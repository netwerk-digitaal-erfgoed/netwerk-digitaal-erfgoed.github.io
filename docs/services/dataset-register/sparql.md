---
sidebar_position: 2
---

# SPARQL API

This chapter is for **software developers** building applications, dashboards or harvesters on
top of the [Dataset Register](index.md), and for **researchers** who want to find datasets
across the Dutch heritage network by querying its metadata directly. It gives a high-level
overview of the endpoint, what you can do with it, and how it relates to the
[data model](data-model.md); it intentionally does not repeat the full vocabulary reference.

The SPARQL endpoint exposes the entire contents of the Register: every registered dataset
description, its registration metadata, and the validation status of the URLs it was fetched
from. Use the [REST API](api.md) to *change* the Register; use SPARQL to *read* from it.

## Endpoint

The SPARQL endpoint URL is:

```text
https://datasetregister.netwerkdigitaalerfgoed.nl/sparql
```

For a query web interface, use the [QLever web interface](https://qlever.netwerkdigitaalerfgoed.nl/datasetregister).

Or query from the command-line, for example using the [Comunica SPARQL client](https://comunica.dev):

```shell
comunica-sparql sparql@https://datasetregister.netwerkdigitaalerfgoed.nl/sparql \
  'select * { ?s a <http://www.w3.org/ns/dcat#Dataset> ; ?p ?o . } limit 100'
```

Or cURL:

```shell
curl -H 'Accept: application/sparql-results+json' \
  --data-urlencode 'query=select * { ?s a <http://www.w3.org/ns/dcat#Dataset> ; ?p ?o . } limit 100' \
  https://datasetregister.netwerkdigitaalerfgoed.nl/sparql
```

## Data model

The endpoint exposes dataset descriptions in DCAT. The
[data model chapter](data-model.md) is the authoritative reference on every class and property
you can query; jump straight to the section you need:

- [Dataset](data-model.md#dataset): `dcat:Dataset`, `dcat:Distribution`, `foaf:Agent`
- [Registration](data-model.md#registration): the register-specific metadata used for
  [registration status](#registration-status) below
- [Distribution health](data-model.md#distribution-health): per-URL probe results (reachability and content-type match), exposed in a dedicated named graph
- [Allow list](data-model.md#allow-list): which domains are permitted to register datasets

## Registration status

In addition to the dataset description itself, the Register stores metadata about *how* it was
registered: the registration URL it was fetched from, the timestamp of the latest fetch, and
whether that fetch produced a valid description. Most useful applications want to filter on
status – for example, only show currently valid datasets, or only datasets that have been
re-validated recently.

The full set of properties on a registration is documented under
[`schema:EntryPoint`](data-model.md#schemaentrypoint) (the registration URL itself) and
[`schema:Dataset`](data-model.md#schemadataset) (each dataset found at that URL). For
filtering on validity, each dataset links back to its registration URL via `schema:subjectOf`,
and the registration URL carries a `schema:additionalType` flag indicating its current status:

```sparql
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX schema: <https://schema.org/>
SELECT * {
  ?dataset a dcat:Dataset ;
    schema:subjectOf ?registrationUrl .
  ?registrationUrl schema:additionalType <https://data.netwerkdigitaalerfgoed.nl/registry/valid>
}
```

You can try this in the [QLever web interface](https://qlever.netwerkdigitaalerfgoed.nl/datasetregister/0BQB8d?exec=true).

## Building queries

The [Dataset Register website](https://datasetregister.netwerkdigitaalerfgoed.nl/en/datasets)
offers a ‘SPARQL’ button on each dataset that produces a starter query for the dataset’s
predicates – a useful way to see real-world property usage before writing your own queries.

For broader exploration, the [data model chapter](data-model.md) is the better starting point:
it documents every property the Register exposes, with the same cardinalities and tags that
appear in the data.
