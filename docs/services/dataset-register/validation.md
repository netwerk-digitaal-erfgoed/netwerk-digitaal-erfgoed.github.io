---
sidebar_position: 3
---

# Validation

The Dataset Register validates every description it receives – both when you submit it through
the [REST API](api.md) and when the crawler re-fetches a registered URL. This chapter explains
what is checked, how to read the result, and why a description might be rejected. It is relevant
to **publishers** confirming their descriptions and to **software developers** building
validation into their tooling.

Validation runs against the
[Requirements for Datasets](https://docs.nde.nl/requirements-datasets/), expressed as the SHACL
shape graph available from `GET /shacl`. How you interpret the result depends on whether you call
the API or run the shape graph yourself.

:::tip

If you only need to check a single dataset description by hand – e.g. to confirm a publisher’s
URL before integrating – use the public
[validation web service](https://datasetregister.netwerkdigitaalerfgoed.nl/validate). It runs
the same SHACL shape as the API.

:::

## Calling the API

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

## Validating against the SHACL shape directly

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
schemas in the [OpenAPI specification](https://datasetregister.netwerkdigitaalerfgoed.nl/api/).

## Distribution-health probes

During validation the Register also probes every distribution URL it can derive from the description (`dcat:accessURL`, `dcat:downloadURL`, `schema:contentUrl`) to check that it is reachable and serves the declared media type. Even when the description passes SHACL, a broken or mistyped distribution URL is reported as a `sh:Violation` and rejected with HTTP `400` — so fix the URL before (re)submitting.

The REST API and the crawler differ in how strict they are about probe failures:

| Caller | Probe-failure severity | Effect |
| ------ | ---------------------- | ------ |
| **Registration** (`POST /datasets`) | `sh:Violation` (strict) | A faulty distribution makes the dataset invalid, so it is rejected with HTTP `400` and never indexed. |
| **Validation** (`POST`/`PUT /datasets/validate`) | `sh:Violation` (strict) | The same result registration would give – an accurate dry-run; the [validate page](https://datasetregister.netwerkdigitaalerfgoed.nl/validate) shows the dataset as invalid. |
| **Crawler** | declared `sh:severity` (`sh:Warning` today) | A distribution that breaks *after* registration is flagged without invalidating the dataset. How quickly the flag appears depends on the failure type (see below). |

The REST API is strict regardless of the severity the shapes declare, so it will not admit a dataset whose distributions are unreachable or mistyped at submit time. The crawler instead honours the shapes: promoting `nde-probe:probeReachable` / `nde-probe:probeFormatMatch` to `sh:Violation` in the [Requirements for Datasets](https://docs.nde.nl/requirements-datasets/) would make the crawler invalidate matching datasets too.

#### Grace window: transient vs. deterministic failures

The crawler does not flag every probe failure immediately. Whether it waits out a grace window depends on whether the failure could plausibly resolve itself:

- **Transient reachability failures** – `nde-probe:NetworkError`, `nde-probe:NotFound`, `nde-probe:ServerError`, `nde-probe:AuthRequired`, `nde-probe:RateLimited`, `nde-probe:SparqlProbeFailed` – are emitted only once the failure streak is persistent (`nde-probe:firstFailureAt` older than the threshold, default 7 days). A brief outage that self-heals before the threshold is suppressed, so a network blip neither warns the publisher nor flips the browser availability badge.
- **Deterministic content defects** – `nde-probe:EmptyBody`, `nde-probe:RdfParseFailed`, `nde-probe:ContentTypeMismatch`, `nde-probe:ContentTypeMissing` – are surfaced within one probe cycle, with no grace window. An empty or unparseable body, or a `Content-Type` that does not match the declared media type, is the same defect on the next crawl as it is today, so waiting cannot change the verdict.

The browser availability badge uses the same classification, so the badge and the registration warning tier stay consistent.

### How probe failures appear in the report

Probe failures surface in the validation report as additional `sh:ValidationResult` nodes, with one of two probe-specific constraint components on `sh:sourceConstraintComponent`:

- `nde-probe:DistributionReachableConstraintComponent` — the URL itself could not be retrieved.
- `nde-probe:DistributionFormatMatchConstraintComponent` — the URL was retrieved but the response did not match the declared media type / format.

Probe-emitted results carry these extra properties beyond the standard SHACL ones:

| Property                         | Description                                                                            |
| -------------------------------- | -------------------------------------------------------------------------------------- |
| `nde-probe:probeOutcome`         | One of the [outcome IRIs](data-model.md#probe-outcomes).                               |
| `nde-probe:firstFailureAt`       | `xsd:dateTime` — copied from the health record, so consumers see how long the URL has been failing without joining the health graph. Present only on crawler-emitted results. |
| `nde-probe:consecutiveFailures`  | `xsd:integer` — length of the current failure streak. Present only on crawler-emitted results. |

Every probe the crawler runs — successful or not — is also recorded as queryable enrichment data. See [Distribution health](data-model.md#distribution-health) in the data model for that named graph, the [`nde-probe:DistributionHealthRecord`](data-model.md#nde-probedistributionhealthrecord) structure, and the [outcome vocabulary](data-model.md#probe-outcomes).
