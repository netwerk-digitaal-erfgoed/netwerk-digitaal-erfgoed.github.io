---
slug: /data-layer-api/rest
sidebar_position: 1
---

# REST API

## Introduction

This specification defines how data layers and presentation layers exchange information using REST.

The specification is generic: it defines general rules, data models and endpoints without assuming a specific implementation. Data layer developers can implement relevant portions of the specification and publish their own API specifications accordingly.

The specification standardizes the most common interactions between a data layer and a presentation layer. This means a presentation layer can be built once and reused with any data layer that follows these rules.

## Design considerations

The specification follows these considerations:

1. **Use standard REST patterns**. The specification leverages common RESTful practices to simplify API development and consumption.
2. **Adhere to Dutch government rules**. The specification adheres to the [REST API Design Rules](https://logius-standaarden.github.io/API-Design-Rules/) of the Dutch government to improve developer experience and interoperability.
3. **Build on existing standards**. The specification is inspired by existing data models and API specifications in the digital heritage ecosystem, like [Activity Streams](https://www.w3.org/TR/activitystreams-core/), [IIIF APIs](https://iiif.io/api/), and [Linked Art Search API](https://linked.art/api/1.0/search/).
4. **Support the goal of the NDE**. The specification makes specific choices to support the goal of the NDE: making digital heritage more accessible to end users. To reach this goal, the specification is tailored to facilitate the use of heritage information in presentation layers.

## Discovery

:::note

**To do**:

- Explain that the API specification uses discovery patterns; it makes API implementations dynamic and self-documenting. This is essential for a generic, extensible specification that can be used by all sorts of data layers.
- Specify the root endpoint of the API, e.g. `/v1`. This endpoint allows presentation layers to discover the entry points and capabilities of the API (e.g. `/v1/entities`, `/v1/collections`).
- Specify how a data layer can extend the capabilities of its API using the patterns in the specification, e.g. with custom functionality or resources. Add examples.

:::

## A note about examples

Various examples in this specification illustrate how the rules, data models and endpoints work. These examples assume a data layer API lives at `https://example.org/` and uses version `1`.
