---
description: Testing for NDE compatibility
---

# Testing for NDE compatibility

![alt_text](/img/test-cover.png "Cover image")

## Introduction

When a supplier delivers a collection management system (CMS), it is up to the client to determine whether the system meets the stated requirements and expectations. From the perspective of the Dutch Digital Heritage Network (NDE), the following requirements are relevant:

* [Requirements for Collection Management Systems](https://docs.nde.nl/requirements-collection-management-systems/) specifying what requirements a collection management system must meet;
* [Requirements for Datasets](https://docs.nde.nl/requirements-datasets/) specifying the format of dataset descriptions;
* [Schema.org Application Profile](https://docs.nde.nl/schema-profile/) specifying the format of the heritage data to be published.

NDE maintains close contact with suppliers and focuses on individual implementations to determine NDE compatibility. This document provides guidance for heritage institutions, suppliers, digital heritage coaches, data workshops and independent heritage specialists to assess whether a specific CMS implementation at a heritage institution results in an NDE-compatible system. Data workshops, digital heritage coaches and independent heritage specialists can play a supporting role. However, it remains the responsibility of the heritage institution to determine that what they have procured meets their requirements and expectations.

## NDE compatibility

The 5 requirements for NDE compatibility stem from the objectives of the National Strategy for Digital Heritage and are in line with the Digital Heritage Reference Architecture ([DERA](https://dera.netwerkdigitaalerfgoed.nl/index.php/Hoofdpagina)):

✅ Datasets findable via the Dataset Register \
✅ Use of persistent identifiers \
✅ Publishes linked open data \
✅ Links to URIs of standardised terms via the Network of Terms \
✅ Uses IIIF for access to image collections

## Acceptance and regression testing

When the supplier has indicated that the CMS implementation is complete (from their perspective), it is time to carefully review and test the implementation. Only after an "acceptance test" and any resolved findings is there a completed implementation (which often coincides with payment of a final invoice instalment). The test approach should cover all aspects of the system, from functions to data model, from help texts to look and feel, from domain name to API.

A regression test verifies that existing functionality still works correctly after changes have been made, such as configuration changes, code updates, bug fixes or new features. The goal is to prevent unintended errors (regressions) in already-approved parts of the system. It is recommended to also use this test plan to ensure the system remains NDE-compatible.

## Step-by-step plan

This document describes only how to test the NDE compatibility of the delivered system. The tests are described in such a way that they can be performed with a web browser, without other technical tools. Each test step begins with background information about the topic being tested.

![alt_text](/img/test-stappen.png "Test steps")

The order of the test steps has been carefully considered. If a test step fails, it may be difficult to proceed with subsequent steps. Report the issue to the supplier, describing exactly how and what you tested, preferably with URIs of heritage objects or URLs of collection pages. Once the supplier has resolved an issue, or it turns out not to be an issue, the test step can be repeated. If a test step fails, still try to proceed with the subsequent steps of the test plan.

To keep track of information, the appendix provides a template for a working document. The test report is for the heritage institution; communicate with the supplier via their designated communication channels about specific issues.

## 1. Finding dataset(s) via the Dataset Register

> ***What is a dataset?***
>
> *A dataset (or data collection) is a collection of data (data or metadata). In the context of heritage institutions, this can include data about heritage objects, such as a catalogue, a set of museum objects or a collection of archives or finding aids. This (meta)data is often managed in an archive management or collection management system and made accessible to users via the institution's website in some form. The data can also be shared for reuse, by a service portal or aggregator. The institution's system must make the data available for this purpose via a data dump (export) or API.*
>
> **Source**: [Frequently asked questions about the Dataset Register for dataset managers at heritage institutions](https://datasetregister.netwerkdigitaalerfgoed.nl/faq-beheerders.php)

Testing CMS NDE compatibility starts with the NDE Dataset Register. The Dataset Register provides insight into the availability of datasets in the heritage field and thereby encourages the use of these datasets.

➡️ Open the [NDE Dataset Register](https://datasetregister.netwerkdigitaalerfgoed.nl/?lang=en) in your browser. Go to the search page and search for the dataset(s) of the heritage organisation.

If no datasets from the heritage organisation can be found, this is the first finding that should be reported to the supplier.

If one or more search results are found, this means that the dataset descriptions published online by the heritage organisation (often via the CMS) have been registered with the NDE Dataset Register and are **valid**. In other words, the dataset description fully meets the syntax requirements in the [Requirements for Datasets](https://docs.nde.nl/requirements-datasets/).

When reviewing the search results, you should also ask whether the name of the dataset and the name of the organisation are correct and clear. These are the "products in the shop window" and must therefore be appealing to dataset reusers. If the name of the dataset or organisation is not as desired, this should be corrected — usually within your CMS or by contacting the supplier.

➡️ Click on each search result to view the complete dataset description. Record the URI of the dataset in the working document.

Like an object from the collection, the dataset should be well described for its target audience. This increases the chance that the dataset will be found and reused by service platforms, making your objects even more discoverable. Ask yourself: is the description correct, complete and appealing? Is the licence correct? Is it clear what kind of data it is, what time period it covers, what areas it covers, relevant keywords, what it is derived from, is there a link to a page with more information about the dataset, etc.?

➡️ Under the Metadata heading, find the URL of the dataset description followed by a Validate link — click on it.

The dataset description is valid (the required fields are present), since it has been included in the Dataset Register. But the validation function also provides advice on values to add and warnings about values that will become mandatory in the future!

![alt_text](/img/test-datasetregister-validatie.png "Validation via the Dataset Register")

A dataset contains one or more so-called distributions. These are links to a data dump or an API through which the dataset can actually be downloaded or consulted in a machine-readable way.

➡️ For each dataset description, click on the AccessURL of each distribution. Save the file locally and record the URI and filename in the working document.

Check the contents of the data dump or Application Programming Interface (API) against the media type stated in the dataset description, which must be at least one of the Linked Data formats, such as JSON-LD, N-triples (.nt) and Turtle (.ttl). For example: if the media type states "text/turtle" then the data dump must contain Turtle. You can easily see this by opening the file in an editor such as Notepad (or an [online variant](https://onlinenotepad.org/notepad)).

**Tip**: Turtle is the most human-readable form of RDF/linked data, making it great for visual inspection. Machines work more efficiently with N-triples.

Common APIs include SPARQL, GraphQL and OAI-PMH. Making datasets available via such APIs is not mandatory; however, if datasets are made available via such APIs, they must be listed in one or more dataset descriptions.

**✅ If the expected datasets from your organisation are found in the NDE Dataset Register, the description is complete and clear, and the distributions are downloadable or queryable, this test has passed.**


## 2. Finding and testing persistent identifiers

> ***What are Persistent Identifiers (PIDs)?***
>
> *A Persistent Identifier is a permanent and unique identification code for a digital object (scan, audiovisual file, metadata record, website, etc.). The Persistent Identifier is independent of the storage location. It is a unique identification code registered at an agreed location. The unique identification code ensures that the object can always be found on the internet, even if the name of the object or its storage location changes. This makes an object unambiguously citable and findable at any time and place.*
>
> **Source**: [Frequently asked questions Persistent Identifier Guide](https://www.pidwijzer.nl/veelgestelde-vragen)

During the CMS implementation, the supplier may have asked about your sustainability policy and preferred persistent identifier (PID) system. ARK (via [Arks.org](https://arks.org/)) or Handle (via [SURF](https://www.surf.nl/diensten/publiceren/persistent-identifiers)) are commonly chosen, but using a generic domain name such as [data.bibliotheek.nl](http://data.bibliotheek.nl) with a GUID per object can also suffice. In general, persistent identifiers are a **promise** by the heritage organisation: the object will also be accessible in the future via a persistent web address. This promise is partly policy & organisational and partly technical. This step looks only at the technical part.

An important aspect of linked data is that everything has an HTTP URI (web address). We want to make the use of terms and the interconnection of collections sustainable. Therefore, the HTTP URIs of heritage objects (and terms) must also be persistent. For this reason, rather than PIDs (which can have the form `ark:60537/b3xVzO`), we prefer to speak of persistent HTTP URIs (such as [https://n2t.net/ark:/60537/b3xVzO](https://n2t.net/ark:/60537/b3xVzO)). A persistent HTTP URI typically contains a global resolver such as [n2t.net](https://n2t.net), [arks.org](https://arks.org) or [handle.net](https://handle.net), turning the PID into a real, persistent web address.

In the previous step, linked data was downloaded. Testing a complete RDF data dump using online tooling is difficult: data dumps are often too large and can only be tested in their entirety using offline tools. The tests in steps 2 through 5 will be approached using sampling.

➡️ Open the data dump from the previous step in a programme such as Notepad (or an [online variant](https://onlinenotepad.org/notepad)).

![alt_text](/img/test-notepad-turtle.png "image_tooltip")

➡️ For the sample, collect around 5 persistent HTTP URIs of heritage objects, archival finding aids or works. Record the URIs in the working document.

In a Turtle file, URIs can be recognised as web addresses between angle brackets &lt;>. Select random persistent HTTP URIs (from across the entire data dump) of the institution's own objects — not "external" URIs such as those of terms (which we will examine in step 4). Record the 5 persistent HTTP URIs in a table in a working document (which can also be used for an acceptance test report).

If the persistent HTTP URIs use the ARK system, the registration can be verified. The number after "ark:" is the so-called NAAN (Name Assigning Authority Number), the number specific to the heritage organisation. By requesting the URL https://arks.org/ark:{NAAN} (e.g. [https://arks.org/ark:60537](https://arks.org/ark:60537)) you can see the metadata associated with this registration.

➡️ Request the page describing the ARK registration of your organisation in the web browser and verify that it is indeed your own organisation (and not an aggregation platform or CMS supplier).

➡️ Paste each persistent HTTP URI into the browser address bar and check the content: do you land on a collection page (in HTML) that describes the heritage object? Update the results in the working document.

Ideally, the persistent HTTP URI is also shown on the public page, as a "persistent address" or "persistent link" or "permalink". It is up to heritage organisations to point their users to these persistent HTTP URIs and explain that these web addresses will continue to work and will always lead to information about the specific object — so that users do not keep copying the address from the browser's address bar for their research, but use the permalink instead.

**✅ If persistent HTTP URIs appear in the linked data and these URIs lead to the relevant heritage object, this test has passed.**


## 3. Checking the linked data

> ***What is linked data?***
>
> *Linked data is structured data that is linked to other data and is therefore more useful in semantic queries. The method is based on the technology of HTTP URIs and RDF. Linked data can be read by people via web pages and automatically by computers. Part of the linked data vision is to allow the internet to grow into a worldwide database, enabling a larger group of 'non-expert' users to make use of the data.*
>
> *When linked data uses open data (which is seen as a precursor to linked data), it is referred to as linked open data (LOD). Linked open data implements free knowledge.*
>
> **Source**: [Linked data (on Wikipedia)](https://en.wikipedia.org/wiki/Linked_data)

> **GOAL: Towards broad usability of heritage information**
>
> *The use of general web standards promotes accessibility not only for people, but also for machines. For example, the use of linked data — the standard applied by the Dutch Digital Heritage Network when connecting data — enables computers to read and discover connections in pieces of information from different sources. In this way, heritage information can also be used by algorithms, for example in (safe and responsible) AI applications. And when data is presented according to the schema.org standard, search engines can also process it. This allows heritage to be shared globally, for use in many different contexts.*
>
> **Source**: [National Strategy for Digital Heritage 2025-2028](https://zenodo.org/records/14237069)

Each heritage object URI must be "resolvable" — that is, every heritage object must be retrievable via its web address, returning the correct content in the correct format.

By requesting URIs via the browser in step 2, you requested content in HTML format (the browser automatically sends the request header `Accept: text/html`). Requesting content in a specific format is called *content negotiation*. Let's see if the URIs also return machine-readable linked data.

➡️ Check each persistent HTTP URI via [reqbin.com](https://reqbin.com) and save the result to a file. Record the URI and filenames in the working document.

[Reqbin.com](https://reqbin.com) is a free service — no login required, though logging in provides extra functionality. Using this online service you can make HTTP requests via your browser and view the HTTP response. To make an HTTP request, enter the URI and on the *Headers* tab add an `Accept` key with the value `text/turtle` (see the screenshot below). After clicking the Send button, you will see the HTTP response (the answer) below the HTTP request (the question). If all is well, the response will contain information about the object in Turtle format!

![alt_text](/img/test-reqbin.png "ReqBin 1")

![alt_text](/img/test-reqbin2.png "ReqBin 2")

If you only see HTML in the *Body* of the response: have you filled in the `Accept` key on the *Headers* tab with a valid RDF representation value? If so, it is possible that the requested RDF representation is not supported by the system. Try other formats (as the requirement is that at least one RDF representation must be supported): `text/turtle`, `application/ld+json`, `application/n-triples`, `application/n-quads`.

If you see strange characters such as `��V�n�6}�...` in the *Body* of the response, the response has most likely been received in compressed format (Gzip). This is actually very good, as less data needs to be transferred — a 'greener' solution. If you prefer uncompressed RDF, add the key `Accept-Encoding` with value `identity` on the *Headers* tab.

You can check whether the received linked data is syntactically valid using the RDF converter by Zazuko.

➡️ Go to the [RDF converter by Zazuko](https://converter.zazuko.com) and paste the contents of the saved linked data files into the Input field. In the left panel, select the correct input format (probably `text/turtle`). If the syntax is correct, the Output field will show the converted linked data in JSON-LD, TriG, etc. If the syntax is incorrect, the red text *Parsing failed* will appear next to Input (hover over the first red-underlined line in the input field to see error information). Record the results of the checks in the working document.

![alt_text](/img/test-converter.png "Zazuko's Converter")

It is a requirement that the linked data (the RDF) uses the [schema.org](https://schema.org/) vocabulary. You can easily see this in the data dump: look for classes and properties beginning with https://schema.org. The Schema.org NDE Application Profile ([SCHEMA-AP-NDE](https://docs.nde.nl/schema-profile/)) is preferred, as it makes explicit choices for consistent use and better findability. In the future, use of [SCHEMA-AP-NDE](https://docs.nde.nl/schema-profile/) will become a requirement. In addition, linked data can be published in a domain-specific model such as Records in Contexts ([RIC-O](https://www.ica.org/resource/records-in-contexts-ontology/)), [Linked.Art](https://linked.art/) and Resource Description and Access ([RDA](https://www.rdaregistry.info/)).

If a data dump is available (online or downloadable), you can also inspect it with the tool RDF Glance. In addition to statistics and used classes, you can also view the relationships of resources and the 'meta graph'.

![alt_text](/img/test-rdfglance.gif "Album Amicorum of the KB - national library loaded in RDF Glance")

➡️ Go to [RDF Glance](https://xdobry.github.io/rdfglance/) and choose 'Import RDF File' or 'Import RDF File from URL' from the menu to load and inspect the RDF.

A follow-up test verifies whether the linked data complies with the Schema.org AP NDE application profile as described at [https://docs.nde.nl/schema-profile/](https://docs.nde.nl/schema-profile/). For this test we use SHACL Play! by the French company Sparna.

➡️ Go to [SHACL Play!](https://shacl-play.sparna.fr/play/validate) and paste the RDF (from a saved file) as Input Data in the 'Copy/paste RDF content' field. In the Shapes section, select 'Schema.org Application Profile for NDE' from the Shapes catalog. Click the 'Validate' button to get a validation report. Repeat this for all saved linked data files and update the working document with the results.

![alt_text](/img/test-shacl-play.png "SHACL Play - Validate RDF data")

The NDE requirements for publishing linked data require that URIs are resolvable (level 1) and that a data dump is available (level 2). Level 3 — a SPARQL endpoint — is not mandatory and therefore not a prerequisite for an NDE-compatible system. If you encountered a SPARQL endpoint in step 1 in the dataset description, it must work correctly (otherwise the test fails). We can test this using Yasgui.

➡️ Go to [Yasgui](https://yasgui.org/) and enter the URL of the SPARQL endpoint (followed by Enter). Enter the following SPARQL query and click the 'Play' button:
```
SELECT ?class (COUNT(?s) AS ?count) WHERE { 
    ?s a ?class . 
}
GROUP BY ?class 
ORDER BY DESC(?count)
```

If all is well, results will appear below the query field. This specific query asks for the used classes. In addition to checking the technical functioning of the SPARQL endpoint, you can also verify whether you see the expected classes (from schema.org!).

![alt_text](/img/test-yasgui-classes.png "List classes via YASGUI")

**Tip**: via the Share icon you can get a shortened URL of the SPARQL query on the selected SPARQL endpoint, which you can easily share with colleagues and the supplier. Via [http://yasgui.org/short/Bnnq2X1w2F](http://yasgui.org/short/Bnnq2X1w2F) you can access the SPARQL page shown above.

**✅ If the linked data as a whole can be downloaded and individual objects can be requested in the desired linked data format, the data constitutes valid RDF and at minimum complies with the [Schema.org](https://docs.nde.nl/schema-profile/) AP NDE, this test has passed.**


## 4. Adding, finding and checking terms via the Network of Terms

> ***What are terms?***
>
> *Terms describe what heritage is about. Terms are, for example, subjects, persons or places. Take The Night Watch: it is a 'painting', made by 'Rembrandt' in 'Amsterdam'.*
>
> *Yet a term is more than a word. Each term has an identifier, a so-called URI. A URI is a unique address that makes it unambiguously clear which term is meant. For example, the (Dutch) term 'noodweer': does it refer to the legal concept or to severe weather? The meaning becomes clear when you use the URI of the term, such as http://www.wikidata.org/entity/Q741507.*
>
> *In addition, a term can contain additional information, such as a definition or an alternative name. For example the term 'painting' with the URI http://vocab.getty.edu/aat/300177435. The additional information about this term makes it clear that it has a synonym (in Dutch), 'schilderstuk'.*
>
> **Source**: [https://termennetwerk.netwerkdigitaalerfgoed.nl/en/faq1](https://termennetwerk.netwerkdigitaalerfgoed.nl/en/faq1)

This test depends on your own data in the CMS — has it already been linked to terms? If your organisation has not yet done this, ask the supplier to explain how to link your data to terms. The supplier will ask which fields should be linked to which terminology sources. In a good implementation of the NDE Network of Terms, the terminology sources are available as listed in the [list of terminology sources](https://termennetwerk.netwerkdigitaalerfgoed.nl/en/sources). It is advisable to have a few objects linked to terms (URIs) before completing the CMS implementation, as these URIs must also be published by the CMS in the linked data for the test described above.

➡️ Search the RDF for URIs of terms. You will often see URIs from the [AAT](https://www.getty.edu/research/tools/vocabularies/aat/), the [CHT](https://kennis.cultureelerfgoed.nl/index.php/Thesauri_bij_de_RCE_-_Cultuurhistorische_Thesaurus), [WO2 thesaurus](https://www.niod.nl/collections/ww2-thesaurus), [Geonames](https://www.geonames.org/), etc. in fields such as subject, keyword, place, creator, etc. Paste the found term URIs into the browser: do you get more information about the term or a "page not found"? Record the URIs and results in the working document.

➡️ Request the sample objects in the browser and verify that the terms are also shown on the public page. At minimum, the label of the term must be displayed; ideally a description of the term is also shown, for example in a tooltip. Record the URLs of the public pages and the results in the working document.

**✅ If the CMS has fields that are — via the NDE Network of Terms — linked to terms and these also appear in the published linked data, this test has passed.**


## 5. Checking media and metadata via IIIF

> ***What is IIIF?***
>
> *IIIF stands for International Image Interoperability Framework. It is a set of open standards that makes it easier to make digitised paintings, maps, deeds, medieval manuscripts, photographs and other images, together with their associated information, accessible online. IIIF was developed by and for the international heritage community. It is supported by a community of libraries, archives, museums, universities, software companies and developers who together write, develop, test and promote the standards. The community site [iiif.io](https://iiif.io) offers extensive background information, guides and training to help you get started with IIIF.*
>
> **Source**: [https://netwerkdigitaalerfgoed.nl/activiteiten/iiif/](https://netwerkdigitaalerfgoed.nl/activiteiten/iiif/)

If media (images, scans, 3D models, videos) are published, the images must be available via the [IIIF Image API](https://iiif.io/api/image/3.0/) and the media metadata must be available via the [IIIF Presentation API](https://iiif.io/api/presentation/3.0/), also known as a manifest.

The IIIF Image API describes how an image can be retrieved and what transformations must be applied. The structure of a IIIF image URL is `{scheme}://{server}{/prefix}/{identifier}/{region}/{size}/{rotation}/{quality}.{format}`, for example: [https://www.goudatijdmachine.nl/omeka/iiif/2/51787/full/max/0/default.jpg](https://www.goudatijdmachine.nl/omeka/iiif/2/51787/full/max/0/default.jpg). There is also an info.json file providing technical information about the image, such as dimensions, for example [https://www.goudatijdmachine.nl/omeka/iiif/2/51787/info.json](https://www.goudatijdmachine.nl/omeka/iiif/2/51787/info.json). A validator specific to the IIIF Image API is made available by the IIIF community at [https://iiif.io/api/image/validator/](https://iiif.io/api/image/validator/).

The IIIF Presentation API describes the structure of a work, which can be a single photograph or multiple scans of a book or register. The manifest provides a IIIF viewer with all the information needed to display the work. There is no fixed structure for the URI of a manifest, but you will often recognise IIIF (version 2 or 3) and the word manifest, such as [https://www.goudatijdmachine.nl/omeka/iiif/2/98632/manifest](https://www.goudatijdmachine.nl/omeka/iiif/2/98632/manifest). A validator specific to the IIIF Presentation API is made available by the IIIF community at [https://presentation-validator.iiif.io/](https://presentation-validator.iiif.io/) (make sure to set the correct API version, 2 or 3).

When you view a IIIF Manifest in a IIIF Viewer such as the [Theseus Viewer](https://theseusviewer.org/), [Mirador](https://projectmirador.org/) or [Universal Viewer](https://universalviewer.io/), you are validating the IIIF files!

➡️ Search the sample linked data files for IIIF URIs. Go to [Theseus Viewer](https://theseusviewer.org/) and paste each IIIF URI there to view the result (can you see the images, is the metadata correct — click (i) in the left bar to check). Record the IIIF URIs and results in the working document.

![alt_text](/img/test-iiif.png "image_tooltip")

Ideally, the IIIF manifest is also made available on the collection website. It is common practice to include the IIIF logo and link to the manifest.

![alt_text](/img/test-iiif2.png "image_tooltip")

**✅ If the images and their associated information are visible in a IIIF viewer, this test has passed.**

If you have reached this point, you have completed the 5 steps for testing NDE compatibility!

## Appendix: working document

It is recommended to record information in a working document during the NDE compatibility test. Useful for yourself, colleagues and the supplier, and it can be used in an acceptance test report. This appendix — also available as a [Word document](../../static/doc/BijlageTestenOpNdeCompatibiliteit.docx) — provides a template for such a working document.


#### 1. Finding dataset(s) via the Dataset Register

List of URIs of the tested datasets and the validation result, including warnings and recommendations.


<table class="table">
  <tr>
   <td><strong>Dataset URI</strong></td>
   <td><strong>Validation result</strong></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
  </tr>
</table>

List of URIs of downloaded data dumps and filename on your computer (confirming that the distribution URI works).

<table class="table">
  <tr>
   <td><strong>Distribution URI (AccessURL of data dump)</strong></td>
   <td><strong>Local file</strong></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
  </tr>
</table>


URI of the SPARQL endpoint (only if included as a distribution):

-

Found / resolved issues:

-
-
-

#### 2. Finding and testing persistent identifiers

PID system used:

-

List of persistent HTTP URIs of heritage objects (and whether you get a "view" when requesting these URIs in the browser).

<table class="table">
  <tr>
   <td><strong>Persistent HTTP URI</strong></td>
   <td><strong>View in browser</strong></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
  </tr>
</table>

Found / resolved issues:

-

#### 3. Checking the linked data

List of persistent HTTP URIs of heritage objects, the filename on your computer (of the linked data retrieved via [reqbin.com](https://reqbin.com)), whether they are valid and whether they comply with schema.org AP NDE.

<table class="table">
  <tr>
   <td><strong>Persistent HTTP URI</strong></td>
   <td><strong>Valid syntax</strong></td>
   <td><strong>Schema.org AP NDE</strong></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
   <td></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
   <td></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
   <td></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
   <td></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
   <td></td>
  </tr>
</table>


Shortened URL of SPARQL page (if a SPARQL endpoint is present):

-

Found / resolved issues:

-
-
-


#### 4. Adding, finding and checking terms via the Network of Terms

List of term URIs and whether you get a "view" when requesting these URIs in the browser.

<table class="table">
  <tr>
   <td><strong>Term URI</strong></td>
   <td><strong>Term</strong></td>
   <td><strong>View in browser</strong></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
   <td></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
   <td></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
   <td></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
   <td></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
   <td></td>
  </tr>
</table>

List of URLs of collection pages and whether terms are shown there.

<table class="table">
  <tr>
   <td><strong>Collection page URL</strong></td>
   <td><strong>Term</strong></td>
   <td><strong>Shown on collection page</strong></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
   <td></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
   <td></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
   <td></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
   <td></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
   <td></td>
  </tr>
</table>

Found / resolved issues:

- 
-  
-

#### 5. Checking media and metadata via IIIF

List of IIIF URIs and whether they display correctly in Theseus.

<table class="table">
  <tr>
   <td><strong>IIIF URI</strong></td>
   <td><strong>View in Theseus</strong></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
  </tr>
  <tr>
   <td></td>
   <td></td>
  </tr>
</table>

Found / resolved issues:

-
-
-

#### **Final conclusion NDE compatibility**

<table class="table">
  <tr>
   <td><strong>Aspect</strong></td>
   <td><strong>Compliant / non-compliant</strong></td>
  </tr>
  <tr>
   <td>✅ Datasets findable via the Dataset Register</td>
   <td>👍👎</td>
  </tr>
  <tr>
   <td>✅ Use of persistent identifiers</td>
   <td>👍👎</td>
  </tr>
  <tr>
   <td>✅ Publishes linked open data</td>
   <td>👍👎</td>
  </tr>
  <tr>
   <td>✅ Links to URIs of standardised terms via the Network of Terms</td>
   <td>👍👎</td>
  </tr>
  <tr>
   <td>✅ Uses IIIF for access to image collections</td>
   <td>👍👎</td>
  </tr>
</table>
