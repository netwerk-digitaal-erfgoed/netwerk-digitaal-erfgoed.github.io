---
sidebar_position: 4
description: Search and reconcile persons in heritage datasets. A proof of concept.
---

# Network of Persons

The Network of Persons searches person datasets the way the [Network of Terms](../network-of-terms/index.md) searches
terminology sources: it sends your query to each dataset’s SPARQL endpoint in real time and returns the matching
persons in one data model.

:::warning Proof of concept

Its address, datasets and data may change or disappear without notice. Do not build production integrations on it.

:::

## Datasets

| Dataset      | Publisher | Source URI                          |
|--------------|-----------|-------------------------------------|
| WO2-personen | WO2Net    | `https://data.niod.nl/WO2_personen` |

WO2-personen describes about 807000 persons from the Second World War, as published on
[Oorlogsbronnen](https://www.oorlogsbronnen.nl/personen). Oorlogsbronnen reconstructs each person from the records that
mention them. The spellings of the name in those records are searched too, so ‘Zwanenveld’ finds Dirk Zwaneveld.

## APIs

Both APIs are those of the Network of Terms, served at `https://personennetwerk.netwerkdigitaalerfgoed.nl`. Their
documentation applies unchanged: see [GraphQL](../network-of-terms/graphql.md) and
[Reconciliation](../network-of-terms/reconciliation.md).

### GraphQL

The endpoint is `https://personennetwerk.netwerkdigitaalerfgoed.nl/graphql`, with a
[GraphiQL interface](https://personennetwerk.netwerkdigitaalerfgoed.nl/graphiql) to try queries. What the dataset states
about a person is in the `person` field:

```graphql
query {
  terms(sources: ["https://data.niod.nl/WO2_personen"], query: "Zwanenveld") {
    result {
      ... on Terms {
        terms {
          uri
          prefLabel
          altLabel
          hiddenLabel
          person {
            birthDate
            deathDate
            birthPlace { uri name { value } }
            deathPlace { uri name { value } }
          }
        }
      }
    }
  }
}
```

### Reconciliation

To match a column of names in [OpenRefine](https://openrefine.org), add this reconciliation service:

```
https://personennetwerk.netwerkdigitaalerfgoed.nl/reconcile/https://data.niod.nl/WO2_personen
```

## Limitations

- Search matches whole words: ‘Zwanenv’ finds nothing. To search by prefix, set `queryMode` to `RAW` and end the word
  with `*`.
- Punctuation in the search words finds nothing: search for ‘Zwanenveld Dirk’, not ‘Zwanenveld, Dirk’.
- There is no scope note. To tell namesakes apart, read the birth and death dates and places in the `person` field.
- Given and family names are empty, because the dataset gives each person one undivided name.
- A birth or death place can appear twice: once by name and once as a URI from the WO2 Thesaurus. The dataset does not
  say which name belongs to which URI.
- Reconciliation matches on the name only. Birth and death dates are not used to rank candidates.

## Source code

The Network of Persons runs the Network of Terms software with its own catalogue, kept in the
[`services` repository](https://github.com/netwerk-digitaal-erfgoed/services/tree/main/packages/network-of-persons-catalog).
Its README also explains how to run the software over your own datasets.
