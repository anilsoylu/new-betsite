# GET Expected by Player

{% tabs %}
{% tab title="Base URL" %}

```
https://api.sportmonks.com/v3/football/expected/lineups
```

{% endtab %}

{% tab title="Example Response" %}

```

  "data": [
    {
      "id": 1064853093,
      "fixture_id": 19076535,
      "player_id": 77908,
      "team_id": 238626,
      "lineup_id": 8076889919,
      "type_id": 5304,
      "data": {
        "value": 0.0295
      }
    },
    {
      "id": 1064853094,
      "fixture_id": 19076535,
      "player_id": 37389571,
      "team_id": 238626,
      "lineup_id": 8076889917,
      "type_id": 5304,
      "data": {
        "value": 0.0496
      }
    },
```

{% endtab %}

{% tab title="Field Description" %}

| Field         | Description                                           | Type    |
| ------------- | ----------------------------------------------------- | ------- |
| id            | Refers to the unique id of the expected value.        | integer |
| fixture_id    | Refers to the fixture related to the value.           | integer |
| player_id     | Refers to the player related to the value.            | integer |
| lineup_id     | Refers to the lineup record the player is related to. | integer |
| type_id       | Refers to the type of the Expected value.             | integer |
| value         | Displayes the value.                                  | integer |
| {% endtab %}  |                                                       |         |
| {% endtabs %} |                                                       |         |

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

{% hint style="info" %}
Please note that the availability of xG values varies depending on the package you choose.

- The **Basic** package offers access to the xG statistics 12 hours after the match finishes.&#x20;
- The **Standard** package offer access straight after the match has finished.&#x20;
- The **Advanced** package offers real-time availability to all xG statistics.

You can find more information on our dedicated [pricing page](https://www.sportmonks.com/blogs/xg-pricing-explained/).&#x20;
{% endhint %}

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
