---
sidebar_position: 3
---

# Terminology sources

## Catalog

The list of [terminology sources](../../glossary.md#terminology-source) is managed in the Network of Terms [catalog](https://github.com/netwerk-digitaal-erfgoed/network-of-terms/tree/master/packages/network-of-terms-catalog),
a set of JSON-LD RDF files that describe the sources, their SPARQL endpoints and the queries used to find terms.

## Adding a terminology source

Terminology sources must comply with the [Requirements for terminologiebronnen](https://docs.nde.nl/requirements-terminologiebronnen/) (in Dutch).
Most importantly:

* the source must be available as a SPARQL endpoint
* basic information must be published for each term, at least a URI and a label. 

If you’d like to add a source to the Network, please consult the [FAQ](https://termennetwerk.netwerkdigitaalerfgoed.nl/faq2). The technical steps – dataset description, SPARQL search and lookup queries, and SHACL validation – live in the [catalog README](https://github.com/netwerk-digitaal-erfgoed/network-of-terms/blob/master/packages/catalog/README.md#adding-a-dataset).

## Writing SPARQL queries for a source

Each source in the catalog ships with a SPARQL `CONSTRUCT` query for searching and another for [looking up terms by URI](graphql.md#look-up-terms-by-uri). The Network of Terms substitutes a placeholder variable at runtime with the value the client sent in the GraphQL `query` argument:

* `?query` – the search string after the default `OPTIMIZED` preprocessing (lowercased and trimmed). Use this in most SPARQL endpoints.
* `?virtuosoQuery` – the same string, but with each token wrapped in quotes and joined with `AND`, so it can be passed straight to Virtuoso’s `bif:contains` full-text operator.

Both variables are always available; pick whichever fits the endpoint’s full-text syntax. Lookup queries use `VALUES ?uri { ?uris }` instead, where `?uris` is replaced with the list of URIs to resolve.

Clients can opt out of preprocessing per request by setting `queryMode: RAW` on the GraphQL `terms` query, in which case the search string is passed through to `?query` and `?virtuosoQuery` unchanged. The default is `OPTIMIZED`.

## Full-text search

Terms are matched against textual search strings. Plain SPARQL `FILTER(CONTAINS(…))` works but scans every candidate literal on every request – fine for tiny vocabularies, painful for anything larger. **Prefer the endpoint’s native full-text index** whenever the SPARQL backend offers one: the federated query stays fast enough to keep the Network of Terms’ overall response time in budget.

Common patterns:

* **Apache Jena Fuseki** – [`text:query`](https://jena.apache.org/documentation/query/text-query.html), e.g. `(?uri ?score) text:query (<field> ?query 100)`.
* **GraphDB (Lucene plugin)** – `?uri luc:term ?query` for labels and IDs, `?uri luc:text ?query` to also include scope notes. See [full-text search](https://graphdb.ontotext.com/documentation/10.8/full-text-search.html).
* **GraphDB (Lucene connector)** – named indexes via `luc:query` / `luc:entities`; list configured connectors with `?cntUri luc:listConnectors ?cntStr`.
* **GraphDB (Elasticsearch connector)** – same pattern under the `elastic:` namespace.
* **OpenLink Virtuoso** – [`bif:contains`](https://docs.openlinksw.com/virtuoso/bifcontainsoptions/), e.g. `?label bif:contains ?virtuosoQuery` (see [`?virtuosoQuery`](#writing-sparql-queries-for-a-source)).
* **Wikidata** – the `wikibase:mwapi` service with `mwapi:search` (titles) or `mwapi:srsearch` (full text). See the [Wikidata MWAPI manual](https://www.mediawiki.org/wiki/Wikidata_Query_Service/User_Manual/MWAPI).
