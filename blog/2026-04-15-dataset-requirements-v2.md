---
title: Upcoming changes to the Requirements for Datasets
authors: [ddeboer]
tags: [dataset-register, requirements]
---

Version 2.0 of the [Requirements for Datasets](https://docs.nde.nl/requirements-datasets/) is on the horizon. It tightens rules that are warnings today into full requirements, aligns the Dataset Register with [DCAT-AP-NL 3.0](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/), and raises the baseline quality of dataset descriptions across the Dutch cultural heritage network. Publishers and collection management system vendors have until **Monday 3 May 2027** to prepare.

<!-- truncate -->

## Why we’re making these changes

The upcoming changes share a handful of underlying themes, each aimed at making heritage data more useful, more findable, and more interoperable.

### Alignment with DCAT, DCAT-AP, and DCAT-AP-NL 3.0

A short orientation: [**DCAT**](https://www.w3.org/TR/vocab-dcat-3/) is the W3C base vocabulary for describing datasets; [**DCAT-AP**](https://semiceu.github.io/DCAT-AP/releases/3.0.0/) is the European application profile that decides which DCAT properties are mandatory and pins controlled vocabularies to EU Authority Tables; [**DCAT-AP-NL 3.0**](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/) (Geonovum) is the Dutch national layer on top, with additional mandatory properties and NL-specific conventions like the Creative Commons mandate for licenses. Most heritage publishers never need to touch any of these directly – the Register handles the conversion from Schema.org – but they’re the reason version 2.0 asks for the structure it does.

The Dataset Register is fully prepared to output [DCAT-AP-NL 3.0](https://docs.geostandaarden.nl/dcat/dcat-ap-nl30/) data: it has adopted DCAT-AP-NL as its internal model and converts incoming Schema.org descriptions to DCAT on ingest. But the output can only be as complete as the input. Without a publisher, a contact point, a license on each distribution, or controlled vocabularies for language and spatial coverage, the Register cannot emit a fully conformant description. Version 2.0 closes that gap by asking publishers and their collection management system vendors to supply these properties.

This matters beyond government. DCAT-AP-NL started life as a profile for Dutch public-sector data, but it has become the lingua franca for any dataset catalogued by a Dutch data portal. The [EU Data Portal](https://data.europa.eu/) harvests national portals across Europe, and national portals in turn harvest sources like the Dataset Register. When a heritage institution’s dataset description conforms to DCAT-AP-NL, it flows through that chain automatically: it shows up alongside government data, research data, and data from other EU member states, discoverable in the same searches and usable by the same tools. Heritage collections are not government data, but they share the same audience of researchers, journalists, educators, and developers who increasingly expect to find everything in one place.

Conformance also protects publishers from having to maintain multiple flavours of the same metadata. Publishing once, in a single format that satisfies DCAT, DCAT-AP, and DCAT-AP-NL, is less work than maintaining bespoke exports for each consumer.

### Schema.org in, fully compliant DCAT out

Heritage publishers overwhelmingly use [Schema.org](https://schema.org) – for example as JSON-LD embedded in their web pages – because it is what search engines understand and what their content management systems already produce. We want to keep it that way. The Dataset Register converts Schema.org input to DCAT internally, filling in sensible defaults (access rights, EU themes, language URIs) so that publishers get a fully DCAT-AP-NL-compliant description without having to learn DCAT themselves.

Version 2.0 sharpens this contract. The Schema.org side stays familiar, but we ask for a little more structure at the edges – language tags on names and descriptions, IRIs instead of plain strings for places and catalogues – so that the generated DCAT is unambiguous and complete.

Where the Register *can* fill in a DCAT-AP-NL-mandatory property without publisher input, it does. Two examples illustrate how much compliance burden the Register absorbs on behalf of vendors and publishers:

- **`dct:identifier`** is mandatory in DCAT-AP-NL, but we auto-derive it from the dataset IRI during conversion. Since every dataset already has a resolvable IRI (which the Dataset Register requires), asking publishers to repeat it as a separate triple would be pure ceremony.
- **`dct:accessRights`** is likewise mandatory. Publishers don’t have to supply it; we default to `PUBLIC` on ingest. When they *do* supply it, the SHACL validates that the value is one of the three EU Access Rights vocabulary IRIs (`PUBLIC`, `RESTRICTED`, `NON_PUBLIC`).

The pattern here is deliberate: we tighten input validation only where the publisher must supply information that the Register genuinely cannot derive. Everything derivable, we derive.

### Linked data quality

Most of the other changes are about turning strings into links (terms). A place name typed as text tells a human something; an IRI to [GeoNames](https://www.geonames.org/) tells a machine how to federate, aggregate, translate, and visualise. The same goes for catalogues, update frequencies, access rights, and documentation URLs. Each IRI we require today makes a dataset description a first-class citizen of the web of data rather than a self-contained document.

Language tags belong to the same family. A title like `"Middeleeuwse handschriften"` without a language tag forces consumers to guess. A tag like `@nl` removes the guesswork, enables multilingual display, and makes it possible to add an English or Frisian translation later without breaking anything.

## What changes in v2.0

The Dataset Register’s SHACL shapes already flag all of these as warnings. In v2.0 they become violations – meaning the Dataset Register will reject descriptions that don’t comply.

### Required properties

The following properties move from *recommended* to *required*:

- `schema:creator` (`dct:creator`) – the person or organisation that created the dataset.
- `schema:publisher` (`dct:publisher`) – the publisher of the dataset and of the catalogue.
- `schema:contactPoint` (`dcat:contactPoint`) – a contact point on the publishing organisation, both on datasets and on catalogues.
- `schema:description` (`dct:description`) – a free-text description becomes mandatory on datasets, distributions, and catalogues. The discoverability of a dataset depends in large part on the quality of its description, so this isn’t just a formality: a missing or perfunctory description means the dataset is harder to find, evaluate, and reuse.
- `schema:license` (`dct:license`) on each distribution – inherited from the dataset when not specified, to keep Schema.org publishers unaffected.

### Typed values

- **Language tags.** `schema:name` and `schema:description` (and the DCAT equivalents `dct:title`, `dct:description`, `foaf:name`) must be `rdf:langString` (i.e. carry a language tag like `@nl` or `@en`).
- **IRIs, not strings.** `schema:spatialCoverage` (`dct:spatial`), `schema:includedInDataCatalog`, and `schema:usageInfo` must be HTTP(S) IRIs.
- **Canonical license URIs.** `schema:license` (`dct:license`) must be an IRI (no literals), and must be one of the canonical Creative Commons URIs from the [DCAT-AP-NL license waardelijst](https://definities.geostandaarden.nl/dcat-ap-nl/id/waardelijst/licenties).
- **BCP 47 languages.** `schema:inLanguage` must use a BCP 47 code (on the DCAT side, `dct:language` becomes an EU Language Authority IRI).
- **Single media type.** `schema:encodingFormat` (`dcat:mediaType`) is restricted to one value per distribution.
- **Typed content URLs.** `schema:contentUrl` on distributions must be an `xsd:anyURI` literal.
- **ISO-8601 dates.** All date properties – `schema:datePublished`, `schema:dateCreated`, `schema:dateModified` (and the DCAT equivalents `dct:issued`, `dct:created`, `dct:modified`) – must be valid ISO-8601 (`YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SS` with optional timezone).

### Download vs. API distributions

Version 2.0 distinguishes downloads from APIs more clearly:

- A **download distribution** (an RDF dump, CSV, ZIP, etc.) *must* carry `schema:encodingFormat` (a single MIME type from [IANA](https://www.iana.org/assignments/media-types/), e.g. `application/n-triples`) and *may* carry `schema:usageInfo` pointing to the application profile, vocabulary, or ontology that the data conforms to.
- An **API distribution** (SPARQL endpoint, OAI-PMH, REST) *must* carry `schema:usageInfo` linking to the protocol specification – the response media type varies per request, so a single `schema:encodingFormat` is meaningless. `schema:usageInfo` here typically links to the API spec URI and, if relevant, to the data model the API exposes.

### What this means for publishers

If your dataset descriptions are already free of Dataset Register validation *warnings*, you are already compliant with v2.0 – nothing to do. If you see warnings in your validation report, those are exactly the items that will become blocking on 3 May 2027. Version 2.0 introduces no new rules that aren’t already announced as warnings today.

Most publishers will find the work concentrated in a few places: adding language tags to titles and descriptions, swapping place-name strings for GeoNames IRIs, and making sure every distribution carries a canonical license URI. The Dataset Register’s validation report lists each item with a plain-language message and a link to the relevant section of the requirements.

### What this means for vendors

Collection management system vendors have a specific role to play. The new [Requirements for Dataset Register Implementations](https://docs.nde.nl/requirements-dataset-register-implementations/) ask vendors to [surface SHACL warnings](https://docs.nde.nl/requirements-dataset-register-implementations/#validate-dataset-descriptions) to collection managers ahead of time and to add form fields for upcoming requirements as soon as they are announced – so that users of those systems can prepare without ever seeing a validation failure. This is the [migration path for new requirements](https://docs.nde.nl/requirements-collection-management-systems/#staying-up-to-date) described in the broader Requirements for Collection Management Systems. Version 2.0 is the first major version since those requirements were published; it is also the first test of that migration path.

Several of the v2.0 rules can’t be met by collection managers alone – they require system-level support from the vendor. The clearest example is language tags: a collection manager typing a title into a text field has no way to attach `@nl` or `@en` to the value unless the system provides it. Vendors will need to either offer multilingual input (a tab or toggle per language), or, at minimum, tag all outgoing values with a default language derived from the organisation’s settings or the interface locale. The same applies to IRI-valued properties like `schema:spatialCoverage` and `schema:includedInDataCatalog`: the system needs to offer a picker (e.g. against GeoNames or the Network of Terms) rather than a free-text field. Canonical license URIs, single-value constraints on media type, and typed `xsd:anyURI` content URLs likewise depend on form design and output serialisation that only the vendor can control.

## The migration window

The deadline is **Monday 3 May 2027**. That gives publishers and vendors over a year from the publication of this post to prepare.

Until that date, the current warnings remain warnings: the Dataset Register continues to accept descriptions that don’t yet meet the v2.0 rules, and surfaces them in the validation report so publishers can see what to fix. On 3 May 2027 those warnings become violations, and new or updated descriptions that don’t comply will be rejected.

## What to do now

1. **Check your dataset descriptions** with the [validator](https://datasetregister.netwerkdigitaalerfgoed.nl/validate.php?lang=en). The validation report already flags every v2.0 item as a warning.
2. **Talk to your vendor** if you use a collection management system. Ask whether they are tracking the [Requirements for Dataset Register Implementations](https://docs.nde.nl/requirements-dataset-register-implementations/) and how they plan to surface v2.0 warnings in their forms.
3. **Follow this blog** for further updates as the deadline approaches.
