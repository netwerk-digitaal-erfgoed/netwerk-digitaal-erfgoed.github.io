---
sidebar_position: 1
description: Find heritage datasets in the Dataset Register and follow them to the data at the source.
---

# Discover

The [Dataset Register](../services/dataset-register/index.md) is the place to find heritage datasets
and discover where their data lives. It holds a
[description](../glossary.md#dataset-description) of each dataset (including its name, publisher, 
license and where to get the data).
Descriptions are published by [data providers](../glossary.md#data-provider);
the Register keeps a cached copy of it, refreshed from the source daily.
The data itself always stays at the source.

Retrieving a dataset therefore takes two steps:

1. **Find its description in the Register**, which tells you the dataset exists and where its data is.
2. **Fetch the data from the source**, by following the description’s [distributions](../glossary.md#distribution).

## What the Register adds

Caching a catalog of these descriptions lets the Register build on them, giving you:

- **A uniform, validated model.**
  On ingest, the Register [validates](../services/dataset-register/validation.md) each
  publisher-provided description and converts it to a uniform
  [data model](../services/dataset-register/data-model.md) that is easier to query.
- **Reachable distributions.**
  A valid description can still point to a distribution that is offline or has moved, so the Register
  [probes each distribution](../services/dataset-register/data-model.md#distribution-health) to confirm
  it responds, giving you reliable access to the data.
- **A Linked Data summary.** 
  The [Dataset Knowledge Graph](../services/dataset-knowledge-graph/index.md) enriches each entry with the
  dataset’s empirical shape (including triple counts, classes, properties, vocabularies and terminology sources used)
  so you can [assess a dataset before retrieving it](../services/dataset-knowledge-graph/index.md#what-a-summary-tells-you) and see which classes and properties to target in your queries.
- **Full-catalog search.** Search every description in one place with full-text search and facets,
  instead of hunting source by source, so you find every dataset matching your criteria across the
  network. An RSS feed per query notifies you when new matching datasets are registered.

## Find a dataset

How you search depends on whether a person or a program is doing the looking.

**If you are browsing**, use the
[Dataset Register website](https://datasetregister.netwerkdigitaalerfgoed.nl/en/datasets), a
human-readable search interface with facets for publisher, terminology source, size and format.

**If you are automating**, query the Register’s
[SPARQL endpoint](../services/dataset-register/sparql.md). It exposes every registered description in
[DCAT](../services/dataset-register/data-model.md), so you can narrow the list at query time – by
keyword, publisher, subject, `dcterms:conformsTo`, or validation status – instead of fetching
everything and filtering afterwards. Usually you want valid datasets only, so that you skip any whose
latest fetch failed to produce a valid description; the
[registration-status](../services/dataset-register/sparql.md#registration-status) section shows that
query.

The Register is a [DCAT-AP-NL](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/) registry, so you can read it with any DCAT-AP client rather than writing SPARQL by hand. 
For TypeScript/JavaScript, the [`@lde/dataset-registry-client`](https://github.com/ldelements/lde/tree/main/packages/dataset-registry-client) library does this for you.

## Follow a dataset to its data

When you have found a dataset you want, read its
[distributions](../glossary.md#distribution) off the description: these are the concrete access points
for the data. 
For linked data, each one is either a **data dump** you download or a **SPARQL endpoint** you query at the source.
Pick a distribution, then continue to [Access](access.md) to fetch the content.

## Re-fetch only what changed

If you come back for the same datasets repeatedly (say you ingest them on a schedule) you do not
want to re-download everything every time. Use the Register to detect what changed. Because it re-crawls
every source daily, its copy of each distribution’s `dct:modified` tells you, across every dataset in a
single query, whether the data has changed since you last ingested it. Compare against the
distribution’s modification date, not the dataset description’s: the description’s date changes when the
metadata is edited, while the distribution’s date tracks the data itself. If it has advanced, go back to
the source and re-fetch; if not, skip it. The trigger comes from the Register, but the data still comes
from the source.

See also the Stack’s
[Discovery via DCAT-AP Registry](../stack/patterns.md#discovery-via-dcat-ap-registry) and
[Change-driven Rebuild](../stack/patterns.md#change-driven-rebuild) patterns.

## Discovering in a pipeline

If you are building a [Service Platform](../glossary.md#service-platform) that ingests datasets
automatically, make the Register the first stage of your pipeline. Rather than maintaining a
handwritten list of sources to pull from, query the Register at the start of each run to get the
current set of datasets to process. New datasets are then picked up as soon as they are registered,
without you touching any code. The Stack describes this as the
[Discovery via DCAT-AP Registry](../stack/patterns.md#discovery-via-dcat-ap-registry) pattern.
