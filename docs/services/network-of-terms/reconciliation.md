---
sidebar_position: 2
---

# Reconciliation API

Use the [Reconciliation Service API](https://www.w3.org/community/reports/reconciliation/CG-FINAL-specs-0.2-20230410/)
to **match and reconcile textual strings in your data with [terms](../../glossary.md#term)**.

The Network of Terms implements **version 0.2** of the Reconciliation Service API
(W3C Entity Reconciliation Community Group Final Report, 10 April 2023). Version 1.0
of the specification is still a draft and is not yet supported.

If you want to use the Reconciliation Service API, configure one or more service endpoints in your
[OpenRefine](https://openrefine.org) application. An endpoint’s URL is structured like
`https://termennetwerk-api.netwerkdigitaalerfgoed.nl/reconcile/{sourceUri}`. A full list of endpoints can be found on
the [Network of Terms website](https://termennetwerk.netwerkdigitaalerfgoed.nl/reconciliation).

Note that the Network of Terms provides Reconciliation endpoints only for terminology sources that do not offer such
endpoints themselves.

## Language selection

Reconciliation endpoints honor the standard `Accept-Language` HTTP header for content
negotiation. Clients send a ranked list of preferences (e.g. `en, nl;q=0.8`); the
server picks a single best match. Currently honored values are `nl` and `en`; the
default and fallback when nothing matches is `nl`.

The header controls:

* `name` and `description` of every candidate returned by `/reconcile/{sourceUri}`
* Values returned by the data-extension endpoint `/extend` (and `/reconcile/{sourceUri}/extend`)
* The HTML preview at `/preview/*`
* Service manifest labels (column titles, suggest service titles, etc.)

The v0.2 specification does not define a per-query language field; the HTTP header is
the only knob. The v1.0 draft introduces a per-query `lang` field – when that
specification stabilizes and OpenRefine adopts it, we will revisit support for it here.

### Example

A minimal reconciliation query against the Cultuurhistorische Thesaurus (CHT), asking
for English candidate labels:

```bash
curl -X POST \
  -H 'Accept-Language: en' \
  -d 'queries={"q0":{"query":"fiets"}}' \
  https://termennetwerk-api.netwerkdigitaalerfgoed.nl/reconcile/https://data.cultureelerfgoed.nl/term/id/cht
```

The response is a JSON object keyed by the query identifier (`q0`), with each candidate’s
`name` and `description` returned in English where available, falling back to whatever
the source provides otherwise.
