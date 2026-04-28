---
sidebar_position: 3
---

# Terminologiebronnen

## Catalogus

De lijst van [terminologiebronnen](../../glossary.md#terminology-source) wordt beheerd in de Termennetwerk-[catalogus](https://github.com/netwerk-digitaal-erfgoed/network-of-terms/tree/master/packages/network-of-terms-catalog),
een set JSON-LD RDF-bestanden die de bronnen, hun SPARQL-endpoints en de gebruikte queries om termen te vinden beschrijven.

## Een terminologiebron toevoegen

Terminologiebronnen moeten voldoen aan de [Vereisten voor terminologiebronnen](https://docs.nde.nl/requirements-terminologiebronnen/).
De belangrijkste eisen zijn:

* de bron moet beschikbaar zijn als SPARQL-endpoint
* voor elke term moet basisinformatie gepubliceerd zijn, minimaal een URI en een label.

Als je een bron wilt toevoegen aan het Termennetwerk, raadpleeg dan de [FAQ](https://termennetwerk.netwerkdigitaalerfgoed.nl/faq2).

## Volledige-tekstzoeken

Termen worden gezocht op basis van tekstuele zoekopdrachten.
Hoewel dit mogelijk is met gewone SPARQL (`CONTAINS`), kan de zoekprestatie verbeterd worden door gebruik te maken van de volledige-tekstzoekondersteuning van het SPARQL-endpoint,
doorgaans aangedreven door Lucene.

Volledige-tekstzoeken wordt ondersteund door:

* [Fuseki](https://jena.apache.org/documentation/query/text-query.html) (`text:query`)
* [GraphDB](https://graphdb.ontotext.com/documentation/10.8/full-text-search.html)
* [Virtuoso](https://docs.openlinksw.com/virtuoso/bifcontainsoptions/) (`bif:contains`)
