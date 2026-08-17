---
sidebar_position: 4.5
---

# GraphQL search API

This chapter is for **software developers** building search or discovery interfaces on top of
the [Dataset Register](index.md). The GraphQL search API is the same API that powers the
[Dataset Register website](https://datasetregister.netwerkdigitaalerfgoed.nl/en/datasets): a
curated, presentation-facing view of the registered datasets, with full-text search, facets,
paging, and human-readable labels resolved inline.

It sits alongside the other two APIs:

- the [REST API](api.md) *changes* the Register (registering and validating descriptions);
- the [SPARQL API](sparql.md) gives you the **entire RDF store** for arbitrary graph queries and
  harvesting;
- the **GraphQL search API** (this page) gives you the **curated search surface** – faceted,
  paged, locale-aware, with labels already resolved – ideal for building a search UI without
  writing SPARQL or resolving IRIs to labels yourself.

## Endpoint

```text
POST https://datasetregister.netwerkdigitaalerfgoed.nl/graphql
```

It is a standard [GraphQL-over-HTTP](https://graphql.org/learn/serving-over-http/) endpoint. Send
a JSON body with a `query` (and optional `variables`):

```json
{ "query": "…", "variables": {} }
```

Set the `Accept-Language` header (for example `nl` or `en`) to choose the preferred language for
multilingual strings and for the labels resolved on facets and references. The API returns the
requested language first, falling back to the others it has.

**A playground is built in.** Open the endpoint in a browser
(`GET https://datasetregister.netwerkdigitaalerfgoed.nl/graphql`) for an interactive GraphiQL
client, or fetch the schema contract directly as SDL:

```shell
curl 'https://datasetregister.netwerkdigitaalerfgoed.nl/graphql?sdl'
```

Introspection is enabled too, so you can equally point [Altair](https://altairgraphql.dev) or any
other GraphQL IDE at the endpoint. Cross-origin requests are allowed, so a browser client may
call the endpoint directly.

## Example

```shell
curl -X POST https://datasetregister.netwerkdigitaalerfgoed.nl/graphql \
  -H 'Content-Type: application/json' \
  -H 'Accept-Language: nl' \
  --data '{"query":"{ datasets(query: \"kaarten\", perPage: 5) { pagination { total } items { title { language value } publisher { id label { value } } } facets { publisher { value count label { value } } format { value count } } } }"}'
```

Paging metadata comes back under `pagination`:

```graphql
pagination { total page perPage }
```

Each result item carries the dataset’s title, description, publisher, formats, size and more, as
the same multilingual-string shape used throughout the platform:

```graphql
title { language value }   # [{ language: "nl", value: "…" }, …]
```

## Searching, filtering and sorting

The `datasets` query accepts:

```graphql
datasets(
  query: String            # full-text search
  where: DatasetWhere      # structured filters (AND across fields)
  orderBy: DatasetOrderBy  # { field, direction }
  page: Int = 1
  perPage: Int = 20
): DatasetSearchResult!
```

- **`where`** filters by exact values. Every filter is `{ in: […] }`, which unions the listed
  values; its *type* says what those values are:
  - **IRIs** – `id` (`DatasetFilter`), `publisher` (`AgentFilter`), `terminology_source`
    (`VocabularyFilter`), and `class` and `catalog` (`IRIFilter`, where no entity type names
    them). These also accept the `group:…` tokens the Register mints alongside real IRIs
    (`group:person` on `class`): they are absolute IRIs in their own right.
  - **Tokens** – `format` and `status` (`KeywordFilter`).
  - `size` takes an `IntRange` (`{ min, max }`).

  For example, `where: { format: { in: ["group:rdf"] } }` returns datasets with any RDF
  distribution.
  The automated checks the Register performs on the datasets themselves are boolean fields and
  take a plain `Boolean`: `where: { nde_schema_ap: true }` returns the datasets of which a sample
  of the resources conforms to the NDE Schema.org Application Profile.
  Sibling keys combine with AND. To widen across fields instead, use the `or` key, which matches a
  dataset satisfying **any** of its criteria.
- **`orderBy`** takes a `field` (`RELEVANCE`, `TITLE`, `DATE_POSTED`, `SIZE`, `STATUS_RANK`) and a
  `direction` (`ASC`/`DESC`).
- By default only **currently valid** datasets are returned. Pass a `status` filter (for example
  `where: { status: { in: ["valid", "invalid", "gone"] } }`) to include the others; the `status`
  facet always counts across every status.

## Facets

`DatasetSearchResult.facets` returns, per field, the buckets that match the current query – each
with its `value`, its `count`, and, where the value is an IRI (publishers, terminology sources),
its **human-readable label resolved inline** as a multilingual string:

```graphql
facets {
  publisher { value count label { language value } }
  terminology_source { value count label { language value } }
  format { value count }
  status { value count }
}
```

Because labels arrive with the buckets, a client never has to perform a separate IRI-to-label
lookup to render a facet or a result card.

Three bucket shapes appear, by the kind of field faceted:

- **`IRIBucket`** (`value: IRI!`, `count`, optional `label`) for the facets keyed on IRIs
  (`publisher`, `class`, `terminology_source`), and **`ValueBucket`** (`value: String!`, the same
  otherwise) for the token facets (`format`, `status`);
- **`RangeBucket`** (`min`, `max`, `count`) for `size`, which facets into fixed bins rather than
  one bucket per value;
- **`BooleanBucket`** (`value: Boolean!`, `count`) for the automated-check facets (`iiif`,
  `nde_schema_ap`, `linked_data`, `terms`, `persistent_uris`). Note `value` is a real boolean
  here, not the string `"true"`.

## Reference collections

Besides `datasets`, the schema exposes search queries over the reference entities the facets are
keyed by – `organizations`, `classs` and `terminologySources` – for building autocompletes or
lookups. Each takes the same `query`/`where`/`orderBy`/`page`/`perPage` arguments and returns
items carrying an `id` and a multilingual `label`. Explore them through introspection or the
playground.

## Data model

The GraphQL fields map onto the same underlying DCAT model as the rest of the Register. The
[data model chapter](data-model.md) is the authoritative reference for what each field means; use
it to interpret `publisher`, `format`, `terminology_source`, `size` and the other fields.
