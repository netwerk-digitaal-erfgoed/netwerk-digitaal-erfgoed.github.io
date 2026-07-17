---
sidebar_position: 8
---

# Stack

:::warning Draft – under review
This chapter proposes engineering choices, naming conventions, and operational patterns for the NDE network which are not yet endorsed by NDE. Feedback welcome via the [issue tracker](https://github.com/netwerk-digitaal-erfgoed/docs/issues).
:::

## Introduction

The **NDE Stack** is the working name given here to the **ecosystem of [NDE-compatible](../glossary.md#nde-compatible) [components](#components)** and the **[operational patterns](patterns.md)** that compose them, grounded in the network’s shared standards.
The Stack’s goal is to **help software developers in the NDE network solve shared functionality once** rather than reinventing it in each project.
It is what NDE offers builders to work *with*; the NDE-operated [network services](#taxonomy) it works *on* – the [Dataset Register](../services/dataset-register/), [Network of Terms](../services/network-of-terms/), and [Dataset Knowledge Graph](../services/dataset-knowledge-graph/) – are composed and consumed, not part of the Stack a builder deploys.
Most of what appears here is new: proposed components and patterns yet to be built.
The rest is existing software given a role in the Stack.

The Stack **operationalises the architecture** sketched in [*Van data naar dienst: visie op de ontwikkeling van verbonden erfgoeddiensten*](https://zenodo.org/records/17541400) (NDE, November 2025), covering the [Data and Presentation Layers](layers/platform.md) of a [Service Platform](../glossary.md#service-platform). The Stack also includes the [Publication Layer](layers/provider.md#publication-layer) and connects to source-side data management. As more of the network’s functionality is named, the Stack grows. Where the report leaves gaps, the Stack fills them.

These chapters are also meant to **create a shared language and understanding** across the network:
a [common vocabulary](#taxonomy) for the components and patterns that builders, operators, and decision-makers can use when discussing what the Stack does and how it fits together.
Naming the parts is the prerequisite for talking about them coherently across teams and organisations.

## Scope

**This is**: a bridge from the report’s architectural vocabulary to running code. Names concrete components (existing and proposed), default operational patterns, and the foundational technologies the Stack depends on.

**This isn’t**: a restatement of the report. The report describes *what* should happen at each step of a [Service Platform](../glossary.md#service-platform); this guidance proposes *how*, at the engineering level, with named patterns and packages.

**Goes beyond the report where useful**: some practical engineering concerns are not in the report, such as semantic search, snapshot-CDC (change data capture) deletion handling, per-source outage resilience, declarative standards-backed pipeline configuration. The Stack picks these up as natural extensions of the report’s framework, flagged in context where they appear so a reader can tell report-grounded content from Stack-direction extensions.

**Primary audience**: builders of [Service Platforms](../glossary.md#service-platform) and [network services](../services/index.md) within the NDE network.

**Status of contents**: many components are proposals (`@lde/*` or `@ndes/*` packages that do not exist yet). The [function-mapping table](layers/platform.md#function-mapping) marks them as such. Patterns labelled “Proposed” have been discussed but not endorsed.

## Taxonomy

The Stack uses a small vocabulary consistently.

| Term | Definition | Examples                                                                                                                                                              |
| --- | --- |-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Component** | Software the Stack provides | `@lde/*` packages, `@ndes/*` packages                                                                                                                                 |
| **Pattern** | Operational mechanic | [Blue/green Rebuild](patterns.md#bluegreen-rebuild), [SCHEMA-AP-NDE-first](patterns.md#schema-ap-nde-first), [Ports & Adapters](patterns.md#adapters)                        |
| **Service** | A running instance of a Component, deployed with a specific configuration | A [Service Platform](../glossary.md#service-platform) running the search projection with its own SHACL and search configuration                                       |
| **Network service** | An NDE-operated, network-wide endpoint the Stack **builds on** rather than provides: consumed via its canonical URL, not deployed by Stack users. DERA’s [netwerkvoorziening](https://dera.netwerkdigitaalerfgoed.nl/index.php/Netwerkvoorziening) | [Dataset Register](../services/dataset-register/), [Network of Terms](../services/network-of-terms/), [Dataset Knowledge Graph](../services/dataset-knowledge-graph/) |
| **Standard** | A network commitment the Stack adopts | SCHEMA-AP-NDE, LDES, IIIF, DCAT-AP 3.0 / Schema.org Dataset                                                                                                        |
| **Foundational technology** | Upstream open-source dependency outside NDE governance | QLever, Typesense, nginx, Fastify, Mercurius                                                                                                                          |

## Components

The Stack provides the components below – the software a builder deploys. These are distinct from the [network services](#taxonomy) NDE operates and the Stack builds on: where a component below reaches a network service, the service is consumed, not part of the deployed Stack. The [DKG](../services/dataset-knowledge-graph/), for instance, is a network service reached through the Knowledge Graph APIs, not a component a builder runs. They live in the [Service Platform side](layers/platform.md) chapter; this catalog is a quick index, and the [Pipeline](pipeline.md) chapter shows how the pipeline components compose.

| Component | Layer | Brief |
| --- | --- | --- |
| **[Search Pipeline](layers/platform.md#search-pipeline)** *(proposed)* | Data | Builds a search index of records from selected datasets |
| **[Knowledge Graph Pipeline](layers/platform.md#knowledge-graph-pipeline)** | Data | Builds a queryable knowledge graph from selected datasets |
| **[Search APIs](layers/platform.md#search-apis)** *(proposed)* | Data | Search and filter API that Presentation Layers consume |
| **[Knowledge Graph APIs](layers/platform.md#knowledge-graph-apis)** | Data | Query interfaces for the Stack’s knowledge graphs: [DKG](../services/dataset-knowledge-graph/) *(operational)*, Term Backlink Graph *(proposed)*, Knowledge Graph voor Termen *(proposed)*, and any self-operated KG a Service Platform builds |
| **[Change Stream Producer](layers/platform.md#change-stream-producer)** *(proposed)* | Data | Publishes a Service Platform’s data changes as a feed other systems can subscribe to |
| **[Heritage UI Components](layers/platform.md#presentation-layer)** *(future)* | Presentation | Reusable display components |

## Foundational technologies

The Stack is built on top of mature open-source infrastructure that lives outside NDE/LDE governance. These are **dependencies, not Stack components**; release cycles, roadmaps, and breaking changes follow upstream projects. The Stack picks opinionated defaults and treats them as exchangeable for any conformant alternative; substitutes plug in behind ports defined by the [Ports & adapters pattern](patterns.md#adapters), so a swap is a configuration concern rather than a code rewrite.

Defaults favour **operational lightness**: solutions that are resource-efficient and simple to run on NDE’s national infrastructure 
as well as by individual service providers on their own hardware, so the same Stack stays realistic to operate at every scale. That criterion is why the default search engine is Typesense (rather than the heavier Elasticsearch) 
and QLever the RDF store.

| Concern                                         | Stack default                                                                                                                        | Realistic substitutes                                                                              |
|-------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| [RDF](../glossary.md#rdf) store / SPARQL engine | [QLever](https://github.com/ad-freiburg/qlever) – read-only-after-load, fast bulk-load, fits [blue/green rebuild](patterns.md#bluegreen-rebuild)                      | [Oxigraph](https://github.com/oxigraph/oxigraph), GraphDB, Jena Fuseki                             |
| Search engine                                   | [Typesense](https://typesense.org/) – used by the search pipeline                                                                    | Elasticsearch, OpenSearch (each behind their own adapter at the search pipeline’s engine boundary) |
| Reverse proxy                                   | nginx – default for proxy-level [blue/green](patterns.md#bluegreen-rebuild)                                                          | HAProxy (runtime API for zero-reload switching), Caddy (admin-API hot reload), Envoy               |
| Web / API runtime                               | [Fastify](https://fastify.dev/) – one runtime for both API styles: REST via [`@fastify/swagger`](https://github.com/fastify/fastify-swagger) for the OpenAPI surface (used by the [Dataset Register](../services/dataset-register/) API today), GraphQL via [Mercurius](https://mercurius.dev/) (proposed `@lde/graphql-server`) | REST: any OpenAPI-capable framework. GraphQL: Apollo Server, Yoga, any GraphQL.js-based runtime |

## Substrates

Three distinct bodies of source data (substrates) underlie the Stack. Each pipeline rides on exactly one. They differ in source, scale, cadence, and consumers; the layer pages refer back to them by letter.

| Substrate | What’s crawled                                                                                  | Source(s) | Scale / cadence                                              | Feeds                                                                                                                                                         |
| --- |-------------------------------------------------------------------------------------------------| --- |--------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| A. [Dataset descriptions](../glossary.md#dataset-description) | DCAT-AP metadata *about* datasets (titles, publishers, [distributions](../glossary.md#distribution), licenses, subjects)       | Publishers’ DCAT-AP descriptions, harvested by the [NDE Datasetregister](https://datasetregister.netwerkdigitaalerfgoed.nl/) | Small, metadata-only. Refresh frequently (daily)             | Enumeration for B: which datasets exist and where their distributions live. Catalog [Search Pipeline](layers/platform#search-pipeline) over the descriptions themselves (the Dataset Register browser), enriched with DKG facets |
| B. [Metadata records](../glossary.md#metadata-record) | Metadata records *inside* each distribution (instances of `CreativeWork`, `Person`, `Place`, …) | Per-dataset SPARQL endpoint or RDF dump | Large, per-dataset. Refresh per source on last modified date | Object [Search Pipeline](layers/platform#search-pipeline) (records inside distributions); [Dataset Knowledge Graph](../services/dataset-knowledge-graph/); Term Backlink Graph (data-model-agnostic vocab walk) |
| C. [Terms](../glossary.md#terminology-source) | Terms and the relations between them, across terminology sources                                | Terminology sources, aggregated by the [NDE Network of Terms](https://termennetwerk.netwerkdigitaalerfgoed.nl/) | Medium, vocabulary-scoped. Refresh on vocab updates          | The report’s “Knowledge Graph voor Termen” (function 5)                                                                                                       |

Observations that fall out of this separation:

- **A enumerates B, not C.** B’s pipelines read the Register to learn which datasets exist and where their distributions live. C is enumerated separately, from the [Network of Terms](../services/network-of-terms/) catalogue of terminology sources. Part of that catalogue may migrate into the Register over time, but external sources like GeoNames, AAT and Wikidata stay outside it, so C keeps its own enumeration.
- **Object search over B is the norm; only the register indexes A.** A Service Platform’s Search Pipeline *reads* the register (substrate A) only to enumerate which datasets to crawl; the records it *ingests* are the **objects** inside their distributions (substrate B) – each `CreativeWork`, `Person`, or `Place`. The dataset descriptions themselves never enter that index. The one exception is the [Dataset Register](../services/dataset-register/)’s own browser: being the catalog, it indexes substrate A directly – the dataset descriptions *are* its records – enriched with DKG facets. Same pipeline and stages either way; only the substrate and record grain differ.
- **B carries multiple projections.** The same crawl feeds three structurally different sinks: an AP-aware search-document projection ([Search Pipeline](layers/platform#search-pipeline)), a [VoID](https://www.w3.org/TR/void/) (Vocabulary of Interlinked Datasets) statistical summary ([Dataset Knowledge Graph](../services/dataset-knowledge-graph/)), and a data-model-agnostic term-backlink projection (Term Backlink Graph). All three are enumerated from A but compute over B’s contents: what differs is the projection, not the substrate.
- **Change cadences differ.** B changes most often: records are added, updated, and removed at source as collections grow. A changes less often: dataset metadata is updated more rarely than the records it describes. C is most stable: vocabularies move slowly. Stack components inherit the change cadence of the substrate they ride on.
