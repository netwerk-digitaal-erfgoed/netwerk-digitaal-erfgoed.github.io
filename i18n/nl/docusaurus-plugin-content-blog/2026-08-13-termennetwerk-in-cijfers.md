---

title: "Het Termennetwerk in cijfers: meer dan 11 miljoen zoekvragen in 2026"
authors: joop
tags:

* network-of-terms

---

Het Termennetwerk wordt steeds meer onderdeel van de infrastructuur waarmee binnen het Nederlandse erfgoednetwerk termen worden gezocht, geïdentificeerd en hergebruikt. Grafana geeft ons inzicht in hoe de dienst wordt gebruikt.

Voor de periode van 1 januari tot en met 10 augustus 2026 registreert de beschikbare Grafana-export **11.238.305 zoekvragen van gebruikers** en **15.256.333 verzoeken aan termenbronnen**.

<!-- truncate -->

## Meer dan 11 miljoen zoekvragen

Op 10 augustus 2026 had het Termennetwerk **11.238.305 zoekvragen van gebruikers** geregistreerd.

De opgevraagde periode in Grafana begint op 1 januari, maar het eerste geregistreerde datapunt in de aangeleverde cumulatieve reeks dateert van **6 januari 2026**. De onderstaande cijfers beschrijven daarom alleen de gegevens die daadwerkelijk in de export aanwezig zijn. We hebben geen schatting gemaakt voor de ontbrekende eerste dagen van januari.

Over de geregistreerde periode komt dit neer op gemiddeld ongeveer **52.019 zoekvragen per dag**. Het gebruik is niet gelijkmatig over de tijd verdeeld. De maandcijfers laten duidelijke pieken en rustigere perioden zien. Uit de gegevens zelf valt niet af te leiden waardoor deze verschillen worden veroorzaakt.

| Maand | Zoekvragen gebruikers | Verzoeken aan termenbronnen |
| ----- | --------------------: | --------------------------: |
| Jan*  |             1.878.461 |                   2.162.532 |
| Feb   |               742.276 |                   1.167.442 |
| Mrt   |               395.191 |                     967.980 |
| Apr   |             1.834.717 |                   2.534.093 |
| Mei   |             4.149.846 |                   4.741.887 |
| Jun   |               420.839 |                   1.195.675 |
| Jul   |             1.104.829 |                   1.639.252 |
| Aug*  |               712.146 |                     847.472 |

* Voor januari zijn gegevens beschikbaar vanaf 6 januari. Augustus bevat alleen gegevens tot en met 10 augustus.

## De meeste zoekvragen zijn lookups

De Grafana-gegevens maken onderscheid tussen lookups en searches.

* **9.134.804 zoekvragen (81,3%)** waren lookups.
* **2.103.983 zoekvragen (18,7%)** waren searches.

Een lookup haalt een bekende term of URI op. Een search is breder en kan meerdere termenbronnen tegelijk bevragen. Dit onderscheid is belangrijk bij het interpreteren van de cijfers: één zoekvraag van een gebruiker kan leiden tot meerdere verzoeken aan onderliggende bronnen.

Bij searches werden gemiddeld **2,76 termenbronnen** bevraagd. Ongeveer **70,5%** van de searches gebruikte slechts één of twee bronnen.

| Aantal bronnen in een zoekopdracht | Searches | Aandeel |
| ---------------------------------- | -------: | ------: |
| 1 bron                             |  864.080 |   41,1% |
| 2 bronnen                          |  619.916 |   29,5% |
| 3 bronnen                          |  285.317 |   13,6% |
| 4 bronnen                          |  140.170 |    6,7% |
| 5 bronnen                          |  109.184 |    5,2% |
| 6-10 bronnen                       |   59.682 |    2,8% |
| 11+ bronnen                        |   25.634 |    1,2% |

## Verzoeken aan termenbronnen

Het Termennetwerk registreerde tot en met 10 augustus **15.256.333 verzoeken aan termenbronnen**. Dit aantal ligt hoger dan het aantal zoekvragen van gebruikers, omdat één search naar meerdere bronnen tegelijk kan worden gestuurd.

Gegevens per bron zijn nuttig om te begrijpen welke thesauri en andere termenbronnen het vaakst worden bevraagd. Bij één bron is echter een duidelijke waarschuwing nodig.

> **Opmerking over datakwaliteit:** de cijfers voor Homosaurus in Grafana lijken onjuist en zijn waarschijnlijk veel te hoog. De ruwe cijfers zijn in de bijbehorende gegevens niet aangepast. Homosaurus moet daarom **niet** als betrouwbare indicator worden gebruikt bij het vergelijken van het gebruik van termenbronnen.

