---
sidebar_position: 2
description: Make heritage data available for a specific purpose
---

# Service Platforms

[Service Platforms](/glossary.md#service-platform) make heritage data available for a specific purpose. 
To do so, they need to find, access, understand and transform datasets.

## Find datasets

To get a quick overview of datasets available, you can use the [Dataset Register website](https://datasetregister.netwerkdigitaalerfgoed.nl/?lang=en).
For automation, developers will want to use the [Dataset Register SPARQL endpoint](/services/dataset-register/sparql.md).

## Access datasets

For each relevant dataset, look up its [distributions](../glossary.md#distribution).
There are two types of [RDF](../glossary.md#rdf) distribution:

* data dumps are files that Service Platforms can download to read and process in their own infrastructure;
* SPARQL endpoints allow you to directly query the data.

For example, the dataset [Gouda Timemachine Linked Open Data](https://datasetregister.netwerkdigitaalerfgoed.nl/show.php?lang=en&uri=https%3A%2F%2Fwww.goudatijdmachine.nl%2Fomeka%2Fapi%2Fitems%2F13000)
has both a data dump (at https://www.goudatijdmachine.nl/omeka/files/goudatijdmachine.nt.gz) and a SPARQL endpoint
(at https://www.goudatijdmachine.nl/sparql/repositories/gtm).

### Using SPARQL

To use the SPARQL endpoint, start with a simple SELECT query using the cURL command-line tool:

```shell
curl -X POST https://www.goudatijdmachine.nl/sparql/repositories/gtm --data 'query=SELECT * WHERE { ?s ?p ?o} LIMIT 10'
s,p,o
http://www.w3.org/1999/02/22-rdf-syntax-ns#type,http://www.w3.org/1999/02/22-rdf-syntax-ns#type,http://www.w3.org/1999/02/22-rdf-syntax-ns#Property
http://www.w3.org/1999/02/22-rdf-syntax-ns#Property,http://www.w3.org/1999/02/22-rdf-syntax-ns#type,http://www.w3.org/2000/01/rdf-schema#Class
http://www.w3.org/2000/01/rdf-schema#Class,http://www.w3.org/1999/02/22-rdf-syntax-ns#type,http://www.w3.org/2000/01/rdf-schema#Class
http://www.w3.org/2000/01/rdf-schema#subPropertyOf,http://www.w3.org/1999/02/22-rdf-syntax-ns#type,http://www.w3.org/1999/02/22-rdf-syntax-ns#Property
http://www.w3.org/2000/01/rdf-schema#subPropertyOf,http://www.w3.org/1999/02/22-rdf-syntax-ns#type,http://www.w3.org/2002/07/owl#TransitiveProperty
http://www.w3.org/2000/01/rdf-schema#subClassOf,http://www.w3.org/1999/02/22-rdf-syntax-ns#type,http://www.w3.org/1999/02/22-rdf-syntax-ns#Property
http://www.w3.org/2000/01/rdf-schema#subClassOf,http://www.w3.org/1999/02/22-rdf-syntax-ns#type,http://www.w3.org/2002/07/owl#TransitiveProperty
http://www.w3.org/2000/01/rdf-schema#domain,http://www.w3.org/1999/02/22-rdf-syntax-ns#type,http://www.w3.org/1999/02/22-rdf-syntax-ns#Property
http://www.w3.org/2000/01/rdf-schema#range,http://www.w3.org/1999/02/22-rdf-syntax-ns#type,http://www.w3.org/1999/02/22-rdf-syntax-ns#Property
http://www.w3.org/2002/07/owl#sameAs,http://www.w3.org/1999/02/22-rdf-syntax-ns#type,http://www.w3.org/1999/02/22-rdf-syntax-ns#Property
```

You may also want to use any of the available SPARQL clients, such as [Comunica](https://comunica.dev/docs/query/getting_started/query_cli/):

```shell
npm install -g @comunica/query-sparql
comunica-sparql sparql@https://www.goudatijdmachine.nl/sparql/repositories/gtm \
  "SELECT * WHERE { ?s ?p ?o} LIMIT 10"
```


For more information about querying with SPARQL, see the [SPARQL specification](https://www.w3.org/TR/sparql11-query/).




## Understand datasets


## Transform data

Service Platforms may need to [transform](../use/transform.md) source data to make it usable in the Platform and its UIs.
