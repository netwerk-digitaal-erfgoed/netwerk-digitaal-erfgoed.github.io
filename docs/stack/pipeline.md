---
sidebar_position: 5
---

# Pipeline

:::warning Draft – under review
Part of the Stack documentation ([overview](./index.md)). Not yet endorsed by NDE.
:::

## Why pipelines

Pipelines are how the [Data Layer](layers/platform.md#data-layer) gets built. Every derived product – search indexes, knowledge graphs, term mappings, dataset analyses – is produced by a pipeline that reads from sources, transforms the data into a target shape, and materialises it into a sink. The Stack’s [substrates](index.md#substrates) (A, B, C) are inputs; pipelines turn them into outputs.

Different Data Layer products share most of the work: every pipeline runs the same [stages](#stages) – discover, select, read, transform, validate, materialise, serve – diverging only from **Transform** onward, where the target shape takes over. Pipelines factor these stages so each product is built by **composing the same primitives** differently. The [patterns](patterns.md) chapter names the operational mechanics individually; this chapter shows how they compose into a working pipeline.

The Stack standardises on **standards-backed pipelines** – SHACL for shape constraints, SPARQL for extraction, JSON-LD Framing for output reshaping – instead of bespoke Python scripts. Each pipeline is configured by declarative linked-data standards, not by custom transformation code. This is what makes pipelines portable across deployments, lets the same SHACL drive both the build and the API contract, and keeps the system inspectable: each stage’s input and output is RDF that any standards-compliant tool can read.

## `@lde/pipeline`

[`@lde/pipeline`](https://github.com/ldelements/lde/tree/main/packages/pipeline) is the Stack’s orchestration framework. Pipelines compose **Executors** (stages that read, transform, or validate RDF) and **Writers** (sinks that materialise output: files, SPARQL stores, search engines). Every Data Layer pipeline – the [Search Pipeline](layers/platform.md#search-pipeline), knowledge-graph building, Term Backlink Graph – is `@lde/pipeline` configured differently.

This chapter names the **configuration axes** a pipeline picks along, and shows how the [patterns](patterns.md) slot into each axis. A builder picks one option per axis; the choices interact in known ways.

## Stages

Every Data Layer pipeline runs the same spine of seven stages from source to served API. A pipeline is *built* over stages 1–6 and *serves* at stage 7. Each [configuration axis](#configuration-axes) attaches to one stage; the per-pipeline examples below expand the stages where they specialise.

| # | Stage | What it does | Configured by |
| --- | --- | --- | --- |
| 1 | **Discover** | Obtain the candidate source list | [Discovery](#configuration-axes) axis |
| 2 | **Select** | Filter to the sources worth ingesting | [Selection](#configuration-axes) axis |
| 3 | **Read** | Load source RDF – all selected sources, or only changed | [Scope](#configuration-axes) axis |
| 4 | **Transform** | Convert source RDF into the target shape | the specialisation point – no axis |
| 5 | **Validate** | SHACL-check the output and handle violations | [Validation](#configuration-axes) axis |
| 6 | **Materialise & deploy** | Write to the sink and make it live | [Deploy](#configuration-axes) axis; [State](#configuration-axes) axis pairs with it |
| 7 | **Serve** *(query-time)* | Expose the typed API | derived from the transformation contract – no axis |

Stages 1–3 are shared upstream; pipelines diverge from **Transform** onward, where the target shape determines validation, sink, and API. The [Search Pipeline](layers/platform.md#search-pipeline) expands stages 4–7 into finer [phases](layers/platform.md#pipeline-phases); the [Knowledge Graph](layers/platform.md#knowledge-graph-pipeline) and [EDM export](#example-edm-export-loda-pipeline) pipelines expand them differently.

## Configuration axes

| Axis | Question | Options                                                    | Patterns |
| --- | --- |------------------------------------------------------------| --- |
| **Discovery** | Where does the source list come from? | <ul><li>DCAT-AP registry</li><li>static config</li></ul>   | [Discovery via DCAT-AP Registry](patterns.md#discovery-via-dcat-ap-registry) |
| **Selection** | Which discovered sources to ingest? | <ul><li>Declared metadata only</li><li>Declared + VoID-derived</li></ul> | [Augmented Dataset Selection](patterns.md#augmented-dataset-selection) |
| **Scope** | Which selected sources does each run process? | <ul><li>All selected sources</li><li>Only changed sources</li></ul> | [Change-driven Rebuild](patterns.md#change-driven-rebuild) |
| **Validation** | How is the transformation checked, and what happens to violations? | <ul><li>Reuse transformation SHACL (search)</li><li>Separate target shapes (EDM)</li><li>Sampled profile (DKG)</li></ul>; policy: fail / drop / report / sample | [Non-conformant source data](layers/platform.md#non-conformant-source-data) |
| **Deploy** | How does the result land in the sink? | <ul><li>Blue/green swap</li><li>In-place upsert + sweep</li></ul> | [Blue/green Rebuild](patterns.md#bluegreen-rebuild), [In-place Rebuild](patterns.md#in-place-rebuild) |
| **State** | What carries between runs? | <ul><li>Nothing</li><li>Per-source transformation cache</li><li>Per-doc `last_seen`</li></ul> | [Last-known-good Per-source Caching](patterns.md#last-known-good-per-source-caching) |

Source input may be the source itself (with the pipeline running its own change detection) or an upstream LDES feed from a [Change Stream Producer](layers/platform.md#change-stream-producer). Both feed the Transform step the same way; the choice is per-deployment.

## Composing the axes

The axes are mostly independent. The one meaningful interaction:

- **Scope × Deploy.** *Change-driven + Blue/green* needs [Last-known-good Caching](patterns.md#last-known-good-per-source-caching) so unchanged sources can reuse their previous transformation during a full alias swap. *Change-driven + In-place* needs per-doc `last_seen` state for the sweep. *Full-scope + Blue/green* is the simplest configuration: re-transform every source every run, no per-source state.

## Example: Search pipeline

Scope and State below are expressed as the search pipeline’s named **update modes** – [Mode 1](layers/platform.md#update-modes) (full rebuild, the default), Mode 2 (per-source incremental, designed-in but not yet active), Mode 3 (per-resource, future):

| Axis | Choice |
| --- | --- |
| Discovery | DCAT-AP registry (Dataset Register) |
| Selection | Augmented (declared `dcterms:conformsTo` + VoID class partitions) |
| Scope | Full today (Mode 1); change-driven planned (Mode 2/3) |
| Validation | Reuse transformation SHACL – the [SHACL-honest](layers/platform.md#non-conformant-source-data) policy (validator rules = indexer decisions) |
| Deploy | Blue/green – Typesense alias swap |
| State | None today (Mode 1); per-doc `source` + `last_seen` designed in for Mode 2 |

## Example: Term Backlink Graph (proposed)

| Axis | Choice |
| --- | --- |
| Discovery | DCAT-AP registry (Dataset Register) |
| Selection | Declared metadata only – any RDF source, no AP-conformance filter |
| Scope | Full re-transformation per run (until LDES adoption broadens) |
| Validation | None – data-model-agnostic walk, no shapes to conform to |
| Deploy | Blue/green – QLever directory-level swap |
| State | Per-source transformation cache via [Last-known-good Caching](patterns.md#last-known-good-per-source-caching) |

The choice differences encode the structural difference between the two pipelines: the Search pipeline is AP-aware (drives a SHACL transformation against SCHEMA-AP-NDE); the Term Backlink Graph is data-model-agnostic (walks any RDF for term URI references). The axis structure is the same.

## Example: EDM export (loda-pipeline)

[`loda-pipeline` (PR #14)](https://github.com/netwerk-digitaal-erfgoed/loda-pipeline/pull/14) transforms heritage datasets into [EDM](https://pro.europeana.eu/page/edm-documentation) for aggregation into Europeana. It is a downstream consumer of [SCHEMA-AP-NDE-first](patterns.md#schema-ap-nde-first): it maps the **SCHEMA-AP-NDE pivot to EDM**, so a single mapping covers every source instead of one mapping per source data model. EDM export runs today on legacy LD Workbench; the `@lde/pipeline` + QLever migration in that PR is what makes it a Stack-conformant pipeline and is not yet on `main`. The axis choices below describe that migrated pipeline.

| Axis | Choice |
| --- | --- |
| Discovery | DCAT-AP registry (Dataset Register), filtering out already-transformed EDM distributions |
| Selection | Datasets published in SCHEMA-AP-NDE – the pivot shape is the mapping’s input contract |
| Scope | Full re-transformation per run |
| Validation | Separate EDM shapes – report violations and continue |
| Deploy | EDM output for Europeana aggregation (file artifact, not a live sink swap) |
| State | None |

The transformation is **SPARQL CONSTRUCT mapping SCHEMA-AP-NDE to EDM**, not a reshaping of the [framed document](layers/platform.md#architecture-two-stage-split): each dataset’s SCHEMA-AP-NDE is imported into QLever and CONSTRUCTed into EDM, then SHACL-validated against EDM shapes. Per-dataset CONSTRUCTs are split into separate executors (e.g. `edm:ProvidedCHO` + aggregation + constants) joined by `UNION` rather than `OPTIONAL`, so multi-valued properties don’t multiply into cross-product duplicates. The axis structure is the same as the Search and KG pipelines, aimed at a third target shape.

## When to extend the axis set

A new axis is warranted when a real choice opens up that the existing axes don’t capture. Candidates to keep an eye on:

- **Trigger axis** (push: webhooks, [LDN](https://www.w3.org/TR/ldn/) (Linked Data Notifications)) when network sources begin to offer push notifications. Today every pipeline is pull-based and scheduled, so the trigger is a constant rather than a choice; the *Scope* axis above covers the only real lever (process all selected sources vs. only changed ones). A separate Trigger axis lands the day push arrives.
- **Cross-pipeline event publishing** (an upstream substrate-B pipeline that fans out to per-transformation consumers) – currently aspirational; would warrant a *Distribution* axis if built.

Until those land, the six axes above cover the configurations the Stack actually deploys today.
