# GET Expected Lineups by Player

{% tabs %}
{% tab title="Base URL" %}

```json
https://api.sportmonks.com/v3/football/expected-lineups/players/PLAYER_ID
```

{% endtab %}

{% tab title="Example Response" %}

```json
{
    "data": [
        {
            "id": 1,
            "sport_id": 1,
            "fixture_id": 19347797,
            "player_id": 37526530,
            "team_id": 3285,
            "formation_field": null,
            "position_id": null,
            "detailed_position_id": null,
            "type_id": 77615,
            "formation_position": null,
            "player_name": "Hlynur Freyr Karlsson",
            "jersey_number": 2
        }
```

{% endtab %}

{% tab title="Field Description" %}

| Field                  | Description                                    | Type    |
| ---------------------- | ---------------------------------------------- | ------- |
| `id`                   | Refers to the unique id of the expected value. | integer |
| `sport_id`             | Refers to the sport of the expected lineup     | integer |
| `fixture_id`           | Refers to the fixture related to the value.    | integer |
| `player_id`            | Refers to the player in the expected lineup    | integer |
| `team_id`              | Refers to the team the player plays for        | integer |
| `formation_field`      | Refers to the formation field                  | integer |
| `position_id`          | Refers to the players' position                | integer |
| `detailed_position_id` | Refers to the detailed players' position       | integer |
| `type_id`              | Refers to the type of the Expected lineup.     | integer |
| `formation_position`   | Refers to the formation position               | integer |
| `player_name`          | The name of the player                         | string  |
| `jersey_number`        | The number of the player                       | integer |
| {% endtab %}           |                                                |         |
| {% endtabs %}          |                                                |         |

{% tabs %}
{% tab title="Query Parameters" %}

<table><thead><tr><th>Query Parameters</th><th width="164.33333333333331">Required?</th><th>Description</th></tr></thead><tbody><tr><td><code>api_token</code></td><td>YES</td><td>Your unique API token</td></tr><tr><td><code>include</code></td><td>NO</td><td>Enrich the API with more data by using includes</td></tr><tr><td><code>select</code></td><td>NO</td><td>Select specific fields on the base entity.</td></tr><tr><td><code>filters</code></td><td>NO</td><td><p>Filter the API response on multiple related entities. There are static filters and dynamic filters.</p><p></p><p>Please find the possibilities in the Static and Dynamic Filter tab.</p></td></tr></tbody></table>
{% endtab %}

{% tab title="Static Filters" %}
Not applicable for this endpoint.
{% endtab %}

{% tab title="Dynamic Filters" %}
The **dynamic filters** are based on entities and includes. Each dynamic filter uses an entity to filter on and one entity to apply the filter to. Below is an example with an explanation of how filters are set up. For more information, please look at our[ Filters page](https://docs.sportmonks.com/football/api/request-options/filtering).

{% hint style="info" %}
Using an include? Check their respective filters on their entity page. For example if you use `&include=fixtures`, you can apply [fixture-related filters](https://docs.sportmonks.com/football/endpoints-and-entities/entities/fixture#fixture-entity-filters).
{% endhint %}

| Dynamic Filters | Available on Entity                                                                | Description                                                           | Examples                                                                                                           |
| --------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `Types`         | [LineupDetail](https://docs.sportmonks.com/football/entities/fixture#lineupdetail) | Filters the player statistics on a specific type separated by commas. | <p><code>\&filters=lineupDetailTypes:TypeIDs</code></p><p></p><p><code>\&filters=lineupDetailTypes:5304</code></p> |
| {% endtab %}    |                                                                                    |                                                                       |                                                                                                                    |
| {% endtabs %}   |                                                                                    |                                                                       |                                                                                                                    |

#### Pagination

Yes

#### Include depth

You can use a total of `3` nested includes on this endpoint

#### Include options

[`type`](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/types) [`fixture`](https://docs.sportmonks.com/football/endpoints-and-entities/entities/fixture) [`player`](https://docs.sportmonks.com/football/entities/team-player-squad-coach-and-referee#player) [`team`](https://docs.sportmonks.com/football/entities/team-player-squad-coach-and-referee#team)

**Related Entities:**

Get an overview and explanation of all the fields returned in the API response. The related entities for the expected endpoints are:

- [Expected](https://docs.sportmonks.com/football/endpoints-and-entities/entities/expected)

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/11949411-c7a3a0a0-b5c5-4109-9bf6-f430fec65316?action=collection%2Ffork&collection-url=entityId%3D11949411-c7a3a0a0-b5c5-4109-9bf6-f430fec65316%26entityType%3Dcollection%26workspaceId%3D17c720d0-d97b-42a9-9ea7-23260ed53ddf)
