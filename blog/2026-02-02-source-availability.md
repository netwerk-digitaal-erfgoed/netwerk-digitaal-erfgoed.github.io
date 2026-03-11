---
title: Terminology source availability status
authors: ddeboer
tags: [network-of-terms, graphql]
---

The Network of Terms now monitors each terminology source and exposes its availability via the website and the GraphQL API.

<!-- truncate -->

## Why availability matters

The Network of Terms queries terminology sources in real time. If a source’s SPARQL endpoint is down, searches against that source will fail. Until now, there was no way to know upfront whether a source was available – you'd only find out after a failed query.

With the new `status` field on each source, you can check availability before querying.
This lets you inform users proactively, for example by showing a warning badge next to unavailable sources.
When searching multiple sources in a single query, you can decide to temporarily skip sources that are unavailable
so users won’t have to wait for them.

## How it works

The Network of Terms periodically checks each source's SPARQL endpoint. 
The result is exposed through a `status` field on the `Source` type in the [GraphQL API](/services/network-of-terms/graphql):

```graphql
query Sources {
  sources {
    uri
    name
    status {
      isAvailable
      lastChecked
    }
  }
}
```

The `status` object contains two fields:

- `isAvailable`: whether the source's endpoint responded successfully at the last check
- `lastChecked`: when the last availability check was performed (ISO 8601 timestamp).

## On the website

On the Network of Terms website, availability is shown in two places: in the search form where you select sources, and on the [list of terminology sources](https://termennetwerk.netwerkdigitaalerfgoed.nl/en/sources).

For developers, the `status` field is available in any GraphQL query that returns source information – both when [listing sources](/services/network-of-terms/graphql#list-terminology-sources) and when [searching terms](/services/network-of-terms/graphql#query-multiple-sources). This makes it easy to combine search results with up-to-date availability information.

## Relation to the NDE status page

This feature complements the [NDE status page](https://status.netwerkdigitaalerfgoed.nl) we [launched recently](/blog/2026/02/05/status-page).
While the status page monitors the Network of Terms service itself, the `status` field monitors the individual terminology sources that the Network of Terms queries. 
Together, they give you a complete picture of availability.
