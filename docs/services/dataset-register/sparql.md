# SPARQL endpoint

You can retrieve dataset descriptions registered by yourself and others
from our [triple store’s web interface](https://qlever.netwerkdigitaalerfgoed.nl/datasetregister).

Alternatively, use the SPARQL endpoint at `https://datasetregister.netwerkdigitaalerfgoed.nl/sparql` directly.
For example using the [Comunica SPARQL client](https://comunica.dev):

```sh
comunica-sparql sparql@https://datasetregister.netwerkdigitaalerfgoed.nl/sparql 'select * {?s a <http://www.w3.org/ns/dcat#Dataset> . ?s ?p ?o . } limit 100'
```

Or curl:

```bash
curl -H Accept:application/sparql-results+json --data-urlencode 'query=select * {?s a <http://www.w3.org/ns/dcat#Dataset> . ?s ?p ?o . } limit 100'  https://datasetregister.netwerkdigitaalerfgoed.nl/sparql
```

## Data model

DCAT

## Queries

You can get some help building queries at the [Dataset Register website](https://datasetregister.netwerkdigitaalerfgoed.nl/en/datasets),
using the ‘SPARQL’ button.

You probably only want to view currently valid datasets.
For this, follow the link from dataset to registration URL and 
<a href="https://qlever.netwerkdigitaalerfgoed.nl/datasetregister/0BQB8d?exec=true" target="_blank">check whether that URL is valid</a>:

```sparql
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX schema: <http://schema.org/>
SELECT * {
  ?dataset a dcat:Dataset ;
    schema:subjectOf ?registrationUrl .
  ?registrationUrl schema:additionalType <https://data.netwerkdigitaalerfgoed.nl/registry/valid>
}
```
