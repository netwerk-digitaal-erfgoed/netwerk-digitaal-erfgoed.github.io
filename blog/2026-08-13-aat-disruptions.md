---
title: "AAT intermittently unavailable via the Network of Terms"
authors: [joop, ddeboer]
tags:
  - network-of-terms
---

The Art & Architecture Thesaurus (AAT), maintained by the Getty Research Institute, is currently experiencing availability problems. As a result, searching the AAT through the Network of Terms often returns no results, or results only after a long wait – both on the website and in collection management systems that use it. Other terminology sources are working normally; the AAT terms themselves can still be consulted directly on Getty’s own site.

<!-- truncate -->

## Cause

The Network of Terms retrieves AAT terms live from Getty and keeps no copy of its own. If Getty’s service does not respond, or responds too slowly, there are no results to show. Both the Network of Terms website and its API then return a [clear error message](https://termennetwerk.netwerkdigitaalerfgoed.nl/en/faq1#TimeoutError): “The terminology source is unavailable” or “The terminology source did not respond in time”.

Getty reports that the service is overloaded by large-scale automated bot traffic. This is not planned maintenance or an upgrade. Getty is working on a fix, but cannot yet say when the service will be stable again. Similar outages have occurred before and were resolved each time.

Other terminology sources are unaffected: each source is provided by its own maintainer, on its own infrastructure.

## What can you do now?

If you see one of these errors, the problem is not your search term: the [terminology sources](https://termennetwerk.netwerkdigitaalerfgoed.nl/en/sources) page shows the [current availability](./2026-02-02-source-availability.md) of every source. If the AAT is listed as unavailable, try again later.

If you cannot wait, there is a workaround: look up the term in Getty’s [AAT search](https://www.getty.edu/research/tools/vocabularies/aat/) and copy the URI into your collection management system, if your system supports this.

## What are we doing?

We are in contact with the Getty Research Institute about the availability of the AAT service.
We are [investigating](https://github.com/netwerk-digitaal-erfgoed/network-of-terms/issues/1930) whether we can run our own copy of the AAT inside the NDE infrastructure for the Network of Terms to query, so that an outage at Getty no longer disrupts searches. We will report back as soon as there is more to say.
