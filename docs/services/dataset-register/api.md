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
shape graph available from `GET /shacl`. How you interpret the result depends on whether you
call the API or run the shape graph yourself.

:::tip

If you only need to check a single dataset description by hand – e.g. to confirm a publisher’s
URL before integrating – use the public
[validation web service](https://datasetregister.netwerkdigitaalerfgoed.nl/validate). It runs
the same SHACL shape as the API.

:::

### Calling the API

The **HTTP status code is the authoritative signal**; you do not need to parse the SHACL report to decide pass or fail:

| Status | Meaning                                                                    |
|--------|----------------------------------------------------------------------------|
| `200`  | Valid. Returned by `POST /datasets/validate` and `PUT /datasets/validate`. |
| `202`  | Valid; queued for ingestion. Returned by `POST /datasets`.                 |
| `400`  | Invalid – one or more SHACL violations. The response body lists them.      |

The status maps to **validity**, not to SHACL's `sh:conforms`. A description is considered *valid* when no
result has severity `sh:Violation`; warnings and infos do not block ingestion. 
SHACL’s `sh:conforms` is stricter: it is only `true` when there are no violations _and_ no warnings _and_ no infos.
So a `200` or `202` response can still carry a report with `sh:conforms = false` if the description triggered warnings or infos.

In short: use the status code to keep or reject; surface anything else in the report body to
the editor as advisory feedback.

### Validating against the SHACL shape directly

If you fetch the shape graph from `GET /shacl` and run validation in your own pipeline (e.g.
an authoring tool that highlights violations inline, or a CI check on a publishing repo),
there is no HTTP status to lean on; only the SHACL [validation report](https://www.w3.org/TR/shacl/#validation-report). 
Walk every `sh:ValidationResult` and inspect its `sh:resultSeverity`:

| Severity       | Meaning                                                                                   |
|----------------|-------------------------------------------------------------------------------------------|
| `sh:Violation` | The register would reject this description (HTTP `400`). Must be fixed before submitting. |
| `sh:Warning`   | The register would accept the description now, but reject it in the future.               |
| `sh:Info`      | Suggestions.                                                                              |

To reproduce the register’s accept/reject decision, treat the description as valid when no
result has severity `sh:Violation`. 
Do _not_ rely on `sh:conforms` for this decision:
it flips to `false` on warnings and infos too, which is stricter than what the register enforces.

For the exact JSON-LD and Turtle shapes of the report, see the `Valid` and `Invalid` response
schemas in the OpenAPI spec.

### Distribution-health probes

During validation the Register also probes every distribution URL it can derive from the description (`dcat:accessURL`, `dcat:downloadURL`, `schema:contentUrl`) to check that it is reachable and that the response matches the declared media type. A failed probe emits a `sh:Violation`, so a description that passes SHACL can still be rejected with HTTP `400` if one of its distribution URLs is broken. See [Distribution health](data-model.md#distribution-health) for the outcome vocabulary that appears on probe-emitted `sh:ValidationResult` nodes.

## Authentication

Only `DELETE /datasets` requires authentication, via a Bearer token in the `Authorization`
header. All other endpoints are open. Contact NDE to obtain a token if you need to manage
deletions programmatically.

