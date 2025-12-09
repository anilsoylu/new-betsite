# GET TOTW per round

{% tabs %}
{% tab title="Base URL" %}

```javascript
https://api.sportmonks.com/v3/football/team-of-the-week/rounds/round_ID
```

{% endtab %}

{% tab title="Example Response" %}

```json
{
    "data": [
        {
            "id": 11464,
            "player_id": 1371,
            "fixture_id": 19135026,
            "round_id": 339271,
            "team_id": 9,
            "rating": "8.12",
            "formation_position": 8,
            "formation": "4-3-3"
        },
        {
            "id": 11467,
            "player_id": 1881,
            "fixture_id": 19135020,
            "round_id": 339271,
            "team_id": 11,
            "rating": "7.8",
            "formation_position": 11,
            "formation": "4-3-3"
        },
        {
            "id": 11469,
            "player_id": 5252,
            "fixture_id": 19135023,
            "round_id": 339271,
            "team_id": 1,
            "rating": "7.9",
            "formation_position": 5,
            "formation": "4-3-3"
        },
        {
            "id": 11470,
            "player_id": 7643,
            "fixture_id": 19135027,
            "round_id": 339271,
            "team_id": 51,
            "rating": "9.11",
            "formation_position": 6,
            "formation": "4-3-3"
        },
        {
            "id": 11471,
            "player_id": 7926,
            "fixture_id": 19135025,
            "round_id": 339271,
            "team_id": 63,
            "rating": "8.62",
            "formation_position": 7,
            "formation": "4-3-3"
        },
        {
            "id": 11466,
            "player_id": 160217,
            "fixture_id": 19135020,
            "round_id": 339271,
            "team_id": 11,
            "rating": "7.83",
            "formation_position": 10,
            "formation": "4-3-3"
        },
        {
            "id": 11468,
            "player_id": 162536,
            "fixture_id": 19135026,
            "round_id": 339271,
            "team_id": 9,
            "rating": "8.1",
            "formation_position": 4,
            "formation": "4-3-3"
        },
        {
            "id": 11463,
            "player_id": 4536500,
            "fixture_id": 19135027,
            "round_id": 339271,
            "team_id": 51,
            "rating": "8.11",
            "formation_position": 3,
            "formation": "4-3-3"
        },
        {
            "id": 11462,
            "player_id": 24082563,
            "fixture_id": 19135028,
            "round_id": 339271,
            "team_id": 78,
            "rating": "8.48",
            "formation_position": 2,
            "formation": "4-3-3"
        },
        {
            "id": 11465,
            "player_id": 28912805,
            "fixture_id": 19135025,
            "round_id": 339271,
            "team_id": 63,
            "rating": "7.77",
            "formation_position": 9,
            "formation": "4-3-3"
        },
        {
            "id": 11461,
            "player_id": 37430162,
            "fixture_id": 19135027,
            "round_id": 339271,
            "team_id": 6,
            "rating": "8.11",
            "formation_position": 1,
            "formation": "4-3-3"
        }
    ],
```

{% endtab %}

{% tab title="Field Description" %}

| Field              | Description                                         | Type    |
| ------------------ | --------------------------------------------------- | ------- |
| id                 | Refers the unique id of the TOTW entity             | integer |
| player_id          | Refers to the player of the Team of the week        | integer |
| fixture_id         | Refers to the fixture the TOTW player played in     | integer |
| round_id           | Refers to the round the fixture is played at        | integer |
| team_id            | Refers to the team the TOTW player played for       | integer |
| rating             | Refers to the rating of the TOTW player             | integer |
| formation_position | Refers to the player position in the TOTW formation | integer |
| formation          | Refers to the TOTW's formation                      | integer |
| {% endtab %}       |                                                     |         |
| {% endtabs %}      |                                                     |         |

{% tabs %}
{% tab title="Query Parameters" %}

<table><thead><tr><th>Name</th><th width="232.66666666666666">Required?</th><th>Description</th></tr></thead><tbody><tr><td><code>api_token</code></td><td><p>YES </p><p>Another option is to provide the API token in the header.</p></td><td>Your unique API token. Ex. ?api_token=YOUR_TOKEN</td></tr><tr><td><code>include</code></td><td>NO</td><td>Enrich the API response with more data by using includes. Ex. &#x26;include=fixture;player;team</td></tr><tr><td><code>select</code></td><td>NO</td><td>Select specific fields on the<a href="https://docs.sportmonks.com/football2/endpoints-and-entities/entities/fixtures"> base entity</a>. Read how to select fields in our <a href="https://docs.sportmonks.com/football2/api/request-options/selecting-fields">tutorial</a>.</td></tr><tr><td><code>sortBy</code></td><td>NO</td><td>Order by specific fields on the <a href="../../entities/fixture">base entity</a>. For more information check out <a href="../../../api/request-options/ordering-and-sorting">this</a> page.</td></tr><tr><td><code>filters</code></td><td>NO</td><td>Filter the API response on multiple related entities. There are static filters and dynamic filters.​<br><br>Please find the possibilities in the Static and Dynamic Filter tab.</td></tr><tr><td><code>locale</code></td><td>NO</td><td>Translate name fields of the API Response in your selected language. Find more information and which languages are available on our <a href="../../../api/translations-beta">translations page</a>.</td></tr></tbody></table>
{% endtab %}

{% tab title="Static Filters" %}
**N/A**
{% endtab %}

{% tab title="Dynamic Filters" %}
**N/A**

{% hint style="info" %}
Using an include? Check their respective filters on their entity page. For example if you use `&include=participants` you can apply [team-related filters](https://docs.sportmonks.com/football/entities/team-player-squad-coach-and-referee#team).&#x20;
{% endhint %}
{% endtab %}
{% endtabs %}

### **Filters**

More information on how to use filters can be found on our tutorials on how to [filter](https://docs.sportmonks.com/football2/api/request-options/filtering). If you want more information on which filters to use you can check out the following [endpoint](https://app.gitbook.com/s/z0kWjB5EvZvqGsozw8vP/endpoints/filters/get-all-entity-filters):

{% hint style="info" %}

```javascript
https://api.sportmonks.com/v3/my/filters/entity?api_token=YOUR_TOKEN
```

{% endhint %}

### Pagination

NO

### Include depth

You can use a total of `3` nested includes on this endpoint

### Include options

`fixture` `team` `player` `round`&#x20;

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/11949411-c7a3a0a0-b5c5-4109-9bf6-f430fec65316?action=collection%2Ffork&collection-url=entityId%3D11949411-c7a3a0a0-b5c5-4109-9bf6-f430fec65316%26entityType%3Dcollection%26workspaceId%3D17c720d0-d97b-42a9-9ea7-23260ed53ddf)
