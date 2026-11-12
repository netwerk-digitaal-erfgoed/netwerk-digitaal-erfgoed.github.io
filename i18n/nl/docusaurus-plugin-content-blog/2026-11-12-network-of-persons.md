---
title: Een Termennetwerk voor personen
authors: ddeboer
tags: [network-of-terms, graphql, services]
---

Vandaag lanceert WO2Net [data.oorlogsbronnen.nl](https://data.oorlogsbronnen.nl), dat de data achter Oorlogsbronnen openstelt: personen en bronnen uit meer dan 300 erfgoedcollecties, via API’s, SPARQL en linked data.
Een vroege toepassing van die data is het **Personennetwerk**: een experimentele dienst waarmee je de namen in je eigen collectie koppelt aan personen in WO2-personen, Open Archieven, de Gouda Tijdmachine en Regiotermen Fryslân, met OpenRefine en zonder te programmeren.

<!-- truncate -->

## Personen, geen termen

Een foto, een brief en een dossier in drie instellingen horen bij elkaar doordat ze over dezelfde persoon gaan.
Dat zie je pas als je naamgenoten uit elkaar kunt houden, en daarvoor is een naam niet genoeg: ‘Jan de Vries’ levert alleen in WO2-personen al 218 kandidaten op.
Je hebt ook een geboortedatum, een geboorteplaats of familieleden nodig.
In het [Termennetwerk](/services/network-of-terms/) is een persoon een term zoals alle andere: je vindt hem op naam.
Dat werkt voor bekende mensen in een beheerde thesaurus, zoals RKDartists, maar niet voor de miljoenen gewone mensen in de bronnen.

## Wat het is

Het Personennetwerk draait op de software van het Termennetwerk; alleen de catalogus van bronnen is anders.
Het heeft geen eigen code: de twee diensten zijn Dockerfiles die een [catalogus](https://github.com/netwerk-digitaal-erfgoed/services/tree/main/packages/network-of-persons-catalog) in de image van het Termennetwerk kopiëren.
Het doorzoekt [vier datasets](https://github.com/netwerk-digitaal-erfgoed/services/tree/main/packages/network-of-persons-catalog#datasets) bij de bron, zonder centrale personenthesaurus:

| Dataset | Uitgever | Personen |
| --- | --- | --- |
| [WO2-personen](https://www.oorlogsbronnen.nl/personen) | WO2Net | 813.747 reconstructies |
| [Open Archieven Persoonsreconstructies](https://www.openarchieven.nl/datasets/reconstructions) | Open Archieven | 8.835.746 reconstructies |
| [Gouda Tijdmachine](https://www.goudatijdmachine.nl/) | Gouda Tijdmachine | 648.161 reconstructies |
| [Regiotermen Fryslân: Personen](https://fryslan.regiotermen.nl/) | Tresoar | 4.347 personen |

De eerste drie gebruiken het model [Persons in Context (PiCo)](https://personsincontext.org).
Daarin is een persoon een *reconstructie*, samengesteld uit *observaties*: vermeldingen van iemand in bijvoorbeeld een geboorteakte of een bevolkingsregister.
Voor WO2-personen zijn dat 1,56 miljoen vermeldingen uit 124 datasets van 65 instellingen, verzameld door Oorlogsbronnen.
Het Personennetwerk geeft reconstructies terug, maar zoekt ook in de schrijfwijzen uit de observaties.
WO2-personen is de data die vandaag opengaat; het Personennetwerk bevraagt die via het SPARQL-endpoint `sparql.ldmax.nl/wo2-oorlogsbronnen`.
Oorlogsbronnen verbindt de vermeldingen binnen het platform tot één persoon; het Personennetwerk laat collecties buiten het platform naar die persoon verwijzen.
De personen in Regiotermen Fryslân linken naar Wikidata, VIAF, de NTA en het RKD.

Van een persoon krijg je meer terug dan een naam: voor- en achternaam, geboorte- en sterfdatum en -plaats, beroep, en ouders, kinderen, echtgenoten, broers en zussen.
Ook die familieleden kun je weer opzoeken.
Er zijn twee API’s:

- een [GraphQL-API](https://github.com/netwerk-digitaal-erfgoed/services/tree/main/apps/network-of-persons-graphql) op [personennetwerk.netwerkdigitaalerfgoed.nl](https://personennetwerk.netwerkdigitaalerfgoed.nl), met een webinterface om queries uit te proberen;
- een [reconciliatiedienst](https://github.com/netwerk-digitaal-erfgoed/services/tree/main/apps/network-of-persons-reconciliation) voor OpenRefine.

Een zoekwebsite is er bewust niet: het Personennetwerk is bedoeld voor mensen die met hun eigen data werken, en de bronnen hebben zelf al een zoekpagina.

## Vier namen, met en zonder geboortegegevens

Met de reconciliatiedienst kun je naast de naam andere kolommen meesturen, zoals een geboortedatum.
De dienst rangschikt de kandidaten daarop, maar filtert niet: kandidaten die niet overeenkomen blijven in de lijst staan, alleen lager.
Komt precies één kandidaat op alle punten overeen, dan koppelt OpenRefine die automatisch.

We hebben vier namen gereconcilieerd met WO2-personen, eerst op alleen de naam en daarna met geboortedatum en -plaats:

```csv
naam,geboren,geboorteplaats
Jan de Vries,1902-07-11,
Hendrik de Jong,1919,Marum
Pieter Bakker,1921-10-19,
Willem Smit,1899,
```

| Naam | Kandidaten | Met de topscore | Alleen de naam | Met geboortedatum en -plaats |
| --- | --- | --- | --- | --- |
| Jan de Vries | 218 | 134 | niet gekoppeld | gekoppeld: Han de Vries, ook vermeld als Jan de Vries, geboren 1902-07-11 |
| Hendrik de Jong | 125 | 83 | niet gekoppeld | gekoppeld: Hein Sietsma, 1919-10-15 Marum – 1945-01-21 Dachau |
| Pieter Bakker | 87 | 56 | niet gekoppeld | gekoppeld: geboren 1921-10-19 |
| Willem Smit | 82 | 47 | niet gekoppeld | drie kandidaten geboren in 1899: jij kiest |

Hein Sietsma was een verzetsman die in de bronnen onder de naam Hendrik de Jong voorkomt; alleen met geboortejaar én geboorteplaats vind je hem.
Willem Smit laat zien dat een jaartal soms niet genoeg is, en dat de dienst dan niet gokt: passen meer kandidaten even goed, dan blijft de keuze aan jou.
Een jaartal past wel bij elke datum in dat jaar (`1919` bij `1919-10-15`), en een datum die een jaar afwijkt telt voor de helft mee, omdat een bron soms de doopdatum als geboortedatum geeft.
[Matching persons on more than their name](/services/network-of-terms/reconciliation#matching-persons-on-more-than-their-name) legt uit hoe de score tot stand komt.

Is een kolom gereconcilieerd, dan haalt **Add columns from reconciled values…** op wat de dataset over elke persoon weet: geboorteplaats, ouders, dezelfde persoon in andere datasets (`exactMatches`) en de archiefstukken waaruit de persoon is gereconstrueerd (`seeAlso`).
Zo controleer en verrijk je bijvoorbeeld de namen op een monument, een voorbeeld dat WO2Net zelf noemt.

## Regionaal en landelijk

Tresoar test het Personennetwerk met 175 portretfoto’s van Friese verzetsstrijders, van de Vereniging Friesland 1940-1945.
De test laat zien waar je in je eigen data op moet letten:

- **Namen worden als hele woorden gematcht.** ‘J. Prins’ vindt niets, omdat ‘J.’ in geen enkele naam voorkomt, en ‘Zwanenveld, Dirk’ vindt pas iets als de komma eruit is. Met de namen zoals ze in de lijst stonden, kregen maar 5 van de 175 foto’s kandidaten.
- **De gegevens staan vaak in een beschrijving.** Bij 169 foto’s stonden ze in een tekst als ‘J. Prins, geboren 1901, overleden 19 september 1944 te St. Nicolaasga’. Nadat we die in kolommen hadden gesplitst en op achternaam hadden gereconcilieerd, met geboortejaar, sterfdatum en sterfplaats erbij, kregen 172 foto’s kandidaten. Bij 69 kwam de bovenste kandidaat overeen met alle meegestuurde gegevens.
- **Een achternaam alleen is nooit een volledige match op de naam,** dus automatisch gekoppeld werd er niets. Zet een facet op de score van de beste kandidaat en koppel de hoge scores met **Match each cell to its best candidate**.

Krijn van der Helm, een van de geportretteerden, staat in WO2-personen (als Krijn van *den* Helm) én in Regiotermen Fryslân, met dezelfde geboorte- en sterfdatum.
De meeste anderen staan wel in WO2-personen, maar nog niet in Tresoars eigen thesaurus.
Koppelen maakt ook tegenstrijdigheden zichtbaar: voor Willem Santema geeft Tresoar 1944-08-10 als sterfdatum, WO2-personen 1944-08-09 en Regiotermen Fryslân 1944-10-08.

## Gestructureerde velden in beide netwerken

De gestructureerde velden en het koppelen op die velden zitten in de software van het Termennetwerk, dus ze werken in beide netwerken.

SKOS beschrijft een term: zijn labels, zijn plaats in een hiërarchie, zijn verwijzingen naar andere vocabulaires.
Voor een geboortedatum of een coördinaat heeft SKOS geen plek, dus stopten de queries die tot nu toe in een `skos:scopeNote`: tekst om te lezen, geen data om op te koppelen.
Nu geeft het Termennetwerk wat SKOS niet kan uitdrukken terug in [gestructureerde velden](/services/network-of-terms/graphql#what-a-term-denotes), naast de SKOS-term:

| Veld | Inhoud | In het Termennetwerk |
| --- | --- | --- |
| `person` | Naamdelen, geboorte- en sterfdatum en -plaats, gender, beroep, nationaliteit, familie | RKDartists |
| `place` | Coördinaten | GeoNames |
| `organization` | Type, datum van oprichting en opheffing, vestigingsplaats, moederorganisatie | RKDartists, KB Corporatiethesaurus |

In het Personennetwerk vullen alle vier datasets `person`.
De [reconciliatiedienst](/services/network-of-terms/reconciliation) gebruikt in beide netwerken dezelfde velden: je kunt reconciliëren op de typen Person, Place en Organization, en de velden als kolommen toevoegen.
Bij personen telt de dienst de velden mee bij het koppelen en toont hij ze in de preview van een kandidaat.
In het Termennetwerk levert ‘Rembrandt’ in RKDartists 19 kandidaten op; met geboortejaar `1606` wordt Rembrandt van Rijn automatisch gekoppeld.
Die velden blijven in het Termennetwerk, ook als het Personennetwerk stopt.

## Een aparte instantie, want het is een experiment

Het Termennetwerk is een productiedienst waarvan collectiebeheersystemen afhankelijk zijn.
Op een aparte instantie kunnen we bronnen, velden en zoekgedrag veranderen of weghalen zonder dat iemands collectieregistratie daar last van heeft.
Ook de bronnen verschillen: het Termennetwerk bevat thesauri van bekende mensen, bijgehouden door redacteuren; hier gaat het om reconstructies van grotendeels onbekende mensen.

Na [onze vragen](https://github.com/netwerk-digitaal-erfgoed/services/issues/6) heeft WO2Net alle 813.747 reconstructies getypeerd als `schema:Person`.
Een vervangen reconstructie verwijst nu naar haar opvolger, zodat bestaande links blijven werken; dat is tot nu toe 45.715 keer gebeurd.

## Status, en wat we van je vragen

Het Personennetwerk is een proof of concept, geen productiedienst: de URL, de datasets en de data kunnen veranderen of verdwijnen.
Probeer het gerust, maar bouw er nog geen werkprocessen op.
Of er een Termennetwerk voor personen komt, en in welke vorm, besluit NDE pas als de behoefte in het netwerk duidelijk is.

Heb je een lijst namen, een namenmonument, een fotocollectie of een personenthesaurus?
Reconcilieer die met het Personennetwerk en laat ons weten wat er misgaat en wat je mist.
Beheer je zelf persoonsgegevens? Publiceer ze open, liefst in PiCo, zodat we ze kunnen toevoegen.
Een systeem dat het Termennetwerk ondersteunt, kan met weinig moeite ook het Personennetwerk doorzoeken, want de API’s zijn hetzelfde.
Om ook geboortedata, plaatsen en familie te gebruiken, moeten leveranciers wel aan de slag.
Daarmee koppel je een persoon al bij het registreren, in je eigen collectiebeheersysteem, in plaats van achteraf op een platform.
Wil je dat, vraag het dan aan je leverancier.

Mail [tech@netwerkdigitaalerfgoed.nl](mailto:tech@netwerkdigitaalerfgoed.nl) als je je eigen persoonsdataset aan het Personennetwerk wilt toevoegen, of als je vragen hebt.

## Aan de slag

Alle documentatie is in het Engels:

- [Reconciliatie in OpenRefine](https://github.com/netwerk-digitaal-erfgoed/services/tree/main/apps/network-of-persons-reconciliation): endpoints, koppelen en kolommen toevoegen;
- [GraphQL-API](https://github.com/netwerk-digitaal-erfgoed/services/tree/main/apps/network-of-persons-graphql): personen zoeken en opzoeken, de persoonsvelden en hoe de datasets verschillen;
- [Catalogus](https://github.com/netwerk-digitaal-erfgoed/services/tree/main/packages/network-of-persons-catalog#run-your-own-network-of-terms): hoe het Personennetwerk is uitgerold, en hoe je zelf een Termennetwerk met je eigen datasets draait.
