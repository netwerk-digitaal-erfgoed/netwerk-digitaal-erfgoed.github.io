---
sidebar_position: 3
---


# Dataset Knowledge Graph

The Dataset Knowledge Graph enriches the [Dataset Register](../dataset-register/index.md)
with insights derived from the actual content of each dataset.
A [pipeline](https://github.com/netwerk-digitaal-erfgoed/dataset-knowledge-graph)
periodically fetches valid dataset descriptions, analyses the RDF distributions they point to,
and produces **[Dataset Summaries](https://github.com/netwerk-digitaal-erfgoed/dataset-knowledge-graph?tab=readme-ov-file#dataset-summaries)** – modelled as [VoID](https://www.w3.org/TR/void/) – that describe
the empirical shape of each dataset:

* the counts of RDF triples, subjects, predicates, and objects (split into literals and URIs);
* the classes that occur and how many instances each has;
* the predicates that occur and how they are distributed across subject classes;
* the external terminology sources and vocabularies the dataset links to.

These summaries help researchers, software developers, and data platform builders assess
whether a dataset is suitable for their purpose and which query patterns they can use to access it.

## Access

* Explore aggregated insights across all datasets in the [Dataset Knowledge Graph datastory](https://datastories.demo.netwerkdigitaalerfgoed.nl/dataset-knowledge-graph/index.html).
* Query the graph directly via the SPARQL endpoint at
  `https://triplestore.netwerkdigitaalerfgoed.nl/repositories/dataset-knowledge-graph`.
* The source code of the pipeline is available on [GitHub](https://github.com/netwerk-digitaal-erfgoed/dataset-knowledge-graph).
