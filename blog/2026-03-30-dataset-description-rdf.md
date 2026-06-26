---
title: Publishing dataset descriptions with a SPARQL CONSTRUCT query
authors: [coret, ddeboer]
tags: [rdf, dataset-register]
---

To make a dataset findable across the heritage network, you register its [dataset description](https://docs.nde.nl/requirements-datasets/) – a machine-readable (RDF) record of the dataset – with the [NDE Dataset Register](https://datasetregister.netwerkdigitaalerfgoed.nl/?lang=en). If you already publish linked data, you don’t need to maintain a separate description file: you can let the Register read your description straight from your triplestore with a `SPARQL CONSTRUCT` query.

<!-- truncate -->

## The SPARQL CONSTRUCT registration URL

The NDE Dataset Register requires you to [register](https://datasetregister.netwerkdigitaalerfgoed.nl/maak.php?lang=en) the location of your dataset description(s) via a so-called registration URL. This can be the URL of an HTML page (with RDFa or JSON-LD), the URL of an RDF file (e.g. JSON-LD, Turtle, N-Triples), or even a call to your own SPARQL endpoint.

Suppose you have stored all triples for your dataset descriptions, distributions, and possibly a data catalog in the graph `<https://data.bibliotheken.nl/datasetbeschrijvingen>`, which is available in your linked data publishing environment with the SPARQL endpoint `https://data.bibliotheken.nl/sparql`. The query to retrieve all dataset description triples from your triplestore in this example is:

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

`https://data.bibliotheken.nl/sparql?query=CONSTRUCT%20%7B%20%3Fs%20%3Fp%20%3Fo%20.%20%7D%20WHERE%20%7B%20GRAPH%20%3Chttps%3A//data.bibliotheken.nl/datasetbeschrijvingen%3E%20%7B%20%3Fs%20%3Fp%20%3Fo%20.%20%7D%20%7D`

This is a registration URL that can be submitted to the NDE Dataset Register!

:::warning Point to the SPARQL protocol endpoint, not the query editor

Register the URL of the SPARQL *protocol* endpoint – the one that answers `?query=…` requests with RDF – not the URL of a SPARQL query editor or landing page. A query web UI (such as a YASGUI page) returns an HTML page instead of RDF, so the Register cannot read any dataset descriptions from it. A common mistake is to copy the URL straight from your browser’s address bar while you are looking at the query editor.

Also make sure the graph IRI in your query matches the one in your triplestore exactly, including the `http` versus `https` scheme: `<http://…>` and `<https://…>` are different named graphs, and querying the wrong one returns an empty result.
:::

The dataset register retrieves all dataset descriptions daily. For all SPARQL CONSTRUCT registration URLs, the most up-to-date information about the dataset descriptions is always obtained from the underlying linked data publishing environment. It is **a smart, standards-based use** of the linked data publishing environment for dataset descriptions.

If you change your linked data publishing environment, the registration URL may change. However, this is not a problem, as long as the URIs used in the dataset descriptions remain unchanged and continue to resolve.

## Example in the NDE Dataset Register

In the NDE Dataset Register, at the bottom of a dataset description page, you will find the so-called registration information, including the registration URL. For example, on the [Thesaurus of Dutch Author Names (NTA)](https://datasetregister.netwerkdigitaalerfgoed.nl/en/datasets/http://data.bibliotheken.nl/id/dataset/persons) page in the dataset register, you can see a `SPARQL CONSTRUCT` registration URL similar to the example above.
