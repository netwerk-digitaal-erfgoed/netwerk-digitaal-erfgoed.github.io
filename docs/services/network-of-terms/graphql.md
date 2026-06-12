---
sidebar_position: 1
toc_max_heading_level: 4
---

# GraphQL API

The GraphQL API is intended for software developers, 
who may want to integrate it in 
[Collection Management Systems](../../glossary.md#collection-management-system),
[Service Platforms](../../glossary.md#service-platform) and other software.

If you simply want to search for terms, you can use the [demonstrator](https://termennetwerk.netwerkdigitaalerfgoed.nl).

## Endpoint 

The GraphQL API is available at: 
```
https://termennetwerk-api.netwerkdigitaalerfgoed.nl/graphql
```

For a web interface to try out queries, you can use https://termennetwerk-api.netwerkdigitaalerfgoed.nl.

TODO: https://github.com/netwerk-digitaal-erfgoed/network-of-terms-tutorial/wiki/GraphQL-API

## List terminology sources

For a list of [terminology sources](../../glossary.md#terminology-source) that can be consulted through the Network of Terms,
use this query:

```graphql title="List terminology sources"
query Sources {
  sources {
    uri
    name
    alternateName
    description
    inLanguage  
    mainEntityOfPage
    creators {
      uri
      name
      alternateName
    }
    genres {
      uri
      name
    }
    features {
      type
      url
    }
    status {
      isAvailable
      lastChecked
    }
  }
}
```

### Filter sources by subject

The `sources` query accepts an optional `genres` parameter to filter sources by subject.
Genre URIs can be discovered from the `genres` field on each source (shown in the query above).

```graphql title="List only sources about ‘periodes’"
query Sources {
  sources(genres: ["https://data.cultureelerfgoed.nl/termennetwerk/onderwerpen/Periodes"]) {
    uri
    name
    genres {
      uri
      name
    }
  }
}
```

### Source language

Terminology source information (name, description, genre and creator names, and the
sort order of the result) is returned in the language requested via the `Accept-Language`
HTTP header. Currently honored values are `nl` and `en`; the default and fallback is `nl`.

```http request
Accept-Language: en
```

See [Language selection](#language-selection) for the full picture of how language is
negotiated across the API, including the `languages` parameter that controls term labels.

## Search terms

### Query a single source

To query a single [terminology source](../../glossary.md#terminology-source), select a source from the [list of sources](#list-terminology-sources)
and use its URI in the `sources` query parameter. For `query`, enter any literal search string that you want to find terms for.

```graphql title="Query Cultuurhistorische Thesaurus (CHT)"
query {
  terms(
    sources: ["https://data.cultureelerfgoed.nl/term/id/cht"],
    query: "fiets"
  ) {
    result {
      __typename
      ... on Terms {
        terms {
          uri
          prefLabel
          altLabel
          hiddenLabel
          definition 
          scopeNote
          seeAlso
          broader {
            uri
            prefLabel
          }
          narrower {
            uri
            prefLabel
          }
          related {
            uri
            prefLabel
          }
          exactMatch {
            uri
            prefLabel
          }
        }
      }
      ... on Error {
        message
      }
    }
    responseTimeMs
  }
}
```

The `result` element is either:

* a list of terms found (`... on Terms`), which can be empty if no terms were found
* or an error message (`... on Error`). Errors include [timeouts](#timeouts).

### Search result

The list of terms is sorted by relevance, if supported by the terminology source,
or simply alphabetically if not.
Each result contains the terminology source and the terms found in it.

#### Source

A terminology source object has:

* a [URI](../../glossary.md#persistent-http-uri) that identifies the source
* `name`
* `description` that explains in a single sentence the intended use of the source
* `inLanguage` that shows in which languages the source is available, usually `nl` and/or `en`
* `alternateName`: an optional, well-known short name for display purposes
* `creators`: the publisher or the source, with its own `uri`, `name` and `alternateName` (short name)
* `genres`: subjects that the source contains information about
* `features`: capabilities supported by the source (e.g. `GENRE_FILTER`)
* `mainEntityOfPage`: a website that provides more information about the source
* `status`: availability of the source’s endpoint, with sub-fields `isAvailable` (boolean) and `lastChecked` (ISO 8601 timestamp).

#### Terms

A term object has:

* a [URI](../../glossary.md#persistent-http-uri) that identifies the term
* `prefLabel` that is the main name of the term
* `altLabel`s and `hiddenLabel`s that are alternative names
* `definition` that defines the term
* `scopeNote` that provides additional information
* `seeAlso` that links to a web page for humans about the term
* `broader`, `narrower`, and `related` terms that are related to the term
* `exactMatch`es that link to terms in other terminology sources.

In [collection management systems](../../glossary.md#collection-management-system), the term’s URI is used to link data to the term.

### Filter by subject

Some terminology sources cover multiple subjects. You can narrow search results to specific subjects
using the `genres` parameter with a list of genre URIs.

Genre URIs can be discovered from the `genres` field when [listing sources](#list-terminology-sources).
Genre filtering is only available for sources that declare the `GENRE_FILTER` feature,
which is visible via the `features` field on each source.

```graphql title="Search CHT for ‘steen’, filtered to ‘Periodes’"
query {
  terms(
    sources: ["https://data.cultureelerfgoed.nl/term/id/cht"],
    query: "steen",
    // highlight-start
    genres: ["https://data.cultureelerfgoed.nl/termennetwerk/onderwerpen/Periodes"]
    // highlight-end
  ) {
    source {
      uri
      name
    }
    result {
      __typename
      ... on Terms {
        terms {
          uri
          prefLabel
          altLabel
          definition
          scopeNote
        }
      }
      ... on Error {
        message
      }
    }
  }
}
```

:::tip

Sources that currently support genre filtering include the Art & Architecture Thesaurus (AAT),
Cultuurhistorische Thesaurus (CHT), and Wikidata.

:::

### Query multiple sources

Querying multiple sources is very similar to [querying a single source](#query-a-single-source), but now providing multiple URIs in the `sources` query parameter:

```graphql title="Query RKDartists and NTA simultaneously" 
query {
  terms(
    // highlight-start
    sources: [
      "https://data.rkd.nl/rkdartists",
      "http://data.bibliotheken.nl/id/dataset/persons"
    ],
    // highlight-end
    query: "Gogh"
  ) {
    source {
      uri
      name
      creators {
        uri
        name
        alternateName
      }
      status {
        isAvailable
        lastChecked
      }
    }
    result {
      __typename
      ... on Terms {
        terms {
          uri
          prefLabel
          altLabel
          hiddenLabel
          definition
          scopeNote
          seeAlso
        }
      }
      ... on Error {
        message
      }
    }
    responseTimeMs
  }
}
```

The results are grouped by terminology source. Each source returns either a list of terms or an error.

## Look up terms by URI

Use the `lookup` query to look up terms whose URIs you know (for example, because you have stored the URIs previously).
You can look up multiple URIs at once, by providing them in the `uris` query parameter.

```graphql
query {
  lookup(
    uris: ["https://data.rkd.nl/artists/32439", "https://data.cultureelerfgoed.nl/term/id/cht/15e29ea3-1b4b-4fb2-b970-a0c485330384"],
  ) {
    uri
    source {
      ... on Source {
        uri
        name
        creators {
          uri
          name
          alternateName
        }
      }
      ... on Error {
        __typename
        message
      }
    }
    result {
      ... on Term {
        uri
        prefLabel
        altLabel
        hiddenLabel
        definition 
        scopeNote
        seeAlso
        broader {
          uri
          prefLabel
        }
        exactMatch {
          uri
          prefLabel
        }
      }
      ... on Error {
        __typename
        message
      }
    }
    responseTimeMs
  }
}
```

Each URI is routed to the source whose `url` prefix it starts with. Sources declare one or more URL prefixes in the catalog, and the Network of Terms picks the matching source for every URI in the request. If no source claims the prefix, the `source` field returns an `Error` for that URI.

## Discover reconciliation endpoints

Sources that offer a [Reconciliation API](reconciliation.md) advertise it via the `features` field. Each feature has a `type` and a `url`; the entry with `type: RECONCILIATION` carries the endpoint URL to configure in OpenRefine.

```graphql title="List reconciliation endpoints"
query {
  sources {
    uri
    name
    features {
      type
      url
    }
  }
}
```

Filter client-side for entries where `type` equals `RECONCILIATION`. Sources that publish their own reconciliation service (such as Wikidata) are not re-exposed here – see [Reconciliation API](reconciliation.md) for details.

## Language selection

The Network of Terms uses two language controls:

* **`Accept-Language`** – for single-language fields: source information (names,
  descriptions, genre and creator names) in this API, and all responses from the
  [Reconciliation API](./reconciliation). Served from our local catalog, translated
  to a fixed set (`nl` and `en`).
* **`languages` GraphQL argument** – for multilingual term labels (`prefLabel`,
  `altLabel`, `definition`, etc.), returned side by side as `{ language, value }`
  pairs. Fetched in real time from remote sources, so available languages vary per
  source – see [Discovering supported languages](#discovering-supported-languages).

### Two axes of language control

|                       | `Accept-Language` HTTP header                                                         | `languages` GraphQL argument                                   |
|-----------------------|---------------------------------------------------------------------------------------|----------------------------------------------------------------|
| Used for              | Catalog metadata (sources, genres, creators)                                          | Term labels (`prefLabel`, `altLabel`, etc.)                    |
| Input shape           | Ranked list with quality values, per [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html#field.accept-language) (e.g. `en, nl;q=0.8`) | Ordered list of preferred languages          |
| Output shape          | One `String` per field — the server selects a single best match                       | Each term-label field is a list of `{ language, value }` pairs on `TranslatedTerms` |
| Unknown language      | Silently falls back to `nl`                                                           | Raises a GraphQL error (closed enum)                           |
| Multilingual output?  | No — one chosen language wins                                                         | Yes — every requested language with available data is returned |

### Which fields are affected

| Field                                                                            | Controlled by                                                |
|----------------------------------------------------------------------------------|--------------------------------------------------------------|
| All localized fields on `Source` returned by the top-level `sources` query       | `Accept-Language`                                            |
| `prefLabel`, `altLabel`, `hiddenLabel`, `definition`, `scopeNote` on terms       | `languages`                                                  |
| Embedded `Source` inside a `terms` or `lookup` query result                      | First entry of `languages`, else `Accept-Language`           |

Inside a `terms` or `lookup` operation, the `languages` argument doubles as a hint for
which catalog translation to pick for the embedded `Source`. The top-level `sources`
query has no operation-level language preference and uses `Accept-Language` directly.

### The `Accept-Language` header

`Accept-Language` is the standard HTTP content-negotiation header: clients send a ranked
list of preferences and the server picks the best match. The Network of Terms currently
matches against `nl` and `en`; the default and fallback when nothing matches is `nl`.
Tags that don’t intersect with the honored set fall through to `nl`.

```http request
Accept-Language: en, nl;q=0.8
```

Catalog metadata is only translated into `nl` and `en`, even when the catalog has
term-level data in other languages. For example, `fy` (Frisian) is a valid value for
the [`languages` GraphQL argument](#the-languages-graphql-argument) and returns Frisian
term labels where sources provide them, but `Accept-Language: fy` still resolves source
names, descriptions, genre names and creator names to `nl`.

### The `languages` GraphQL argument

`languages` is a GraphQL argument accepted by the `terms` and `lookup` queries. It
takes a list of values from the `Language` enum, in order of preference.

:::important

**Passing `languages` changes the result type.** Without it, term results come back as
`Terms` with each label field as a plain `[String!]`. With it, results come back as
[`TranslatedTerms`](#multilingual-results-translatedterms) and each label field is a
list of `{ language, value }` pairs covering every requested language that the source
provides data for. This is the only way to get a multilingual response from the API.

:::

Untagged literals are treated as `nl`. Passing a value that is not part of the enum
(for example `fr` when the catalog has no French data) raises a GraphQL parse error.
This is by design: the enum is the API’s declarative statement of which languages it
currently offers.

### Discovering supported languages

The `Language` enum *is* the authoritative list of supported languages. It is derived
from the catalog at server startup, so the schema grows automatically as new languages
are added. Clients can discover the current set via GraphQL introspection:

```graphql title="List supported languages"
query SupportedLanguages {
  __type(name: "Language") {
    enumValues { name }
  }
}
```

The recommended pattern for forward-compatible clients:

1. Fetch the supported set via introspection (once, at startup or at build time via codegen).
2. Intersect it with the languages your application supports.
3. Send only that intersection in the `languages` argument.

When the Network of Terms adds a new language to its catalog, a fresh introspection
picks it up without any change to the API contract on the client side.

### Multilingual results: `TranslatedTerms`

Passing `languages` is what turns the API multilingual. Both
[search](#search-terms) and [lookup](#look-up-terms-by-uri) queries switch to
`TranslatedTerms` as soon as the argument is present, exposing each label as a
`{ language, value }` pair so translations can be rendered side by side. Without
`languages`, you get plain `Terms` with `[String!]` labels in a single language.

```graphql title="Return results in both English and Dutch" {8,16,19-23} showLineNumbers
query {
  terms(
    sources: [
      "https://data.rkd.nl/rkdartists",
      "http://data.bibliotheken.nl/id/dataset/persons"
    ],
    query: "Gogh",
    languages: [en, nl]
  ) {
    source {
      uri
      name
    }
    result {
      __typename
      ... on TranslatedTerms {
        terms {
          uri
          prefLabel { language value }
          altLabel { language value }
          hiddenLabel { language value }
          definition { language value }
          scopeNote { language value }
          seeAlso
        }
      }
      ... on Error {
        message
      }
    }
    responseTimeMs
  }
}
```

:::tip

Not all terminology sources are available in all languages. Inspect the `inLanguage`
field on each source (see [List terminology sources](#list-terminology-sources)) to
see which languages it provides.

:::

If you omit `languages`, the result type is `Terms` instead and label fields are
returned as plain `[String!]`. Their values come from whichever language the source
provides, with untagged literals treated as `nl`.

### Per-term label fallback

The `languages` parameter filters labels per term – it does not exclude terms from the
results. If a term has no labels in any of the preferred languages, it is still
returned, but its label fields (`prefLabel`, `altLabel`, `hiddenLabel`, `definition`,
`scopeNote`) fall back as follows:

* If the source provides untagged literals for the field, they are returned and treated
  as Dutch (`nl`).
* Otherwise, the field is returned as an empty list.

The languages you can actually get back depend on what each source provides: see the
`inLanguage` field when [listing sources](#list-terminology-sources).

## Response times

Response times from the Network of Terms will vary depending on how fast each terminology source returns results for the
query.

Use the `responseTimeMs` response property to inspect the response time (in ms) for each source.

```graphql
query {
  terms(
    sources: [...],
    query: "..."
  ) {
    source { ... }
    result { ... }
    responseTimeMs
  }
}
```

## Timeouts

The default timeout is 10 seconds. You can raise this up till 60 seconds using the
`timeoutMs` query parameter. For example, to wait a maximum of 15 seconds for each terminology source to respond:

```graphql
query {
  terms(
    sources: [...],
    query: "...",
    timeoutMs: 15000,
  ) {
    ...
  }
}
```

