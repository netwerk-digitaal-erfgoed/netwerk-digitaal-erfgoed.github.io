---
sidebar_position: 1
---

# Data Provider side

:::warning Draft – under review
Part of the Stack documentation ([overview](../index.md)). Not yet endorsed by NDE.
:::

Data management and Publication are run by [Data Providers](../../glossary.md#data-provider). Data management is source-internal and out of scope here. Publication is the source-side externalisation that turns internal data into something the network can consume.

## Publication Layer

[Data Providers](../../glossary.md#data-provider) make their data available via standardised channels so [Service Platforms](../../glossary.md#service-platform), [consumers](../../glossary.md#consumer), and [network services](../../services/index.md) can discover, fetch, and process it.

This layer is DERA’s [Publicatie](https://dera.netwerkdigitaalerfgoed.nl/index.php/Publicatie): “zorgdragen dat erfgoedinformatie toegankelijk wordt gemaakt voor afnemers”. Unlike the [Data Layer](platform.md#data-layer), it sits inside DERA’s existing scope, so the terms below are shared rather than Stack-specific.

### Patterns applied at this layer

The Publication Layer is the source-side of several cross-cutting patterns defined in the [Patterns chapter](../patterns.md):

- [SCHEMA-AP-NDE-first](../patterns.md#schema-ap-nde-first): the inter-layer data contract; every Data Provider publishes at least SCHEMA-AP-NDE.
- [Parallel Data Models](../patterns.md#parallel-data-models): publish in SCHEMA-AP-NDE and, where relevant, in one or more domain models (Linked Art, RiC-O, RDA, EDM) alongside.
- [Enrichments-as-Datasets](../patterns.md#enrichments-as-datasets): when a Service Platform publishes its own enrichments back into the Dataset Register, those enrichments enter this layer as new published datasets.

### Standards used at this layer

The Publication Layer is built on standards published outside this Stack documentation. Each links to its canonical source.

- **[SCHEMA-AP-NDE](https://github.com/netwerk-digitaal-erfgoed/schema-profile)**: the NDE-Schema.org-toepassingsprofiel. Network minimum for heritage data publication.
- **Linked Open Data**: dataset publication as Turtle / N-Triples / JSON-LD dump or SPARQL endpoint. See [Publish linked data](../../publish/linked-data.md).
- **[LDES](https://semiceu.github.io/LinkedDataEventStreams/)**: incremental change feed. Currently the most mature mechanism for sub-dataset-granularity change detection.
- **[IIIF](https://iiif.io/)**: Image API + Presentation API for image-based heritage. See [Publish IIIF](../../publish/iiif.md).
- **DCAT-AP 3.0 / Schema.org Dataset** – the dataset-description vocabularies the [Dataset Register](../../services/dataset-register/) accepts. Data Providers publish descriptions in either; Schema.org Dataset is the more common choice in practice, DCAT-AP is the EU-catalog-interoperability standard.

### Network services consumed at this layer

- **[NDE Dataset Register](../../services/dataset-register/)** – every Publication-layer dataset gets registered here. See [Register datasets](../../publish/register.md).
- **[NDE Network of Terms](../../services/network-of-terms/)** – Data Providers ideally link to canonical terms during publication, so Service Platforms receive already-enriched data. See [Publish with terms](../../publish/terms.md).

### Software at this layer

The Stack provides no software of its own here: [Data Providers](../../glossary.md#data-provider) fill this layer with existing products, and one product typically covers both Data management and Publication.

**[Omeka-S](https://omeka.org/s/)** is one such product. [*Van data naar dienst*](https://zenodo.org/records/17541400) describes it as “een open source, semantisch collectiebeheersysteem, waaraan je verschillende modules kunt toevoegen om het systeem NDE-compatibel te maken” – so the standards above are met by adding modules, not by replacing the system. At the [Gouda Tijdmachine](https://www.goudatijdmachine.nl/) it “fungeert als het collectiebeheersysteem” and “ook als publicatieomgeving van de collectiedata”, publishing a dump and a SPARQL endpoint. Two modules connect it to the [network services](#network-services-consumed-at-this-layer) above: [NdeTermennetwerk](https://github.com/omeka-s-modules/NdeTermennetwerk) for linking descriptions to terms, and LinkedDataSets for registering datasets in the Dataset Register.

What a [collection management system](../../glossary.md#collection-management-system) must do to be [NDE-compatible](../../glossary.md#nde-compatible) is specified in [Requirements](../../requirements.md), not here.
