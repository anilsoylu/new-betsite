# GET All available TOTWs

{% tabs %}
{% tab title="Base URL" %}

```javascript
https://api.sportmonks.com/v3/football/team-of-the-week
```

{% endtab %}

{% tab title="Example Response" %}

```json
{
    "data": [
        {
            "id": 1,
            "player_id": 455900,
            "fixture_id": 18946393,
            "round_id": 318161,
            "team_id": 18644,
            "rating": "7.45",
            "formation_position": 2,
            "formation": "4-3-3"
        },
        {
            "id": 2,
            "player_id": 333731,
            "fixture_id": 18946393,
            "round_id": 318161,
            "team_id": 18644,
            "rating": "8.06",
            "formation_position": 3,
            "formation": "4-3-3"
        },
        {
            "id": 3,
            "player_id": 12393419,
            "fixture_id": 18946393,
            "round_id": 318161,
            "team_id": 18573,
            "rating": "7.65",
            "formation_position": 4,
            "formation": "4-3-3"
        },
        {
            "id": 4,
            "player_id": 466063,
            "fixture_id": 18946392,
            "round_id": 318161,
            "team_id": 15251,
            "rating": "8.06",
            "formation_position": 5,
            "formation": "4-3-3"
        },
        {
            "id": 5,
            "player_id": 260880,
            "fixture_id": 18946392,
            "round_id": 318161,
            "team_id": 15251,
            "rating": "9.79",
            "formation_position": 6,
            "formation": "4-3-3"
        },
        {
            "id": 6,
            "player_id": 186320,
            "fixture_id": 18946395,
            "round_id": 318161,
            "team_id": 18704,
            "rating": "9.79",
            "formation_position": 7,
            "formation": "4-3-3"
        },
        {
            "id": 7,
            "player_id": 129798,
            "fixture_id": 18946393,
            "round_id": 318161,
            "team_id": 18644,
            "rating": "8.16",
            "formation_position": 8,
            "formation": "4-3-3"
        },
        {
            "id": 8,
            "player_id": 160258,
            "fixture_id": 18946395,
            "round_id": 318161,
            "team_id": 18704,
            "rating": "9.18",
            "formation_position": 9,
            "formation": "4-3-3"
        },
        {
            "id": 9,
            "player_id": 6013424,
            "fixture_id": 18946392,
            "round_id": 318161,
            "team_id": 15251,
            "rating": "8.67",
            "formation_position": 10,
            "formation": "4-3-3"
        },
        {
            "id": 10,
            "player_id": 7346228,
            "fixture_id": 18946395,
            "round_id": 318161,
            "team_id": 18704,
            "rating": "9.49",
            "formation_position": 11,
            "formation": "4-3-3"
        },
        {
            "id": 11,
            "player_id": 254169,
            "fixture_id": 18946391,
            "round_id": 318161,
            "team_id": 18775,
            "rating": "8.47",
            "formation_position": 1,
            "formation": "4-3-3"
        },
        {
            "id": 12,
            "player_id": 78223,
            "fixture_id": 18946398,
            "round_id": 318162,
            "team_id": 18711,
            "rating": "8.06",
            "formation_position": 1,
            "formation": "4-3-3"
        },
        {
            "id": 13,
            "player_id": 159208,
            "fixture_id": 18946399,
            "round_id": 318162,
            "team_id": 18704,
            "rating": "7.85",
            "formation_position": 2,
            "formation": "4-3-3"
        },
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

YES

### Include depth

You can use a total of `3` nested includes on this endpoint

### Include options

`fixture` `team` `player` `round`&#x20;

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/11949411-c7a3a0a0-b5c5-4109-9bf6-f430fec65316?action=collection%2Ffork&collection-url=entityId%3D11949411-c7a3a0a0-b5c5-4109-9bf6-f430fec65316%26entityType%3Dcollection%26workspaceId%3D17c720d0-d97b-42a9-9ea7-23260ed53ddf)
