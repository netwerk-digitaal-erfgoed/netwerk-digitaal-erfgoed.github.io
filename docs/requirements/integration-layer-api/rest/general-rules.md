---
slug: /integration-layer-api/rest/general-rules
sidebar_position: 2
---

# General rules

## Introduction

An API provides an interface for presentation layers to interact with an integration layer, decoupling them from specific underlying systems and technologies. The API of an integration layer must adhere to several rules to ensure consistent and predictable interactions.

## Documentation

The API is as good as the accompanying documentation. The documentation of the API must be easily discoverable, searchable and publicly accessible. It is often the primary resource for developers of presentation layers during implementation.

API documentation _MUST_ be provided in the form of an OpenAPI definition document which conforms to the [OpenAPI Specification](https://www.openapis.org/), version 3 or later.

See [Documentation](https://logius-standaarden.github.io/API-Design-Rules/#documentation) in the API Design Rules for more information.

## Versioning

The API may evolve over time. It _MUST_ be versioned as follows:

1. The URI base path _MUST_ include a major version number prefixed with `v`. Example: `https://example.org/v1`, `https://example.org/v2`.
2. The integration layer _MUST_ send the full version number of the API in the `API-Version` header. Example: `API-Version: 1.2.3`, `API-Version: 2.1.0`.

### Example

An example request from a presentation layer:

```http
GET /v1/entities/1234
Host: example.org
```

This tells the integration layer that the presentation layer is requesting a resource of version `1` (`v1`) of the API.

An example of the response headers of the integration layer:

```http
HTTP/2 200 OK
API-Version: 1.2.3
```

The response indicates that the exact version of the API is `1.2.3`.

The integration layer _MUST_ facilitate the transition between versions. For example, the integration layer _SHOULD_ publish a deprecation schedule and a changelog. See [Versioning](https://logius-standaarden.github.io/API-Design-Rules/#versioning) in the API Design Rules for more information.

## Status codes

The integration layer _MUST_ use common HTTP status codes in its responses: `2xx` for success, `3xx` for redirects, `4xx` for errors caused by the presentation layer and `5xx` for errors caused by the integration layer.

The following table lists common status codes:

| Status | Description                                                                     |
| ------ | ------------------------------------------------------------------------------- |
| `200`  | The request has succeeded.                                                      |
| `304`  | The requested resource is not modified.                                         |
| `400`  | The request is invalid.                                                         |
| `404`  | The requested resource does not exist.                                          |
| `406`  | The request could not be accepted according to the content negotiation headers. |
| `415`  | The media type in the request is not supported.                                 |
| `429`  | The server has received too many requests.                                      |
| `500`  | A server error has occurred.                                                    |
| `503`  | The server is under maintenance.                                                |

## Media types

The integration layer must use media types to enable open and extensible content negotiation. The rules of this section apply to every response of an integration layer, whatever the media type of its content, such as JSON data, binary files or a CSV for download. This section lists the main requirements — see the [HTTP Semantics](https://www.rfc-editor.org/info/rfc9110/) for more information.

1. A presentation layer _MAY_ send the `Accept` header in its request. Its value _MUST_ conform to the [HTTP semantics](https://www.rfc-editor.org/info/rfc9110/#section-12.5.1). For example, the value may contain a specific media type (e.g. `application/json`), a list of media types (e.g. `application/json, application/problem+json`) or any media type (`*/*`).
1. The integration layer _MUST_ negotiate the media type from the list of media ranges in the `Accept` header. If one or more of the requested media types are supported, the integration layer _MUST_ select the most preferred supported media type and send its content in that media type. If none of the requested media types are supported, the integration layer _MUST_ respond with a `406 Not Acceptable` status code.
1. If a presentation layer does not send the `Accept` header, the integration layer _MUST_ send the content in its default media type.
1. The integration layer _MUST_ send the media type of its response in the `Content-Type` header. Its value _MUST_ conform to the [HTTP semantics](https://www.rfc-editor.org/info/rfc9110/#section-8.3).
1. The integration layer _MUST_ send the `Vary: Accept` header to indicate to a presentation layer that it supports content negotiation for media types. This tells a presentation layer that changing the value of the `Accept` header in a request will yield a different representation of a resource.

## JSON-LD

The API uses JSON by default: JSON is easy to parse and is supported natively in most programming languages. The integration layer serialises this JSON as [JSON-LD 1.1](https://www.w3.org/TR/json-ld11/), a format for linked data. JSON-LD is the default media type of the API. Because JSON-LD is JSON, a presentation layer that only knows JSON can parse a JSON-LD response like any other JSON document.

1. The integration layer _MUST_ support `application/ld+json` and `application/json` in the `Accept` header: a presentation layer _MAY_ request either.
1. If a presentation layer does not send the `Accept` header, or sends a media range that accepts `application/ld+json` (such as `*/*` or `application/*`), the integration layer _MUST_ serve JSON-LD.
1. The integration layer _MUST_ send `Content-Type: application/ld+json` when it serves JSON-LD, and `Content-Type: application/json` when the presentation layer requests `application/json` only.

### Example

An example request from a JSON-LD-aware presentation layer:

```http
GET /v1/entities/1234
Host: example.org
Accept: application/ld+json
```

This tells the integration layer that the presentation layer prefers the response to be serialised as JSON-LD.

An example of the response headers of the integration layer:

```http
HTTP/2 200 OK
Content-Type: application/ld+json
Vary: Accept
```

The response indicates that the body is serialised as JSON-LD.

An example request from a conventional presentation layer that only knows JSON:

```http
GET /v1/entities/1234
Host: example.org
Accept: application/json
```

An example of the response headers of the integration layer:

```http
HTTP/2 200 OK
Content-Type: application/json
Vary: Accept
```

Both responses carry the same body. A JSON-LD-aware presentation layer interprets the body as linked data. A conventional presentation layer treats the body as plain JSON.

## Languages

Heritage information is available in one or more languages, such as Dutch or English. The integration layer must allow presentation layers to request information in a preferred language, even if the integration layer only exposes information in one language. This section lists the main requirements — see the [HTTP Semantics](https://www.rfc-editor.org/info/rfc9110/) for more information.

1. A presentation layer _MAY_ send the `Accept-Language` header in its request to indicate which language it prefers. Its value _MUST_ conform to the [HTTP semantics](https://www.rfc-editor.org/info/rfc9110/#section-12.5.4). For example, the value may contain a specific language tag (e.g. `nl`), a list of language tags (e.g. `nl, en`) or any language (`*`).
1. The integration layer _MUST_ negotiate the language from the list of language tags in the `Accept-Language` header. If one or more of the requested languages are supported, the integration layer _MUST_ select the most preferred supported language and send its content in that language. If none of the requested languages are supported, the integration layer _MUST_ respond with a `406 Not Acceptable` status code.
1. If a presentation layer does not send the `Accept-Language` header, the integration layer _MUST_ send its content in its default language.
1. The integration layer _MUST_ send the language tag of the content in the `Content-Language` header. Its value _MUST_ conform to the [HTTP semantics](https://www.rfc-editor.org/info/rfc9110/#section-8.5).
1. The integration layer _MUST NOT_ serve its content in different languages in one response. Instead, a presentation layer _MUST_ issue separate requests for each language, with different `Accept-Language` header values.
1. The integration layer _MUST_ send the `Vary: Accept-Language` header to indicate to a presentation layer that it supports content negotiation for languages. This informs a presentation layer that changing the value of the `Accept-Language` header in a request will yield a different, language-aware representation of a resource.

:::note To be discussed

How can a presentation layer discover the supported languages? Should we add a separate discovery endpoint (e.g. `/v1/languages`, returning a collection of languages)? Or should a presentation layer rely upon the [OpenAPI definition](#documentation), documenting the languages? The first one makes sense if we treat languages as 'data'. The second one makes sense if we treat languages as 'documentation'.

:::

### Example

An example request from a presentation layer:

```http
GET /v1/entities/1234
Host: example.org
Accept-Language: nl
```

This tells the integration layer that the presentation layer prefers the content to be in Dutch.

An example of the response headers of the integration layer:

```http
HTTP/2 200 OK
Content-Language: nl
Vary: Accept-Language
```

The response indicates that the content is in Dutch and that a new request to the same resource with a different `Accept-Language` header value will result in a different representation of the resource.

Another example request from a presentation layer:

```http
GET /v1/entities/1234
Host: example.org
Accept-Language: de, nl
```

This tells the integration layer that the presentation layer prefers the content to be in German, otherwise in Dutch.

An example of the response headers of the integration layer:

```http
HTTP/2 200 OK
Content-Language: nl
Vary: Accept-Language
```

The response indicates that the content is in Dutch: German is not supported by the integration layer.

## Character encoding

Character encoding defines how characters are converted into bytes by the integration layer for transmission to a presentation layer. The integration layer _MUST_ encode all payload responses using [UTF-8](https://www.rfc-editor.org/info/rfc3629/), except for payloads that are binary by nature, such as images.

## Compression

Compression reduces the size of a response body as it is transmitted to a presentation layer, improving performance and reducing bandwidth use. The integration layer _SHOULD_ support compression. This section lists the main requirements — see the [HTTP Semantics](https://www.rfc-editor.org/info/rfc9110/#section-8.4.1) for more information.

1. A presentation layer _MAY_ send the `Accept-Encoding` header in its request to indicate which compression schemes it supports, such as `gzip`, `br`, `deflate` or `zstd`. Its value _MUST_ conform to the [HTTP semantics](https://www.rfc-editor.org/info/rfc9110/#field.accept-encoding).
1. If a presentation layer sends the `Accept-Encoding` header, the integration layer _MAY_ compress the response body using one of the schemes the presentation layer supports. The integration layer _MUST_ then send the `Content-Encoding` header to indicate which scheme it used. Its value _MUST_ conform to the [HTTP semantics](https://www.rfc-editor.org/info/rfc9110/#field.content-encoding).
1. If a presentation layer does not send the `Accept-Encoding` header, or requests only schemes the integration layer does not support, the integration layer _MUST_ send the response body uncompressed, without a `Content-Encoding` header.
1. If the integration layer supports compression, it _MUST_ send the `Vary: Accept-Encoding` header to indicate to a presentation layer that responses can differ based on the value of the `Accept-Encoding` request header. This informs a presentation layer that changing the value of the `Accept-Encoding` header in a request will yield a differently compressed representation of a resource.

### Example

An example request from a presentation layer:

```http
GET /v1/entities/1234
Host: example.org
Accept-Encoding: gzip, br
```

This tells the integration layer that the presentation layer can handle the compressed response body with either `gzip` or `br`.

An example of the response headers of the integration layer:

```http
HTTP/2 200 OK
Content-Encoding: br
Vary: Accept-Encoding
```

The `Content-Encoding: br` header indicates that the body is compressed with Brotli (`br`). The `Vary: Accept-Encoding` header indicates that a new request to the same resource with a different `Accept-Encoding` header value will result in a differently compressed representation of the resource.

## Caching

Caching is a mechanism where presentation layers store responses from the integration layer to reuse them for subsequent requests. The integration layer _SHOULD_ support caching via HTTP headers; it enhances performance by reducing server load and latency. This section lists the main requirements — see [HTTP Caching](https://www.rfc-editor.org/info/rfc9111) for more information.

1. The integration layer _SHOULD_ send the `Cache-Control` header, to make clear to a presentation layer whether information can be cached and, if so, for how long (e.g. 1 hour, 1 day or 1 week). Its value _MUST_ conform to the [HTTP Caching standard](https://www.rfc-editor.org/info/rfc9111/#section-5.2).
1. The integration layer _SHOULD_ send the `ETag` header with a unique fingerprint of a resource. When the resource changes, the integration layer _MUST_ change its fingerprint.
1. A presentation layer _MAY_ send the `If-None-Match` header in its request with one or more ETag values returned by the integration layer. If the resource still has one of the provided ETags, the integration layer _MUST_ respond with the `304 Not Modified` status code. Otherwise, the integration layer _MUST_ return the modified resource with a new `ETag` header value.
1. The integration layer _SHOULD_ send the `Last-Modified` header with a timestamp of when the resource was last modified. Its value _MUST_ conform to the [HTTP semantics](https://www.rfc-editor.org/info/rfc9110/#section-8.8.2).
1. A presentation layer _MAY_ send the `If-Modified-Since` header in its request. If the resource has not been modified since that time, the integration layer _MUST_ respond with the `304 Not Modified` status code. Otherwise, the integration layer _MUST_ return the modified resource with a new `Last-Modified` header value.
1. If a presentation layer sends both the `If-None-Match` and `If-Modified-Since` headers in the same request, the integration layer _MUST_ accept `If-None-Match` and ignore `If-Modified-Since`.

### Example

An example of the response headers of the integration layer:

```http
HTTP/2 200 OK
Cache-Control: max-age=3600
ETag: "xyz"
Last-Modified: Fri, 28 Aug 2026 04:58:08 GMT
```

The response indicates that this resource can be cached for 1 hour (`max-age=3600`) without checking the integration layer, has ETag `xyz`, and was last modified on Friday 28 August 2026.

## Rate limiting

Rate limiting is a traffic control mechanism that caps the number of requests a presentation layer can make to the integration layer within a specific time window. It protects the integration layer's infrastructure from overload and abuse. This section lists the main requirements — see [Retry-After](https://www.rfc-editor.org/info/rfc9110/#name-retry-after) and [RateLimit header fields for HTTP](https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-ratelimit-headers) for more information.

1. The integration layer _SHOULD_ support rate limiting. It chooses a policy that best fits its situation. For example, the integration layer may choose a rate limiting algorithm such as Token Bucket, Fixed Window Counter or Sliding Window. The integration layer may also choose a method for identifying presentation layers, for example based on IP address or the `User-Agent` header.
1. The integration layer _SHOULD_ send the `RateLimit-Policy` and `RateLimit` headers to communicate its rate limiting policy and the current limits for a particular presentation layer.
1. The integration layer _SHOULD_ send a `429 Too Many Requests` status code if a presentation layer has sent too many requests within the current time window.
1. The integration layer _SHOULD_ send the `Retry-After` header if a presentation layer has sent too many requests within the current time window, to indicate how long the presentation layer ought to wait before making a new request.

### Example

An example of the response headers of the integration layer:

```http
HTTP/2 200 OK
RateLimit-Policy: "default";q=100;w=60
RateLimit: "default";r=50;t=30
```

The `RateLimit-Policy` indicates that a presentation layer may send up to 100 requests (`q=100`) per 60 seconds (`w=60`). The `RateLimit` shows 50 of those remain (`r=50`) and that they may be used within the next 30 seconds (`t=30`).

An example of the response headers of the integration layer when a rate limit has been reached:

```http
HTTP/2 429 Too Many Requests
Retry-After: 120
```

The response indicates that a presentation layer has made too many requests and that it can try again after 120 seconds.

## Cross-Origin Resource Sharing (CORS)

Cross-Origin Resource Sharing (CORS) is a mechanism that allows browser-based presentation layers to interact with the integration layer. The integration layer _MUST_ support CORS by following the relevant requirements of the [CORS specification](https://fetch.spec.whatwg.org/#http-cors-protocol). This section lists the main requirements.

1. A browser-based presentation layer _MUST_ send the `Origin` header to indicate the origin (scheme, hostname, and optionally port) that caused the request to the integration layer.
1. The integration layer _MUST_ send the `Access-Control-Allow-Origin` header. The value _SHOULD_ be `*` to allow access to the integration layer from any origin. If the integration layer [restricts access](#open-access), a specific origin _MUST_ be provided instead of `*`, and the `Access-Control-Allow-Credentials: true` header _MUST_ be send.
1. If the integration layer sends a response with an `Access-Control-Allow-Origin` value with an explicit origin (rather than the `*` wildcard), the integration layer _MUST_ also send the `Vary: Origin` header to indicate to a presentation layer that responses can differ based on the value of the `Origin` request header.
1. The integration layer _MUST_ send the `Access-Control-Allow-Methods` header to specify which HTTP methods are permitted for cross-origin requests.
1. The integration layer _MUST_ send the `Access-Control-Allow-Headers` header to specify which HTTP headers are permitted for cross-origin requests.
1. The integration layer _MUST_ support the HTTP `OPTIONS` method and send the headers above in response to an `OPTIONS` request (the [preflight request pattern](https://fetch.spec.whatwg.org/#cors-preflight-request)).

### Example

An example of a preflight request from a presentation layer:

```http
OPTIONS /v1/entities/1234
Host: example.org
Origin: https://mywebsite.nl
Access-Control-Request-Method: GET
Access-Control-Request-Headers: Accept, Accept-Language, If-None-Match, If-Modified-Since, Origin
```

An example of the preflight response headers of the integration layer:

```http
HTTP/2 200 OK
Content-Length: 0
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Accept, Accept-Language, If-None-Match, If-Modified-Since, Origin
Access-Control-Max-Age: 7200
```

An example of a regular, non-preflight request from a presentation layer:

```http
GET /v1/entities/1234
Host: example.org
Origin: https://mywebsite.nl
```

An example of the regular, non-preflight response headers of the integration layer:

```http
HTTP/2 200 OK
Access-Control-Allow-Origin: *
```

## Error handling

When an error occurs, the integration layer _MUST_ handle errors as follows:

1. The integration layer _MUST_ return an appropriate HTTP status code, such as `404` or `500`.
1. The integration layer _MUST_ return error information according to [Problem Details for HTTP APIs](https://www.rfc-editor.org/info/rfc9457/). The error information _MUST_ contain at least the following properties:

| Name     | Data type | Cardinality | Description                                                                                                                                                     |
| -------- | --------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status` | number    | 1           | The HTTP status code. Example: `400`, `404`, `500`.                                                                                                             |
| `title`  | string    | 1           | A short, human-readable summary of the problem type. For example: `Resource not found` for every resource that could not be retrieved by the integration layer. |
| `detail` | string    | 1           | A human-readable explanation specific to this occurrence of the problem.                                                                                        |

:::note To be discussed

Add support for the [type property](https://www.rfc-editor.org/info/rfc9457/#name-type), for machine-readable processing?

:::

### Example

An example of the response headers of the integration layer:

```http
HTTP/2 404 Not Found
Content-Type: application/problem+json
Content-Language: en
```

Note that the integration layer has responded with the `application/problem+json` media type, even though the presentation layer may not have listed it in its `Accept` header. This is allowed by the [HTTP Semantics](https://www.rfc-editor.org/info/rfc9110/#field.accept). Also note the `Content-Language` header, to make clear that the content is in a particular language, per the `Accept-Language` header of the presentation layer or, if that header was not provided, the default language of the integration layer.

An example of the response body of the integration layer:

```json
{
  "status": 404,
  "title": "Resource not found",
  "detail": "No heritage object found with ID 1234"
}
```

Note that the `title` is generic (it applies to every resource) and that the `detail` is specific (it applies to a particular resource with a particular ID).

## Open access

The integration layer _SHOULD_ be open to any presentation layer without technical constraints, such as authentication (e.g. via the `Authorization` header) or IP address filtering.

Access should only be restricted to designated presentation layers under specific circumstances, such as legal requirements. This specification does not dictate which technical constraints an integration layer should implement; that decision rests with the integration layer based on its specific needs.

:::note To do

Rephrase or remove this section — it's not yet clear what the requirements are.

:::

## Client identification

The integration layer should be able to monitor the usage of its API and advise presentation layers in optimising their implementations. The integration layer should therefore be able to identify individual presentation layers.

1. A presentation layer _SHOULD_ send the `User-Agent` header in its requests. The header value _SHOULD_ consist of the name of the system of the presentation layer, the version of its system and the URL of the owner of the presentation layer. The value _SHOULD_ look like this: `system/version (url)`, e.g. `MyApp/1.7.6 (https://mymuseum.nl)`. See the [HTTP semantics](https://www.rfc-editor.org/info/rfc9110/#field.user-agent) for more information.
1. The integration layer _MAY_ respond with a `400 Bad Request` status code if the `User-Agent` header in the request is missing or invalid.

### Example

An example request from a presentation layer:

```http
GET /v1/entities/1234
Host: example.org
User-Agent: MyApp/1.7.6 (https://mymuseum.nl)
```

This tells the integration layer that the request comes from system `MyApp`, version `1.7.6`, operated by a presentation layer with URL `https://mymuseum.nl`.
