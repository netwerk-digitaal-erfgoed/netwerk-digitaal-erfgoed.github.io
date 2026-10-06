---
sidebar_position: 1
slug: /data-layer-api
---

# Data Layer API specification

:::warning Work in progress

This document is for illustration and discussion only. It has no official standing.

:::

## Introduction

This document defines API specifications for the exchange of heritage information between data layers and presentation layers within the [Dutch Digital Heritage Network](https://netwerkdigitaalerfgoed.nl/) (NDE). It standardizes the interface a data layer exposes to a presentation layer, by defining the rules, data models and endpoints for the most important interactions between the two.

One shared specification helps both kinds of developer. Data layer developers can build a data layer API more easily, because they can follow it instead of designing their own. Presentation layer developers can build a presentation layer once and reuse it with any data layer that follows this specification, reducing the need for custom integrations.

## Version

The document describes **version 0.0.3** of the API specification.

This is the **initial development** version, version zero. Breaking changes are introduced within the same major version, following [semantic versioning for version zero](https://semver.org/#spec-item-4).

## Definitions

1. A **data layer** combines heritage information from multiple data providers and exposes it through an API for use by one or more presentation layers.
2. A **presentation layer** uses heritage information from data layers and makes it accessible to end users, e.g. via websites or mobile apps.

## Audience

This document is intended for:

1. **Data layer developers** building compliant APIs.
1. **Presentation layer developers** building generic clients that work across various data layers.

## Conformance

The keywords _MAY_, _MUST_, _MUST NOT_, _OPTIONAL_, _RECOMMENDED_, _SHOULD_, and _SHOULD NOT_ are to be interpreted as described in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt), when, and only when, they appear in all capitals, as shown here.

:::note To do:

- Add references to the [gedragsprofielen digitaal erfgoed](https://zenodo.org/records/14938780).
- Make a clean separation between the specification of the interface and the behaviour of the data layer (what it must or should do).
- Include a 'Metamodel Informatiemodellering' (MIM), explaining the information model on which the API is grounded.

:::
