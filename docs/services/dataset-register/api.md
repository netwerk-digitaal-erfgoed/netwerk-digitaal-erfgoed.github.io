---
sidebar_position: 1
---

# REST API

This chapter is for **software developers** integrating the Dataset Register into a
[Data Platform](../../glossary.md#data-platform), [collection management system](../../glossary.md#collection-management-system), or other tooling
that publishes [dataset descriptions](../../glossary.md#dataset-description) on behalf of heritage
institutions. It gives a high-level overview of the available endpoints and the order in which
you typically call them.

For exact request and response schemas, status codes, examples and a “try it out” console, see
the [OpenAPI specification](https://datasetregister.netwerkdigitaalerfgoed.nl/api/). This page
intentionally does not duplicate that reference; it focuses on **how the endpoints fit together**.

If you are building software that integrates with the Dataset Register on behalf of heritage institutions,
also see the [Requirements for Dataset Register Implementations](https://docs.nde.nl/requirements-dataset-register-implementations/),
which define the obligations an integrating platform must meet.

## Typical integration flow

The [OpenAPI specification](https://datasetregister.netwerkdigitaalerfgoed.nl/api/) groups the
endpoints into four sections – **Onboarding**, **Validation**, **Registration** and
**Administration** – which mirror the steps below. Validation endpoints are read-only and safe
to call as often as you like; everything else changes state.


When you build a Data Platform that registers datasets on behalf of multiple publishers, the
endpoints are normally used in this order:

1. **Check the allow list** with `GET /allowed-domains?url=…` before showing publishers a
   ‘Register’ button. Only URLs on allow-listed domains can be registered; surface a clear error
   (and a link to the contact address) if a domain is not yet allowed.
2. **Validate during authoring** with `POST /datasets/validate` (description in the body) so
   editors get immediate feedback while they are still writing the description. The body form
   avoids the need to publish a draft on the web first.
3. **Re-validate the published URL** with `PUT /datasets/validate` once the description is
   live. This catches issues that only show up when the description is fetched over HTTP
   (content negotiation, redirects, character encoding, etc.).
4. **Register the URL** with `POST /datasets`. The Register fetches, validates, and stores the
   description. From here, periodic re-fetches are handled automatically by the Register’s
   crawler, so you do _not_ need to call `POST /datasets` again when the description changes.
   The call is idempotent: repeating it for the same URL has no additional
   effect, so it is fine to retry on transient errors or network failures.
5. **Delete a registration** with `DELETE /datasets?url=…` when a publisher leaves or replaces
   a catalog URL. This operation requires a Bearer token issued by NDE.

`GET /shacl` is mostly useful for tooling that wants to run the same validation rules locally,
for example in a CI pipeline or an authoring tool that highlights violations inline. The shape
graph returned here is the authoritative source: it matches what the validation endpoints apply.

## Validation results

Validation is performed against the
[Requirements for Datasets](https://docs.nde.nl/requirements-datasets/), expressed as the SHACL
shape graph available from `GET /shacl`. Both validation endpoints and `POST /datasets` return
SHACL [validation reports](https://www.w3.org/TR/shacl/#validation-report). When acting on a
report, keep two distinctions in mind:

- **Validity vs. conformance.** A description is considered *valid* (and will be registered) if it has no
  violations. In SHACL, `sh:conforms` is only `true` when there are no violations **and** no
  warnings or infos, so do not treat `sh:conforms = false` as a hard failure – inspect
  `sh:resultSeverity` per result instead.
- **HTTP status maps to validity, not conformance.** The validation endpoints return `200`
  when the description is valid and `400` when it has one or more violations. `POST /datasets`
  returns `202 Accepted` on a valid submission (the description is queued for ingestion and
  will appear in the Register shortly) and `400` when invalid. Warnings and infos do _not_
  flip the status code on the success path, so a `200` or `202` response can still carry a
  report with `sh:conforms = false`.

For the exact JSON-LD and Turtle shapes of these reports, see the `Valid` and `Invalid` response
schemas in the OpenAPI spec.

## Authentication

Only `DELETE /datasets` requires authentication, via a Bearer token in the `Authorization`
header. All other endpoints are open. Contact NDE to obtain a token if you need to manage
deletions programmatically.

