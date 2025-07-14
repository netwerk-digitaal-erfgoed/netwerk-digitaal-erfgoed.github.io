---
sidebar_position: 7
---

# Glossary

## Collection Manager

Users of [Collection Management Systems](#collection-management-system) who manage collections of heritage objects.

## Collection Management System

Also known as: Collection _Registration_ System (CRS).

TODO

## Consumer



## Data model

Can be generic or domain-specific.

## Data Platform

Data Platforms provide access to heritage data, which can then be consumed by [Service Platforms](#service-platform).

It can be integrated in a [Collection Management System](#collection-management-system) or be a separate system,
such as a triple store or a IIIF image server.

Data owners are responsible for Data Platforms.

Defined in [DERA](https://dera.netwerkdigitaalerfgoed.nl/index.php/Platforms#Dataplatform) (Dutch).

## Data Provider

(corresponds to Dutch ‘bronhouder’ as defined in the [DERA](https://dera.netwerkdigitaalerfgoed.nl/index.php/Rollen#Bronhouder)).

## Dataset Description

An RDF document that documents a dataset. Formally defined in the [Requirements for Datasets](https://docs.nde.nl/requirements-datasets/).
These Descriptions should be registered with the [Dataset Register](#dataset-register)
so [Consumers](#consumer) can find them and use the datasets.

## Dataset Register

See the [Dataset Register service description](services/dataset-register/index.md).

## Distribution

TODO

## Linked Data

[RDF](#rdf) data that is published according to the [Linked Data principles](https://www.w3.org/DesignIssues/LinkedData.html).

## Machine-readable

A way to publish data that can be automatically processed by computer programs.

## NDE-compatible

TODO

## Network of Terms

See the [Network of Terms service description](services/network-of-terms/index.md).

## Persistent HTTP URI

A URI that is resolvable over HTTP(S) and once made available must remain accessible, always pointing to the same resource.
A persistent HTTP URI acts both as a URI, providing the resource’s identity, and as a URL, providing its location.

May contain a [Persistent Identifier](#persistent-identifier).
For more information, see the [Publish datasets](publish/persistent-uris.md) chapter.

Example: `https://n2t.net/ark:/60537/b3KCns`.

## Persistent Identifier

The part of a [Persistent HTTP URI](#persistent-http-uri) that uniquely identifies a resource.

Example: `ark:/60537/b3KCns`.

## RDF

TODO

## Service Platform

A software application with the purpose of making data from one or several [Data Platforms](#data-platform)
available for a specific purpose, for example through a website or app.

Examples are:

- making heritage objects from the Dutch colonial past available for heritage research;
- keeping the memory of World War II alive by presenting stories about it.

Service Platforms are the responsibility of the Service Providers.

## Term

A word, name, acronym, phrase or other symbol with a formal definition, published in the [Network of Terms](/services/network-of-terms/index.md).

Terms describe what heritage is about. Terms are, for example, subjects, persons or places. For example the Night watch: it is a 'painting', made by 'Rembrandt' in 'Amsterdam'.

Yet a term is more than a word. Each term has an identifier, a so-called URI. A URI is a unique address which makes it unambiguously clear which term is meant. For example, the (Dutch) term 'noodweer' could be a legal concept or really bad weather? The meaning becomes clear when you read the URI of the term, such as http://www.wikidata.org/entity/Q741507.

In addition, a term can contain additional information, such as a definition or an alternative name. For example the term "painting" with the URI http://vocab.getty.edu/aat/300177435. The extra information about this term makes it clear that it has a synonym (in Dutch), 'schilderstuk'.

(FROM https://termennetwerk.netwerkdigitaalerfgoed.nl/en/faq1)

## Terminology source

## URI
