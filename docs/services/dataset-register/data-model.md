---
sidebar_position: 3
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
| [`dcat:keyword`](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/#dataset-keyword) | `rdf:langString` | 0..n |
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

### `schema:Dataset`

Each dataset that is found at the `schema:EntryPoint` registration URL gets added as a
`schema:Dataset` to the
[Registrations graph](https://qlever.netwerkdigitaalerfgoed.nl/datasetregister/NwXonb?exec=true).

| Property                                           | Description                                                     |
| -------------------------------------------------- | --------------------------------------------------------------- |
| [`schema:dateRead`](https://schema.org/dateRead)   | UTC datetime when the dataset was last read by the application. |
| [`schema:subjectOf`](https://schema.org/subjectOf) | From which registration URL the dataset was read.               |

### `schema:Rating`

A separate named graph keeps a `schema:Rating` instance for each dataset description, indicating
how complete the description is. Reach it from a dataset via the `schema:contentRating` property.

| Property                                                           | Description                                               |
| ------------------------------------------------------------------ | --------------------------------------------------------- |
| [`schema:bestRating`](https://schema.org/bestRating)               | The highest possible rating.                              |
| [`schema:worstRating`](https://schema.org/worstRating)             | The lowest possible rating.                               |
| [`schema:ratingValue`](https://schema.org/ratingValue)             | Rating for the dataset description.                       |
| [`schema:ratingExplanation`](https://schema.org/ratingExplanation) | Explanation for the rating: which properties are missing? |

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

### Probe outcomes

When a probe fails, `nde-probe:lastOutcome` is one of:

| Outcome IRI                          | Meaning                                                                                       |
| ------------------------------------ | --------------------------------------------------------------------------------------------- |
| `nde-probe:NetworkError`             | Connection refused, DNS failure, TLS error, timeout, or any other non-HTTP transport failure. |
| `nde-probe:NotFound`                 | HTTP `404` or `410`.                                                                          |
| `nde-probe:ServerError`              | HTTP `5xx`.                                                                                   |
| `nde-probe:AuthRequired`             | HTTP `401` or `403`.                                                                          |
| `nde-probe:RateLimited`              | HTTP `429`.                                                                                   |
| `nde-probe:ContentTypeMismatch`      | Response was reachable but its `Content-Type` did not match the declared `dcat:mediaType` / `dct:format` / `schema:encodingFormat`. |
| `nde-probe:ContentTypeMissing`       | Response had no `Content-Type` header at all.                                                 |
| `nde-probe:EmptyBody`                | Response body was empty for a distribution that should have returned data.                    |
| `nde-probe:SparqlProbeFailed`        | The distribution declares a SPARQL endpoint (`dct:conformsTo <https://www.w3.org/TR/sparql11-protocol/>`) but the probe `ASK` query did not return a valid SPARQL result. |
| `nde-probe:RdfParseFailed`           | The body was returned but could not be parsed as RDF.                                         |

### Effect on validation results

Probe failures surface in the SHACL [validation report](api.md#validation-results) as additional `sh:ValidationResult` nodes, with one of two probe-specific constraint components on `sh:sourceConstraintComponent`:

- `nde-probe:DistributionReachableConstraintComponent` — the URL itself could not be retrieved.
- `nde-probe:DistributionFormatMatchConstraintComponent` — the URL was retrieved but the response did not match the declared media type / format.

Probe-emitted results carry these extra properties beyond the standard SHACL ones:

| Property                         | Description                                                                            |
| -------------------------------- | -------------------------------------------------------------------------------------- |
| `nde-probe:probeOutcome`         | One of the outcome IRIs in the table above.                                            |
| `nde-probe:firstFailureAt`       | `xsd:dateTime` — copied from the health record, so consumers see how long the URL has been failing without joining the health graph. Present only on crawler-emitted results. |
| `nde-probe:consecutiveFailures`  | `xsd:integer` — length of the current failure streak. Present only on crawler-emitted results. |

The REST API and the crawler differ in how strict they are about probe failures:

- **REST API** (`POST /datasets`, `POST/PUT /datasets/validate`): any failed probe is emitted at `sh:Violation` immediately. A registration with a broken distribution URL is rejected synchronously with HTTP `400`.
- **Crawler**: probes run every crawl round but are only promoted to `sh:Violation` once `nde-probe:firstFailureAt` is older than the failure-streak threshold (default 7 days). Transient blips do not flip a dataset to invalid.

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
