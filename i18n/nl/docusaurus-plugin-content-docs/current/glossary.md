---
sidebar_position: 8
---

# Woordenlijst

## Collectiebeheerder {#collection-manager}

Gebruikers van [collectie-informatiesystemen](#collection-management-system) die collecties van erfgoedobjecten beheren.

## Collectie-informatiesysteem {#collection-management-system}

Ook bekend als: collectie_registratie_systeem (CRS).

TODO

## Consument {#consumer}



## Datamodel {#data-model}

Kan generiek of domeinspecifiek zijn.

## Dataplatform {#data-platform}

Dataplatforms bieden toegang tot erfgoeddata, die vervolgens door [dienstenplatforms](#service-platform) kan worden gebruikt.

Het kan geïntegreerd zijn in een [collectie-informatiesysteem](#collection-management-system) of een apart systeem zijn,
zoals een triple store of een IIIF-beeldserver.

Data-eigenaren zijn verantwoordelijk voor dataplatforms.

Gedefinieerd in [DERA](https://dera.netwerkdigitaalerfgoed.nl/index.php/Platforms#Dataplatform).

## Bronhouder {#data-provider}

(Engels: _Data Provider_, gedefinieerd in [DERA](https://dera.netwerkdigitaalerfgoed.nl/index.php/Rollen#Bronhouder)).

## Datasetbeschrijving {#dataset-description}

Een RDF-document dat een dataset beschrijft. Formeel gedefinieerd in de [Requirements voor datasets](https://docs.nde.nl/requirements-datasets/).
Deze beschrijvingen moeten worden geregistreerd in het [Datasetregister](#dataset-register)
zodat [consumenten](#consumer) ze kunnen vinden en de datasets kunnen gebruiken.

## Datasetregister {#dataset-register}

Zie de [beschrijving van de dienst Datasetregister](services/dataset-register/index.md).

## Distributie {#distribution}

TODO

## Linked Data {#linked-data}

[RDF](#rdf)-data die gepubliceerd is volgens de [Linked Data-principes](https://www.w3.org/DesignIssues/LinkedData.html).

## Machineleesbaar {#machine-readable}

Een manier om data te publiceren die automatisch door computerprogramma's verwerkt kan worden.

## NDE-compatibel {#nde-compatible}

TODO

## Termennetwerk {#network-of-terms}

Zie de [beschrijving van de dienst Termennetwerk](services/network-of-terms/index.md).

## Persistente HTTP-URI {#persistent-http-uri}

Een URI die via HTTP(S) opvraagbaar is en die, zodra beschikbaar gesteld, altijd toegankelijk moet blijven en altijd naar dezelfde resource moet verwijzen.
Een persistente HTTP-URI fungeert zowel als URI (identiteit van de resource) als als URL (locatie van de resource).

Kan een [persistente identifier](#persistent-identifier) bevatten.
Zie voor meer informatie het hoofdstuk [Datasets publiceren](publish/persistent-uris.md).

Voorbeeld: `https://n2t.net/ark:/60537/b3KCns`.

## Persistente identifier {#persistent-identifier}

Het deel van een [persistente HTTP-URI](#persistent-http-uri) dat een resource uniek identificeert.

Voorbeeld: `ark:/60537/b3KCns`.

## RDF {#rdf}

TODO

## Dienstenplatform {#service-platform}

Een softwaretoepassing met als doel data van één of meerdere [dataplatforms](#data-platform)
beschikbaar te stellen voor een specifiek doel, bijvoorbeeld via een website of app.

Voorbeelden zijn:

- erfgoedobjecten uit het Nederlandse koloniale verleden beschikbaar stellen voor erfgoedonderzoek;
- de herinnering aan de Tweede Wereldoorlog levend houden door verhalen daarover te presenteren.

Dienstenplatforms vallen onder de verantwoordelijkheid van de dienstverleners.

## Term {#term}

Een woord, naam, acroniem, zin of ander symbool met een formele definitie, gepubliceerd in het [Termennetwerk](/services/network-of-terms/index.md).

Termen beschrijven waar erfgoed over gaat. Termen zijn bijvoorbeeld onderwerpen, personen of plaatsen. Neem de Nachtwacht: het is een 'schilderij', gemaakt door 'Rembrandt' in 'Amsterdam'.

Maar een term is meer dan een woord. Elke term heeft een identifier, een zogenaamde URI. Een URI is een uniek adres waarmee ondubbelzinnig duidelijk is welke term bedoeld wordt. Zo kan het Nederlandse woord 'noodweer' een juridisch begrip zijn of heel slecht weer betekenen. De betekenis wordt duidelijk als je de URI van de term leest, zoals http://www.wikidata.org/entity/Q741507.

Daarnaast kan een term aanvullende informatie bevatten, zoals een definitie of een alternatieve naam. Neem de term 'schilderij' met URI http://vocab.getty.edu/aat/300177435. De extra informatie bij deze term maakt duidelijk dat het een synoniem heeft: 'schilderstuk'.

(VAN https://termennetwerk.netwerkdigitaalerfgoed.nl/faq1)

## Terminologiebron {#terminology-source}

## URI {#uri}
