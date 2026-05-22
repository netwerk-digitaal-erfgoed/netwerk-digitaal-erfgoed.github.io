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

## Query authoring

Source-specific search and lookup queries (the SPARQL `CONSTRUCT` queries the Network of Terms federates over the source’s endpoint, including template placeholders such as `?query` / `?virtuosoQuery` and recommended full-text patterns per backend) are documented next to the catalog code: see [Writing the SPARQL queries](https://github.com/netwerk-digitaal-erfgoed/network-of-terms/blob/master/packages/catalog/README.md#writing-the-sparql-queries) in the catalog README.

The `queryMode` GraphQL argument is the client-facing knob: the default `OPTIMIZED` mode lowercases and trims the input before substitution; `RAW` passes it through unchanged.
