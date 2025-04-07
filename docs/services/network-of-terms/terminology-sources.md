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

If you’d like to add a source to the Network, please consult the [FAQ](https://termennetwerk.netwerkdigitaalerfgoed.nl/faq2).

## Fulltext search

Terms are searched using textual strings. 
While this is possible with plain SPARQL (`CONTAINS`), search performance can be improved by using the SPARQL’s endpoint fulltext search support,
usually backed by Lucene.

Fulltext search is supported by:

* [Fuseki](https://jena.apache.org/documentation/query/text-query.html) (`text:query`)
* [GraphDB](https://graphdb.ontotext.com/documentation/10.8/full-text-search.html) 
* [Virtuoso](https://docs.openlinksw.com/virtuoso/bifcontainsoptions/) (`bif:contains`)
