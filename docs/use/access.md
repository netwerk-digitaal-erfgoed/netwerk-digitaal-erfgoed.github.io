---
sidebar_position: 2
description: Download a data dump or query a SPARQL endpoint to retrieve a dataset’s content.
---

# Access

You have [discovered a dataset](discover.md) and read its [distributions](../glossary.md#distribution); now you want its content. 
How you get it depends on the distribution you picked:

* a **data dump** is a file you download and process locally;
* a **SPARQL endpoint** you query at the source, without keeping a copy.

A dataset may offer either or both; choose whichever fits how you work.
Either way you fetch the content from the publisher at the source, not from the
[Dataset Register](../services/dataset-register/index.md), which holds descriptions, not data.

## Download a data dump

### Find the dump’s URL

Read the dump’s access URL (`dcat:accessURL`) off the distribution, along with its media type
(`dcat:mediaType`), which tells you the [RDF](../glossary.md#rdf) serialisation to expect. If the dump
is compressed, you will find the compression in `dcat:compressFormat`. For the full set of properties,
see the [distribution data model](../services/dataset-register/data-model.md#dcatdistribution).

### Download it

A dump is a plain HTTP resource, so reach for any HTTP client. Dumps are often gzip-compressed, so you
may need to unpack what you download:

```shell
curl -LO https://example.org/collection.nt.gz
gunzip collection.nt.gz
```

`-L` follows redirects, which publishers commonly use for persistent download URLs; `-O` keeps the
server-provided filename.

### Match your parser to the serialisation

The media type on the distribution tells you how to read the dump. You will most often meet these RDF
serialisations:

| Serialisation | Typical extension | Media type |
| --- | --- | --- |
| N-Triples | `.nt` | `application/n-triples` |
| N-Quads | `.nq` | `application/n-quads` |
| Turtle | `.ttl` | `text/turtle` |
| RDF/XML | `.rdf`, `.xml` | `application/rdf+xml` |
| JSON-LD | `.jsonld` | `application/ld+json` |

Most RDF tooling reads all of these; point your parser at the media type the distribution declared.

### Work with the dump

Once the dump is on disk, you can:

* **query it** by loading it into a local triplestore (QLever, Oxigraph, Jena Fuseki, …) and running
  SPARQL against your own copy, so you no longer depend on the source being up;
* [transform](transform.md) it into the model your application needs.

## Query a SPARQL endpoint

If you would rather not keep a copy, query the source directly. A SPARQL-endpoint distribution declares
its protocol with `dct:conformsTo <https://www.w3.org/TR/sparql11-protocol/>`, 
and its `dcat:accessURL` is the endpoint you send queries to. 
You always see the current data, and you store nothing yourself.

Send a query with any SPARQL client. From the command line with cURL:

```shell
curl -X POST https://www.goudatijdmachine.nl/sparql/repositories/gtm \
  --data 'query=SELECT * WHERE { ?s ?p ?o } LIMIT 10'
```

Or with a dedicated client such as
[Comunica](https://comunica.dev/docs/query/getting_started/query_cli/):

```shell
npm install -g @comunica/query-sparql
comunica-sparql sparql@https://www.goudatijdmachine.nl/sparql/repositories/gtm \
  "SELECT * WHERE { ?s ?p ?o } LIMIT 10"
```

## Keep your copy current

Whether you downloaded a dump or cached a query result, what you hold is a snapshot, so refresh it
when the source moves on. Rather than re-fetching on a hunch, compare the distribution’s
`dct:modified` – the date the data itself last changed, distinct from when the dataset description was
updated – against your last copy, and re-fetch only when it has advanced. See
[Discover → Re-fetch only what changed](discover.md#re-fetch-only-what-changed).
