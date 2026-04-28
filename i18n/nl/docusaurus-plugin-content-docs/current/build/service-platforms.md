---
sidebar_position: 2
description: Erfgoeddata beschikbaar stellen voor een specifiek doel
---

# Dienstenplatforms

[Dienstenplatforms](/glossary.md#service-platform) stellen erfgoeddata beschikbaar voor een specifiek doel.
Daarvoor moeten ze datasets vinden, benaderen, begrijpen en transformeren.

## Datasets vinden

Voor een snel overzicht van beschikbare datasets kun je de [Datasetregister-website](https://datasetregister.netwerkdigitaalerfgoed.nl/) gebruiken.
Voor automatisering kunnen ontwikkelaars het [Datasetregister SPARQL-endpoint](/services/dataset-register/sparql.md) gebruiken.

## Datasets benaderen

Zoek voor elke relevante dataset de bijbehorende [distributies](../glossary.md#distribution) op.
Er zijn twee typen [RDF](../glossary.md#rdf)-distributie:

* datadumps zijn bestanden die dienstenplatforms kunnen downloaden om in hun eigen infrastructuur te lezen en te verwerken;
* SPARQL-endpoints maken het mogelijk de data rechtstreeks te bevragen.

De dataset [Gouda Tijdmachine Linked Open Data](https://datasetregister.netwerkdigitaalerfgoed.nl/show.php?lang=nl&uri=https%3A%2F%2Fwww.goudatijdmachine.nl%2Fomeka%2Fapi%2Fitems%2F13000)
heeft bijvoorbeeld zowel een datadump (op https://www.goudatijdmachine.nl/omeka/files/goudatijdmachine.nt.gz) als een SPARQL-endpoint
(op https://www.goudatijdmachine.nl/sparql/repositories/gtm).

### SPARQL gebruiken

Om het SPARQL-endpoint te gebruiken, begin je met een eenvoudige SELECT-query via het cURL-opdrachtregelprogramma:

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

Je kunt ook een van de beschikbare SPARQL-clients gebruiken, zoals [Comunica](https://comunica.dev/docs/query/getting_started/query_cli/):

```shell
npm install -g @comunica/query-sparql
comunica-sparql sparql@https://www.goudatijdmachine.nl/sparql/repositories/gtm \
  "SELECT * WHERE { ?s ?p ?o} LIMIT 10"
```

Zie de [SPARQL-specificatie](https://www.w3.org/TR/sparql11-query/) voor meer informatie over bevragen met SPARQL.

## Datasets begrijpen


## Data transformeren

Dienstenplatforms moeten brondata mogelijk [transformeren](../use/transform.md) om deze bruikbaar te maken in het platform en de bijbehorende interfaces.
