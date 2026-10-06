---
slug: /data-layer-api/rest/entities
sidebar_position: 5
---

# Entities

## Introduction

An entity is an identifiable 'thing' relevant to heritage. For example: 'The Night Watch' (a painting), 'Rembrandt' (a person), 'Amsterdam' (a place) and 'Brabantine Gothic' (a concept) are all entities.

Entities are what every data layer is about. They are the heritage information that a data layer exposes through its API. Presentation layers present this information to their users, and it is what those users care about. Everything else the data layer publishes — collections, facet values, keyword values — serves the entities: it organises, groups or finds them.

An entity has a URI of its own, independent of the collections it is a part of. The identifier of an entity is unique across all entity types and does not contain the type of the entity.

## Data model

An entity is a specialisation of a [Resource](resources.md#resource): it has an `id`, a `type` and a `name`. An entity is abstract: there is no entity whose type is `Entity`. Every entity has one of the concrete types that a data layer defines, published as part of its [type vocabulary](types.md).

The following class diagram visualises how entity types relate to a Resource and to each other. It shows two examples of the concrete types a data layer can define, 'Heritage object' and 'Person':

```mermaid
---
  config:
    class:
      hideEmptyMembersBox: true
---
classDiagram

class Resource["Resource"] {
  <<abstract>>
  id
  type
  name
}

class Entity["Entity"] {
  <<abstract>>
  id
  type
  name
}

class HeritageObject["Heritage object"]

class Person["Person"]

Resource <|-- Entity : type
Entity <|-- HeritageObject : type
Entity <|-- Person : type
```

## Entity types

An entity can be of any type. A data layer decides which types are relevant to its API and the presentation layers it serves.

For example, a data layer that exposes information about...

1. **all sorts of heritage objects** where the exact type does not matter, defines the generic entity type 'Heritage object';
1. **books** and **cars** defines the specific entity types 'Book' and 'Car';
1. **historical places** defines the specific entity types 'City', 'Town' and 'Hamlet';
1. **datasets** with heritage information defines the specific entity types 'Dataset' and 'Distribution'.

The following table provides examples of common entity types:

| Entity type name | Description                                                                |
| ---------------- | -------------------------------------------------------------------------- |
| Heritage object  | A valued object, e.g. a building, painting, book or document.              |
| Person           | A human being.                                                             |
| Organisation     | An organised group of people.                                              |
| Place            | A spatial extent on the Earth's surface.                                   |
| Concept          | A unit of thought.                                                         |
| Event            | A thing that happened at a certain time and location.                      |
| Story            | An account of an event.                                                    |
| Dataset          | A collection of data, e.g. data about heritage objects.                    |
| Digital object   | A digital representation of an entity, e.g. an image of a heritage object. |

### Recommended data models for entity types

:::note To do:

Describe the recommended data models (e.g. for a heritage object, a person, a place) using e.g. Schema.org concepts.

:::

:::note To do:

Explain data modelling requirements, e.g.

- Each entity must refer to the data provider's publication system from which it came (e.g. `isBasedOn`), and must have a licence (e.g. `license`);
- An entity should expose the [collections](collections.md) the entity is a member of. A presentation layer can then offer a 'more like this' or 'more from this collection' functionality.

:::

## Endpoint: Retrieve an entity

The endpoint retrieves an entity. The data layer _MUST_ implement this endpoint if it publishes at least one entity.

### HTTP request

`GET /{version}/entities/{id}`

### Path parameters

| Name      | Data type | Cardinality | Description                                         |
| --------- | --------- | ----------- | --------------------------------------------------- |
| `version` | string    | 1           | The version of the API. Example: `v1`.              |
| `id`      | string    | 1           | The path identifier of the entity. Example: `1234`. |

### Query parameters

None.

### Request body

None.

### Response body

The response body _MUST_ contain at least the properties underneath. Additional properties depend on the data model of the entity, defined by the data layer.

| Name   | Data type | Cardinality | Description                   |
| ------ | --------- | ----------- | ----------------------------- |
| `id`   | string    | 1           | The identifier of the entity. |
| `type` | string    | 1           | The type of the entity.       |
| `name` | string    | 1           | The name of the entity.       |

### Example

An example request from a presentation layer:

```http
GET /v1/entities/1234
Host: example.org
```

The request indicates that the data layer should return the entity with ID `1234`.

The response body depends on the data model of the entity. An example:

```json
{
  "id": "https://example.org/v1/entities/1234",
  "type": "HeritageObject",
  "name": "The Night Watch",
  "additionalTypes": [
    {
      "id": "https://example.org/v1/entities/1122",
      "type": "Concept",
      "name": "Painting"
    }
  ],
  "description": "Rembrandt’s largest, most famous canvas was made for the Arquebusiers guild hall...",
  "dateCreated": "1642",
  "creators": [
    {
      "id": "https://example.org/v1/entities/5678",
      "type": "Person",
      "name": "Rembrandt"
    }
  ],
  "locationsCreated": [
    {
      "id": "https://example.org/v1/entities/9012",
      "type": "Place",
      "name": "Amsterdam"
    }
  ]
  // Other properties...
}
```

The response indicates that this entity is a `HeritageObject` and has name 'The Night Watch'. It is linked to other entities of types `Concept`, `Person` and `Place`.
