---
title: "A valid description isn’t enough: the Dataset Register now goes deeper"
authors: [ddeboer]
tags: [dataset-register, requirements]
---

Users want access to datasets, not dataset descriptions.
The dataset descriptions that you can search, filter and view in the [Dataset Register](https://datasetregister.netwerkdigitaalerfgoed.nl/en/datasets)
are a means of getting to the dataset’s source data.

<!-- truncate -->

## Dataset descriptions

Valid dataset descriptions are an important enabler for discoverability:
only through reliably and predictably structured definitions can we build the
[Dataset Register search website](https://datasetregister.netwerkdigitaalerfgoed.nl/en/datasets).
That is why the Dataset Register has always checked that descriptions provided by dataset publishers are well-formed, containing the right properties, data types, language tags, a canonical license URI.

But a [dataset description](../docs/glossary.md#dataset-description) is not the dataset;
it only provides metadata about it and points to its distributions:
the files and API endpoints that hold the actual data.
The end goal is never to just discover datasets, but to be actually able to use them,
which is only possible if you can access those distributions.
Checking the description therefore validates only the surface.
To know a dataset is genuinely usable, the Register now goes deeper by retrieving and validating distributions, too.

## What we check

The Register requests each of a distribution’s URLs (`schema:contentUrl`, or `dcat:accessURL` / `dcat:downloadURL` for DCAT) and accepts it only when:

- **It resolves:** the URL returns a successful (2xx) HTTP response within 5 seconds.
- **It serves what it declares:** the server’s content type matches the declared `schema:encodingFormat`; declaring `text/turtle` while the server answers `text/html` misdirects any consumer that trusts the format. Compressed downloads count: `text/turtle+gzip` is expected to serve the compressed body, suffix included.
- **It contains the data it claims:** an RDF download is valid; it’s neither empty nor malformed. The Register shallow-parses the body and reports a failure with the parser’s own reason, so an HTML error page declared as Turtle no longer slips through.
- **A SPARQL endpoint answers with results:** not a query editor web interface or landing page. When it returns HTML, the Register says what to do: put the query UI in `schema:documentation` (or `foaf:page` for DCAT).

A distribution that fails any of these produces a validation result on the distribution itself, with a readable message.

## How the check works

The probe (the reusable [`@lde/distribution-probe` package](https://www.npmjs.com/package/@lde/distribution-probe)) treats SPARQL endpoints and data dumps differently, because each proves itself differently. Every request has a timeout (5 s default), and the probe classifies all failure conditions.

**SPARQL endpoints** are checked by querying them. The probe sends `POST` with `SELECT * { ?s ?p ?o } LIMIT 1` and `Accept: application/sparql-results+json`, then requires the response `Content-Type` to start with `application/sparql-results+json` and the body to parse as JSON with a `results` object. That rules out an HTML editor or error page served with `200 OK`, which a naive link check would pass.

**Data dumps** are checked without downloading gigabytes. The probe sends `HEAD` with `Accept-Encoding: identity`.
If `Content-Length` is missing or ≤ 10 KB, it follows up with `GET` to inspect the bytes (also catching servers that answer `0` from `HEAD`). For Turtle, N-Triples, and N-Quads it parses that first slice and treats an empty or unparseable body as a defect. Larger bodies and formats that are costly to parse incrementally (RDF/XML, JSON-LD, TriG) are checked at the HTTP level only.

**Politeness is built in.** Since a catalogue often declares many distributions on one host, the probe coalesces identical requests into one, caps requests per host and per dataset, and treats rate-limiting as NDE’s problem, not the data provider’s.

## Reachability, validity, and usability

Two independent signals sit behind these checks ([#2120](https://github.com/netwerk-digitaal-erfgoed/dataset-register/pull/2120)):

- **Reachability:** can the distribution be fetched? The HTTP/SPARQL check above.
- **Validity:** does what comes back parse as RDF? A dump can be perfectly reachable and still be empty or broken RDF.

The Register rolls both into a **usability** badge on each distribution in the browser: **usable**, **unusable** (*unreachable* vs *reachable but invalid*), or **unknown**.

The validity check above is shallow: it parses only the first slice of a dump. The [Dataset Knowledge Graph](https://datasetregister.netwerkdigitaalerfgoed.nl/) goes deeper still, parsing an imported distribution in full and catching parse errors that surface only megabytes into a large file.

## What goes wrong in the wild

Every failure below originates at the source – the provider’s own server, not the Register. The probe only surfaces these problems; it does not cause them. Here is what we have found across the network: in a recent snapshot of ~17,800 distributions across ~2,700 datasets, about **330 (under 2%) failed a reachability probe**, most-to-least common:

1. **Content-type mismatch (~170).** The most common failure by far: the server returns something other than the declared `schema:encodingFormat`. Four in five are the same case – **an HTML page instead of the data**: a login wall, a `200 OK` “not found” page, or a human-facing web page sitting where the file or endpoint should be. *Fix: point the URL at the actual file or endpoint; declare any landing page on `schema:documentation`.*
2. **Server error, `5xx` (~60).** The host is up but the URL errors out – often a download that times out on large dumps. *Fix: serve the file directly and reliably.*
3. **Network error (~45).** The request never completes: DNS, refused connection, TLS, or timeout. Usually a decommissioned or moved host. *Fix: update the URL; check the certificate.*
4. **Authentication required, `401`/`403` (~40).** Behind a login or IP-restricted, so not openly retrievable. *Fix: expose an open copy, or reconsider whether it belongs in an open description.*
5. **Not found, `404`/`410` (~20).** A dead link. *Fix: update or remove the URL.*

Two more show up on the *validity* rail:

- **Empty distributions (~30).** Reachable but returning no RDF triples – an empty or truncated dump. Every invalid-RDF verdict on the network today is this case, not a genuine parse error.
- **SPARQL endpoints answering with the wrong thing.** Endpoints returning `application/json` or another non-results document usually point at an API console or generic JSON API, not the SPARQL protocol endpoint.

Common, easily-fixed flavours of content-type mismatch:

- **RDF/XML regardless of what you declared** (Turtle, N-Triples, JSON-LD, N-Quads). Declare what the server serves, or fix content negotiation.
- **Compression mismatch** – declaring `application/n-triples` while serving `application/n-triples+gzip` (or vice versa). Declare the suffix (`+gzip`/`+zip`).
- **`application/octet-stream` or a bare `application/zip` / `application/gzip`**. A generic binary type says nothing about the data. Declare the real media type.

The reachability figures above are de-duplicated, one verdict per endpoint. The v2.0 declaration-level SPARQL warnings occur far more often in raw counts, but a few very large catalogues repeating one distribution shape dominate that total, so it is not comparable here.

## Where this runs

The probe behaves differently on the two paths, which is what keeps the change from being disruptive:

- **At registration and in the validator (strict).** Registering or [validating](https://datasetregister.netwerkdigitaalerfgoed.nl/en/validate) a description makes every probe failure, including an empty or invalid dump, a **violation**: the description is rejected. This is where a faulty distribution should stop you, since you are actively publishing. (Probing takes real network time, so the validator now streams progress instead of leaving you on a hanging page.)
- **During crawling (lenient).** For already-registered datasets, a probe failure is only a **warning** and an invalid dump is recorded, not rejected. A grace window absorbs transient failures – a distribution must stay broken for a sustained period before the warning fires – while deterministic defects (empty body, unparseable graph, wrong content type) are reported within one crawl.

The upshot: **no dataset already in the Register is kicked out because a server had a bad moment.**

## Will this affect data providers?

For almost everyone, no.
A well-formed description whose distributions resolve and serve what they claim is accepted exactly as before; nothing in the accepted vocabulary, cardinalities, or datatypes changed. The one new way to be turned away is a distribution that genuinely does not work, and even then the reach is deliberately narrow:

- registered datasets are never retroactively invalidated (the crawler only warns);
- the grace window absorbs transient outages;
- rate-limiting – the one failure that is our fault – can never fail you;
- the check bites only while you actively publish, when a broken distribution is cheapest to fix.

In effect the Register now verifies a promise the metadata always made: a description pointing at a dead URL, or misdeclaring its format, was never *usable* – we simply could not see the defect before.

## What to do now

1. **[Validate](https://datasetregister.netwerkdigitaalerfgoed.nl/en/validate) your descriptions.** The report now link-checks each distribution and tells you whether it resolves and serves the declared type.
2. **Check SPARQL distributions.** `schema:contentUrl` should point at the protocol endpoint, not the query editor, with the SPARQL protocol URI in `schema:usageInfo`.
3. **Confirm content types**, including the `+gzip`/`+zip` suffix for compressed dumps.
4. **Keep publishing.** Nothing changes for working distributions, and already-registered datasets stay put through a server’s off day.

If you cannot get a distribution format (say a SPARQL endpoint) to work, drop it from your dataset description for now – users gain nothing from a broken endpoint.
