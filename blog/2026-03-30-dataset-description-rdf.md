---
title: Publishing dataset descriptions from a triplestore
authors: [coret]
tags: [rdf, dataset-register]
---

## Dataset descriptions are RDF

Through a dataset description, an organization can describe and publish the data they make available via a data dump or API in a machine-readable format (RDF), enabling other platforms to make use of it. This can be a service platform such as CollectieNederland, Europeana (via DC4EU), or Oorlogsbronnen. And, to gain better insight into available datasets within the network: via the [NDE Dataset Register](https://datasetregister.netwerkdigitaalerfgoed.nl/?lang=en).

Dataset descriptions are defined based on international standards such as Schema.org or DCAT3. For DCAT3, a cross-sector application profile has been developed for use in the Netherlands under the guidance of Geonovum: [DCAT3 AP NL](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/). For Schema.org, an application profile has been developed within the heritage network in the form of [Requirements for datasets](https://docs.nde.nl/requirements-datasets/).

For both vocabularies, the agreements concern how the RDF of the dataset description should be structured: which classes and properties are used, and their cardinality.

## Publishing dataset descriptions (RDF)
From the NDE Dataset Register, we see multiple routes that lead to [valid](https://datasetregister.netwerkdigitaalerfgoed.nl/validate.php?lang=en) published dataset descriptions:

- manually created and published on website, dataplatform or Github
- published from a NDE-compatible collection information system
- from an organization’s own linked data publishing environment (triplestore)

As more and more heritage organizations publish linked data (RDF), this blog post pays particular attention to this publication route.

## Dataset descriptions (RDF) via a linked data publishing environment

If, as a heritage organization, you have set up a linked data publishing environment and can expose internal data via a pipeline to a data dump or triplestore with a SPARQL endpoint, then this environment logically also becomes relevant for dataset descriptions, after all, these are also linked data to be published!

The requirements for valid dataset descriptions mean that you must publish a complete set of RDF. This can be done via RDFa or JSON-LD within HTML, or as a separate RDF file. If your linked data publishing environment includes a SPARQL endpoint, you can also assemble your dataset description(s) using a `SPARQL CONSTRUCT` query.

## SPARQL CONSTRUCT Registration URL
The NDE Dataset Register requires you to [register](https://datasetregister.netwerkdigitaalerfgoed.nl/maak.php?lang=en)
 the location of your dataset description(s) via a so-called registration URL. This can be the URL of an HTML page (with RDFa or JSON-LD), a URL of an RDF file (e.g. JSON-LD, Turtle, N-triple), or even a smart call to your own SPARQL endpoint.

Suppose you have stored all triples for your dataset descriptions, distributions, and possibly a data catalog in the graph `<https://data.bibliotheken.nl/datasetbeschrijvingen>`, which is available in your linked data publishing environment with the SPARQL endpoint `https://api.bibliotheken.nl/datasets/KB/Production/services/Production-VTS/sparql`. The query to retrieve all dataset description triples from your triplestore in this example is:

```SPARQL
CONSTRUCT {
      ?s ?p ?o .
} WHERE {
      GRAPH <https://data.bibliotheken.nl/datasetbeschrijvingen> {
            ?s ?p ?o .
      }
}
```

After URL-encoding this `SPARQL CONSTRUCT` query, you can include it as a query parameter to the SPARQL endpoint. This results in the following URL:

`https://data.bibliotheken.nl/sparql?query=CONSTRUCT%20%7B%20%3Fs%20%3Fp%20%3Fo%20.%20%7D%20WHERE%20%7B%20GRAPH%20%3Chttps%3A%2F%2Fdata.bibliotheken.nl%2Fdatasetbeschrijvingen%3E%20%7B%20%3Fs%20%3Fp%20%3Fo%20.%20%7D%20%7D`

This is a registration URL that can be submitted to the NDE Dataset Register!

The dataset register retrieves all dataset descriptions daily. For all SPARQL CONSTRUCT registration URLs, the most up-to-date information about the dataset descriptions is always obtained from the underlying linked data publishing environment. It is **a smart, standards-based use** of the linked data publishing environment for dataset descriptions.

If you change your linked data publishing environment, the registration URL may change. However, this is not a problem, as long as the URIs used in the dataset descriptions remain unchanged and continue to resolve.

## Example in the NDE Dataset Register

In the NDE Dataset Register, at the bottom of a dataset description page, you will find the so-called registration information, including the registration URL. For example, on the [Thesaurus of Dutch Author Names (NTA)](https://datasetregister.netwerkdigitaalerfgoed.nl/en/datasets/http://data.bibliotheken.nl/id/dataset/persons) page in the dataset register, you can see the `SPARQL CONSTRUCT` registration URL from the example above.