Omdat de waarde voor Homosaurus de schaal van de vergelijking zou domineren, is deze bron in onderstaande tabel weggelaten. De oorspronkelijke waarden zijn wel ongewijzigd opgenomen in de bijbehorende Excel- en CSV-bestanden.

| Termenbron                                | Zoekvragen | Succespercentage |
| ----------------------------------------- | ---------: | ---------------: |
| AAT                                       |  1.081.062 |            92,1% |
| Cultuurhistorische Thesaurus              |    914.856 |            98,5% |
| RKD                                       |    544.835 |            98,3% |
| Wikidata - alle entiteiten                |    277.474 |            88,4% |
| WO2 Thesaurus                             |    273.434 |            99,2% |
| Cultuurhistorische Thesaurus - Materialen |    245.996 |            99,7% |
| AAT - Materialen                          |    235.111 |            90,7% |
| NMVW-thesaurus                            |    216.328 |            99,2% |
| Wikidata - personen                       |    165.215 |            92,6% |
| Archeologisch Basis Register (ABR)        |    160.511 |            99,7% |

## Betrouwbaarheid verschilt per bron

Het Termennetwerk is afhankelijk van externe terminologiediensten. Het functioneren van deze diensten heeft daarom direct invloed op de ervaring van gebruikers en aangesloten systemen.

De succespercentages in bovenstaande tabel zijn berekend op basis van de aangeleverde aantallen zoekvragen en fouten over de gehele exportperiode. Ze laten zien dat de betrouwbaarheid per bron verschilt. Het monitoren van afzonderlijke bronnen is daarom een belangrijk onderdeel van het beheer van het Termennetwerk. Het Termennetwerk zelf kan beschikbaar zijn terwijl een specifieke termenbron traag is, niet bereikbaar is of fouten teruggeeft.

Het bijbehorende Excel-bestand bevat per bron de aantallen zoekvragen, foutmeldingen, berekende succespercentages en de oorspronkelijke Grafana-exports.

## Wat vertellen deze cijfers ons?

De belangrijkste conclusie is niet één specifieke piek of één veelgebruikte termenbron. Het gaat vooral om de schaal en de aard van het gebruik.

Begin augustus had het Termennetwerk in 2026 al **meer dan 11 miljoen zoekvragen van gebruikers** verwerkt. Meer dan vier op de vijf zoekvragen waren lookups. Dit wijst erop dat de dienst niet alleen wordt gebruikt om vrij naar termen te zoeken, maar ook om bekende termen en URI's op te halen binnen werkprocessen en applicaties.

Tegelijkertijd worden searches vaak naar meerdere termenbronnen tegelijk gestuurd. Het Termennetwerk fungeert daarmee als een gezamenlijke toegangslaag: gebruikers en systemen kunnen via één dienst meerdere thesauri en andere termenbronnen bevragen, zonder voor iedere bron afzonderlijk een koppeling te hoeven implementeren.

Deze cijfers vormen een momentopname van 2026. Ze vertellen ons niet hoeveel individuele personen, organisaties of softwaresystemen verantwoordelijk zijn voor het verkeer. Met de huidige metingen kunnen we bijvoorbeeld niet betrouwbaar onderscheid maken tussen verschillende klanten achter één multi-tenant systeem. Door in de toekomst een consistente client identifier of request header toe te voegen, zou dit soort analyse wel mogelijk worden.

## Data

Het bijbehorende Excel-bestand bevat:

* een dashboard met de belangrijkste cijfers;
* maandelijkse trends in zoekvragen en verzoeken aan termenbronnen;
* de verhouding tussen lookups en searches;
* het aantal geselecteerde termenbronnen per search;
* statistieken over zoekvragen en fouten per bron;
* cijfers over betrouwbaarheid;
* de ongewijzigde Grafana-exports waarop deze analyse is gebaseerd.

Het CSV-bestand met bronstatistieken bevat een compacte, machineleesbare versie van de gegevens per termenbron. De rij voor Homosaurus is behouden en voorzien van de bekende waarschuwing over de datakwaliteit.

Je kunt de onderliggende gegevens en analyse hier downloaden:

* [Download het Excel-bestand](/network-of-terms/network-of-terms-usage-2026-01-01-to-2026-08-10.xlsx)
* [Download de bronstatistieken als CSV](/network-of-terms/network-of-terms-source-statistics-2026-08-10.csv)
