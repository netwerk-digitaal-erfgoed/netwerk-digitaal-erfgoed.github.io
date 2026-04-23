---
sidebar_position: 8
---

# Glossary

## Collection Manager

A person who uses a [Collection Management System](#collection-management-system) to create, edit,
and publish metadata records for heritage objects, without requiring technical knowledge.

## Collection Management System

Also known as: Collection Registration System (CRS) or Collection Information System (CIS).

A software application used by heritage institutions to create, edit, and publish metadata records
about heritage objects. In the context of NDE, a Collection Management System implements
the [Dataset Register](#dataset-register) API and the [Network of Terms](#network-of-terms) API.

The system may include a separate publication component or layer that wraps the core application;
for the purpose of NDE requirements, the system is treated as a whole.

## Consumer

A person or application that uses heritage data published by [Data Platforms](#data-platform),
typically through a [Service Platform](#service-platform) or directly via a dataset’s [distributions](#distribution).

## Data model

A formal description of the classes, properties, and relationships used to represent information
about a domain, enabling data from different sources to be combined and queried consistently.

[Data models](https://docs.nde.nl/requirements-collection-management-systems/#data-modelling) can be:

- _generic_, reusable across domains, such as [Schema.org](https://schema.org), [DCAT](https://www.w3.org/TR/vocab-dcat-3/),
  [Dublin Core](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/), or [FOAF](http://xmlns.com/foaf/spec/);
- _domain-specific_, tailored to a particular field, such as [CIDOC-CRM](https://cidoc-crm.org/) for museum collections,
  [RiC-O](https://www.ica.org/resource/records-in-contexts-conceptual-model/) for archives,
  or the [Europeana Data Model (EDM)](https://pro.europeana.eu/page/edm-documentation) for aggregated heritage data.

NDE requires the [Schema.org Application Profile for NDE (SCHEMA-AP-NDE)](https://docs.nde.nl/schema-profile/)
to be used when publishing linked data in the heritage network.

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

See the [Dataset Register service chapter](services/dataset-register/index.md).

## Distribution

A channel through which a dataset is made available, either for downloading (such as a CSV file download or RDF dump),
or for querying (such as a SPARQL endpoint).
Formally defined in the [Requirements for Datasets](https://docs.nde.nl/requirements-datasets/#distribution).

## Linked Data

[RDF](#rdf) data that is published according to the [Linked Data principles](https://www.w3.org/DesignIssues/LinkedData.html).

## Machine-readable

A way to publish data that can be automatically processed by computer programs.

## NDE-compatible

Conforming to the requirements published by [Netwerk Digitaal Erfgoed](https://www.netwerkdigitaalerfgoed.nl/en/about-us/),
so that heritage data and systems can interoperate within the network.
The applicable requirements depend on what is being evaluated:

- datasets must meet the [Requirements for Datasets](https://docs.nde.nl/requirements-datasets/);
- [Collection Management Systems](#collection-management-system) must meet the
  [Requirements for Collection Management Systems](https://docs.nde.nl/requirements-collection-management-systems/).

Additionally, the [Requirements for Network of Terms Implementations](https://docs.nde.nl/requirements-network-of-terms-implementations/)
and [Requirements for Dataset Register Implementations](https://docs.nde.nl/requirements-dataset-register-implementations/)
provide more detailed guidance for [Vendors](#vendor) of [Collection Management Systems](#collection-management-system)
on implementing the [Network of Terms](#network-of-terms) and [Dataset Register](#dataset-register) APIs.

## Network of Terms

See the [Network of Terms service chapter](services/network-of-terms/index.md).

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

The Resource Description Framework (RDF) is a framework for expressing information about resources,
which allows that information to be processed by applications, rather than being only displayed to people.
See also the [RDF Primer](https://www.w3.org/TR/rdf12-primer/#section-Introduction).

## Registration URL

A URL submitted to the [Dataset Register](#dataset-register) API that points to one or more
[Dataset Descriptions](#dataset-description). The Dataset Register fetches and validates the descriptions
found at this URL, and periodically re-crawls it to pick up changes.

Defined in the [Requirements for Dataset Register Implementations](https://docs.nde.nl/requirements-dataset-register-implementations/#registration-url).

## Service Platform

A software application with the purpose of making data from one or several [Data Platforms](#data-platform)
available for a specific purpose, for example through a website or app.

Examples are:

- making heritage objects from the Dutch colonial past available for heritage research;
- keeping the memory of World War II alive by presenting stories about it.

Service Platforms are the responsibility of the Service Providers.

## Term

A word, name, acronym, phrase or other symbol with a formal definition, published in the [Network of Terms](services/network-of-terms/index.md).

Terms describe what heritage is about. Terms are, for example, subjects, persons or places. For example the Night Watch: it is a ‘painting’, made by ‘Rembrandt’ in ‘Amsterdam’.

Yet a term is more than a word. Each term has an identifier, a so-called URI. A URI is a unique address which makes it unambiguously clear which term is meant. For example, the (Dutch) term ‘noodweer’ could be a legal concept or really bad weather? The meaning becomes clear when you read the URI of the term, such as http://www.wikidata.org/entity/Q741507.

In addition, a term can contain additional information, such as a definition or an alternative name. For example the term ‘painting’ with the URI http://vocab.getty.edu/aat/300177435. The extra information about this term makes it clear that it has a synonym (in Dutch), 'schilderstuk'.

## Terminology source

A dataset, such as a thesaurus, reference list or classification system, that contains authoritative [terms](#term)
used to describe heritage objects. 

## URI

A Uniform Resource Identifier (URI) uniquely identifies an abstract or physical resource.
See also [RFC3986](https://www.rfc-editor.org/rfc/rfc3986#section-1).

## Vendor

An organization that supplies a [Collection Management System](#collection-management-system).

Defined in the [Requirements for Dataset Register Implementations](https://docs.nde.nl/requirements-dataset-register-implementations/#vendor)
and the [Requirements for Network of Terms Implementations](https://docs.nde.nl/requirements-network-of-terms-implementations/#vendor).
