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

## What happens to a rejected submission

A `400` is final for that submission. The Register stores nothing on the rejection path: no registration record, no pending queue, no scheduled retry. Only a description that passes validation is written to the [Registrations graph](data-model.md#schemaentrypoint), and the crawler only ever re-fetches URLs it finds there. A rejected URL is therefore never re-checked, not after 24 hours and not ever: nothing picks it up by itself once the underlying problem is fixed.

To register the description, fix what the report lists and call `POST /datasets` again. That call is idempotent, so re-submitting is both safe and necessary.

This applies to a URL that is not yet registered. Re-submitting a URL that is **already** registered leaves its existing registration untouched: the `400` changes nothing, and the crawler keeps re-fetching that registration on its normal schedule.

:::note

Because rejected submissions leave no trace, the Register cannot report which descriptions were turned away, or how many. A publisher who does not act on the `400` is invisible to it. This is why the [Requirements for Dataset Register Implementations](https://docs.nde.nl/requirements-dataset-register-implementations/) place the duty to surface validation results on the [collection management system](../../glossary.md#collection-management-system).

:::

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

## Distribution health

The Register models a distribution’s health as a derived **usability** verdict over two separately-produced signals:

- **reachability** – can the distribution be fetched? (HTTP/SPARQL level)
- **validity** – does the fetched content actually parse as RDF?

During validation the Register probes every distribution URL it can derive from the description (`dcat:accessURL`, `dcat:downloadURL`, `schema:contentUrl`) to produce both signals: it checks that the URL is reachable and serves the declared media type (reachability), and, for small RDF dumps (≤ 10 KB Turtle / N-Triples / N-Quads), that the body parses as RDF (validity). Even when the description passes SHACL, a broken or mistyped distribution URL, or a body that does not parse as RDF, is reported as a `sh:Violation` and rejected with HTTP `400` — so fix it before [(re)submitting](#what-happens-to-a-rejected-submission).

:::note

Reachability and validity are distinct. A body that is fetched but does not parse (or comes back empty) is still **reachable**; its defect is a **validity** failure, not a reachability one. The two are recorded on separate rails (see [Distribution health](data-model.md#distribution-health) and [Distribution validity](data-model.md#distribution-validity) in the data model) and combined into a single usability verdict on read.

:::

The REST API and the crawler differ in how strict they are about probe failures:

| Caller | Probe-failure severity | Effect |
| ------ | ---------------------- | ------ |
| **Registration** (`POST /datasets`) | `sh:Violation` (strict) | A faulty distribution makes the dataset invalid, so it is rejected with HTTP `400` and never indexed. |
| **Validation** (`POST`/`PUT /datasets/validate`) | `sh:Violation` (strict) | The same result registration would give – an accurate dry-run; the [validate page](https://datasetregister.netwerkdigitaalerfgoed.nl/validate) shows the dataset as invalid. |
| **Crawler** | declared `sh:severity` (`sh:Warning` today) | A distribution that breaks *after* registration is flagged without invalidating the dataset. How quickly the flag appears depends on the failure type (see below). |

The REST API is strict regardless of the severity the shapes declare, so it will not admit a dataset whose distributions are unreachable or mistyped at submit time. The crawler instead honours the shapes: promoting `nde-probe:probeReachable` / `nde-probe:probeFormatMatch` to `sh:Violation` in the [Requirements for Datasets](https://docs.nde.nl/requirements-datasets/) would make the crawler invalidate matching datasets too.

#### Grace window: transient vs. deterministic failures

The crawler does not flag every probe failure immediately. Whether it waits out a grace window depends on whether the failure could plausibly resolve itself:

- **Transient reachability failures** – `nde-probe:NetworkError`, `nde-probe:NotFound`, `nde-probe:ServerError`, `nde-probe:AuthRequired`, `nde-probe:RateLimited`, `nde-probe:SparqlProbeFailed` – are emitted only once the failure streak is persistent (`nde-probe:firstFailureAt` older than the threshold, default 7 days). A brief outage that self-heals before the threshold is suppressed, so a network blip neither warns the publisher nor flips the browser usability badge.
- **Deterministic content defects** – `nde-probe:ContentTypeMismatch`, `nde-probe:ContentTypeMissing` – are surfaced within one probe cycle, with no grace window. A `Content-Type` that does not match the declared media type, or none at all, is the same defect on the next crawl as it is today, so waiting cannot change the verdict.

Empty and unparseable bodies are **not** reachability outcomes: a fetched body that is empty or does not parse is reachable, and its defect is recorded on the [validity rail](data-model.md#distribution-validity) instead. A validity verdict refreshes when the distribution’s source fingerprint changes, rather than riding out a grace window.

The browser usability badge uses the same classification, so the badge and the registration warning tier stay consistent.

### How probe failures appear in the report

Probe failures surface in the validation report as additional `sh:ValidationResult` nodes, with one of three probe-specific constraint components on `sh:sourceConstraintComponent`:

- `nde-probe:DistributionReachableConstraintComponent` — the URL itself could not be retrieved.
- `nde-probe:DistributionFormatMatchConstraintComponent` — the URL was retrieved but the response did not match the declared media type / format.
- `nde-probe:DistributionValidConstraintComponent` — the body was retrieved but did not parse as RDF (a validity failure). Emitted only on the registration path (`POST /datasets`, `POST`/`PUT /datasets/validate`); the crawler records validity as a quality measurement instead (see [Distribution validity](data-model.md#distribution-validity)). The `sh:resultMessage` names the reason and, where the parser provides one, the parser message.

Probe-emitted results carry these extra properties beyond the standard SHACL ones:

| Property                         | Description                                                                            |
| -------------------------------- | -------------------------------------------------------------------------------------- |
| `nde-probe:probeOutcome`         | One of the [outcome IRIs](data-model.md#probe-outcomes).                               |
| `nde-probe:firstFailureAt`       | `xsd:dateTime` — copied from the health record, so consumers see how long the URL has been failing without joining the health graph. Present only on crawler-emitted results. |
| `nde-probe:consecutiveFailures`  | `xsd:integer` — length of the current failure streak. Present only on crawler-emitted results. |

Every probe the crawler runs — successful or not — is also recorded as queryable enrichment data: its reachability outcome and observed source fingerprint in the [Distribution health](data-model.md#distribution-health) graph (the [`nde-probe:DistributionHealthRecord`](data-model.md#nde-probedistributionhealthrecord) structure and the [outcome vocabulary](data-model.md#probe-outcomes)), and its RDF-validity verdict in the [Distribution validity](data-model.md#distribution-validity) graph as a DQV quality measurement.
