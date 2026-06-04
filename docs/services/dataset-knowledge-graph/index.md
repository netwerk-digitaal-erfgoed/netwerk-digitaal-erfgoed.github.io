---
sidebar_position: 3
description: Find heritage datasets that fit your purpose and learn how to query them.
---


# Dataset Knowledge Graph

The Dataset Knowledge Graph **enriches the [Dataset Register](../dataset-register/index.md)** with insights derived from each dataset's content. The Register stores what publishers submit; the Knowledge Graph publishes an empirical, [VoID](https://www.w3.org/TR/void/)-modelled view of each dataset's shape – its RDF types, predicates, languages, outgoing links, and conformance to [SCHEMA-AP-NDE](https://docs.nde.nl/schema-profile/).

It helps researchers, [service platform](../../glossary.md#service-platform) builders and data engineers **decide which heritage datasets fit their use case, and how to query them**.

## What a Summary tells you

For each dataset, the Summary lets you answer questions like:

- **Does this dataset contain what I need?** – which [RDF types are present](#most-common-classes) and how many instances of each; which [predicates are populated for which classes](#property-density-on-schemaperson).
- **How big and how queryable is it?** – [total triples, distinct subjects and predicates](#size); [example resources](#example-resources-per-dataset) to start exploring.
- **Which terminology sources does it link to?** – [outgoing linksets](#outgoing-linksets-to-terminology-sources) to AAT, GTAA, GeoNames, Wikidata and other vocabularies in the [Network of Terms](../network-of-terms/index.md).
- **Which languages and datatypes does it cover?** – [language tags](#language-coverage-on-schemaname) and [XSD datatypes per property](#datatypes-used-for-schemapersonschemaname), broken down by class.
- **Does it conform to SCHEMA-AP-NDE?** – a [sampled SHACL validation](#datasets-passing-schema-ap-nde) of the dataset against the [Schema.org Application Profile for NDE](https://docs.nde.nl/schema-profile/).
- **How can I access it?** – which [SPARQL endpoint or data dump](#datasets-with-working-sparql-endpoints) currently responds, and at what size.

## Inside a Dataset Summary

Each Summary attaches the following information to a `void:Dataset` – a mix of dataset-level statistical properties, [VoID partitions](https://www.w3.org/TR/void/#class-property-partitions), separate [linkset](https://www.w3.org/TR/void/#linksets) resources, and DQV/PROV quality measurements:

| Aspect | Modelled as | What it tells you |
| --- | --- | --- |
| Size | `void:triples`, `void:distinctSubjects`, `void:properties`, `nde:objectsLiteral`, `nde:distinctObjectsURI` | Overall scale and the literal-vs-URI balance |
| Classes | `void:classPartition` | Which RDF types occur, with instance counts |
| Properties | `void:propertyPartition` | Which predicates occur; entities and distinct objects per predicate |
| Property density per class | nested `classPartition` / `propertyPartition` | Which properties are populated for each subject class – answers *"which fields exist on `schema:Person` records?"* |
| Datatypes per class and property | `void-ext:datatype`, `void-ext:datatypePartition` | Which XSD datatypes are used, broken down by class and property |
| Languages per class and property | `void-ext:languagePartition` | Language-tag coverage per class and property |
| Object classes per class and property | `void-ext:objectClassPartition` | How classes connect through predicates – e.g. *"books link to persons via author 1350 times"* |
| Outgoing linksets | `void:Linkset` | Cross-dataset and cross-vocabulary links – how the dataset fits into the wider network |
| Subject URI spaces | `void:uriSpace` | The most common namespaces for subject resources |
| Vocabularies | `void:vocabulary` | Schema.org, FOAF, Dublin Core, etc. – what the predicates draw from |
| Licenses | `dcterms:license` | License coverage at the resource level |
| IIIF Presentation manifests | `void:subset` + `dcterms:conformsTo <http://iiif.io/api/presentation/>` + `void:entities`, plus `manifests-sampled` / `manifests-validated` DQV measurements | Whether the dataset exposes [IIIF Presentation API](http://iiif.io/api/presentation/) manifests, how many, and how many of a sample actually resolve. Detected from `schema:encodingFormat` literals matching the [SCHEMA-AP-NDE](https://docs.nde.nl/schema-profile/) IIIF profile pattern; v2 and v3 collapse into one version-less subset. The `dcterms:conformsTo` marker is *declared*; a sample of the manifest IRIs is then dereferenced and *validated*, so a dataset whose manifests genuinely resolve (`validated > 0`) is distinguishable from one that declares IIIF but serves broken manifests (`validated = 0`) |
| Distributions | `void:sparqlEndpoint`, `void:dataDump`, plus HTTP-validated status | Which distributions currently work and at what size |
| Example resources | `void:exampleResource` | Concrete starting points for exploration |
| SCHEMA-AP-NDE conformance | `dqv:QualityMeasurement` + `prov:Activity` | Whether a sample of resources passes the [SCHEMA-AP-NDE](https://docs.nde.nl/schema-profile/) SHACL shapes. Three metrics are emitted: `schema-ap-nde-sample-conformance` (boolean), `quads-validated` (number of sampled triples), and `samples-per-class` (sample cap). Combine `quads-validated > 0` with `conformance = true` to mean *"tested and passed"*; `quads-validated = 0` means the profile didn't apply (e.g. the dataset uses Linked.Art or EDM). The full per-resource SHACL report is written to a file rather than the triple store. |

For the full RDF examples behind each row, see the [`dataset-knowledge-graph` README](https://github.com/netwerk-digitaal-erfgoed/dataset-knowledge-graph#dataset-summaries) – the canonical reference.

## Sample queries

One example per analysis. Each link opens the query pre‑loaded in the [Knowledge Graph triplestore UI](https://triplestore.netwerkdigitaalerfgoed.nl/sparql) — click *Run* to execute. The aggregate [datastory](https://datastories.demo.netwerkdigitaalerfgoed.nl/dataset-knowledge-graph/index.html) demonstrates more advanced combinations.

### Size

The overall size of each dataset: total triples, distinct subjects, and the literal-vs-URI object split.

```sparql
PREFIX void: <http://rdfs.org/ns/void#>
SELECT * WHERE {
  ?dataset a void:Dataset ;
    void:triples ?triples ;
    void:distinctSubjects ?distinctSubjects .
}
ORDER BY DESC(?triples)
```

[▶ Run on the triplestore](https://triplestore.netwerkdigitaalerfgoed.nl/sparql?name=Size&infer=true&sameAs=true&query=PREFIX%20void%3A%20%3Chttp%3A//rdfs.org/ns/void%23%3E%0ASELECT%20%2A%20WHERE%20%7B%0A%20%20%3Fdataset%20a%20void%3ADataset%20%3B%0A%20%20%20%20void%3Atriples%20%3Ftriples%20%3B%0A%20%20%20%20void%3AdistinctSubjects%20%3FdistinctSubjects%20.%0A%7D%0AORDER%20BY%20DESC%28%3Ftriples%29)

### Most common classes

Which RDF types appear most across the network, with instance counts summed across datasets and the number of datasets each class appears in.

```sparql
PREFIX void: <http://rdfs.org/ns/void#>
SELECT ?class (SUM(?count) AS ?instances) (COUNT(DISTINCT ?dataset) AS ?datasets) WHERE {
  ?dataset a void:Dataset ;
    void:classPartition [
      void:class ?class ;
      void:entities ?count
    ] .
}
GROUP BY ?class
ORDER BY DESC(?instances)
LIMIT 20
```

[▶ Run on the triplestore](https://triplestore.netwerkdigitaalerfgoed.nl/sparql?name=Classes%20across%20the%20network&infer=true&sameAs=true&query=PREFIX%20void%3A%20%3Chttp%3A//rdfs.org/ns/void%23%3E%0ASELECT%20%3Fclass%20%28SUM%28%3Fcount%29%20AS%20%3Finstances%29%20%28COUNT%28DISTINCT%20%3Fdataset%29%20AS%20%3Fdatasets%29%20WHERE%20%7B%0A%20%20%3Fdataset%20a%20void%3ADataset%20%3B%0A%20%20%20%20void%3AclassPartition%20%5B%0A%20%20%20%20%20%20void%3Aclass%20%3Fclass%20%3B%0A%20%20%20%20%20%20void%3Aentities%20%3Fcount%0A%20%20%20%20%5D%20.%0A%7D%0AGROUP%20BY%20%3Fclass%0AORDER%20BY%20DESC%28%3Finstances%29%0ALIMIT%2020)

### Most common properties

Which predicates appear most across the network, with the total number of entities that carry each predicate.

```sparql
PREFIX void: <http://rdfs.org/ns/void#>
SELECT ?property (SUM(?entities) AS ?totalEntities) WHERE {
  ?dataset a void:Dataset ;
    void:propertyPartition [
      void:property ?property ;
      void:entities ?entities
    ] .
}
GROUP BY ?property
ORDER BY DESC(?totalEntities)
LIMIT 20
```

[▶ Run on the triplestore](https://triplestore.netwerkdigitaalerfgoed.nl/sparql?name=Properties%20across%20the%20network&infer=true&sameAs=true&query=PREFIX%20void%3A%20%3Chttp%3A//rdfs.org/ns/void%23%3E%0ASELECT%20%3Fproperty%20%28SUM%28%3Fentities%29%20AS%20%3FtotalEntities%29%20WHERE%20%7B%0A%20%20%3Fdataset%20a%20void%3ADataset%20%3B%0A%20%20%20%20void%3ApropertyPartition%20%5B%0A%20%20%20%20%20%20void%3Aproperty%20%3Fproperty%20%3B%0A%20%20%20%20%20%20void%3Aentities%20%3Fentities%0A%20%20%20%20%5D%20.%0A%7D%0AGROUP%20BY%20%3Fproperty%0AORDER%20BY%20DESC%28%3FtotalEntities%29%0ALIMIT%2020)

### Property density on `schema:Person`

For each dataset, which predicates are populated on `schema:Person` resources, and how many entities carry them.

```sparql
PREFIX void: <http://rdfs.org/ns/void#>
PREFIX schema: <https://schema.org/>
SELECT * WHERE {
  ?dataset void:classPartition [
    void:class schema:Person ;
    void:propertyPartition [
      void:property ?property ;
      void:entities ?entities ;
      void:distinctObjects ?distinctObjects
    ]
  ]
}
ORDER BY DESC(?entities)
LIMIT 50
```

[▶ Run on the triplestore](https://triplestore.netwerkdigitaalerfgoed.nl/sparql?name=Property%20density%20on%20schema%3APerson&infer=true&sameAs=true&query=PREFIX%20void%3A%20%3Chttp%3A//rdfs.org/ns/void%23%3E%0APREFIX%20schema%3A%20%3Chttps%3A//schema.org/%3E%0ASELECT%20%2A%20WHERE%20%7B%0A%20%20%3Fdataset%20void%3AclassPartition%20%5B%0A%20%20%20%20void%3Aclass%20schema%3APerson%20%3B%0A%20%20%20%20void%3ApropertyPartition%20%5B%0A%20%20%20%20%20%20void%3Aproperty%20%3Fproperty%20%3B%0A%20%20%20%20%20%20void%3Aentities%20%3Fentities%20%3B%0A%20%20%20%20%20%20void%3AdistinctObjects%20%3FdistinctObjects%0A%20%20%20%20%5D%0A%20%20%5D%0A%7D%0AORDER%20BY%20DESC%28%3Fentities%29%0ALIMIT%2050)

### Datatypes used for `schema:Person`/`schema:name`

Which XSD datatypes appear in `schema:name` values on `schema:Person` resources — useful for spotting unexpected datatype mixes.

```sparql
PREFIX void: <http://rdfs.org/ns/void#>
PREFIX void-ext: <http://ldf.fi/void-ext#>
PREFIX schema: <https://schema.org/>
SELECT ?datatype (SUM(?triples) AS ?count) WHERE {
  ?dataset void:classPartition [
    void:class schema:Person ;
    void:propertyPartition [
      void:property schema:name ;
      void-ext:datatypePartition [
        void-ext:datatype ?datatype ;
        void:triples ?triples
      ]
    ]
  ]
}
GROUP BY ?datatype
ORDER BY DESC(?count)
```

[▶ Run on the triplestore](https://triplestore.netwerkdigitaalerfgoed.nl/sparql?name=Datatypes%20used%20for%20schema%3APerson/schema%3Aname&infer=true&sameAs=true&query=PREFIX%20void%3A%20%3Chttp%3A//rdfs.org/ns/void%23%3E%0APREFIX%20void-ext%3A%20%3Chttp%3A//ldf.fi/void-ext%23%3E%0APREFIX%20schema%3A%20%3Chttps%3A//schema.org/%3E%0ASELECT%20%3Fdatatype%20%28SUM%28%3Ftriples%29%20AS%20%3Fcount%29%20WHERE%20%7B%0A%20%20%3Fdataset%20void%3AclassPartition%20%5B%0A%20%20%20%20void%3Aclass%20schema%3APerson%20%3B%0A%20%20%20%20void%3ApropertyPartition%20%5B%0A%20%20%20%20%20%20void%3Aproperty%20schema%3Aname%20%3B%0A%20%20%20%20%20%20void-ext%3AdatatypePartition%20%5B%0A%20%20%20%20%20%20%20%20void-ext%3Adatatype%20%3Fdatatype%20%3B%0A%20%20%20%20%20%20%20%20void%3Atriples%20%3Ftriples%0A%20%20%20%20%20%20%5D%0A%20%20%20%20%5D%0A%20%20%5D%0A%7D%0AGROUP%20BY%20%3Fdatatype%0AORDER%20BY%20DESC%28%3Fcount%29)

### Language coverage on `schema:name`

Which language tags appear on `schema:name` values of `schema:CreativeWork` resources, and how often.

```sparql
PREFIX void: <http://rdfs.org/ns/void#>
PREFIX void-ext: <http://ldf.fi/void-ext#>
PREFIX schema: <https://schema.org/>
SELECT ?language (SUM(?triples) AS ?count) WHERE {
  ?dataset void:classPartition [
    void:class schema:CreativeWork ;
    void:propertyPartition [
      void:property schema:name ;
      void-ext:languagePartition [
        void-ext:language ?language ;
        void:triples ?triples
      ]
    ]
  ]
}
GROUP BY ?language
ORDER BY DESC(?count)
```

[▶ Run on the triplestore](https://triplestore.netwerkdigitaalerfgoed.nl/sparql?name=Language%20coverage%20on%20schema%3Aname&infer=true&sameAs=true&query=PREFIX%20void%3A%20%3Chttp%3A//rdfs.org/ns/void%23%3E%0APREFIX%20void-ext%3A%20%3Chttp%3A//ldf.fi/void-ext%23%3E%0APREFIX%20schema%3A%20%3Chttps%3A//schema.org/%3E%0ASELECT%20%3Flanguage%20%28SUM%28%3Ftriples%29%20AS%20%3Fcount%29%20WHERE%20%7B%0A%20%20%3Fdataset%20void%3AclassPartition%20%5B%0A%20%20%20%20void%3Aclass%20schema%3ACreativeWork%20%3B%0A%20%20%20%20void%3ApropertyPartition%20%5B%0A%20%20%20%20%20%20void%3Aproperty%20schema%3Aname%20%3B%0A%20%20%20%20%20%20void-ext%3AlanguagePartition%20%5B%0A%20%20%20%20%20%20%20%20void-ext%3Alanguage%20%3Flanguage%20%3B%0A%20%20%20%20%20%20%20%20void%3Atriples%20%3Ftriples%0A%20%20%20%20%20%20%5D%0A%20%20%20%20%5D%0A%20%20%5D%0A%7D%0AGROUP%20BY%20%3Flanguage%0AORDER%20BY%20DESC%28%3Fcount%29)

### Object classes linked from `schema:Book`/`schema:author`

Which classes are the targets of `schema:author` on `schema:Book` resources, and how often each class is linked — shows how `Book` connects to other things in the data.

```sparql
PREFIX void: <http://rdfs.org/ns/void#>
PREFIX void-ext: <http://ldf.fi/void-ext#>
PREFIX schema: <https://schema.org/>
SELECT ?objectClass (SUM(?triples) AS ?count) WHERE {
  ?dataset void:classPartition [
    void:class schema:Book ;
    void:propertyPartition [
      void:property schema:author ;
      void-ext:objectClassPartition [
        void:class ?objectClass ;
        void:triples ?triples
      ]
    ]
  ]
}
GROUP BY ?objectClass
ORDER BY DESC(?count)
```

[▶ Run on the triplestore](https://triplestore.netwerkdigitaalerfgoed.nl/sparql?name=Object%20classes%20linked%20from%20schema%3ABook/schema%3Aauthor&infer=true&sameAs=true&query=PREFIX%20void%3A%20%3Chttp%3A//rdfs.org/ns/void%23%3E%0APREFIX%20void-ext%3A%20%3Chttp%3A//ldf.fi/void-ext%23%3E%0APREFIX%20schema%3A%20%3Chttps%3A//schema.org/%3E%0ASELECT%20%3FobjectClass%20%28SUM%28%3Ftriples%29%20AS%20%3Fcount%29%20WHERE%20%7B%0A%20%20%3Fdataset%20void%3AclassPartition%20%5B%0A%20%20%20%20void%3Aclass%20schema%3ABook%20%3B%0A%20%20%20%20void%3ApropertyPartition%20%5B%0A%20%20%20%20%20%20void%3Aproperty%20schema%3Aauthor%20%3B%0A%20%20%20%20%20%20void-ext%3AobjectClassPartition%20%5B%0A%20%20%20%20%20%20%20%20void%3Aclass%20%3FobjectClass%20%3B%0A%20%20%20%20%20%20%20%20void%3Atriples%20%3Ftriples%0A%20%20%20%20%20%20%5D%0A%20%20%20%20%5D%0A%20%20%5D%0A%7D%0AGROUP%20BY%20%3FobjectClass%0AORDER%20BY%20DESC%28%3Fcount%29)

### Outgoing linksets to terminology sources

Every cross-dataset and cross-vocabulary linkset emitted by the pipeline, with the number of triples in each — shows how datasets connect to terminology sources and to one another.

```sparql
PREFIX void: <http://rdfs.org/ns/void#>
SELECT * WHERE {
  [] a void:Linkset ;
    void:subjectsTarget ?dataset ;
    void:objectsTarget ?terminologySource ;
    void:triples ?triples .
}
ORDER BY DESC(?triples)
LIMIT 50
```

[▶ Run on the triplestore](https://triplestore.netwerkdigitaalerfgoed.nl/sparql?name=Outgoing%20linksets%20to%20terminology%20sources&infer=true&sameAs=true&query=PREFIX%20void%3A%20%3Chttp%3A//rdfs.org/ns/void%23%3E%0ASELECT%20%2A%20WHERE%20%7B%0A%20%20%5B%5D%20a%20void%3ALinkset%20%3B%0A%20%20%20%20void%3AsubjectsTarget%20%3Fdataset%20%3B%0A%20%20%20%20void%3AobjectsTarget%20%3FterminologySource%20%3B%0A%20%20%20%20void%3Atriples%20%3Ftriples%20.%0A%7D%0AORDER%20BY%20DESC%28%3Ftriples%29%0ALIMIT%2050)

### Subject URI spaces

The most common URI namespaces used for subject resources across all datasets — shows where the network's identifiers live.

```sparql
PREFIX void: <http://rdfs.org/ns/void#>
SELECT * WHERE {
  ?dataset void:subset [
    void:uriSpace ?uriSpace ;
    void:entities ?entities
  ] .
}
ORDER BY DESC(?entities)
LIMIT 50
```

[▶ Run on the triplestore](https://triplestore.netwerkdigitaalerfgoed.nl/sparql?name=Subject%20URI%20spaces&infer=true&sameAs=true&query=PREFIX%20void%3A%20%3Chttp%3A//rdfs.org/ns/void%23%3E%0ASELECT%20%2A%20WHERE%20%7B%0A%20%20%3Fdataset%20void%3Asubset%20%5B%0A%20%20%20%20void%3AuriSpace%20%3FuriSpace%20%3B%0A%20%20%20%20void%3Aentities%20%3Fentities%0A%20%20%5D%20.%0A%7D%0AORDER%20BY%20DESC%28%3Fentities%29%0ALIMIT%2050)

### Most-referenced vocabularies

Which vocabularies (Schema.org, FOAF, Dublin Core, …) are referenced, and by how many datasets.

```sparql
PREFIX void: <http://rdfs.org/ns/void#>
SELECT ?vocabulary (COUNT(DISTINCT ?dataset) AS ?datasetCount) WHERE {
  ?dataset a void:Dataset ;
    void:vocabulary ?vocabulary .
}
GROUP BY ?vocabulary
ORDER BY DESC(?datasetCount)
```

[▶ Run on the triplestore](https://triplestore.netwerkdigitaalerfgoed.nl/sparql?name=Vocabularies%20referenced%20across%20datasets&infer=true&sameAs=true&query=PREFIX%20void%3A%20%3Chttp%3A//rdfs.org/ns/void%23%3E%0ASELECT%20%3Fvocabulary%20%28COUNT%28DISTINCT%20%3Fdataset%29%20AS%20%3FdatasetCount%29%20WHERE%20%7B%0A%20%20%3Fdataset%20a%20void%3ADataset%20%3B%0A%20%20%20%20void%3Avocabulary%20%3Fvocabulary%20.%0A%7D%0AGROUP%20BY%20%3Fvocabulary%0AORDER%20BY%20DESC%28%3FdatasetCount%29)

### License usage

License IRIs that appear in dataset subsets and how many datasets use each.

```sparql
PREFIX void: <http://rdfs.org/ns/void#>
PREFIX dcterms: <http://purl.org/dc/terms/>
SELECT ?license (COUNT(DISTINCT ?dataset) AS ?datasetCount) WHERE {
  ?dataset a void:Dataset ;
    void:subset [
      dcterms:license ?license
    ] .
}
GROUP BY ?license
ORDER BY DESC(?datasetCount)
```

[▶ Run on the triplestore](https://triplestore.netwerkdigitaalerfgoed.nl/sparql?name=License%20usage&infer=true&sameAs=true&query=PREFIX%20void%3A%20%3Chttp%3A//rdfs.org/ns/void%23%3E%0APREFIX%20dcterms%3A%20%3Chttp%3A//purl.org/dc/terms/%3E%0ASELECT%20%3Flicense%20%28COUNT%28DISTINCT%20%3Fdataset%29%20AS%20%3FdatasetCount%29%20WHERE%20%7B%0A%20%20%3Fdataset%20a%20void%3ADataset%20%3B%0A%20%20%20%20void%3Asubset%20%5B%0A%20%20%20%20%20%20dcterms%3Alicense%20%3Flicense%0A%20%20%20%20%5D%20.%0A%7D%0AGROUP%20BY%20%3Flicense%0AORDER%20BY%20DESC%28%3FdatasetCount%29)

### Datasets exposing IIIF Presentation manifests

Datasets that publish [IIIF Presentation API](http://iiif.io/api/presentation/) manifests under the SCHEMA-AP-NDE convention, with the number of distinct manifests detected per dataset.

```sparql
PREFIX void: <http://rdfs.org/ns/void#>
PREFIX dcterms: <http://purl.org/dc/terms/>
SELECT ?dataset ?manifests WHERE {
  ?dataset a void:Dataset ;
    void:subset [
      dcterms:conformsTo <http://iiif.io/api/presentation/> ;
      void:entities ?manifests
    ] .
}
ORDER BY DESC(?manifests)
```

[▶ Run on the triplestore](https://triplestore.netwerkdigitaalerfgoed.nl/sparql?name=Datasets%20exposing%20IIIF%20Presentation%20manifests&infer=true&sameAs=true&query=PREFIX%20void%3A%20%3Chttp%3A//rdfs.org/ns/void%23%3E%0APREFIX%20dcterms%3A%20%3Chttp%3A//purl.org/dc/terms/%3E%0ASELECT%20%3Fdataset%20%3Fmanifests%20WHERE%20%7B%0A%20%20%3Fdataset%20a%20void%3ADataset%20%3B%0A%20%20%20%20void%3Asubset%20%5B%0A%20%20%20%20%20%20dcterms%3AconformsTo%20%3Chttp%3A//iiif.io/api/presentation/%3E%20%3B%0A%20%20%20%20%20%20void%3Aentities%20%3Fmanifests%0A%20%20%20%20%5D%20.%0A%7D%0AORDER%20BY%20DESC%28%3Fmanifests%29)

The `dcterms:conformsTo` marker above is *declared*. To find datasets whose manifests are *validated working*, query the `manifests-validated` measurement instead – a sample of the manifest IRIs is dereferenced each run, and this counts how many resolved to a valid IIIF Presentation Manifest. `validated > 0` means working manifests; `validated = 0` alongside a declared subset means the dataset claims IIIF but its sampled manifests all failed to resolve.

### Datasets with validated IIIF manifests

Datasets whose declared IIIF manifests actually resolve, ordered by how many of the sampled manifests were validated.

```sparql
PREFIX dqv: <http://www.w3.org/ns/dqv#>
PREFIX nde: <https://def.nde.nl/metric#>
SELECT ?dataset ?validated ?sampled WHERE {
  ?dataset dqv:hasQualityMeasurement
    [ dqv:isMeasurementOf nde:manifests-validated ; dqv:value ?validated ] ,
    [ dqv:isMeasurementOf nde:manifests-sampled ; dqv:value ?sampled ] .
  FILTER(?validated > 0)
}
ORDER BY DESC(?validated)
```

[▶ Run on the triplestore](https://triplestore.netwerkdigitaalerfgoed.nl/sparql?name=Datasets%20with%20validated%20IIIF%20manifests&infer=true&sameAs=true&query=PREFIX%20dqv%3A%20%3Chttp%3A//www.w3.org/ns/dqv%23%3E%0APREFIX%20nde%3A%20%3Chttps%3A//def.nde.nl/metric%23%3E%0ASELECT%20%3Fdataset%20%3Fvalidated%20%3Fsampled%20WHERE%20%7B%0A%20%20%3Fdataset%20dqv%3AhasQualityMeasurement%0A%20%20%20%20%5B%20dqv%3AisMeasurementOf%20nde%3Amanifests-validated%20%3B%20dqv%3Avalue%20%3Fvalidated%20%5D%20%2C%0A%20%20%20%20%5B%20dqv%3AisMeasurementOf%20nde%3Amanifests-sampled%20%3B%20dqv%3Avalue%20%3Fsampled%20%5D%20.%0A%20%20FILTER%28%3Fvalidated%20%3E%200%29%0A%7D%0AORDER%20BY%20DESC%28%3Fvalidated%29)

### Datasets with working SPARQL endpoints

Datasets whose declared SPARQL endpoint passed the pipeline's smoke test.

```sparql
PREFIX void: <http://rdfs.org/ns/void#>
SELECT * WHERE {
  ?dataset a void:Dataset ;
    void:sparqlEndpoint ?endpoint .
}
```

[▶ Run on the triplestore](https://triplestore.netwerkdigitaalerfgoed.nl/sparql?name=Datasets%20with%20working%20SPARQL%20endpoints&infer=true&sameAs=true&query=PREFIX%20void%3A%20%3Chttp%3A//rdfs.org/ns/void%23%3E%0ASELECT%20%2A%20WHERE%20%7B%0A%20%20%3Fdataset%20a%20void%3ADataset%20%3B%0A%20%20%20%20void%3AsparqlEndpoint%20%3Fendpoint%20.%0A%7D)

### Example resources per dataset

A handful of `void:exampleResource` URIs per dataset — concrete starting points for exploration.

```sparql
PREFIX void: <http://rdfs.org/ns/void#>
SELECT * WHERE {
  ?dataset void:exampleResource ?example .
}
LIMIT 50
```

[▶ Run on the triplestore](https://triplestore.netwerkdigitaalerfgoed.nl/sparql?name=Example%20resources%20per%20dataset&infer=true&sameAs=true&query=PREFIX%20void%3A%20%3Chttp%3A//rdfs.org/ns/void%23%3E%0ASELECT%20%2A%20WHERE%20%7B%0A%20%20%3Fdataset%20void%3AexampleResource%20%3Fexample%20.%0A%7D%0ALIMIT%2050)

### Datasets passing SCHEMA-AP-NDE

Datasets whose sampled resources passed SHACL validation against the [Schema.org Application Profile for NDE](https://docs.nde.nl/schema-profile/). The `?n > 0` filter excludes datasets to which the profile doesn't apply (vacuous truth from an empty target set).

```sparql
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX dqv: <http://www.w3.org/ns/dqv#>
PREFIX nde: <https://def.nde.nl/metric#>
SELECT * WHERE {
  ?dataset dqv:hasQualityMeasurement
    [ dqv:value true ;
      dcterms:conformsTo <https://docs.nde.nl/schema-profile/> ] ,
    [ dqv:isMeasurementOf nde:quads-validated ;
      dqv:value ?n ] .
  FILTER (?n > 0)
}
```

[▶ Run on the triplestore](https://triplestore.netwerkdigitaalerfgoed.nl/sparql?name=Datasets%20passing%20SCHEMA-AP-NDE&infer=true&sameAs=true&query=PREFIX%20dcterms%3A%20%3Chttp%3A//purl.org/dc/terms/%3E%0APREFIX%20dqv%3A%20%3Chttp%3A//www.w3.org/ns/dqv%23%3E%0APREFIX%20nde%3A%20%3Chttps%3A//def.nde.nl/metric%23%3E%0ASELECT%20%2A%20WHERE%20%7B%0A%20%20%3Fdataset%20dqv%3AhasQualityMeasurement%0A%20%20%20%20%5B%20dqv%3Avalue%20true%20%3B%0A%20%20%20%20%20%20dcterms%3AconformsTo%20%3Chttps%3A//docs.nde.nl/schema-profile/%3E%20%5D%20%2C%0A%20%20%20%20%5B%20dqv%3AisMeasurementOf%20nde%3Aquads-validated%20%3B%0A%20%20%20%20%20%20dqv%3Avalue%20%3Fn%20%5D%20.%0A%20%20FILTER%20%28%3Fn%20%3E%200%29%0A%7D)

The `?n > 0` filter excludes datasets that use a different data model and to which the profile doesn't apply at all (where SHACL returns *vacuously true*). To find datasets that tried the profile and failed, swap `dqv:value true` for `dqv:value false`.

## Access

- **Datastory** for visual aggregate insights across all datasets: [datastories.demo.netwerkdigitaalerfgoed.nl/dataset-knowledge-graph](https://datastories.demo.netwerkdigitaalerfgoed.nl/dataset-knowledge-graph/index.html).
- **SPARQL endpoint** for direct queries: `https://triplestore.netwerkdigitaalerfgoed.nl/repositories/dataset-knowledge-graph`.

## How summaries are produced

A periodic pipeline builds the summaries:

1. **Select** valid dataset descriptions with at least one RDF distribution from the [Dataset Register](../dataset-register/index.md).
2. **Load** the data – directly from the publisher’s SPARQL endpoint if available, otherwise by indexing the RDF dump in [QLever](https://github.com/ad-freiburg/qlever).
3. **Analyse** by running a set of [SPARQL CONSTRUCT queries](https://github.com/netwerk-digitaal-erfgoed/dataset-knowledge-graph/tree/main/queries/analysis), one per partition type, with code-level post-processing where needed. Each analyser emits VoID triples. For IIIF, a sample of the detected manifest IRIs is also dereferenced and validated (via [`@lde/iiif-validator`](https://www.npmjs.com/package/@lde/iiif-validator)), recording how many resolve to valid Presentation Manifests.
4. **Validate against SCHEMA-AP-NDE** by sampling a configurable number of resources per `sh:targetClass` and running them through the profile's SHACL shapes. The detailed per-resource SHACL report is written to a file (not the triple store).
5. **Summarise quality measurements** as [DQV](https://www.w3.org/TR/vocab-dqv/) measurements and a [PROV](https://www.w3.org/TR/prov-o/) activity, and append them to the dataset's Summary.
6. **Write** the results to the Knowledge Graph triple store.

Datasets without a valid RDF distribution are skipped; invalid distributions emit a `schema:error` triple instead of a summary, so consumers can still see *which* distributions are unreachable.

The pipeline source, run instructions and contributor guidance live in the [`dataset-knowledge-graph` repository](https://github.com/netwerk-digitaal-erfgoed/dataset-knowledge-graph).
