---
sidebar_position: 1
---

# Layers

:::warning Draft – under review
Part of the Stack documentation ([overview](../index.md)). Not yet endorsed by NDE.
:::

The NDE network architecture distinguishes four layers. This chapter consolidates per-layer Stack guidance: each layer’s patterns, standards, and components. Bottom-up:

| Layer | Scope                                                                                                                                                                               | Who runs it |
| --- |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| --- |
| Data management | Source-internal handling: collection management systems, internal catalogues, cleanup at source. Out of scope for this Stack documentation; see [Requirements](../../requirements). | [Data Provider](../../glossary.md#data-provider) |
| [Publication](#publication) | Source-side externalisation: RDF dump, SPARQL endpoint, IIIF, LDES.                                                                                                                 | [Data Provider](../../glossary.md#data-provider) |
| [Data Layer](#data-layer) | Service Platform internals.                                                                                                                                                         | [Service Platform](../../glossary.md#service-platform) |
| [Presentation Layer](#presentation-layer) | User-facing presentation.                                                                                                                                                           | [Service Platform](../../glossary.md#service-platform) / [consumer](../../glossary.md#consumer) application |

The [NDE Stack](../) covers all four layers. It is positioned around the full Linked Data lifecycle the same way Linked Data Elements ([LDE](https://github.com/ldelements/lde)) is (Discovery / Ingestion / Transformation / Analysis / Publication / Serve).
LDE is a toolkit of small, composable `@lde/*` packages that handle generic linked-data plumbing:
discovering datasets, downloading distributions, running pipelines, serving SPARQL and RDF. It is data-model-agnostic and network-agnostic.
The NDE Stack composes LDE’s packages with NDE-specific configuration (`@ndes/*`), building on NDE’s operated [network services](../../services/) to produce the NDE approach of the lifecycle.

## In this chapter

- [**Data Provider side**](provider.md) – what [Data Providers](../../glossary.md#data-provider) do (Publication Layer; Data management out of scope).
- [**Service Platform side**](platform.md) – what [Service Platforms](../../glossary.md#service-platform) do (Function mapping, Data Layer, Presentation Layer).

## Related

- [DERA](https://dera.netwerkdigitaalerfgoed.nl/index.php/Applicatiearchitectuur) – the network-wide architectural reference; the four-layer model is being added there.
