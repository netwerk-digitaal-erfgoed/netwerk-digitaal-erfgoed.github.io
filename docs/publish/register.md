---
sidebar_position: 4
slug: /register
---

# Register Datasets

Register your datasets with the NDE Dataset Register.

## What happens after you register

You register a **URL** that points to one or more dataset descriptions, not the descriptions
themselves. The Register fetches that URL, [validates](../services/dataset-register/validation.md) what it finds,
and only then stores it.

* **If your description is valid**, the URL is registered and you are done. The Register re-crawls
  it daily to pick up your changes, so you do not have to register again when a description
  changes.
* **If your description is invalid**, the registration is refused and *nothing is kept*: 
  the Register will not come back to your URL by itself. Once you have fixed the problem, you have to register the
  URL again.

Registering the same URL twice is harmless, so when in doubt, register again.

:::caution

A description can be refused for a reason that is not in the description itself. If it declares a
distribution (a data dump or a SPARQL endpoint) that the Register cannot reach at that moment, the
description is refused as invalid even if the metadata is perfectly fine. If you cannot offer a
service reliably, do not declare it: removing an unreliable SPARQL endpoint from the description is
enough to make it registrable.

Note the asymmetry: an unreachable distribution blocks a *new* registration, but only raises a
warning on one that already exists. See [Validation](../services/dataset-register/validation.md#distribution-health).

:::

## Check before you register

Because a refused submission leaves no trace, check the description before registering it, with the
[validation web service](https://datasetregister.netwerkdigitaalerfgoed.nl/validate) or the
[validation endpoints](../services/dataset-register/api.md). They apply the same rules as
registration, including the distribution checks, so they tell you in advance whether registration
would succeed.

If you publish through a [collection management system](../glossary.md#collection-management-system),
it should be doing this for you and showing you the result: that is
[required](https://docs.nde.nl/requirements-dataset-register-implementations/) of it. If it lets you
believe a description was registered when it was refused, report it to your supplier.
