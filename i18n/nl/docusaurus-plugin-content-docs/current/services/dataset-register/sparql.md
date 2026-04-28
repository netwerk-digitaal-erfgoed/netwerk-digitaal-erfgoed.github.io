# SPARQL-endpoint

Je kunt datasetbeschrijvingen die door jezelf en anderen zijn geregistreerd ophalen
via de [webinterface van onze triple store](https://qlever.netwerkdigitaalerfgoed.nl/datasetregister).

Je kunt ook het SPARQL-endpoint op `https://datasetregister.netwerkdigitaalerfgoed.nl/sparql` rechtstreeks gebruiken.
Bijvoorbeeld met de [Comunica SPARQL-client](https://comunica.dev):

```sh
comunica-sparql sparql@https://datasetregister.netwerkdigitaalerfgoed.nl/sparql 'select * {?s a <http://www.w3.org/ns/dcat#Dataset> . ?s ?p ?o . } limit 100'
```

Of met curl:

```bash
curl -H Accept:application/sparql-results+json --data-urlencode 'query=select * {?s a <http://www.w3.org/ns/dcat#Dataset> . ?s ?p ?o . } limit 100'  https://datasetregister.netwerkdigitaalerfgoed.nl/sparql
```

## Datamodel

DCAT

## Queries

Je kunt hulp krijgen bij het opstellen van queries op de [Datasetregister-website](https://datasetregister.netwerkdigitaalerfgoed.nl/datasets),
via de knop 'SPARQL'.

Doorgaans wil je alleen de momenteel geldige datasets bekijken.
Volg daarvoor de link van de dataset naar de registratie-URL en
<a href="https://qlever.netwerkdigitaalerfgoed.nl/datasetregister/0BQB8d?exec=true" target="_blank">controleer of die URL geldig is</a>:

```sparql
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX schema: <http://schema.org/>
SELECT * {
  ?dataset a dcat:Dataset ;
    schema:subjectOf ?registrationUrl .
  ?registrationUrl schema:additionalType <https://data.netwerkdigitaalerfgoed.nl/registry/valid>
}
```
