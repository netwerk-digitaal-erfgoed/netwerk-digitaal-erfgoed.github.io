---
sidebar_position: 1
toc_max_heading_level: 4
---

# GraphQL API

De GraphQL API is bedoeld voor softwareontwikkelaars
die deze willen integreren in
[collectie-informatiesystemen](../../glossary.md#collection-management-system),
[dienstenplatforms](../../glossary.md#service-platform) en andere software.

Als je eenvoudig termen wilt zoeken, kun je de [demonstrator](https://termennetwerk.netwerkdigitaalerfgoed.nl) gebruiken.

## Endpoint

De GraphQL API is beschikbaar op:
```
https://termennetwerk-api.netwerkdigitaalerfgoed.nl/graphql
```

Voor een webinterface om queries uit te proberen kun je https://termennetwerk-api.netwerkdigitaalerfgoed.nl gebruiken.

TODO: https://github.com/netwerk-digitaal-erfgoed/network-of-terms-tutorial/wiki/GraphQL-API

## Terminologiebronnen opvragen

Voor een lijst van [terminologiebronnen](../../glossary.md#terminology-source) die via het Termennetwerk geraadpleegd kunnen worden,
gebruik je deze query:

```graphql title="List terminology sources"
query Sources {
  sources {
    uri
    name
    alternateName
    description
    inLanguage  
    mainEntityOfPage
    creators {
      uri
      name
      alternateName
    }
    genres {
      uri
      name
    }
    features {
      type
      url
    }
  }
}
```

Informatie over terminologiebronnen is beschikbaar in zowel het Engels als het Nederlands.
Om een specifieke taal op te vragen, gebruik je de HTTP-verzoekkop `Accept-Language`, bijvoorbeeld:

```http request
Accept-Language: en
```

of:

```http request
Accept-Language: nl
```

## Termen zoeken

### Één bron bevragen

Om één [terminologiebron](../../glossary.md#terminology-source) te bevragen, selecteer je een bron uit de [lijst van bronnen](#terminologiebronnen-opvragen)
en gebruik je de URI ervan in de queryparameter `sources`. Vul bij `query` de zoekterm in waarvoor je termen wilt vinden.

```graphql title="Query Cultuurhistorische Thesaurus (CHT)"
query {
  terms(
    sources: ["https://data.cultureelerfgoed.nl/term/id/cht"],
    query: "fiets"
  ) {
    result {
      __typename
      ... on Terms {
        terms {
          uri
          prefLabel
          altLabel
          hiddenLabel
          definition 
          scopeNote
          seeAlso
          broader {
            uri
            prefLabel
          }
          narrower {
            uri
            prefLabel
          }
          related {
            uri
            prefLabel
          }
          exactMatch {
            uri
            prefLabel
          }
        }
      }
      ... on Error {
        message
      }
    }
    responseTimeMs
  }
}
```

Het element `result` is ofwel:

* een lijst van gevonden termen (`... on Terms`), die leeg kan zijn als er geen termen gevonden zijn
* of een foutmelding (`... on Error`). Fouten omvatten [time-outs](#time-outs).

### Zoekresultaat

De lijst van termen is gesorteerd op relevantie, indien ondersteund door de terminologiebron,
anders simpelweg alfabetisch.
Elk resultaat bevat de terminologiebron en de daarin gevonden termen.

#### Bron

Een terminologiebronobject heeft:

* een [URI](../../glossary.md#persistent-http-uri) die de bron identificeert
* `name`
* `description` die in één zin het beoogde gebruik van de bron beschrijft
* `inLanguage` dat aangeeft in welke talen de bron beschikbaar is, doorgaans `nl` en/of `en`
* `alternateName`: een optionele, bekende verkorte naam voor weergavedoeleinden
* `creators`: de uitgever van de bron, met eigen `uri`, `name` en `alternateName` (verkorte naam)
* `genres`: onderwerpen waarover de bron informatie bevat
* `mainEntityOfPage`: een website met meer informatie over de bron.

#### Termen

Een termobject heeft:

* een [URI](../../glossary.md#persistent-http-uri) die de term identificeert
* `prefLabel` dat de hoofdnaam van de term is
* `altLabel`s en `hiddenLabel`s die alternatieve namen zijn
* `definition` die de term definieert
* `scopeNote` die aanvullende informatie geeft
* `seeAlso` dat verwijst naar een webpagina voor mensen over de term
* `broader`-, `narrower`- en `related`-termen die gerelateerd zijn aan de term
* `exactMatch`es die verwijzen naar termen in andere terminologiebronnen.

In [collectie-informatiesystemen](../../glossary.md#collection-management-system) wordt de URI van de term gebruikt om data aan de term te koppelen.

#### Bron

### Meerdere bronnen bevragen

Meerdere bronnen bevragen lijkt sterk op [één bron bevragen](#één-bron-bevragen), maar nu worden meerdere URI's opgegeven in de queryparameter `sources`:

```graphql title="Query RKDartists and NTA simultaneously" 
query {
  terms(
    // highlight-start
    sources: [
      "https://data.rkd.nl/rkdartists",
      "http://data.bibliotheken.nl/id/dataset/persons"
    ],
    // highlight-end
    query: "Gogh"
  ) {
    source {
      uri
      name
      creators {
        uri
        name
        alternateName
      }
    }
    result {
      __typename
      ... on Terms {
        terms {
          uri
          prefLabel
          altLabel
          hiddenLabel
          definition 
          scopeNote
          seeAlso
        }
      }
      ... on Error {
        message
      }
    }
    responseTimeMs
  }
}
```

De resultaten zijn gegroepeerd per terminologiebron. Elke bron geeft ofwel een lijst van termen terug, ofwel een fout.

## Termen opzoeken via URI

Gebruik de `lookup`-query om termen op te zoeken waarvan je de URI's kent (bijvoorbeeld omdat je de URI's eerder hebt opgeslagen).
Je kunt meerdere URI's tegelijk opzoeken door ze op te geven in de queryparameter `uris`.

```graphql
query {
  lookup(
    uris: ["https://data.rkd.nl/artists/32439", "https://data.cultureelerfgoed.nl/term/id/cht/15e29ea3-1b4b-4fb2-b970-a0c485330384"],
  ) {
    uri
    source {
      ... on Source {
        uri
        name
        creators {
          uri
          name
          alternateName
        }
      }
      ... on Error {
        __typename
        message
      }
    }
    result {
      ... on Term {
        uri
        prefLabel
        altLabel
        hiddenLabel
        definition 
        scopeNote
        seeAlso
        broader {
          uri
          prefLabel
        }
        exactMatch {
          uri
          prefLabel
        }
      }
      ... on Error {
        __typename
        message
      }
    }
    responseTimeMs
  }
}
```

## Meertalige queries

Standaard worden [zoek- en opzoekresultaten](#zoekresultaat) teruggegeven in de standaardtaal van het Termennetwerk,
namelijk Nederlands.
Zowel [zoek-](#termen-zoeken) als [opzoekqueries](#termen-opzoeken-via-uri) kunnen echter meertalig zijn.

Je past je query als volgt aan:
* geef een queryparameter `languages` mee met een lijst van taalcodes, in volgorde van voorkeur, om resultaten in meerdere talen te ontvangen.
* match `... on TranslatedTerms` om de meertalige inhoud op te halen
* lees de waarden van elke vertaalde eigenschap als een `{ language value }`-paar.

```graphql title="Return results in both English and Dutch" {8,16,19-23} showLineNumbers
query {
  terms(
    sources: [
      "https://data.rkd.nl/rkdartists",
      "http://data.bibliotheken.nl/id/dataset/persons"
    ],
    query: "Gogh",
    languages: [en, nl]
  ) {
    source {
      uri
      name
    }
    result {
      __typename
      ... on TranslatedTerms {
        terms {
          uri
          prefLabel { language value }
          altLabel { language value }
          hiddenLabel { language value}
          definition { language value }
          scopeNote { language value }
          seeAlso
        }
      }
      ... on Error {
        message
      }
    }
    responseTimeMs
  }
}
```

:::tip

Niet alle terminologiebronnen zijn in alle talen beschikbaar.
Bekijk de [responsparameter](#terminologiebronnen-opvragen) `inLanguage`
om te zien welke talen beschikbaar zijn voor elke bron.

:::


## Responstijden

De responstijden van het Termennetwerk variëren afhankelijk van hoe snel elke terminologiebron resultaten teruggeeft voor de query.

Gebruik de responsparameter `responseTimeMs` om de responstijd (in ms) per bron te bekijken.

```graphql
query {
  terms(
    sources: [...],
    query: "..."
  ) {
    source { ... }
    result { ... }
    responseTimeMs
  }
}
```

## Time-outs

De standaard time-out is 10 seconden. Je kunt deze verhogen tot maximaal 60 seconden met de
queryparameter `timeoutMs`. Bijvoorbeeld, om maximaal 15 seconden te wachten op elke terminologiebron:

```graphql
query {
  terms(
    sources: [...],
    query: "...",
    timeoutMs: 15000,
  ) {
    ...
  }
}
```
