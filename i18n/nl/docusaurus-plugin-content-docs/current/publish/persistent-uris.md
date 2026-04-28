---
sidebar_position: 1
slug: /persistent-uris
---

# Persistente HTTP-URI's

Identificeer elke dataresource met een eigen [persistente HTTP-URI](../glossary.md#persistent-http-uri).
Een persistente HTTP-URI is een webadres waarvan gegarandeerd is dat het stabiel blijft en verwijst naar de resource die het identificeert.
Dit betekent dat de URI altijd naar dezelfde resource verwijst, ook als:

- de resource wordt verplaatst, bijgewerkt of verwijderd
- het webadres van de [bronhouder](../glossary.md#data-provider) verandert
- de [dataplatform](../glossary.md#data-platform)-software waarop de dataresources worden gehost wordt bijgewerkt of vervangen.

Alleen met die garantie kunnen [dataconsumenten](../glossary.md#consumer) de URI vertrouwen
en er vanuit hun eigen datasets naar verwijzen.

Op de URI moet een geldig [RDF](../glossary.md#rdf)-document worden aangeboden.

Nieuwe persistente URI's moeten HTTPS-URI's zijn (`https://...`).
Voor eerder gepubliceerde URI's mag HTTP (`http://...`) worden voortgezet.

## Persistente identifiers

Om dit te vereenvoudigen is het doorgaans verstandig een [persistente identifier](../glossary.md#persistent-identifier) (PID) aan te maken
die doorverwijst naar het webadres van de resource.
Zelfs als dat webadres verandert, blijft de PID ongewijzigd.
Door PID's onderdeel te maken van persistente URI's is hun stabiliteit gegarandeerd.

Veelgebruikte PID-systemen zijn:

* [ARK](https://arks.org), bijvoorbeeld `https://n2t.net/ark:/12345/x54xz321/s3/f8.05v.tiff`
* [DOI](https://www.doi.org/), bijvoorbeeld `https://doi.org/10.1234/example.5678`

## Infrastructuuronafhankelijke identifiers

PID's mogen geen infrastructurele details bevatten, zoals de naam of versie van het dataplatform.
De bronhouder wordt geïdentificeerd met een prefix, zodat webadressen of namen kunnen veranderen.
Hierdoor blijven de PID's stabiel ongeacht infrastructurele wijzigingen.

## Meer informatie

* [Requirements voor collectie-informatiesystemen](https://docs.nde.nl/requirements-collection-management-systems/)
