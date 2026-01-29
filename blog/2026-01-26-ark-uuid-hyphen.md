---
title: Can I use UUID's with ARK?
authors: coret
tags: [persistent-http-uris]
---

Yes, although hyphens have no meaning in the Assigned Name of an ARK, you can use UUID's as Assigned Names in ARK, the local resolver does need to be made aware.

<!-- truncate -->

## ARK name strings

Within [ARK](https://arks.org), the Assigned Name (basically the object identifier) ​​is bound to certain rules, which are explained on the [Running minters and resolvers](https://arks.org/about/running-minters-and-resolvers/) page. These rules boil down to: 
> digits, letters (ASCII, no diacritics), and the following characters: = ~ * + @ _ $ . /

But there's also the following:
> Another unique feature of ARKs is that hyphens (‘-‘) may appear but are identity inert, meaning that strings that differ only by hyphens are considered identical; for example, these strings:

>- ark:12345/141e86dc-d396-4e59-bbc2-4c3bf5326152
>- ark:12345/141e86dcd3964e59bbc24c3bf5326152

> identify the same thing.

## UUIDs

The 'identity inert' feature paves the way to use UUIDs for Assigned Names, which according to the ABNF in [RFC 9562 Universally Unique IDentifiers (UUIDs)](https://www.rfc-editor.org/rfc/rfc9562) must conform to:

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

BTW, the RFC also states: 
> Note that the alphabetic characters can all be uppercase, lowercase, or mixed letters,

So, as heritage organisation (and as Collection Information System vendor), you can certainly use a UUID for the Assigned Names part of your [persistent HTTP URIs](https://docs.nde.nl/requirements-collection-management-systems/#persistent-uri).

## Resolvers

However, in the realm of resolvers, you will need to consider the fact that the hyphen has no meaning. The [nt2.net](https://n2t.net) and [arks.org](https://arks.org/) resolvers chose an implementation where the hyphen is removed from the Assigned Names _"as they have no meaning."_ upon redirect.

In practice, for heritage organisations using UUID's the local resolver (on the heritage institution's side) will have to redirect (*)/interpreted an ARK like `ark:12345/141e86dcd3964e59bbc24c3bf5326152` as/to `ark:12345/141e86dc-d396-4e59-bbc2-4c3bf5326152`. This Assigned Name 'in UUID style' can then simply be routed to the object page or - based on content negotiation - resolved to RDF information.

\*) Example Apache rewrite rule with regexp:
```
RewriteRule ^ark:([0-9]+)/([0-9a-fA-F]{8})([0-9a-fA-F]{4})([0-9a-fA-F]{4})([0-9a-fA-F]{4})([0-9a-fA-F]{12})$ /ark:$1/$2-$3-$4-$5-$6 [R=301,L]
```
