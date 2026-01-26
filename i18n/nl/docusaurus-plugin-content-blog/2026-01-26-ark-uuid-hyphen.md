---
title: Kan ik UUID’s gebruiken met ARK?
authors: coret
tags: [persistent-http-uris]
---

Ja, hoewel koppeltekens geen betekenis hebben in de _Assigned Name_ van een ARK, kun je UUID’s gebruiken als _Assigned Names_ in ARK; de lokale resolver moet dit wel ondersteunen.

<!-- truncate -->

## ARK-naamsstrings


Binnen [ARK](https://arks.org) is de _Assigned Name_ (in feite de objectidentifier) gebonden aan bepaalde regels, die worden uitgelegd op de pagina [Running minters and resolvers](https://arks.org/about/running-minters-and-resolvers/). Deze regels komen neer op:

> digits, letters (ASCII, no diacritics), and the following characters: = ~ * + @ _ $ . /

Maar er is ook het volgende:
> Another unique feature of ARKs is that hyphens (‘-‘) may appear but are identity inert, meaning that strings that differ only by hyphens are considered identical; for example, these strings:

>- ark:12345/141e86dc-d396-4e59-bbc2-4c3bf5326152
>- ark:12345/141e86dcd3964e59bbc24c3bf5326152

> identify the same thing.

## UUIDs

De “identity inert”-eigenschap maakt het mogelijk om UUID’s te gebruiken voor _Assigned Names_, die volgens de ABNF in [RFC 9562 Universally Unique IDentifiers (UUIDs)](https://www.rfc-editor.org/rfc/rfc9562) moeten voldoen aan:

```
UUID     = 4hexOctet "-"
           2hexOctet "-"
           2hexOctet "-"
           2hexOctet "-"
           6hexOctet
 hexOctet = HEXDIG HEXDIG
 DIGIT    = %x30-39
 HEXDIG   = DIGIT / "A" / "B" / "C" / "D" / "E" / "F"
```

Overigens stelt de RFC ook:
> Note that the alphabetic characters can all be uppercase, lowercase, or mixed letters,

Dus als erfgoedinstelling (en als leverancier van een Collectie-informatiesysteem) kun je zeker een UUID gebruiken voor het _Assigned Name_-gedeelte van je [persistente HTTP-URI’s](https://docs.nde.nl/requirements-collection-management-systems/#persistent-uri).


## Resolvers

Binnen de wereld van resolvers moet je echter rekening houden met het feit dat het koppelteken geen betekenis heeft. De resolvers van [nt2.net](https://n2t.net)
 en [arks.org](https://arks.org/)
 hebben gekozen voor een implementatie waarbij het koppelteken uit de Assigned Names wordt verwijderd  _"as they have no meaning."_ tijdens het doorsturen.

In de praktijk betekent dit dat erfgoedinstellingen die UUID’s gebruiken, ervoor moeten zorgen dat de lokale resolver (aan de kant van de instelling) een ARK zoals `ark:12345/141e86dcd3964e59bbc24c3bf5326152` herleidt (*)/interpreteert als/naar `ark:12345/141e86dc-d396-4e59-bbc2-4c3bf5326152`. Deze _Assigned Name_ in UUID-stijl kan vervolgens eenvoudig worden doorgestuurd naar de objectpagina of — op basis van content negotiation — worden omgezet naar RDF-informatie.

\*) Voorbeeld van een Apache rewrite rule met regexp:

```
RewriteRule ^ark:([0-9]+)/([0-9a-fA-F]{8})([0-9a-fA-F]{4})([0-9a-fA-F]{4})([0-9a-fA-F]{4})([0-9a-fA-F]{12})$ /ark:$1/$2-$3-$4-$5-$6 [R=301,L]
```
