---
slug: /integration-layer-api/rest/types
sidebar_position: 4
---

# Types

## Introduction

Every resource has a type, and the type tells a presentation layer what it is looking at. For example: a `Collection` holds resources and can be traversed, while an `HeritageObject` is a record. An integration layer uses the types of this specification where they apply, specialises them where it needs a variation of its own, and introduces new ones for the things it exposes. This page specifies how an integration layer does that, and how it publishes the types it uses.

The data model of an individual type is specified with the resources it belongs to, on the pages for [Resources](resources.md), [Collections](collections.md), [Entities](entities.md), [Facets](facets.md) and [Suggestions](suggestions.md).

## Type vocabulary

An integration layer defines the types it uses, so that every type in a response is a type that the integration layer knows. Those types form its **type vocabulary**.

An integration layer _MUST_ publish its type vocabulary. The vocabulary is a set of data models — a change to it is a change to the API.

The vocabulary is administrative information. It tells a developer of a presentation layer what a resource looks like and what the API guarantees about it. The form in which an integration layer publishes its vocabulary is to be specified — see the note below.

:::note To do

This page is a placeholder for the rules that the other pages now assume but do not define. In addition to the [type vocabulary](#type-vocabulary) above, it has to specify:

- what a type is, and how it differs from the identity of a resource (the identity of a resource is not defined by its type);
- the rules for an integration layer that **specialises** a type of this specification, such as `Collection`;
- the rules for an integration layer that **introduces** a type of its own, such as `HeritageObject`.
- the use of the JSON-LD context document and the API endpoint required for fetching it (e.g. `https://example.org/v1/context.json`). Should there be a default context document for integration layers that do not use their own types (e.g. `https://specs.nde.nl/v1/context.json`)?

:::

:::note To be discussed

Generalise this page so that it's not just about types but about data models in general?

:::
