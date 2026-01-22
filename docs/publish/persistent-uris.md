---
sidebar_position: 1
slug: /persistent-uris
---

# Persistent HTTP URIs

Identify each data resource with its own [persistent HTTP URI](../glossary.md#persistent-http-uri).
A persistent HTTP URI is a web address that is guaranteed to be stable and to resolve to the resource it identifies.
This means that the URI always points to the same resource, even if:

- the resource is moved, updated or deleted
- the [Data Provider](../glossary.md#data-provider)’s web address changes
- the [Data Platform](../glossary.md#data-platform) software hosting the data resources is updated or replaced.

Only with that guarantee can [data consumers](../glossary.md#consumer) trust the URI, 
enabling them to link to it from their own datasets.

At the URI, a valid [RDF](../glossary.md#rdf) document must be served.

New persistent URIs must be HTTPS URIs (`https://...`).
For previously coined URIs, HTTP (`http://...`) may continue to be used.

## Persistent identifiers

To make this easier, it’s usually a good idea to coin a [persistent identifier](../glossary.md#persistent-identifier) (PID)
that redirects to the resource’s web address.
Even if the latter changes, the PID remains unchanged.
By making the PIDs part of persistent URIs, their stability is guaranteed.

Common PID systems are:

* [ARK](https://arks.org), for example `https://n2t.net/ark:/12345/x54xz321/s3/f8.05v.tiff`
* [DOI](https://www.doi.org/), for example `https://doi.org/10.1234/example.5678`

## Infrastructure-independent identifiers

PIDs should not contain infrastructural details, such as the Data Platform's name or version.
The Data Provider is identified with a prefix, allowing for web address or name changes.
Because of this, the PIDs can remain stable regardless of infrastructural changes.

## Further reading

* [Requirements for Collection Management Systems](https://docs.nde.nl/requirements-collection-management-systems/)
