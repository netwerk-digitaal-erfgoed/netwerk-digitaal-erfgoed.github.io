---
title: Nieuwe website Datasetregister
authors: ddeboer
tags: [Datasetregister]
---

We verbeteren de website van het Datasetregister om het vinden van datasets sneller en intuïtiever te maken.

<!-- truncate -->

De verbeteringen worden **per pagina** doorgevoerd, te beginnen met de zoek- en detailpagina’s. 

## Zoekpagina

De vernieuwde [zoekpagina](https://datasetregister.netwerkdigitaalerfgoed.nl/datasets) biedt **uitgebreide facetten om nauwkeurig te kunnen zoeken**,
bijvoorbeeld uitgever, gebruikte terminologiebronnen en omvang. Per facet zie je nu het aantal resultaten. 

De resultaten laten **meer informatie** zien dan voorheen: 
niet alleen de naam van de dataset en de uitgever, maar ook (indien beschikbaar) de taal, distributies en omvang van de dataset.

Een RSS-knop geeft toegang tot een **RSS-feed voor elke zoekopdracht**. 
Als je daarop abonneert, word je op de hoogte gesteld wanneer er nieuwe datasets worden toegevoegd aan het Datasetregister die voldoen aan jouw zoekopdracht.

Daarnaast voor fijnproevers een SPARQL-knop, om inspiratie op te doen voor het bevragen van het Datasetregister met SPARQL-queries.

## Detailpagina

De detailpagina (bijvoorbeeld [deze](https://datasetregister.netwerkdigitaalerfgoed.nl/datasets/https://lod.uba.uva.nl/Cinema-Context/Cinema-Context)) 
biedt **meer informatie én overzicht**.

De door de uitgever aangeleverde datasetbeschrijving wordt netter gegroepeerd en weergegeven.

Die beschrijving wordt aangevuld met inzichten uit de Dataset Knowledge Graph.
Geverifieerde distributies worden als zodanig aangemerkt.

Onder ‘**Linked Data-samenvatting**’ vind je een overzicht van de empirische vorm van de dataset: 
de aantallen feiten (RDF triples), onderwerpen (subjects), eigenschappen (predicates) en objecten, opgesplitst in literals en URI’s.

Een interactieve widget maakt het mogelijk om op hoog niveau door de dataset te bladeren om **antwoord te krijgen op vragen** als:

- Welke typen (classes) komen voor in de dataset?
- Wat is hun verdeling?
- Voor een bepaald type, welke eigenschappen (predicates) heeft het?
- Hoe zijn die eigenschappen verdeeld? Bijvoorbeeld voor personen: welk percentage van hen heeft een voornaam, een achternaam en hoeveel beide?
- In welke eigenschappen komen objecten voor van een bepaald type, bijvoorbeeld datum?

Ook wordt getoond welke terminologiebronnen en vocabulaires door de dataset worden gebruikt.

Al deze inzichten moeten gebruikers helpen om te **beoordelen of ze een dataset willen gebruiken** en, zo ja,
volgens **welke patronen ze die kunnen bevragen**.

## Algemene verbeteringen

Bij deze vernieuwingen besteden we veel aandacht aan de gebruikersinterface en -ervaring:

- overzichtelijkere layout en kleurgebruik
- op alle pagina’s geven tooltips (achter het i-icoontje) uitleg waar nodig
- de nieuwe website ondersteunt donkere modus, zodat nachtelijke sessies minder pijn doen aan de ogen. 

## Vervolg

Over de [validatiepagina](https://datasetregister.netwerkdigitaalerfgoed.nl/validate.php?url=http%3A%2F%2Fdata.beeldengeluid.nl%2Fid%2Fdataset%2F0029) krijgen we regelmatig vragen van uitgevers, 
wat haar een logische kandidaat maakt voor de volgende verbetering.

## Techniek

Voor het realiseren van dit soort functionaliteit wordt vaak een zoekindex (zoals Elasticsearch) geïntroduceerd.
Die index wordt dan periodiek gevuld vanuit de databron en kan vervolgens zoekvragen van gebruikers snel beantwoorden.

Hier hebben we **expres niet zo'n index gebruikt** om de architectuur eenvoudig te houden:
geen synchronisatieproces om te onderhouden en één component minder om te draaien.
Een nevendoel van deze vernieuwing is daarom te toetsen of het mogelijk is deze functionaliteit direct op SPARQL-endpoints te draaien, zonder tussenkomst van een index.

Dat is hier extra ingewikkeld omdat we een **gefedereerde SPARQL-query** doen: 
we halen data op uit het Datasetregister zelf, maar ook verrijkingen uit de [Dataset Knowledge Graph](/services/dataset-knowledge-graph/).

Met een snelle SPARQL-server ([QLever](https://github.com/ad-freiburg/qlever)), slimme SPARQL-queries en optimalisaties waar nodig, **lijkt dit mogelijk**.
Optimalisaties zijn bijvoorbeeld het verwijderen van een `FILTER NOT EXISTS`
en explicitering van het datamodel, zoals we gedaan hebben door toevoeging van een `schema:additionalType` voor de status van de dataset.

Toch is er nog veel ruimte voor verbetering. Die komt.
