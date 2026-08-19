---
title: "AAT tijdelijk slecht bereikbaar via het Termennetwerk"
authors: [joop, ddeboer]
tags:
  - network-of-terms
---

De Art & Architecture Thesaurus (AAT) van het Getty Research Institute is regelmatig slecht bereikbaar. Daardoor levert zoeken in de AAT via het Termennetwerk geen of vertraagde resultaten op, ook in collectiebeheersystemen die het Termennetwerk gebruiken. Andere terminologiebronnen werken gewoon; de AAT-termen zelf zijn nog wel direct bij Getty te raadplegen.

<!-- truncate -->

## Oorzaak

Het Termennetwerk haalt AAT-termen live op bij Getty en bewaart zelf geen kopie. Reageert de dienst van Getty niet of te traag, dan kunnen er geen zoekresultaten worden getoond. Zowel de website als de API van het Termennetwerk geven in dat geval een [expliciete foutmelding](https://termennetwerk.netwerkdigitaalerfgoed.nl/nl/faq1#TimeoutError): “De terminologiebron is niet bereikbaar” of “De terminologiebron reageerde niet op tijd”.

Getty laat weten dat de dienst overbelast raakt door grootschalig geautomatiseerd botverkeer. Het gaat niet om gepland onderhoud of een upgrade. Getty werkt aan herstel, maar noemt geen datum waarop de dienst weer stabiel is. Vergelijkbare verstoringen deden zich eerder voor en zijn telkens opgelost.

Andere terminologiebronnen zijn niet getroffen: elke bron wordt door haar eigen beheerder aangeboden, op eigen infrastructuur.

## Wat kun je nu doen?

Zie je zo’n foutmelding, dan ligt het niet aan je zoekterm: op de pagina met [terminologiebronnen](https://termennetwerk.netwerkdigitaalerfgoed.nl/nl/sources) zie je van elke bron de [actuele beschikbaarheid](./2026-02-02-source-availability.md). Staat de AAT daar op onbereikbaar, probeer het dan later opnieuw.

Kun je niet wachten, dan is er een omweg: zoek de term op in de [AAT-zoekomgeving](https://www.getty.edu/research/tools/vocabularies/aat/) van Getty en neem de URI over in je collectiebeheersysteem, als je systeem dit ondersteunt.

## Wat doen we?

We staan in contact met het Getty Research Institute over de beschikbaarheid van de AAT-dienst.
We [onderzoeken](https://github.com/netwerk-digitaal-erfgoed/network-of-terms/issues/1930) of we binnen de NDE-infrastructuur een eigen kopie van de AAT kunnen draaien voor het Termennetwerk, zodat een storing bij Getty het zoeken niet langer verstoort. We melden het zodra daar meer over te zeggen is.
