---
sidebar_position: 1
---

# GraphQL API

## Endpoint 

The GraphQL API is available at `https://termennetwerk-api.netwerkdigitaalerfgoed.nl/graphql`.

For a webinterface to try out queries, you can use https://termennetwerk-api.netwerkdigitaalerfgoed.nl.

TODO: https://github.com/netwerk-digitaal-erfgoed/network-of-terms-tutorial/wiki/GraphQL-API

## Queries

### List available sources

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

```graphql
# Query Cultuurhistorische Thesaurus (CHT)
query {
  terms(
    sources: ["https://data.cultureelerfgoed.nl/term/id/cht"],
    query: "fiets"
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

### Query multiple sources

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

### Look up terms by URI

Use the `lookup` query to look up terms whose URIs you know (for example, because you have stored the URIs previously):

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

### Response times and timeout

Response times from the Network of Terms will vary depending on how fast each terminology source returns results for the
query.

Use the `responseTimeMs` query parameter to inspect the response time for each source.

The default timeout is 5 seconds. You can raise this up till `MAX_QUERY_TIMEOUT` (60 seconds, by default) using the
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

