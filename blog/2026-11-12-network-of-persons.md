---
title: A Network of Terms for people
authors: ddeboer
tags: [network-of-terms, graphql, services]
---

Today, WO2Net launches [data.oorlogsbronnen.nl](https://data.oorlogsbronnen.nl), which opens up the data behind Oorlogsbronnen: people and sources from more than 300 heritage collections, through APIs, SPARQL and linked data.
An early application of that data is the **Network of Persons**: an experimental service that lets you link the names in your own collection to people in WO2-personen, Open Archieven, the Gouda Tijdmachine and Regiotermen Fryslân, with OpenRefine and without writing code.

<!-- truncate -->

## People, not terms

A photo, a letter and a file in three institutions belong together because they are about the same person.
You only see that if you can tell namesakes apart, and a name is not enough for that: ‘Jan de Vries’ returns 218 candidates in WO2-personen alone.
You also need a birth date, a birthplace or relatives.
In the [Network of Terms](/services/network-of-terms/), a person is a term like any other: you find them by name.
That works for well-known people in a curated thesaurus, such as RKDartists, but not for the millions of ordinary people in the sources.

## What it is

The Network of Persons runs on the Network of Terms software; only the catalog of sources differs.
It has no code of its own: its two services are Dockerfiles that copy a [catalog](https://github.com/netwerk-digitaal-erfgoed/services/tree/main/packages/network-of-persons-catalog) into the Network of Terms image.
It searches [four datasets](https://github.com/netwerk-digitaal-erfgoed/services/tree/main/packages/network-of-persons-catalog#datasets) where they are published, without a central thesaurus of people:

| Dataset | Publisher | People |
| --- | --- | --- |
| [WO2-personen](https://www.oorlogsbronnen.nl/personen) | WO2Net | 813747 reconstructions |
| [Open Archieven Persoonsreconstructies](https://www.openarchieven.nl/datasets/reconstructions) | Open Archieven | 8835746 reconstructions |
| [Gouda Tijdmachine](https://www.goudatijdmachine.nl/) | Gouda Tijdmachine | 648161 reconstructions |
| [Regiotermen Fryslân: Personen](https://fryslan.regiotermen.nl/) | Tresoar | 4347 people |

The first three use the [Persons in Context (PiCo)](https://personsincontext.org) model.
In PiCo, a person is a *reconstruction* assembled from *observations*: mentions of someone in, say, a birth certificate or a population register.
For WO2-personen, those are 1.56 million mentions from 124 datasets of 65 institutions, collected by Oorlogsbronnen.
The Network of Persons returns reconstructions, but also searches the spellings in the observations.
WO2-personen is the data that opens up today; the Network of Persons queries it through the SPARQL endpoint `sparql.ldmax.nl/wo2-oorlogsbronnen`.
Oorlogsbronnen joins the mentions on its platform into one person; the Network of Persons lets collections outside the platform refer to that person.
The people in Regiotermen Fryslân link to Wikidata, VIAF, the NTA and the RKD.

For each person you get more than a name: given and family name, date and place of birth and death, occupation, and parents, children, spouses and siblings.
You can look up those relatives in turn.
There are two APIs:

- a [GraphQL API](https://github.com/netwerk-digitaal-erfgoed/services/tree/main/apps/network-of-persons-graphql) at [personennetwerk.netwerkdigitaalerfgoed.nl](https://personennetwerk.netwerkdigitaalerfgoed.nl), with a web interface for trying out queries;
- a [reconciliation service](https://github.com/netwerk-digitaal-erfgoed/services/tree/main/apps/network-of-persons-reconciliation) for OpenRefine.

There is deliberately no search website: the Network of Persons is meant for people who work with their own data, and the sources already have search pages of their own.

## Four names, with and without birth data

The reconciliation service lets you send other columns along with the name, such as a birth date.
It ranks the candidates by those columns, but does not filter: candidates that don’t match stay in the list, just lower down.
If exactly one candidate matches on everything, OpenRefine links it automatically.

We reconciled four names against WO2-personen, first on the name alone and then with the date and place of birth:

```csv
name,born,birthplace
Jan de Vries,1902-07-11,
Hendrik de Jong,1919,Marum
Pieter Bakker,1921-10-19,
Willem Smit,1899,
```

| Name | Candidates | With the top score | Name only | With date and place of birth |
| --- | --- | --- | --- | --- |
| Jan de Vries | 218 | 134 | not linked | linked: Han de Vries, also recorded as Jan de Vries, born 1902-07-11 |
| Hendrik de Jong | 125 | 83 | not linked | linked: Hein Sietsma, 1919-10-15 Marum – 1945-01-21 Dachau |
| Pieter Bakker | 87 | 56 | not linked | linked: born 1921-10-19 |
| Willem Smit | 82 | 47 | not linked | three candidates born in 1899: you choose |

Hein Sietsma was a resistance fighter who appears in the sources under the name Hendrik de Jong; you only find him with both the year and the place of birth.
Willem Smit shows that a year is sometimes not enough, and that the service doesn’t guess: if several candidates fit equally well, the choice is yours.
A year matches any date in that year (`1919` matches `1919-10-15`), and a date one year off counts for half, because a source sometimes gives the baptism date as the birth date.
[Matching persons on more than their name](/services/network-of-terms/reconciliation#matching-persons-on-more-than-their-name) explains how the score is calculated.

Once a column is reconciled, **Add columns from reconciled values…** fetches what the dataset knows about each person: birthplace, parents, the same person in other datasets (`exactMatches`) and the records the person was reconstructed from (`seeAlso`).
That is how you check and enrich, say, the names on a war memorial, one of WO2Net’s own examples.

## Regional and national

Tresoar is testing the Network of Persons with 175 portrait photos of Frisian resistance fighters, from the Vereniging Friesland 1940-1945.
The test shows what to look out for in your own data:

- **Names are matched as whole words.** ‘J. Prins’ finds nothing, because no name contains ‘J.’, and ‘Zwanenveld, Dirk’ finds nothing until the comma is removed. With the names as they were in the list, only 5 of the 175 photos got candidates.
- **The data is often in a description.** For 169 photos it was in a text such as ‘J. Prins, geboren 1901, overleden 19 september 1944 te St. Nicolaasga’. Once we had split that into columns and reconciled on the family name, with year of birth, date of death and place of death added, 172 photos got candidates. For 69, the top candidate matched all the data sent.
- **A family name on its own never matches the full name,** so nothing was linked automatically. Put a facet on the best candidate’s score and link the high scores with **Match each cell to its best candidate**.

Krijn van der Helm, one of the sitters, is in WO2-personen (as Krijn van *den* Helm) and in Regiotermen Fryslân, with the same dates of birth and death.
Most of the others are in WO2-personen but not yet in Tresoar’s own thesaurus.
Linking also exposes contradictions: for Willem Santema, Tresoar gives 1944-08-10 as the date of death, WO2-personen 1944-08-09 and Regiotermen Fryslân 1944-10-08.

## Structured fields in both networks

The structured fields, and matching on them, are part of the Network of Terms software, so they work in both networks.

SKOS describes a term: its labels, its place in a hierarchy, its mappings to other vocabularies.
It has no place for a birth date or a coordinate, so until now the queries put those in a `skos:scopeNote`: text to read, not data to match on.
The Network of Terms now returns what SKOS cannot express in [structured fields](/services/network-of-terms/graphql#what-a-term-denotes), alongside the SKOS term:

| Field | Contents | In the Network of Terms |
| --- | --- | --- |
| `person` | Name parts, date and place of birth and death, gender, occupation, nationality, family | RKDartists |
| `place` | Coordinates | GeoNames |
| `organization` | Type, founding and dissolution date, location, parent organization | RKDartists, KB Corporatiethesaurus |

In the Network of Persons, all four datasets fill `person`.
The [reconciliation service](/services/network-of-terms/reconciliation) uses the same fields: you can reconcile against the types Person, Place and Organization, and add the fields as columns.
For the Person type, the service also uses the fields to rank candidates and shows them in a candidate’s preview.
In the Network of Terms, ‘Rembrandt’ in RKDartists returns 19 candidates; with birth year `1606`, Rembrandt van Rijn is linked automatically.
Those fields stay in the Network of Terms, even if the Network of Persons is discontinued.

## A separate instance, because it is an experiment

The Network of Terms is a production service that collection management systems depend on.
On a separate instance, we can change or remove sources, fields and search behaviour without affecting anyone’s collection registration.
The sources differ too: the Network of Terms holds thesauri of well-known people, maintained by editors; here, it is reconstructions of mostly unknown people.

After [we asked](https://github.com/netwerk-digitaal-erfgoed/services/issues/6), WO2Net gave all 813747 reconstructions the type `schema:Person`.
A replaced reconstruction now points to its successor, so existing links keep working; that has happened 45715 times so far.

## Status, and what we ask of you

The Network of Persons is a proof of concept, not a production service: its URL, datasets and data may change or disappear.
Do try it, but don’t build workflows on it yet.
NDE will decide whether there will be a Network of Terms for people, and in what form, only once the need across the heritage network is clear.

Do you have a list of names, a war memorial, a photo collection or a thesaurus of people?
Reconcile it with the Network of Persons and tell us what goes wrong and what is missing.
Do you manage data about people yourself? Publish it openly, preferably in PiCo, so we can add it.
A system that supports the Network of Terms can search the Network of Persons with little effort, because the APIs are the same.
Using birth dates, places and family too is extra work for vendors.
It would let you link a person when you register an object, in your own collection management system, rather than afterwards on a platform.
If you want that, ask your vendor.

Email [tech@netwerkdigitaalerfgoed.nl](mailto:tech@netwerkdigitaalerfgoed.nl) if you want to add your own dataset of people to the Network of Persons, or if you have any questions.

## Get started

- [Reconciliation in OpenRefine](https://github.com/netwerk-digitaal-erfgoed/services/tree/main/apps/network-of-persons-reconciliation): endpoints, matching and adding columns;
- [GraphQL API](https://github.com/netwerk-digitaal-erfgoed/services/tree/main/apps/network-of-persons-graphql): searching and looking up people, the person fields and how the datasets differ;
- [Catalog](https://github.com/netwerk-digitaal-erfgoed/services/tree/main/packages/network-of-persons-catalog#run-your-own-network-of-terms): how the Network of Persons is deployed, and how to run a Network of Terms over your own datasets.
