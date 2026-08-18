---
title: "The Network of Terms in numbers: more than 11 million queries in 2026"
authors: joop
tags:
  - network-of-terms
---

The Network of Terms is increasingly becoming part of the infrastructure used to search, identify and reuse terminology across the Dutch cultural heritage network. Grafana gives us a useful view of how the service is being used.

For the period from 1 January to 10 August 2026, the supplied Grafana export records **11,238,305 user queries** and **15,256,333 requests to terminology sources**.

<!-- truncate -->

## More than 11 million user queries

By 10 August 2026, the Network of Terms had recorded **11,238,305 user queries**.

The requested Grafana period starts on 1 January, but the first recorded data point in the supplied cumulative series is **6 January 2026**. The figures below therefore describe the data that is actually present in the export and do not estimate the missing first days of January.

Across the recorded period, this corresponds to roughly **52,019 user queries per day**. Usage is not evenly distributed over time: the monthly figures show clear peaks and quieter periods. The data itself does not explain what caused those peaks.

| Month | User queries | Requests to terminology sources |
|---|---:|---:|
| Jan* | 1,878,461 | 2,162,532 |
| Feb | 742,276 | 1,167,442 |
| Mar | 395,191 | 967,980 |
| Apr | 1,834,717 | 2,534,093 |
| May | 4,149,846 | 4,741,887 |
| Jun | 420,839 | 1,195,675 |
| Jul | 1,104,829 | 1,639,252 |
| Aug* | 712,146 | 847,472 |

\* January starts on 6 January in the supplied data. August contains data through 10 August only.

## Most queries are lookups

The Grafana data distinguishes between lookups and searches.

- **9,134,804 queries (81.3%)** were lookups.
- **2,103,983 queries (18.7%)** were searches.

A lookup retrieves a known term or URI. A search is broader and may query several terminology sources at the same time. This distinction matters when interpreting the figures: one user query can result in more than one request to an underlying source.

For searches, users queried **2.76 terminology sources on average**. Around **70.5%** of searches used only one or two sources.

| Number of sources in a search | Searches | Share |
|---|---:|---:|
| 1 source | 864,080 | 41.1% |
| 2 sources | 619,916 | 29.5% |
| 3 sources | 285,317 | 13.6% |
| 4 sources | 140,170 | 6.7% |
| 5 sources | 109,184 | 5.2% |
| 6-10 sources | 59,682 | 2.8% |
| 11+ sources | 25,634 | 1.2% |

## Requests to terminology sources

The Network of Terms recorded **15,256,333 requests to terminology sources** by 10 August. This is higher than the number of user queries because a single search can be sent to multiple sources.

Source-level data is useful for understanding which vocabularies are being queried most often, but one source needs an explicit warning.

> **Data-quality note:** the Homosaurus figures in Grafana appear to be incorrect and are probably far too high. The raw figures have not been adjusted in the accompanying data. Homosaurus should therefore **not** be treated as a reliable indicator when comparing source usage.

Because the Homosaurus value would dominate the scale, the comparison below excludes it while leaving the original values untouched in the accompanying workbook and CSV.

| Terminology source | Queries | Success rate |
|---|---:|---:|
| AAT | 1,081,062 | 92.1% |
| Cultural Heritage Thesaurus | 914,856 | 98.5% |
| RKD | 544,835 | 98.3% |
| Wikidata - all entities | 277,474 | 88.4% |
| WO2 Thesaurus | 273,434 | 99.2% |
| Cultural Heritage Thesaurus - Materials | 245,996 | 99.7% |
| AAT - Materials | 235,111 | 90.7% |
| NMVW thesaurus | 216,328 | 99.2% |
| Wikidata - persons | 165,215 | 92.6% |
| Archaeological Basic Register (ABR) | 160,511 | 99.7% |

## Source reliability varies

The Network of Terms depends on external terminology services. Their behaviour therefore directly affects the experience of users and connected systems.

The success rates in the table above are calculated from the supplied query and error counts over the export period. They show that reliability differs per source. This makes source monitoring an important part of operating the Network of Terms: the Network itself can be available while an individual terminology source is slow, unavailable or returning errors.

The accompanying Excel workbook contains the source-level query counts, error counts, calculated success rates and the original Grafana exports.

## What these numbers tell us

The most important conclusion is not a single peak or a single popular terminology source. It is the scale and nature of the usage.

By early August, the Network of Terms had already processed **more than 11 million user queries in 2026**. More than four out of five queries were lookups, which indicates that the service is not used only for exploratory searching. It is also being used to retrieve known terminology in workflows and applications.

At the same time, searches often fan out across several terminology sources. The Network of Terms therefore acts as a shared access layer: users and systems can query multiple vocabularies through one service instead of implementing each terminology source separately.

These figures are one snapshot of 2026. They do not tell us how many individual people, organisations or software systems are responsible for the traffic. The current metrics cannot reliably distinguish, for example, between different customers behind a multi-tenant system. Adding a consistent client identifier or request header would make that type of analysis possible in the future.

## Data

The accompanying workbook contains:

- a dashboard with the main figures;
- monthly user and terminology-source query trends;
- lookup versus search usage;
- the number of terminology sources selected per search;
- source-level query and error statistics;
- reliability figures;
- the unmodified Grafana exports used for this analysis.

The source-level CSV provides a compact machine-readable version of the terminology-source statistics. The Homosaurus row is retained and explicitly marked with the known data-quality warning.

## Data

You can download the underlying data and analysis here:

- [Download the Excel workbook](/network-of-terms/network-of-terms-usage-2026-01-01-to-2026-08-10.xlsx)
- [Download the source statistics as CSV](/network-of-terms/network-of-terms-source-statistics-2026-08-10.csv)
