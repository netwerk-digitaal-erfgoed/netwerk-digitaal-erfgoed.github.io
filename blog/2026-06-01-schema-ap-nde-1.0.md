---
title: NDE releases SCHEMA-AP-NDE 1.0
authors: [ddeboer]
tags: [rdf, requirements]
---

Today NDE releases **[SCHEMA-AP-NDE](https://docs.nde.nl/schema-profile/) 1.0**: the first stable version of the Schema.org Application Profile every dataset in the Dutch cultural heritage network is expected to publish. It comes with a **backward compatibility promise**: as long as we stay on 1.x, data that conforms keeps conforming, and software built against it keeps working.

That is what a 1.0 really is: not just a number, but a **signal of stability**. It is worth asking what that promise means for a specification, and why a shared profile needs a version number at all.

<!--truncate-->

## Why a profile at all?

[Schema.org](https://schema.org) is the web’s most widely adopted vocabulary, and that is exactly its weakness as a contract: it is **permissive**. It lets you describe the same painting in a dozen valid-but-incompatible ways: a creator as a string here, a `Person` URI there; a language written `Nederlands` in one collection and a BCP-47 `nl` in the next; a place name typed by hand instead of linked to [GeoNames](https://www.geonames.org/). All legal Schema.org; none of it composes across institutions.

An **application profile** closes that gap. SCHEMA-AP-NDE takes the slice of Schema.org that heritage data needs and pins down *one* agreed way to say each thing. It is **SHACL-first**: the [SHACL shapes](https://github.com/netwerk-digitaal-erfgoed/schema-profile) are the source of truth, the readable [specification](https://docs.nde.nl/schema-profile/) is generated from them, and your data is validated against those shapes, so the document and the validation can never drift apart. The [Dataset Knowledge Graph](/services/dataset-knowledge-graph) reports per-dataset conformance, and the [Dataset Register](https://datasetregister.netwerkdigitaalerfgoed.nl/?lang=en) will surface it on each dataset’s page.

The payoff is structural. The profile is a **lingua franca**: one shared shape every party translates to and from. Without it, *n* [data providers](/glossary#data-provider) and *m* [service platforms](/glossary#service-platform) need a mapping for every pair: an O(n×m) problem. With it, everyone maps to one shape and it collapses to O(n+m). That is the difference between a *network* and a tangle of bilateral integrations, and it is what makes cross-collection search possible at all.

It is deliberately a **minimum, not a ceiling**: it will never capture the full expressive range of GLAM data, and isn’t meant to. Rich domain semantics live in parallel data models (Linked Art, RiC-O, and others) published *alongside* it. The profile is the floor everyone shares.

## Why 1.0?

1.0 caps nearly two years of proposals, feedback, and deliberation over thorny modelling questions: how to link to controlled-vocabulary [terms](/glossary#term), how to model IIIF and creator, which properties to make required and which optional.

Feedback came in steadily, by mail and through the [issue tracker](https://github.com/netwerk-digitaal-erfgoed/schema-profile/issues?q=is%3Aissue%20state%3Aclosed), from more than twenty people across heritage institutions, software vendors, and the linked data community – input that shaped 1.0 as much as anything we wrote ourselves.
Many were clarifying questions; rather than leave the answers in private replies, we folded them back into the profile as clarifications, examples, and guidance.

And it was never a paper exercise: through its 0.x life the application profile has been **taken up** by five collection systems and software vendors, and five heritage institutions and platforms, so 1.0 ends that churn and stabilises the profile the network already uses, rather than introducing a new one.

A version number is, first and foremost, **a means of coordination**. SCHEMA-AP-NDE sits between many independent parties – publishers, collection management system vendors, the Dataset Register, the Dataset Knowledge Graph, and the service platforms that consume the data – none of which can move in lockstep. A named, frozen version is what they each point at: a dataset declares conformance with [`schema:usageInfo`](https://docs.nde.nl/requirements-datasets/#developer-docs), a vendor certifies “we produce 1.0”, and a consumer simply reads 1.x data, trusting it won’t shift underneath them. Everyone is working to the same contract, by name.

1.0 marks the profile **leaving draft**: the message changes from “this might shift under you” to “the ground is stable; build here” – less a technical milestone than the network agreeing on a baseline.

## What does “backward compatible” mean?

In software, the rule is intuitive: stay within a major version and everything built on it keeps working. For a *data* specification it is subtler, because a profile answers to **two audiences, and one change can land differently on each**:

- **Producers** (publishers): data valid yesterday should still validate today.
- **Consumers** (service platforms): software that read the data yesterday should still read it today.

A change is safe only if it leaves both intact:

- **Adding an optional property** is safe for producers: nothing becomes invalid. In RDF it is usually safe for consumers too: one that doesn’t ask for the new property never sees it. It bites only a consumer that rejects anything unexpected – say, by validating against a *closed* shape – which is exactly what the must-ignore rule below rules out.
- **Tightening a constraint** (a recommended property made required, a string made a mandatory URI) doesn’t break a consumer’s code, since stricter data still satisfies it, but it **breaks producers**: conformant data is suddenly rejected. And since consumers get their data from producers, the break reaches them too: the data may simply stop arriving.

So 1.x lives within two rules:

1. **No previously-valid data becomes invalid.** Changes are additive or relaxing, never tightening; anything that would reject conformant 1.0 data waits for 2.0.
2. **Consumers must ignore what they don’t recognise** rather than failing on it: the same discipline that let the web’s own formats, HTML and HTTP, keep evolving for decades without ever forcing everyone to upgrade at once, and the [robustness principle](https://en.wikipedia.org/wiki/Robustness_principle) we lean on elsewhere: strict in what you publish, liberal in what you accept.

Together: *no data you publish today stops conforming, and no consumer that played by the rules needs to change, until we cross to 2.0.*

## What makes the promise real

Because the profile is shared by everyone, a breaking change doesn’t inconvenience one team; it ripples to every data provider, service platform, and presentation layer at once. A compatibility promise is what lets those parties evolve on their *own* schedules instead of being forced into a synchronised migration. For a lingua franca, stability is the feature.

But it means something only with two things attached, or it decays into a fiction or a straitjacket:

- **A precise definition of “compatible”**: the producer/consumer split above. A promise that doesn’t say *whose* compatibility it protects isn’t much of a promise.
- **A real major-version path**: the promise is not a vow never to break compatibility – it is a vow to break it *visibly*, at a 2.0 boundary, with notice and a migration window. Without a credible way to eventually break it, the promise is empty.

Because the profile is SHACL-first, the promise is enforceable rather than merely asserted: the shapes are executable, so a new version can be checked against everything that conforms today, and any change that would break it surfaces before release.

A note on scope: SCHEMA-AP-NDE governs a dataset’s *contents*, while a separate spec, the [Requirements for Datasets](https://docs.nde.nl/requirements-datasets/), governs its *description* – the metadata about it. That sibling spec is making exactly such a breaking change in its [v2.0](./2026-04-15-dataset-requirements-v2.md), announced ahead of time with a migration window to **3 May 2027**. SCHEMA-AP-NDE’s own next major version will be handled the same way.

## Why now: _Versnellen_ 2026

The timing isn’t incidental. This year’s **[_Versnellen_ 2026 programme](https://netwerkdigitaalerfgoed.nl/versnellen-2026/)** – funded by the Ministry of Education, Culture and Science (OCW), in its final year – helps institutions that already reach the public through Collectie Nederland, Oorlogsbronnen, or Europeana move to an [NDE-compatible](/glossary#nde-compatible) collection management system. “NDE-compatible” means the system produces conformant data, and **SCHEMA-AP-NDE is the contract**. Systems acquired, upgraded, or jointly adopted through the programme are expected to publish 1.0.

That is why a *stable* 1.0 matters now. An applicant isn’t making a one-afternoon change; it is committing to a system for years, often shared with others in its region. Investing against a moving target would be unfair; investing against a frozen 1.0 is building on solid ground. Nearly 200 organisations have already made this transition in earlier rounds. The premise of Versnellen – public money spent once, on standards that keep paying off – only holds if the standard is durable; 1.0 is that durability.

It also widens the audience a dataset can reach. Because every collection arrives in the one shared shape, NDE can map SCHEMA-AP-NDE to the [Europeana Data Model (EDM)](https://pro.europeana.eu/page/edm-documentation) once (centrally by NDE, or by the publisher using software NDE provides for free) so any conformant dataset flows on to a European audience without anyone writing their own export. Conform once, reach further.

## What this means for you

- **Publishers and vendors:** a collection manager filling in records never has to think about “1.0”, as conformance is the system’s job. Vendors build against 1.x with confidence: they trust that application profile changes won’t invalidate what the system already produces. The only change that can affect producers arrives at a major version, announced in advance – never as a surprise. And if a service platform lets you know your data isn’t conforming yet, contact your vendor – the same step the [Requirements for Datasets v2.0](./2026-04-15-dataset-requirements-v2.md) asks of publishers – since producing conformant data is the system’s job, and closing the gap is something you depend on your vendor to do.
- **Consumers and service platforms:** rely on the shape and honour the must-ignore rule – skip what you don’t recognise rather than failing on it. Do that, and forward compatibility is yours: your software keeps reading every 1.x dataset, and new properties only ever add to what you can use.
