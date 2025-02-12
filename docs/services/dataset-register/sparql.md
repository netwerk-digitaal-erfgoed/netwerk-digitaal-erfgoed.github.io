# SPARQL endpoint

The Dataset Register SPARQL endpoint is available at

You can retrieve dataset descriptions registered by yourself and others
from our [triple store’s web interface](https://triplestore.netwerkdigitaalerfgoed.nl/sparql?savedQueryName=Full%20dataset%20descriptions%20for%20publisher&owner=admin).

Alternatively, use the SPARQL endpoint at `https://triplestore.netwerkdigitaalerfgoed.nl/repositories/registry` directly.
For example using the [Comunica SPARQL client](https://comunica.dev):

```sh
comunica-sparql sparql@https://triplestore.netwerkdigitaalerfgoed.nl/repositories/registry 'select * {?s a <http://www.w3.org/ns/dcat#Dataset> . ?s ?p ?o . } limit 100'
```

Or curl:

```bash
curl -H Accept:application/sparql-results+json --data-urlencode 'query=select * {?s a <http://www.w3.org/ns/dcat#Dataset> . ?s ?p ?o . } limit 100'  https://triplestore.netwerkdigitaalerfgoed.nl/repositories/registry
```

## Data model


DCAT

## Building queries

You can get some help building queries at the [Dataset Register](https://datasetregister.netwerkdigitaalerfgoed.nl/search.php?lang=en#eyJ0IjoiIn0=) website,
using the ‘Take the SPARQL below to the triple store’ link.
