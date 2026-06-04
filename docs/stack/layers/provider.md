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
