---
sidebar_position: 2
---

# Reconciliation API

Use the [Reconciliation Service API](https://www.w3.org/community/reports/reconciliation/CG-FINAL-specs-0.2-20230410/)
to **match and reconcile textual strings in your data with [terms](../../glossary.md#term)**.

The Network of Terms implements **version 0.2** of the Reconciliation Service API
(W3C Entity Reconciliation Community Group Final Report, 10 April 2023). Version 1.0
of the specification is still a draft and is not yet supported.

If you want to use the Reconciliation Service API, configure one or more service endpoints in your
[OpenRefine](https://openrefine.org) application. An endpoint’s URL is structured like
`https://termennetwerk-api.netwerkdigitaalerfgoed.nl/reconcile/{sourceUri}`. A full list of endpoints can be found on
the [Network of Terms website](https://termennetwerk.netwerkdigitaalerfgoed.nl/reconciliation), or
discovered programmatically via the GraphQL API – see [Discover reconciliation endpoints](graphql.md#discover-reconciliation-endpoints).

Note that the Network of Terms provides Reconciliation endpoints only for terminology sources that do not offer such
endpoints themselves.

## Using the API from OpenRefine

In OpenRefine, open the column you want to reconcile and choose **Reconcile → Start reconciling…**. The first time you use a Network of Terms endpoint, click **Add standard service…** and paste the endpoint URL for the source (for example `https://termennetwerk-api.netwerkdigitaalerfgoed.nl/reconcile/https://data.cultureelerfgoed.nl/term/id/cht`). OpenRefine remembers the service for subsequent projects.

In the reconciliation dialog, choose the type to reconcile against:

| Type | Matches |
| --- | --- |
| **Concept** (`http://www.w3.org/2004/02/skos/core#Concept`) | Every term |
| **Person** (`https://schema.org/Person`) | Only terms that the source describes as persons |
| **Reconcile against no particular type** | Every term, like Concept |

OpenRefine suggests a type based on the candidates it finds for the first cells, so for a source of persons it suggests Person. Choose Person to leave out concepts and places that have the same name as a person.

Hover over a candidate to see its preview. A person’s preview shows what tells namesakes apart: birth and death, occupation, gender, nationality and family members. Other terms show their broader, narrower and related terms.

## Matching persons on more than their name

A common name such as ‘Jan Jansen’ has many namesakes. If your data holds more about each person, such as a birth date or birthplace, send it along: in OpenRefine’s reconciliation dialog, under **Also use relevant details from other columns**, pick the column and the property it holds. The service then ranks the candidates whose details match first.

| Property | Value |
| --- | --- |
| `givenNames`, `familyNames` | A name |
| `birthDates`, `deathDates` | A date of any precision, such as `1851`, `1851-03-02` or the [EDTF](https://www.loc.gov/standards/datetime/) interval `1606-07-15/1607` |
| `birthPlaces`, `deathPlaces`, `nationalities` | A name, or a reconciled place with its IRI |
| `genders` | `male` or `female`, in English or Dutch, or `https://schema.org/Male` or `https://schema.org/Female` |
| `occupations` | The name of an occupation or role, or a reconciled occupation |
| `parents`, `children`, `spouses`, `siblings` | A name, or a reconciled person |

The property IDs are the same as those for [adding columns from reconciled terms](#adding-columns-from-reconciled-terms); OpenRefine also offers them by their translated names, such as ‘Geboortedatum’.

How a candidate scores:

* **Dates** match when they can mean the same day, whatever their precision: `1851` matches `1851-03-02`. A date within a year of the other counts half, as a source may give a baptism date for a birth date.
* **Places, occupations and relatives** match by IRI if you reconciled them first. Otherwise their names are compared, ignoring a qualifier such as ‘Leiden (stad)’.
* The name and each property weigh equally. A property the source states nothing about counts half, so that candidate ranks below one that matches and above one that contradicts. Candidates are ranked, never left out.
* Each candidate’s `features` give the separate scores, from 0 to 1. When the first candidate’s name and every property match, and no other candidate’s do, it is marked `match`, so OpenRefine can match the cell automatically.

With properties, the service asks a source of persons for 1,000 instead of 100 results, so that the right person is among the candidates it ranks. Any other source still returns 100.

## Adding columns from reconciled terms

Once a column is reconciled, choose **Edit column → Add columns from reconciled values…** to fetch more of what the source states about each term. The data-extension endpoint offers these properties and returns the ones you select, each empty where the source states nothing:

| Property | Values |
| --- | --- |
| `prefLabels`, `altLabels`, `scopeNotes` | Labels and notes, in the selected language |
| `birthDates`, `deathDates` | Dates of a person, as EDTF strings |
| `birthPlaces`, `deathPlaces`, `genders`, `nationalities`, `occupations` | Names, or IRIs where the source names nothing |
| `givenNames`, `familyNames` | Parts of a person’s name, in whatever language the source states them if not in the selected one |
| `parents`, `children`, `spouses`, `siblings` | Family members in the same source, as reconciled entities named by their preferred label or name; IRIs where the source gives no name |
| `broaderTerms`, `narrowerTerms`, `relatedTerms` | Terms in the same source, as reconciled entities named by their preferred label; IRIs where the source gives no label |
| `exactMatches` | IRIs of the same term in other sources, such as ULAN, VIAF or Wikidata |
| `seeAlso` | IRIs of web pages about the term, such as the records a person was reconstructed from |

For a column reconciled against Person, the dialog leaves out `broaderTerms` and `narrowerTerms`, which a person never has. The family member columns are reconciled against Person themselves, so you can add their properties in turn: the birth dates of a person’s parents, for example.

## Language selection

Reconciliation endpoints honor the standard `Accept-Language` HTTP header for content
negotiation. Clients send a ranked list of preferences (e.g. `en, nl;q=0.8`); the
server picks a single best match. Currently honored values are `nl` and `en`; the
default and fallback when nothing matches is `nl`.

The header controls:

* `name` and `description` of every candidate returned by `/reconcile/{sourceUri}`
* Values returned by the data-extension endpoint `/extend` (and `/reconcile/{sourceUri}/extend`)
* The HTML preview at `/preview/*`
* Service manifest labels (column titles, suggest service titles, etc.)

The v0.2 specification does not define a per-query language field; the HTTP header is
the only knob. The v1.0 draft introduces a per-query `lang` field – when that
specification stabilizes and OpenRefine adopts it, we will revisit support for it here.

### Example

A minimal reconciliation query against the Cultuurhistorische Thesaurus (CHT), asking
for English candidate labels:

```bash
curl -X POST \
  -H 'Accept-Language: en' \
  -d 'queries={"q0":{"query":"fiets"}}' \
  https://termennetwerk-api.netwerkdigitaalerfgoed.nl/reconcile/https://data.cultureelerfgoed.nl/term/id/cht
```

The response is a JSON object keyed by the query identifier (`q0`), with each candidate’s
`name` and `description` returned in English where available, falling back to whatever
the source provides otherwise.
