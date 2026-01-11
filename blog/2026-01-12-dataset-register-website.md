---
title: New Dataset Register website
authors: ddeboer
tags: [Dataset Register]
---

We are improving the Dataset Register website to make dataset discovery faster and more intuitive.

<!-- truncate -->

The improvements are being rolled out **page by page**, starting with the search and detail pages.

## Search page

The redesigned [search page](https://datasetregister.netwerkdigitaalerfgoed.nl/en/datasets) offers **extensive facets for precise searching**,
such as publisher, terminology sources used, and size. Each facet now shows the number of results.
It’s now much simpler to find, for example, all datasets that [have linked data](https://datasetregister.netwerkdigitaalerfgoed.nl/en/datasets?format=group%3Ardf%2Cgroup%3Asparql),
[contain creative works](https://datasetregister.netwerkdigitaalerfgoed.nl/en/datasets?class=group%3Acreative-work),
[link to the RKDartists terminology source](https://datasetregister.netwerkdigitaalerfgoed.nl/en/datasets?terminologySource=https%3A%2F%2Fdata.rkd.nl%2Frkdartists)
or are [larger than 10 million triples](https://datasetregister.netwerkdigitaalerfgoed.nl/en/datasets?size=10000000-).

The results display **more information** than before:
not just the dataset name and publisher, but also (when available) language, distributions, and dataset size.

An RSS button provides access to an **RSS feed for each search query**.
Subscribe to be notified when new datasets matching your query are added to the Dataset Register.

Additionally, for connoisseurs, a SPARQL button provides inspiration for querying the Dataset Register with SPARQL.

## Detail page

The detail page (for example [this one](https://datasetregister.netwerkdigitaalerfgoed.nl/en/datasets/https://lod.uba.uva.nl/Cinema-Context/Cinema-Context))
is **more informative and better organized**.

The dataset description provided by the publisher is grouped and displayed more neatly.

This description is enriched with insights from the Dataset Knowledge Graph.
Distributions that have been verified are marked as such.

Under ‘**Linked Data summary**’ you’ll find an overview of the empirical shape of the dataset:
the counts of facts (RDF triples), subjects, predicates, and objects, split into literals and URIs.

An interactive widget enables high-level browsing of the dataset to **answer questions** like:

- Which types (classes) occur in the dataset?
- How are they distributed?
- For a given type, which predicates does it have?
- How are those predicates distributed? For example, for persons: what percentage have a first name, a last name, and how many have both?
- In which predicates do objects of a certain type occur, such as dates?

It also shows which terminology sources and vocabularies are used by the dataset.

All these insights should help users **assess whether they want to use a dataset** and, if so,
**which patterns they can use to query it**.

## General improvements

With these updates, we pay close attention to user interface and experience:

- cleaner layout and use of color
- on all pages, tooltips (behind the i-icon) provide explanation where needed
- the new website supports dark mode, so late-night sessions are easier on the eyes.

## Next step

We regularly receive questions from publishers about the [validation page](https://datasetregister.netwerkdigitaalerfgoed.nl/validate.php?url=http%3A%2F%2Fdata.beeldengeluid.nl%2Fid%2Fdataset%2F0029),
making it a logical candidate for the next improvement.

## Technical details

This kind of functionality is often implemented using a search index (typically Elasticsearch).
That index is then periodically populated from the data source and can quickly answer user queries.

Here, we **deliberately did not use such an index** to keep the architecture simple: 
no synchronization process to maintain and one less component to run.
A secondary goal of this redesign, therefore, is to test whether it’s possible to run this functionality directly on SPARQL endpoints, without an intermediary index.

This is particularly challenging here because we run a **federated SPARQL query**:
we retrieve data from the Dataset Register itself, but also enrichments from the [Dataset Knowledge Graph](/services/dataset-knowledge-graph/).

With a fast SPARQL server ([QLever](https://github.com/ad-freiburg/qlever)), smart SPARQL queries, and optimizations where needed, **this appears to be feasible**.
Optimizations include removing a `FILTER NOT EXISTS`
and making the data model more explicit, such as adding a `schema:additionalType` for the dataset status.

Still, there’s plenty of room for improvement. It’s coming.
