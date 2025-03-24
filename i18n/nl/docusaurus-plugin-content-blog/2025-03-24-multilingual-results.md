---
title: Termennetwerk biedt nu meertalige zoekresultaten
authors: ddeboer
tags: [Termennetwerk, GraphQL]
image: https://i.imgur.com/mErPwqL.png
---

Het Termennetwerk [ondersteunt](https://github.com/netwerk-digitaal-erfgoed/network-of-terms/issues/1410) nu meertalig zoeken naar termen.

<!-- truncate -->

Tot nu toe werden zoekresultaten altijd in één taal teruggegeven: Nederlands voor de meeste bronnen;
Engels voor de bronnen die alleen in die taal beschikbaar zijn (GeoNames en Iconclass).
Nu kun je de talen opgeven waarin je zoekresultaten wilt ontvangen
van die bronnen die in beide talen beschikbaar zijn.
De demonstrator toont [voor elke bron in welke taal of talen deze beschikbaar is](https://termennetwerk.netwerkdigitaalerfgoed.nl/sources).

Een van die bronnen is de Art & Architecture Thesaurus (AAT).
Wanneer je zoekt naar ‘classicism’ in de Engelse demonstrator, krijg je [termen in het Engels](https://termennetwerk.netwerkdigitaalerfgoed.nl/en?q=classicism&datasets=http://vocab.getty.edu/aat).
Wissel naar Nederlands via het ‘Taal’-menu in de rechterbovenhoek, en je krijgt [termen in het Nederlands](https://termennetwerk.netwerkdigitaalerfgoed.nl/nl?q=classicism&datasets=http://vocab.getty.edu/aat).
De informatie over de terminologiebron verandert samen met de gekozen taal.

Je zult zien dat sommige termen toch nog in het Engels worden weergegeven, bijvoorbeeld ‘Baroque Classicism’.
Dat komt doordat zelfs bij meertalige bronnen, niet altijd alle termen in beide talen beschikbaar zijn.
In dat geval laat het Termennetwerk toch de term zien in de oorspronkelijke taal.

Omdat steeds meer software [afhankelijk is](/services/network-of-terms/integrations)
van het Termennetwerk, hebben we gezorgd voor achterwaartse compatibiliteit.
Dat betekent dat bestaande zoekopdrachten in één taal blijven werken zoals voorheen.
Als je meertalig zoeken aan je applicatie wilt toevoegen,
kijk dan in de [technische documentatie](/services/network-of-terms/graphql#multilingual-queries).

Als je een terminologiebron beheert en deze in meer talen beschikbaar wilt maken,
kun je [contact met ons opnemen](https://termennetwerk.netwerkdigitaalerfgoed.nl/nl/contact).
