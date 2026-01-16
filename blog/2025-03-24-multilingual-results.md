---
title: Network of Terms now returns multilingual results
authors: ddeboer
tags: [network-of-terms, graphql]
image: https://i.imgur.com/mErPwqL.png
---

The [Network of Terms](/services/network-of-terms/) now [supports](https://github.com/netwerk-digitaal-erfgoed/network-of-terms/issues/1410) multilingual searches and lookups.

<!-- truncate -->

Before, search results were always returned in a single language, Dutch for most sources;
English for a few that are only available in that language (GeoNames and Iconclass).
Now, you can specify the language(s) in which you want to receive the results
for sources that support both Dutch and English. 
The demonstrator shows [for each source in which language(s) it is available](https://termennetwerk.netwerkdigitaalerfgoed.nl/sources).

One of these sources is the Art & Architecture Thesaurus (AAT).
When you search for ‘classicism’ in the English demonstrator, you’ll get [terms in English](https://termennetwerk.netwerkdigitaalerfgoed.nl/en?q=classicism&datasets=http://vocab.getty.edu/aat).
Switch to Dutch using the Language dropdown in the top right corner, and you get [terms in Dutch](https://termennetwerk.netwerkdigitaalerfgoed.nl/nl?q=classicism&datasets=http://vocab.getty.edu/aat).
The terminology source information changes along with the chosen language.

Note that some terms, such as ‘Baroque Classicism’ are still in English.
This is because even for multilingual sources, not all terms are available in both languages.
In that case, the Network of Terms will show the term in its original language.

Because more and more clients are [relying](/services/network-of-terms/integrations)
on the Network of Terms, we made sure to preserve backwards compatibility.
Existing single-language queries will continue to work as before.
If you want to add multilingual search to your application, 
have a look at the [technical documentation](/services/network-of-terms/graphql#multilingual-queries). 

If you manage a terminology source and want to make it available in more languages,
please [contact us](https://termennetwerk.netwerkdigitaalerfgoed.nl/en/contact).
