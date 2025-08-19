---
sidebar_position: 1
---

# GraphQL API

The GraphQL API is intended for software developers, 
who may want to integrate it in 
[Collection Management Systems](../../glossary.md#collection-management-system),
[Service Platforms](../../glossary.md#service-platform) and other software.

If you simply want to search for terms, you can use the [demonstrator](https://termennetwerk.netwerkdigitaalerfgoed.nl).

## Endpoint 

The GraphQL API is available at `https://termennetwerk-api.netwerkdigitaalerfgoed.nl/graphql`.
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
  }
}
```

Terminology source information is available in both English and Dutch. 
To get a specific language, use the `Accept-Language` HTTP request header, for example:

```http request
Accept-Language: en
```

or:

```http request
Accept-Language: nl
```

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

## Multilingual queries

By default, [search and lookup results](#search-result) return in the Network of Terms’ default language,
which is Dutch.
However, both [search](#search-terms) and [lookup](#look-up-terms-by-uri) queries can be multilingual.

You need to adapt your query by:
* passing a `languages` query parameter with a list of language codes, in preferred order, to return results in multiple languages.
* match `... on TranslatedTerms` to get the multilingual content
* read each translated property’s values as a `{ language value }` pair.

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
          hiddenLabel { language value}
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

Note that not all terminology sources are available in all languages.
Inspect the `inLanguage` [response parameter](#list-terminology-sources)
to see which languages are available for each source.


:::


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

