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

For a webinterface to try out queries, you can use https://termennetwerk-api.netwerkdigitaalerfgoed.nl.

TODO: https://github.com/netwerk-digitaal-erfgoed/network-of-terms-tutorial/wiki/GraphQL-API

## Queries

### List terminology sources

For a list of [terminology sources](../../glossary.md#terminology-source) that can be consulted through the Network of Terms,
use this query:

```graphql
query Sources {
  sources {
    uri
    name
    alternateName
    mainEntityOfPage
    description
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

### Query a single source

To query a single [terminology source](../../glossary.md#terminology-source), select a source from the list of sources (above)
and use its URI in the `sources` query parameter. For `query`, enter any literal search string that you want to find terms for.

```graphql
# Query Cultuurhistorische Thesaurus (CHT)
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

* a list of terms found (`... on Terms`), which can be empty
* or an error message (`... on Error`). Errors include [timeouts](#timeouts).

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

In [collection management systems](../../glossary.md#collection-management-system), the URI is used to link data to the term.

### Query multiple sources

Querying multiple sources is very similar to querying a single source, but now providing multiple URIs in the `sources` query parameter:

```graphql
# Query RKDartists and NTA simultaneously
query {
  terms(
    sources: ["https://data.rkd.nl/rkdartists", "http://data.bibliotheken.nl/id/dataset/persons"],
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

### Look up terms by URI

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

### Response times

Response times from the Network of Terms will vary depending on how fast each terminology source returns results for the
query.

Use the `responseTimeMs` response property to inspect the response time for each source.

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

### Timeouts

The default timeout is 5 seconds. You can raise this up till 60 seconds using the
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

