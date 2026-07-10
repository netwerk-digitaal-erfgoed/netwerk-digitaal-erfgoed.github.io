---
sidebar_position: 3
description: Reshape a dataset into the model your application needs with SPARQL CONSTRUCT.
---

# Transform

The data you [access](access.md) rarely matches the exact model your application or
[Service Platform](../glossary.md#service-platform) needs, so you reshape it. 
NDE recommends doing this with SPARQL, keeping transformations declarative and portable rather than locked inside bespoke scripts.

## Transform RDF with SPARQL CONSTRUCT

For RDF-to-RDF transformations, NDE recommends **SPARQL `CONSTRUCT`**: you write a query that reads the
source shape and constructs the target shape, often as several small steps chained together. Because
the transformation is an ordinary SPARQL query rather than custom code, it is portable across tools and
inspectable – the same approach the Stack’s [pipelines](../stack/pipeline.md) use to project source
data into search indexes, knowledge graphs and [EDM](https://pro.europeana.eu/page/edm-documentation).

When a source has several independently multi-valued properties, split the mapping into small
`CONSTRUCT` queries joined by `UNION` rather than one query full of `OPTIONAL`s, so multi-valued
properties do not multiply into cross-product duplicates.

## Transform non-RDF with SPARQL Anything

If your source is not RDF (e.g. a CSV or TSV, JSON, XML or Excel file) you can still use the `CONSTRUCT`
you already know, with [SPARQL Anything](https://sparql-anything.cc). It presents any such source
through a uniform RDF facade, so you query it with an ordinary `CONSTRUCT` and a `SERVICE` block; it
does not extend the SPARQL grammar, so your existing skills transfer directly.

For a worked example, see [Turning GeoNames into linked data](/blog/2026/06/25/geonames-linked-data),
which converts the 13-million-row GeoNames TSV dump to RDF using nothing but `CONSTRUCT`.
