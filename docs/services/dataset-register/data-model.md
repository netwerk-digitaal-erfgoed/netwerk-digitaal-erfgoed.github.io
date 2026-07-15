---
sidebar_position: 5
description: The DCAT-AP-NL data model that the Dataset Register exposes to consumers.
---

# Data model

This page is for users of the [Dataset Register](index.md): anyone querying the
[SPARQL endpoint](sparql.md), fetching dataset descriptions in RDF, or building applications on
top of the register. It describes the **consumer-facing, published data model**: the RDF as it
appears in the register after fetching, validating, mapping, and storing the providers’ input.

:::info

If you are a **publisher** (a data platform submitting dataset descriptions) you are looking for
the input format and validation rules instead — see the
[Requirements for Datasets](https://docs.nde.nl/requirements-datasets/#overview).

:::

The register stores descriptions in DCAT, aligned with
[DCAT-AP-NL 3.0](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/). Schema.org submissions are
converted to DCAT at ingest, so consumers see the DCAT form regardless of how the data was
originally submitted. The Schema.org ↔ DCAT alignment mostly follows the W3C DCAT 3
[Alignment with Schema.org](https://www.w3.org/TR/vocab-dcat-3/#dcat-sdo) appendix.

Cardinalities reflect the data as stored, including auto-derived and auto-default values.

Property-column tags signal the source vocabulary:

- _untagged_ — profiled by DCAT-AP-NL 3.0 (the default).
- <span class="vocab-tag">DCAT</span> — defined in DCAT 3.0 but not profiled by DCAT-AP-NL.
- <span class="vocab-tag">DC</span> — plain Dublin Core (`dct:`) passthrough; not profiled by DCAT-AP-NL, DCAT-AP, or DCAT 3.0.
- <span class="vocab-tag">DCAT-AP-NL: Distribution only</span> — DCAT-AP-NL profiles the property only on Distribution; the dataset-level usage is a register convenience.

**NAL** stands for [Named Authority List](https://op.europa.eu/en/web/eu-vocabularies/authority-tables),
the EU Publications Office’s term for the controlled vocabularies it maintains (Languages,
Frequency, Access Rights, File Type, etc.).

## Dataset

The [`dcat:Dataset`](#dcatdataset), [`dcat:Distribution`](#dcatdistribution), and
[`foaf:Agent`](#foafagent) shapes describe the public dataset description as stored.

### `dcat:Dataset`

When a dataset’s RDF description is fetched and validated, it is stored as a `dcat:Dataset` in its
own graph. The URL of the graph corresponds to the dataset’s IRI.

A dataset MUST be identified by an HTTP(S) IRI: it is the stable, dereferenceable identifier the
register indexes and uses as the graph URL. A dataset expressed as a blank node, or with a
non-HTTP IRI, is rejected as invalid (HTTP `400`) with a clear web-URI message – this holds for
both `dcat:Dataset` and `schema:Dataset` descriptions.

| DCAT term                                | Data type / notes                                                                                                                                                                              | Cardinality             |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| [`dct:title`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#dataset-title) | `rdf:langString` | 1..n (one per language) |
| [`dct:identifier`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#dataset-identifier) | Auto-derived from the dataset IRI | 1..1 |
| [`dct:description`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#dataset-description) | `rdf:langString` | 1..n (one per language) |
| `dct:license` <span class="vocab-tag">DCAT-AP-NL: Distribution only</span> | IRI or literal in v1; **v2.0**: IRI required. Inherited by distributions that don’t specify their own. If the dataset has no IRI license, the register denormalises one IRI license from its distributions onto the dataset for query convenience. A license must exist on the dataset **or** on every distribution — see [`DistributionLicenseRequiredShape`](https://docs.nde.nl/requirements-datasets/#dataset-license). | 0..1 |
| [`dct:accessRights`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#dataset-access-rights) | [EU Access Rights NAL](https://op.europa.eu/en/web/eu-vocabularies/concept-scheme/-/resource?uri=http://publications.europa.eu/resource/authority/access-right) IRI; defaults to `PUBLIC` | 1..1 |
| [`dcat:theme`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#dataset-theme) | IRI from a controlled vocabulary; the [EU Data Theme NAL](https://op.europa.eu/en/web/eu-vocabularies/concept-scheme/-/resource?uri=http://publications.europa.eu/resource/authority/data-theme) value `data-theme/EDUC` is auto-assigned | 1..n |
| [`dcat:contactPoint`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#dataset-contact-point) | `vcard:Kind` with `vcard:fn` and `vcard:hasEmail` (`mailto:` IRI) | 0..1<br />**v2.0**: 1..1 |
| [`dct:language`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#dataset-language) | [EU Language Authority](https://op.europa.eu/en/web/eu-vocabularies/concept-scheme/-/resource?uri=http://publications.europa.eu/resource/authority/language) IRI | 0..n |
| [`dcat:landingPage`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#dataset-landing-page) | IRI | 0..n |
| [`dct:source`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#dataset-source) | IRI | 0..n |
| `dct:created` <span class="vocab-tag">DC</span> | `xsd:date` or `xsd:dateTime`; the lexical form may not be ISO 8601 in v1.<br />**v2.0**: ISO 8601 value required | 0..1 |
| [`dct:issued`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#dataset-release-date) | `xsd:date` or `xsd:dateTime`; the lexical form may not be ISO 8601 in v1.<br />**v2.0**: ISO 8601 value required | 0..1 |
| [`dct:modified`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#dataset-modification-date) | `xsd:date` or `xsd:dateTime`; the lexical form may not be ISO 8601 in v1.<br />**v2.0**: ISO 8601 value required | 0..1 |
| [`dcat:version`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#dataset-version) | `xsd:string` | 0..1 |
| [`dct:creator`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#dataset-creator) | [`foaf:Organization` or `foaf:Person`](#foafagent) | 0..n<br />**v2.0**: 1..n |
| [`dct:publisher`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#dataset-publisher) | [`foaf:Organization` or `foaf:Person`](#foafagent) | 0..1<br />**v2.0**: 1..1 |
| [`dct:spatial`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#dataset-geographical-coverage) | IRI (e.g. GeoNames). DCAT-AP-NL also allows `dct:Location` with `dcat:bbox` / `dcat:centroid` / `dcat:geometry`, but the register stores IRI references only. | 0..n |
| [`dct:temporal`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#dataset-temporal-coverage) | `dct:PeriodOfTime` blank node with `dcat:startDate` and/or `dcat:endDate` | 0..n |
| `dct:isPartOf` <span class="vocab-tag">DC</span> | IRI or literal in v1<br />**v2.0**: HTTPS IRI required | 0..n |
| [`dct:hasPart`](https://www.w3.org/TR/vocab-dcat-3/#Property:resource_has_part) <span class="vocab-tag">DCAT</span> | IRI | 0..n |
| [`dct:isReferencedBy`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#dataset-is-referenced-by) | IRI | 0..n |
| [<code>dct:accrual&shy;Periodicity</code>](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#dataset-frequency) | [EU Frequency NAL](https://op.europa.eu/en/web/eu-vocabularies/concept-scheme/-/resource?uri=http://publications.europa.eu/resource/authority/frequency) IRI | 0..1 |
| [`dcat:distribution`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#dataset-dataset-distribution) | [`dcat:Distribution`](#dcatdistribution) (see below) | 0..n |

### `dcat:Distribution`

The objects of `dcat:distribution` dataset properties have type `dcat:Distribution`.

| DCAT term             | Data type / notes                                                                                                                                                | Cardinality |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [`dcat:accessURL`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#distribution-access-url) | IRI<br />**v2.0**: HTTPS IRI | 1..1 |
| [`dcat:mediaType`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#distribution-media-type) | [IANA media type](https://www.iana.org/assignments/media-types/) IRI. Required for download distributions; APIs use `dct:conformsTo` instead. Any compression suffix is split off into `dcat:compressFormat`. | 0..n<br />**v2.0**: 0..1 |
| [`dcat:compressFormat`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#distribution-compression-format) | [IANA media type](https://www.iana.org/assignments/media-types/) IRI; added when e.g. `+gzip` is stripped from `dcat:mediaType` | 0..1 |
| [`dct:conformsTo`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#distribution-linked-schemas) | Protocol IRI (e.g. `<https://www.w3.org/TR/sparql11-protocol/>` for SPARQL endpoints) | 0..1 |
| [`dct:issued`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#distribution-release-date) | `xsd:date` or `xsd:dateTime` | 0..1 |
| [`dct:modified`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#distribution-modification-date) | `xsd:date` or `xsd:dateTime` | 0..1 |
| [`dct:title`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#distribution-title) | `rdf:langString` | 0..n |
| [`dct:description`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#distribution-description) | `rdf:langString` | 0..n |
| [`dct:language`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#distribution-language) | [EU Language Authority](https://op.europa.eu/en/web/eu-vocabularies/concept-scheme/-/resource?uri=http://publications.europa.eu/resource/authority/language) IRI | 0..1 |
| [`dct:license`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#distribution-licence) | IRI or literal in v1; **v2.0**: IRI required. Inherited from the dataset if not specified. The register requires a license to exist on the distribution **or** the dataset via [`DistributionLicenseRequiredShape`](https://docs.nde.nl/requirements-datasets/#dataset-license). | 0..1 |
| [`dcat:byteSize`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#distribution-byte-size) | `xsd:integer` (bytes) | 0..1 |
| [`foaf:page`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#distribution-documentation) | IRI to a documentation page (SPARQL UI, download landing page, etc.)<br />**v2.0**: HTTPS required | 0..n |
| [`odrl:hasPolicy`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#distribution-has-policy) | ODRL policy associated with the distribution | 0..n |

### `foaf:Agent`

The objects of both the `dct:creator` and `dct:publisher` dataset properties are `foaf:Agent`
instances — concretely either `foaf:Organization` or `foaf:Person`. The publisher carries
additional properties beyond those available on the creator.

| Property         | Data type / notes                                                                                                                                | Cardinality             |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| `foaf:name`      | `rdf:langString` — the organization or person name                                                                                               | 1..n (one per language) |
| `foaf:nick`      | Alternate name (publisher only)                                                                                                                  | 0..n                    |
| `dct:identifier` | Identifier (publisher only)                                                                                                                      | 0..1                    |
| `foaf:mbox`      | Email address as a literal (publisher only)                                                                                                      | 0..1                    |
| `owl:sameAs`     | Equivalent entity IRI (publisher only)                                                                                                           | 0..n                    |

## Registration

The shapes below describe how the register tracks registrations themselves – not the public
dataset description that consumers query.

### `schema:EntryPoint`

Any URL [registered by clients](api.md) is added as a `schema:EntryPoint` to the
[Registrations graph](https://qlever.netwerkdigitaalerfgoed.nl/datasetregister/NwXonb?exec=true).

Datasets are fetched from this URL on registration and when the crawler runs.

| Property                                                     | Description                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`schema:additionalType`](https://schema.org/additionalType) | Computed registration status:<ul><li>`<https://data.netwerkdigitaalerfgoed.nl/registry/valid>` — fetched and passed SHACL validation</li><li>`<https://data.netwerkdigitaalerfgoed.nl/registry/invalid>` — fetched but failed SHACL validation; see `schema:validUntil`</li><li>`<https://data.netwerkdigitaalerfgoed.nl/registry/gone>` — could not be fetched as a dataset description. Covers HTTP error responses (≥ 300) **and** non‑HTTP failures: parse errors, unrecognised content types, and URLs that returned 200 but contained no dataset triples.</li></ul> |
| [`schema:datePosted`](https://schema.org/datePosted)         | UTC datetime when the URL was registered.                                                                                                                                                                                                                                                                      |
| [`schema:dateRead`](https://schema.org/dateRead)             | UTC datetime when the URL was last read by the application. The crawler updates this value when fetching descriptions.                                                                                                                                                                                         |
| [`schema:status`](https://schema.org/status)                 | The HTTP status code last encountered when fetching the URL.                                                                                                                                                                                                                                                   |
| [`schema:validUntil`](https://schema.org/validUntil)         | If the URL has become invalid, the UTC datetime at which it did so.                                                                                                                                                                                                                                            |
| [`schema:about`](https://schema.org/about)                   | The `schema:Dataset`s found at this URL. A registration URL may describe a single dataset (one entry) or a catalog of multiple datasets (multiple entries). The crawler updates this value when fetching descriptions. |
| `nde:warningCount` (`<https://def.nde.nl/registration#warningCount>`) | `xsd:integer` — the number of `sh:Warning`-severity results the registration’s description produced at the last crawl. `0` (or absent) means it validated cleanly; a positive value surfaces as “registered with warnings” on the dataset page. Tracked per registration, so it covers all datasets at the URL together. The full report is in the [SHACL validation report](#shacl-validation-report) graph. |

### `schema:Dataset`

Each dataset that is found at the `schema:EntryPoint` registration URL gets added as a
`schema:Dataset` to the
[Registrations graph](https://qlever.netwerkdigitaalerfgoed.nl/datasetregister/NwXonb?exec=true).

| Property                                           | Description                                                     |
| -------------------------------------------------- | --------------------------------------------------------------- |
| [`schema:dateRead`](https://schema.org/dateRead)   | UTC datetime when the dataset was last read by the application. |
| [`schema:subjectOf`](https://schema.org/subjectOf) | From which registration URL the dataset was read.               |

### `schema:Rating`

A separate named graph keeps a `schema:Rating` for each dataset description, reached from a
dataset via the `schema:contentRating` property. It is the **completeness rating**, indicating
how complete the description is (which recommended properties it provides).

| Property                                                           | Description                                                    |
| ------------------------------------------------------------------ | ------------------------------------------------------------- |
| [`schema:bestRating`](https://schema.org/bestRating)               | The highest possible rating (`100`).                          |
| [`schema:worstRating`](https://schema.org/worstRating)             | The lowest possible rating.                                   |
| [`schema:ratingValue`](https://schema.org/ratingValue)             | The completeness score.                                       |
| [`schema:ratingExplanation`](https://schema.org/ratingExplanation) | Explanation for the rating: which properties are missing?     |

:::note
Validation warnings used to be kept here as a second `schema:Rating`. They are now recorded per
registration as [`nde:warningCount`](#schemaentrypoint) — warnings concern the whole registration,
not an individual dataset — with the full report in the [SHACL validation report](#shacl-validation-report)
graph.
:::

## SHACL validation report

On every crawl, the register stores the full SHACL validation report for each registration’s
description in a dedicated named graph, one per registration URL:

```text
https://data.netwerkdigitaalerfgoed.nl/registry/shacl-validation/<URL-encoded registration URL>
```

For example, the report for `https://example.com/datacatalog` lives in the graph
`https://data.netwerkdigitaalerfgoed.nl/registry/shacl-validation/https%3A%2F%2Fexample.com%2Fdatacatalog`.

The graph holds the same `sh:ValidationReport` the [validation endpoint](validation.md) returns —
the report of validating the publisher’s description as fetched, covering every dataset at the URL.
It is **enrichment data produced by the register**, replaced in full on each crawl, so it always
reflects the latest validation. The [`nde:warningCount`](#schemaentrypoint) on the registration is a
denormalised count of the `sh:Warning`-severity results in this report, kept on the registration so
applications can filter on it without reading the report.

## Distribution health

For every distribution URL referenced by a registered dataset, the crawler periodically issues a probe (an HTTP `HEAD`/`GET` or a SPARQL `ASK`, depending on the distribution type) and records the outcome in a dedicated named graph:

```text
https://datasetregister.netwerkdigitaalerfgoed.nl/sparql/distribution-health
```

Distribution health is **enrichment data produced by the register**, not metadata supplied by publishers. Keeping it in its own named graph – parallel to the dataset and registration graphs – makes that origin explicit: consumers can opt in or out of it cleanly, and the register can re-probe, prune, or reset the data without touching the published DCAT description.

Vocabulary prefix: `nde-probe: <https://def.nde.nl/probe#>`.

### `nde-probe:DistributionHealthRecord`

Each probed URL appears as a `nde-probe:DistributionHealthRecord` whose IRI **is** the distribution URL itself.

| Property                       | Data type / notes                                                                                                                                                                              | Cardinality |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `nde-probe:lastProbedAt`       | `xsd:dateTime` — UTC timestamp of the most recent probe attempt.                                                                                                                                | 1..1        |
| `nde-probe:lastOutcome`        | Outcome IRI of the last probe; absent when the last probe succeeded. One of the IRIs listed under [Probe outcomes](#probe-outcomes) below.                                                     | 0..1        |
| `nde-probe:lastSuccessAt`      | `xsd:dateTime` — UTC timestamp of the most recent successful probe, if any.                                                                                                                     | 0..1        |
| `nde-probe:firstFailureAt`     | `xsd:dateTime` — UTC timestamp at which the current failure streak began. Cleared on the next success.                                                                                          | 0..1        |
| `nde-probe:consecutiveFailures`| `xsd:integer` — length of the current failure streak. Reset to `0` on the next success.                                                                                                         | 1..1        |
| `nde-probe:sourceFingerprint`  | `xsd:string` — opaque source-change fingerprint observed on the last probe (the most recent of the declared `dct:modified` and the HTTP `Last-Modified`, combined with the byte size). The shared key the [validity](#distribution-validity) staleness gate compares against. Absent when none could be derived (e.g. a SPARQL endpoint). | 0..1 |

### Probe outcomes

When a probe fails, `nde-probe:lastOutcome` is one of:

| Outcome IRI                          | Meaning                                                                                       |
| ------------------------------------ | --------------------------------------------------------------------------------------------- |
| `nde-probe:NetworkError`             | Connection refused, DNS failure, TLS error, timeout, or any other non-HTTP transport failure. |
| `nde-probe:NotFound`                 | HTTP `404` or `410`.                                                                          |
| `nde-probe:ServerError`              | HTTP `5xx`.                                                                                   |
| `nde-probe:AuthRequired`             | HTTP `401` or `403`.                                                                          |
| `nde-probe:RateLimited`              | HTTP `429`.                                                                                   |
| `nde-probe:ContentTypeMismatch`      | Response was reachable but served the wrong content type. For a data dump, its `Content-Type` did not match the declared `dcat:mediaType` / `dct:format` / `schema:encodingFormat`. For a SPARQL endpoint, the response was not a SPARQL results media type – most often an HTML page, meaning the access URL points to a SPARQL query web UI rather than the SPARQL protocol endpoint itself. The fix is to put the SPARQL protocol endpoint in `dcat:accessURL` (`schema:contentUrl`) and declare the query UI on `foaf:page` (`schema:documentation`) instead. |
| `nde-probe:ContentTypeMissing`       | Response had no `Content-Type` header at all.                                                 |
| `nde-probe:SparqlProbeFailed`        | The distribution declares a SPARQL endpoint (`dct:conformsTo <https://www.w3.org/TR/sparql11-protocol/>`) but the probe `ASK` query did not return a valid SPARQL result. |

:::note

An empty body and an unparseable body used to be reachability outcomes (`nde-probe:EmptyBody`, `nde-probe:RdfParseFailed`). They no longer are: a fetched body that is empty or does not parse is reachable, and the defect is recorded on the [validity rail](#distribution-validity) instead.

:::

### Effect on validation results

Probe failures also surface in the SHACL validation report as `sh:ValidationResult` nodes. See [Validation: how probe failures appear in the report](validation.md#how-probe-failures-appear-in-the-report) for the constraint components, the extra properties they carry, and how strict each caller (registration, validation, crawler) is.

## Distribution validity

Where [distribution health](#distribution-health) records **reachability**, distribution validity records whether a distribution’s fetched content actually **parses as RDF**. The crawler shallow-validates small RDF dumps (≤ 10 KB Turtle / N-Triples / N-Quads) and records the verdict — for every distribution it attempts, valid or not — as a [DQV](https://www.w3.org/TR/vocab-dqv/) quality measurement in a dedicated named graph:

```text
https://datasetregister.netwerkdigitaalerfgoed.nl/sparql/distribution-validity
```

Like distribution health, this is **enrichment data produced by the register**, kept in its own graph and replaced on every crawl. The same measurement shape is also produced by the [Dataset Knowledge Graph](../dataset-knowledge-graph/index.md), which deep-validates the full distribution; a consumer tells the two apart by which endpoint served the measurement, not by the RDF.

Vocabulary prefixes: `dqv: <http://www.w3.org/ns/dqv#>`, `prov: <http://www.w3.org/ns/prov#>`, `metric: <https://def.nde.nl/metric#>`, `failure: <https://def.nde.nl/failure#>`, `dvf: <https://def.nde.nl/distribution-validity-failure#>`, `probe: <https://def.nde.nl/probe#>`.

### `dqv:QualityMeasurement`

Each validated distribution carries a `dqv:QualityMeasurement` of the boolean metric `metric:distribution-rdf-valid`, computed on the distribution’s access URL — the file itself, because validity is a property of the bytes, not of any dataset’s use of them.

| Property                  | Data type / notes                                                                                                                                  | Cardinality |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `dqv:isMeasurementOf`     | `metric:distribution-rdf-valid`.                                                                                                                    | 1..1        |
| `dqv:computedOn`          | The distribution’s access URL.                                                                                                                      | 1..1        |
| `dqv:value`               | `xsd:boolean` — `true` when the content parsed as RDF, `false` otherwise.                                                                           | 1..1        |
| `prov:generatedAtTime`    | `xsd:dateTime` — when the verdict was produced.                                                                                                     | 1..1        |
| `prov:wasGeneratedBy`     | A `prov:Activity` carrying `prov:wasAssociatedWith` the producer (the register crawler).                                                            | 1..1        |
| `probe:sourceFingerprint` | `xsd:string` — the source fingerprint the verdict was judged against; matched against the [health record](#nde-probedistributionhealthrecord)’s fingerprint by the staleness gate. Absent when none could be derived. | 0..1 |

When the verdict is `false`, the activity additionally `prov:qualifiedUsage` a `prov:Usage` recording why:

| Property          | Data type / notes                                                                                                                      | Cardinality |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `failure:reason`  | A SKOS concept from the `distribution-validity-failure` scheme: `dvf:parse-error` (the content could not be parsed) or `dvf:empty` (it parsed but yielded no triples, or the body was empty). | 1..1 |
| `failure:message` | `xsd:string` — best-effort parser message, where the parser provides one. Advisory only.                                               | 0..1        |

### Usability

`reachability` and `validity` are combined, on read, into a single **usability** verdict — `usable`, `unusable`, or `unknown` — that the [browser](https://datasetregister.netwerkdigitaalerfgoed.nl/) surfaces as a per-distribution badge. The rule is:

- **Reachability dominates:** an unreachable distribution is `unusable` (cause: unreachable), regardless of any validity verdict.
- A reachable distribution with a `false` validity verdict is `unusable` (cause: invalid), with the reason and parser message.
- A reachable distribution with a `true` validity verdict is `usable`.
- **Staleness gate:** a validity verdict applies only while its `probe:sourceFingerprint` still equals the currently-observed one; otherwise it decays to `unknown`, so a since-fixed distribution stops showing as broken.
- **Depth:** a deep (Knowledge Graph) verdict wins over a shallow (register) one; a shallow verdict still counts but is flagged as not yet deeply confirmed.

## Allow list

A registration URL must be on a domain that is allowed before it can be added to the Register.
The allow list lives in the
[`https://data.netwerkdigitaalerfgoed.nl/registry/allowed_domain_names` RDF graph](https://qlever.netwerkdigitaalerfgoed.nl/datasetregister/CYjX1Y?exec=true).
Each entry is a blank node with a single property:

| Property                                                                                        | Description                                                                                                                                                                       |
| ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `https://data.netwerkdigitaalerfgoed.nl/allowed_domain_names/def/domain_name`                   | Literal: either a registrable domain (`example.com`) or a specific subdomain (`sub.example.com`). A registrable domain implicitly covers all its subdomains. |

To modify the allow list, use the [REST API](api.md) (`POST /allowed-domains`); the SPARQL
endpoint is read-only.
