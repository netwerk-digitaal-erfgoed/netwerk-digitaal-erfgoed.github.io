---
title: Het publiceren van datasetbeschrijvingen vanuit een triplestore
authors: [coret, ddeboer]
tags: [rdf, dataset-register]
---

## Dataset beschrijvingen zijn RDF

Via een datasetbeschrijving kan een organisatie de data die zij via een datadump of API beschikbaar stellen in een machine leesbaar formaat (RDF) beschrijven én publiceren zodat andere platforms hier gebruik van kunnen maken. Dit kan een dienstplatform zijn zoals CollectieNederland, Europeana (via DC4EU) of Oorlogsbronnen. En, om beter zicht te krijgen op beschikbare datasets binnen het netwerk, via het [NDE Datasetregister](https://datasetregister.netwerkdigitaalerfgoed.nl/).

Datasetbeschrijvingen worden beschreven op basis van internationale standaarden als Schema.org of DCAT3. Voor DCAT3 is er, onder leiding van Geonovum, een sector overschrijdend applicatieprofiel opgesteld voor gebruik in Nederland: [DCAT3 AP NL](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/). Voor Schema.org is er een applicatieprofiel opgesteld binnen het erfgoednetwerk in de vorm van [Requirements for datasets](https://docs.nde.nl/requirements-datasets/).

Voor beide vocabulaires geldt dat de afspraken gaan over hoe de RDF van de datasetbeschrijving opgesteld moet worden. Welke classes en properties en hun cardinaliteit. 

## Dataset beschrijvingen (RDF) publiceren

Vanuit het NDE Datasetregister zien we meerdere wegen die leiden naar [valide](https://datasetregister.netwerkdigitaalerfgoed.nl/validate.php) gepubliceerde datasetbeschrijvingen: 
- handmatig opgesteld en gepubliceerd op website, dataplatform of Github
- gepubliceerd vanuit het NDE-compatible collectie-informatiesysteem
- vanuit de eigen linked data publicatie omgeving (triplestore).

Omdat er meer en meer erfgoedorganisaties linked data (RDF) publiceren, wordt er in deze blogposting wat aandacht voor deze publicatie route besteed. 

## Dataset beschrijvingen (RDF) via een een linked data publicatie omgeving

Als je als erfgoedorganisatie een linked data publicatie omgeving heb ingericht en dus interne data via een pijplijn naar een datadump of triplestore met SPARQL-endpoint kunt brengen, dan komt deze omgeving logischerwijs ook in beeld voor de datasetbeschrijvingen, dat is immers ook te publiceren linked data!

De eisen voor een valide datasetbeschrijvingen maken dat je een complete set van RDF moet publiceren. Dit kan via RDFa of JSON-LD binnen HTML of een los RDF bestand. Als je linked data publicatie omgeving een SPARQL-endpoint heeft, dan kun je je datasetbeschrijving(en) ook via een `SPARQL CONSTRUCT` query samenstellen!

## SPARQL CONSTUCT Registratie URL
Het NDE Datasetregister vereist dat je [aangeeft](https://datasetregister.netwerkdigitaalerfgoed.nl/maak.php) waar de datasetbeschrijving(en) zijn te vinden, de zogenaamde registratie URL. Dit kan de URL zijn van een HTML pagina (met RDFa of JSON-LD) of een URL van een RDF bestand (bijv. JSON-LD, Turtle, N-triple). En dit kan ook een slimme aanroep naar het eigen SPARQL-endpoint zijn!

Stel, je hebt alle triples voor je datasetbeschrijvingen, distributies en wellicht datacatalogus via je integratieomgeving opgeslagen in de graph `<http://data.bibliotheken.nl/datasetbeschrijvingen>` die beschikbaar is in de eigen linked data publicatie omgeving met als SPARQL-endpoint `https://data.bibliotheken.nl/sparql`. 

De query om alle datasetbeschrijving triples "uit" je triplestore op te vragen is in dit voorbeeld:

```SPARQL
CONSTRUCT {
      ?s ?p ?o .
} WHERE {
      GRAPH <http://data.bibliotheken.nl/datasetbeschrijvingen> {
            ?s ?p ?o .
      }
}
```

Deze `SPARQL CONSTUCT` kun je na URL-encoderen opnemen via de query parametere naar het SPARQL-endpoint. Je hiermee de volgende URL:

`https://data.bibliotheken.nl/sparql?query=CONSTRUCT%20%7B%20%3Fs%20%3Fp%20%3Fo%20.%20%7D%20WHERE%20%7B%20GRAPH%20%3Chttp%3A//data.bibliotheken.nl/datasetbeschrijvingen%3E%20%7B%20%3Fs%20%3Fp%20%3Fo%20.%20%7D%20%7D`

Dit is een registratie URL die aangemeld kan worden bij het NDE datasetregister! 

:::warning Verwijs naar het SPARQL-protocol-endpoint, niet naar de query-editor

Registreer de URL van het SPARQL-*protocol*-endpoint – het endpoint dat `?query=…` verzoeken met RDF beantwoordt – en niet de URL van een SPARQL query-editor of landingspagina. Een query-webinterface (zoals een YASGUI-pagina) geeft een HTML-pagina terug in plaats van RDF, waardoor het register er geen datasetbeschrijvingen uit kan lezen. Een veelgemaakte fout is om de URL rechtstreeks uit de adresbalk van je browser te kopiëren terwijl je naar de query-editor kijkt.

Zorg er ook voor dat de graph-IRI in je query exact overeenkomt met die in je triplestore, inclusief het `http`- versus `https`-schema: `<http://…>` en `<https://…>` zijn verschillende named graphs, en het bevragen van de verkeerde levert een leeg resultaat op.
:::

Het datasetregister haalt dagelijks alle datasetbeschrijvingen op. Voor alle SPARQL CONSTRUCT Registratie URL's wordt altijd de laatste informatie omtrent de datasetbeschrijvingen verkregen uit de onderliggende linked data publicatie omgeving. Het is **een slimme, op standaarden gebaseerde inzet** van de linked data publiceer omgeving voor datasetbeschrijvingen.

Verander je van linked data publiceer omgeving, dan kan de registratie URL wijzigen. Dit is echter geen probleem, zoland de in de datasetbeschrijvingen gebruikte URI's maar ongewijzigd blijven en blijven resolven.

## Voorbeeld in het NDE Datasetregister

In het NDE Dataset register zie je onderaan een pagina met de dataset beschrijving de zogenaamde registratie informatie, inclusief de registratie URL. Op bijvoorbeeld de [Personen uit de Nederlandse Thesaurus van Auteursnamen (NTA)](https://datasetregister.netwerkdigitaalerfgoed.nl/datasets/http://data.bibliotheken.nl/id/dataset/persons) pagina in het dataset register zie je een `SPARQL CONSTRUCT` registratie URL staan vergelijkbaar met bovenstaand voorbeeld.
