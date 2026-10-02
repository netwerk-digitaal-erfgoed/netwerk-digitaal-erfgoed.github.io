---
slug: /data-layer-api/rest/suggestions
sidebar_position: 8
---

# Suggestions

## Introduction

A suggestion is a keyword or name displayed as a user types. For example: if a user types 'rem', suggestions might be 'Rembrandt' or 'Rem Koolhaas'. Suggestions help users save time. A user can select one of the suggested keywords or names and find entities matching the suggestion. This functionality is also known as autocompletion or typeahead.

Suggestions are tied to a particular [curated collection](collections.md), ensuring that results remain within the context of that collection.

Suggestions are optional. A data layer _MAY_ implement them, depending on its requirements. A data layer advertises the suggestion collections it supports for a curated collection in the [`suggestions` field of that collection](collections.md#capability-discovery). The field points to the list of suggestion collections, which a presentation layer retrieves with endpoint [Retrieve the suggestion collections of a curated collection](#endpoint-retrieve-the-suggestion-collections-of-a-curated-collection).

## Data model

| Name                           | Description                                                                                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Collection                     | An ordered list of resources. The generic type. See [Resources](resources.md).                                                                                     |
| Suggestion Collection          | An ordered list of suggestion items. This is an abstract type: a suggestion collection is always of one of the concrete types below. Specialization of Collection. |
| Keyword Suggestion Collection  | An ordered list of keyword suggestions. Specialization of Suggestion Collection.                                                                                   |
| Entity Suggestion Collection   | An ordered list of entities. Specialization of Suggestion Collection.                                                                                              |
| Combined Suggestion Collection | An ordered list of keyword suggestions and entities. Specialization of Suggestion Collection.                                                                      |
| Suggestion Item                | A selectable option within a Suggestion Collection, pointing to a Keyword Value or an Entity.                                                                      |
| Keyword Value                  | A keyword matching a suggestion query, e.g. 'windmill'. The keyword can be used as input to search for entities and find all that match it.                        |
| Entity                         | An identifiable 'thing' relevant to heritage, matching a suggestion query, e.g. a heritage object named 'A Watermill'. See [Entities](entities.md).                |

The following class diagram visualizes the data model:

```mermaid
---
  config:
    class:
      hideEmptyMembersBox: true
---
classDiagram

class Collection["Collection"] {
  id
  type
  name
  total items
}

class CuratedCollection["Curated Collection"]

class SuggestionCollection["Suggestion Collection"] {
  <<abstract>>
  id
  type
  name
  total items
}

class KeywordSuggestionCollection["Keyword Suggestion Collection"]
class EntitySuggestionCollection["Entity Suggestion Collection"]
class CombinedSuggestionCollection["Combined Suggestion Collection"]

class SuggestionItem["Suggestion Item"] {
  type
  relevance
}

class KeywordValue["Keyword Value"] {
  type
  name
}

class Entity {
  <<abstract>>
  id
  type
  name
}

Collection <|-- CuratedCollection
Collection <|-- SuggestionCollection
CuratedCollection --> Collection : suggestions
Collection --> CuratedCollection : belongs to
Collection *-- SuggestionCollection : items
SuggestionCollection --> Collection : part of
SuggestionCollection <|-- KeywordSuggestionCollection
SuggestionCollection <|-- EntitySuggestionCollection
SuggestionCollection <|-- CombinedSuggestionCollection
SuggestionCollection *-- SuggestionItem : items
SuggestionItem "1" *-- "0..1" KeywordValue : value
SuggestionItem "1" *-- "0..1" Entity  : value
```

## Search strategies

Suggestions can be found by using different search strategies. The data layer decides which strategy fits best. Common strategies include:

1. **Prefix search**. Prefix search restricts results to strings that start with the user's input. For example, the query `mil` will return `mill`, but not `windmill`. This strategy is optimized for speed and predictability; it is best suited for scenarios where users are searching for specific entities by their primary name or when the data layer wants to encourage an 'autocomplete-as-you-type' experience starting from the first letter.
1. **Infix search**. Infix search is a more flexible matching that looks for a query anywhere within a string. For example, the query `mil` will return `mill` and `windmill`. This is the recommended strategy when the data layer wants users to discover entities using parts of a name, even if they do not know exactly how the name begins. Be aware that infix search can be more computationally expensive than prefix search.

## Endpoint: Retrieve the suggestion collections of a curated collection

The endpoint retrieves all suggestion collections of a curated collection. The API _MUST_ implement this endpoint if it supports suggestions.

### HTTP request

`GET /{version}/collections(/{...collections})/{collection}/suggestions`

### Path parameters

| Name             | Data type | Cardinality | Description                                                                                        |
| ---------------- | --------- | ----------- | -------------------------------------------------------------------------------------------------- |
| `version`        | string    | 1           | The version of the API. Example: `v1`.                                                             |
| `...collections` | string    | 0 or more   | The path identifier(s) of the collection(s) the curated collection is part of. Example: `persons`. |
| `collection`     | string    | 1           | The path identifier of the curated collection. Example: `masterpieces`.                            |

### Query parameters

None.

### Request body

None.

### Response body

The response body _MUST_ contain at least the following fields:

| Name             | Data type            | Cardinality | Description                                                                                               |
| ---------------- | -------------------- | ----------- | --------------------------------------------------------------------------------------------------------- |
| `id`             | string               | 1           | The identifier of the collection.                                                                         |
| `type`           | string               | 1           | The type of the collection. It _MUST_ be `Collection` or a specialization.                                |
| `name`           | string               | 1           | The name of the collection.                                                                               |
| `totalItems`     | number               | 0 or 1      | The total number of suggestion collections. May be an estimate. Not set if it is too costly to calculate. |
| `items`          | array                | 1           | A list of the suggestion collections of the curated collection.                                           |
| `items[*]`       | SuggestionCollection | 1           | A suggestion collection.                                                                                  |
| `items[*].id`    | string               | 1           | The identifier of the suggestion collection.                                                              |
| `items[*].type`  | string               | 1           | The type of the suggestion collection. It _MUST_ be a specialization of `SuggestionCollection`.           |
| `items[*].name`  | string               | 1           | The name of the suggestion collection.                                                                    |
| `belongsTo`      | Collection           | 1           | The curated collection that this is the list of suggestion collections for.                               |
| `belongsTo.id`   | string               | 1           | The identifier of the curated collection.                                                                 |
| `belongsTo.type` | string               | 1           | The type of the curated collection. It _MUST_ be `Collection` or a specialization.                        |
| `belongsTo.name` | string               | 1           | The name of the curated collection.                                                                       |

The API _MUST NOT_ divide this collection into pages. The response body therefore does not contain `first` or `last`.

### Example

An example request from a presentation layer:

```http
GET /v1/collections/objects/suggestions
Host: example.org
```

The request indicates that the API should return all suggestion collections of a curated collection (`objects`).

An example of the response body of the API:

```json
{
  "id": "https://example.org/v1/collections/objects/suggestions",
  "type": "Collection",
  "name": "Suggestions",
  "totalItems": 3,
  "items": [
    {
      "id": "https://example.org/v1/collections/objects/suggestions/keywords",
      "type": "KeywordSuggestionCollection",
      "name": "Keyword suggestions"
    },
    {
      "id": "https://example.org/v1/collections/objects/suggestions/entities",
      "type": "EntitySuggestionCollection",
      "name": "Entity suggestions"
    },
    {
      "id": "https://example.org/v1/collections/objects/suggestions/combinations",
      "type": "CombinedSuggestionCollection",
      "name": "Keyword and entity suggestions"
    }
  ],
  "belongsTo": {
    "id": "https://example.org/v1/collections/objects",
    "type": "CuratedCollection",
    "name": "Objects"
  }
}
```

## Endpoint: Suggest keywords

The endpoint retrieves a list of keywords matching a query. A presentation layer can use a keyword as input to [search for entities](collections.md#endpoint-retrieve-a-page-in-a-collection) and find all entities that match the keyword. The endpoint is _OPTIONAL_: it _MAY_ be implemented by the API.

### HTTP request

`GET /{version}/collections(/{...collections})/{collection}/suggestions/{suggestion}`

### Path parameters

| Name             | Data type | Cardinality | Description                                                                                        |
| ---------------- | --------- | ----------- | -------------------------------------------------------------------------------------------------- |
| `version`        | string    | 1           | The version of the API. Example: `v1`.                                                             |
| `...collections` | string    | 0 or more   | The path identifier(s) of the collection(s) the curated collection is part of. Example: `persons`. |
| `collection`     | string    | 1           | The path identifier of the curated collection. Example: `masterpieces`.                            |
| `suggestion`     | string    | 1           | The path identifier of the keyword suggestion collection. Example: `keywords`.                     |

### Query parameters

| Name      | Data type | Cardinality | Description                                                                                                                                                                                                                                          |
| --------- | --------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`       | string    | 1           | A keyword query for filtering the suggestion items. Minimum length: defined by the API (e.g. 3 characters). Maximum length: defined by the API (e.g. 25 characters). The API defines how the query is matched, e.g. by using prefix or infix search. |
| `size`    | number    | 0 or 1      | The maximum number of suggestion items to retrieve. Minimum: 1. Default: 10. Maximum: defined by the API (e.g. 25).                                                                                                                                  |
| `orderBy` | string    | 0 or 1      | The sorting order of the suggestion items. It _MUST_ be one of `relevance`, `value`. Default: `relevance:desc` (most relevant suggestion first). The API defines which value is used to sort by `value` (e.g. the `name` of a keyword).              |

### Request body

None.

### Response body

The response body _MUST_ contain at least the following fields:

| Name                  | Data type      | Cardinality | Description                                                                                                                                                                                                                                                               |
| --------------------- | -------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                  | string         | 1           | The identifier of the collection.                                                                                                                                                                                                                                         |
| `type`                | string         | 1           | The type of the collection. It _MUST_ be `KeywordSuggestionCollection`.                                                                                                                                                                                                   |
| `name`                | string         | 1           | The name of the collection.                                                                                                                                                                                                                                               |
| `totalItems`          | number         | 1           | The total number of suggestion items in the collection.                                                                                                                                                                                                                   |
| `items`               | array          | 1           | A list of suggestion items. Empty if no suggestions matched the query.                                                                                                                                                                                                    |
| `items[*]`            | SuggestionItem | 1           | A suggestion item.                                                                                                                                                                                                                                                        |
| `items[*].type`       | string         | 1           | The type of the suggestion item. It _MUST_ be `SuggestionItem`.                                                                                                                                                                                                           |
| `items[*].relevance`  | number         | 1           | The relevance of the suggestion to the query. It _MUST_ be a whole number between 0 (not relevant) and 100 (relevant).                                                                                                                                                    |
| `items[*].value`      | KeywordValue   | 1           | The suggested keyword.                                                                                                                                                                                                                                                    |
| `items[*].value.type` | string         | 1           | The type of the keyword. It _MUST_ be `KeywordValue`.                                                                                                                                                                                                                     |
| `items[*].value.name` | string         | 1           | The name of the keyword.                                                                                                                                                                                                                                                  |
| `partOf`              | Collection     | 1           | The collection that lists the suggestion collections of a curated collection, including this one. See the response body of endpoint [Retrieve the suggestion collections of a curated collection](#endpoint-retrieve-the-suggestion-collections-of-a-curated-collection). |
| `partOf.id`           | string         | 1           | The identifier of the collection.                                                                                                                                                                                                                                         |
| `partOf.type`         | string         | 1           | The type of the collection. It _MUST_ be `Collection` or a specialization.                                                                                                                                                                                                |
| `partOf.name`         | string         | 1           | The name of the collection.                                                                                                                                                                                                                                               |

### Example

An example request from a presentation layer:

```http
GET /v1/collections/objects/suggestions/keywords?q=mil
Host: example.org
```

The request indicates that the API should return keyword suggestions from a curated collection (`objects`) matching a specific query (`mil`).

An example of the response body of the API:

```json
{
  "id": "https://example.org/v1/collections/objects/suggestions/keywords?q=mil",
  "type": "KeywordSuggestionCollection",
  "name": "Keyword suggestions",
  "totalItems": 2,
  "items": [
    {
      "type": "SuggestionItem",
      "relevance": 98,
      "value": {
        "type": "KeywordValue",
        "name": "mill"
      }
    },
    {
      "type": "SuggestionItem",
      "relevance": 92,
      "value": {
        "type": "KeywordValue",
        "name": "windmill"
      }
    }
  ],
  "partOf": {
    "id": "https://example.org/v1/collections/objects/suggestions",
    "type": "Collection",
    "name": "Suggestions"
  }
}
```

## Endpoint: Suggest entities

The endpoint retrieves a list of entities matching a query. An entity in the list can then be [directly retrieved](entities.md#endpoint-retrieve-an-entity). The endpoint is _OPTIONAL_: it _MAY_ be implemented by the API.

### HTTP request

`GET /{version}/collections(/{...collections})/{collection}/suggestions/{suggestion}`

### Path parameters

| Name             | Data type | Cardinality | Description                                                                                        |
| ---------------- | --------- | ----------- | -------------------------------------------------------------------------------------------------- |
| `version`        | string    | 1           | The version of the API. Example: `v1`.                                                             |
| `...collections` | string    | 0 or more   | The path identifier(s) of the collection(s) the curated collection is part of. Example: `persons`. |
| `collection`     | string    | 1           | The path identifier of the curated collection. Example: `masterpieces`.                            |
| `suggestion`     | string    | 1           | The path identifier of the entity suggestion collection. Example: `entities`.                      |

### Query parameters

| Name      | Data type | Cardinality | Description                                                                                                                                                                                                                                          |
| --------- | --------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`       | string    | 1           | A keyword query for filtering the suggestion items. Minimum length: defined by the API (e.g. 3 characters). Maximum length: defined by the API (e.g. 25 characters). The API defines how the query is matched, e.g. by using prefix or infix search. |
| `size`    | number    | 0 or 1      | The maximum number of suggestion items to retrieve. Minimum: 1. Default: 10. Maximum: defined by the API (e.g. 25).                                                                                                                                  |
| `orderBy` | string    | 0 or 1      | The sorting order of the suggestion items. One of `relevance`, `value`. Default: `relevance:desc` (most relevant suggestion first). The API defines which value is used to sort by `value` (e.g. the `name` of an entity).                           |

### Request body

None.

### Response body

The response body _MUST_ contain at least the following fields:

| Name                  | Data type      | Cardinality | Description                                                                                                                                                                                                                                                               |
| --------------------- | -------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                  | string         | 1           | The identifier of the collection.                                                                                                                                                                                                                                         |
| `type`                | string         | 1           | The type of the collection. It _MUST_ be `EntitySuggestionCollection`.                                                                                                                                                                                                    |
| `name`                | string         | 1           | The name of the collection.                                                                                                                                                                                                                                               |
| `totalItems`          | number         | 1           | The total number of suggestion items in the collection.                                                                                                                                                                                                                   |
| `items`               | array          | 1           | A list of suggestions items. Empty if no suggestions matched the query.                                                                                                                                                                                                   |
| `items[*]`            | SuggestionItem | 1           | A suggestion item.                                                                                                                                                                                                                                                        |
| `items[*].type`       | string         | 1           | The type of the suggestion item. It _MUST_ be `SuggestionItem`.                                                                                                                                                                                                           |
| `items[*].relevance`  | number         | 1           | The relevance of the suggestion to the query. It _MUST_ be a whole number between 0 (not relevant) and 100 (relevant).                                                                                                                                                    |
| `items[*].value`      | Entity         | 1           | The suggested entity.                                                                                                                                                                                                                                                     |
| `items[*].value.id`   | string         | 1           | The identifier of the entity.                                                                                                                                                                                                                                             |
| `items[*].value.type` | string         | 1           | The [type](entities.md#entity-types) of the entity.                                                                                                                                                                                                                       |
| `items[*].value.name` | string         | 1           | The name of the entity.                                                                                                                                                                                                                                                   |
| `partOf`              | Collection     | 1           | The collection that lists the suggestion collections of a curated collection, including this one. See the response body of endpoint [Retrieve the suggestion collections of a curated collection](#endpoint-retrieve-the-suggestion-collections-of-a-curated-collection). |
| `partOf.id`           | string         | 1           | The identifier of the collection.                                                                                                                                                                                                                                         |
| `partOf.type`         | string         | 1           | The type of the collection. It _MUST_ be `Collection` or a specialization.                                                                                                                                                                                                |
| `partOf.name`         | string         | 1           | The name of the collection.                                                                                                                                                                                                                                               |

The API _MAY_ expose additional fields about a suggested entity.

### Example

An example request from a presentation layer:

```http
GET /v1/collections/objects/suggestions/entities?q=mil
Host: example.org
```

The request indicates that the API should return entity suggestions from a curated collection (`objects`) matching a specific query (`mil`).

An example of the response body of the API:

```json
{
  "id": "https://example.org/v1/collections/objects/suggestions/entities?q=mil",
  "type": "EntitySuggestionCollection",
  "name": "Entity suggestions",
  "totalItems": 2,
  "items": [
    {
      "type": "SuggestionItem",
      "relevance": 98,
      "value": {
        "id": "https://example.org/v1/entities/1234",
        "type": "HeritageObject",
        "name": "A Watermill"
        // Optionally: other fields
      }
    },
    {
      "type": "SuggestionItem",
      "relevance": 92,
      "value": {
        "id": "https://example.org/v1/entities/5678",
        "type": "HeritageObject",
        "name": "Windmill at Wijk bij Duurstede"
        // Optionally: other fields
      }
    }
  ],
  "partOf": {
    "id": "https://example.org/v1/collections/objects/suggestions",
    "type": "Collection",
    "name": "Suggestions"
  }
}
```

## Endpoint: Suggest keywords and entities, combined

The endpoint retrieves a list of both keywords and entities matching a query. The API determines the distribution between keywords and entities returned (e.g. proportional or based on relevance). The endpoint is _OPTIONAL_: it _MAY_ be implemented by the API.

### HTTP request

`GET /{version}/collections(/{...collections})/{collection}/suggestions/{suggestion}`

### Path parameters

| Name             | Data type | Cardinality | Description                                                                                        |
| ---------------- | --------- | ----------- | -------------------------------------------------------------------------------------------------- |
| `version`        | string    | 1           | The version of the API. Example: `v1`.                                                             |
| `...collections` | string    | 0 or more   | The path identifier(s) of the collection(s) the curated collection is part of. Example: `persons`. |
| `collection`     | string    | 1           | The path identifier of the curated collection. Example: `masterpieces`.                            |
| `suggestion`     | string    | 1           | The path identifier of the keyword and entity suggestion collection. Example: `combinations`.      |

### Query parameters

| Name      | Data type | Cardinality | Description                                                                                                                                                                                                                                           |
| --------- | --------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`       | string    | 1           | A keyword query for filtering the suggestion items. Minimum length: defined by the API (e.g. 3 characters). Maximum length: defined by the API (e.g. 25 characters). The API defines how the query is matched, e.g. by using prefix or infix search.  |
| `size`    | number    | 0 or 1      | The maximum number of suggestion items to retrieve. Default: 10. Maximum: 25.                                                                                                                                                                         |
| `orderBy` | string    | 0 or 1      | The sorting order of the suggestion items. One of `relevance`, `value`. Default: `relevance:desc` (most relevant suggestion first). The API defines which value is used to sort by `value` (e.g. the `name` of a keyword or the `name` of an entity). |

### Request body

None.

### Response body

The response body _MUST_ contain at least the following fields:

| Name                  | Data type            | Cardinality | Description                                                                                                                                                                                                                                                               |
| --------------------- | -------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                  | string               | 1           | The identifier of the collection.                                                                                                                                                                                                                                         |
| `type`                | string               | 1           | The type of the collection. It _MUST_ be `CombinedSuggestionCollection`.                                                                                                                                                                                                  |
| `name`                | string               | 1           | The name of the collection.                                                                                                                                                                                                                                               |
| `totalItems`          | number               | 1           | The total number of suggestion items in the collection.                                                                                                                                                                                                                   |
| `items`               | array                | 1           | A list of suggestions items. Empty if no suggestions matched the query.                                                                                                                                                                                                   |
| `items[*]`            | SuggestionItem       | 1           | A suggestion item.                                                                                                                                                                                                                                                        |
| `items[*].type`       | string               | 1           | The type of the suggestion item. It _MUST_ be `SuggestionItem`.                                                                                                                                                                                                           |
| `items[*].relevance`  | number               | 1           | The relevance of the suggestion to the query. It _MUST_ be a whole number between 0 (not relevant) and 100 (relevant).                                                                                                                                                    |
| `items[*].value`      | Entity, KeywordValue | 1           | The value of the suggestion item: an entity or a keyword.                                                                                                                                                                                                                 |
| `items[*].value.id`   | string               | 0 or 1      | The identifier of the entity. Not set if the `type` is `KeywordValue`; a keyword has no identity.                                                                                                                                                                         |
| `items[*].value.type` | string               | 1           | The type of the value of the suggestion item. It _MUST_ be `KeywordValue` or a specialization of `Entity`.                                                                                                                                                                |
| `items[*].value.name` | string               | 1           | The name of the keyword value or entity.                                                                                                                                                                                                                                  |
| `partOf`              | Collection           | 1           | The collection that lists the suggestion collections of a curated collection, including this one. See the response body of endpoint [Retrieve the suggestion collections of a curated collection](#endpoint-retrieve-the-suggestion-collections-of-a-curated-collection). |
| `partOf.id`           | string               | 1           | The identifier of the collection.                                                                                                                                                                                                                                         |
| `partOf.type`         | string               | 1           | The type of the collection. It _MUST_ be `Collection` or a specialization.                                                                                                                                                                                                |
| `partOf.name`         | string               | 1           | The name of the collection.                                                                                                                                                                                                                                               |

The API _MAY_ expose additional fields about a suggested entity.

### Example

An example request from a presentation layer:

```http
GET /v1/collections/objects/suggestions/combinations?q=mil
Host: example.org
```

The request indicates that the API should return keyword and entity suggestions from a curated collection (`objects`) matching a specific query (`mil`).

An example of the response body of the API:

```json
{
  "id": "https://example.org/v1/collections/objects/suggestions/combinations?q=mil",
  "type": "CombinedSuggestionCollection",
  "name": "Keyword and entity suggestions",
  "totalItems": 2,
  "items": [
    {
      "type": "SuggestionItem",
      "relevance": 98,
      "value": {
        "type": "KeywordValue",
        "name": "windmill"
      }
    },
    {
      "type": "SuggestionItem",
      "relevance": 95,
      "value": {
        "id": "https://example.org/v1/entities/1234",
        "type": "HeritageObject",
        "name": "A Watermill"
        // Optionally: other fields
      }
    }
  ],
  "partOf": {
    "id": "https://example.org/v1/collections/objects/suggestions",
    "type": "Collection",
    "name": "Suggestions"
  }
}
```
