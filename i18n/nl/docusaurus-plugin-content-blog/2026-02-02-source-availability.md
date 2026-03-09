---
title: Beschikbaarheidsstatus van terminologiebronnen
authors: ddeboer
tags: [network-of-terms, graphql]
---

Het Termennetwerk monitort nu de beschikbaarheid van terminologiebronnen en toont deze via de website en de GraphQL API.

<!-- truncate -->

## Waarom beschikbaarheid ertoe doet

Het Termennetwerk bevraagt terminologiebronnen in realtime. Als het SPARQL-endpoint van een bron niet bereikbaar is, mislukken zoekopdrachten naar die bron. Tot nu toe was er geen manier om vooraf te weten of een bron beschikbaar was – je kwam er pas achter na een mislukte zoekopdracht.

Met het nieuwe `status`-veld op elke bron kun je de beschikbaarheid controleren voordat je een zoekopdracht uitvoert.
Zo kun je gebruikers proactief informeren, bijvoorbeeld door een waarschuwing te tonen bij onbereikbare bronnen.
Als je meerdere bronnen tegelijk bevraagt, kun je tijdelijk onbereikbare bronnen overslaan zodat gebruikers daar niet op hoeven te wachten.

## Hoe het werkt

Het Termennetwerk controleert periodiek het SPARQL-endpoint van elke bron.
Het resultaat wordt beschikbaar gesteld via een `status`-veld op het `Source`-type in de [GraphQL API](/services/network-of-terms/graphql):

```graphql
query Sources {
  sources {
    uri
    name
    status {
      isAvailable
      lastChecked
    }
  }
}
```

Het `status`-object bevat twee velden:

- `isAvailable`: of het endpoint van de bron succesvol heeft gereageerd bij de laatste controle
- `lastChecked`: wanneer de laatste beschikbaarheidscontrole is uitgevoerd (ISO 8601).

## Op de website

Op de website van het Termennetwerk is de beschikbaarheid zichtbaar op twee plekken: in het zoekformulier waar je bronnen selecteert, en op de [lijst van terminologiebronnen](https://termennetwerk.netwerkdigitaalerfgoed.nl/nl/sources).

Voor ontwikkelaars is het `status`-veld beschikbaar in elke GraphQL-query die broninformatie retourneert – zowel bij het [opvragen van bronnen](/services/network-of-terms/graphql#list-terminology-sources) als bij het [zoeken naar termen](/services/network-of-terms/graphql#query-multiple-sources). Zo kun je zoekresultaten eenvoudig combineren met actuele beschikbaarheidsinformatie.

## Relatie met de NDE-statuspagina

Deze functionaliteit is een aanvulling op de [NDE-statuspagina](https://status.netwerkdigitaalerfgoed.nl) die we [onlangs hebben gelanceerd](/blog/2026/02/05/status-page).
De statuspagina bewaakt het Termennetwerk als dienst, terwijl het `status`-veld de individuele terminologiebronnen bewaakt die het Termennetwerk bevraagt.
Samen geven ze een compleet beeld van de beschikbaarheid.
