---
sidebar_position: 1
slug: /integration-layer-api
---

# Integration Layer API specification

:::warning Work in progress

This document is for illustration and discussion only. It has no official standing.

:::

## Introduction

This document defines the API specification for the exchange of heritage information between integration layers and presentation layers within the [Dutch Digital Heritage Network](https://netwerkdigitaalerfgoed.nl/) (NDE). It standardises the interface an integration layer exposes to a presentation layer, by defining the rules, data models and endpoints for the most important interactions between the two.

The API specification is divided into two sub specifications: one for [REST](/integration-layer-api/rest) and one for [GraphQL](/integration-layer-api/graphql). An integration layer can choose which sub specification it follows. At this stage the focus is on REST. The GraphQL specification has not been developed yet: its pages are a placeholder for a future version.

The specification helps both kinds of developer. Integration layer developers can build an integration layer API more easily, because they can follow the specification instead of designing their own. Presentation layer developers can build a presentation layer once and reuse it with any integration layer that follows the same specification, reducing the need for custom integrations.

## Definitions

1. An **integration layer** integrates heritage information from multiple data providers and exposes it through an API for use by one or more presentation layers.
2. A **presentation layer** uses heritage information from integration layers and makes it accessible to end users, e.g. via websites or mobile apps.

## Audience

This document is intended for:

1. **Integration layer developers** building compliant APIs.
1. **Presentation layer developers** building generic clients that work across various integration layers.

## Conformance

The keywords _MAY_, _MUST_, _MUST NOT_, _OPTIONAL_, _RECOMMENDED_, _SHOULD_, and _SHOULD NOT_ are to be interpreted as described in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt), when, and only when, they appear in all capitals, as shown here.

:::note To do

- Add references to the [gedragsprofielen digitaal erfgoed](https://zenodo.org/records/14938780).
- Make a clean separation between the specification of the interface and the behaviour of the integration layer (what it must or should do).
- Include a 'Metamodel Informatiemodellering' (MIM), explaining the information model on which the API is grounded.
- Describe the integration with the IIIF APIs, for interacting with media objects and their metadata. For example:
  - An integration layer should be able to publish its own IIIF collection(s) with manifests from data providers
  - An integration layer should [retrieve and cache media object dimensions](https://github.com/netwerk-digitaal-erfgoed/netwerk-digitaal-erfgoed.github.io/issues/143) from IIIF info.json files from data providers so that presentation layers do not have to request these real-time

:::
