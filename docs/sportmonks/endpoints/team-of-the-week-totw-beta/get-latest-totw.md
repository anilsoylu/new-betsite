# GET Latest TOTW

{% tabs %}
{% tab title="Base URL" %}
{% code overflow="wrap" %}

```javascript
https://api.sportmonks.com/v3/football/team-of-the-week/leagues/league_ID/latest
```

{% endcode %}
{% endtab %}

{% tab title="Example Response" %}

```json
{
    "data": [
        {
            "id": 12987,
            "player_id": 1646,
            "fixture_id": 19136803,
            "round_id": 339435,
            "team_id": 750,
            "rating": "8.02",
            "formation_position": 3,
            "formation": "4-3-3"
        },
        {
            "id": 12993,
            "player_id": 23657,
            "fixture_id": 19136806,
            "round_id": 339435,
            "team_id": 494,
            "rating": "8.38",
            "formation_position": 9,
            "formation": "4-3-3"
        },
        {
            "id": 12985,
            "player_id": 25482,
            "fixture_id": 19136803,
            "round_id": 339435,
            "team_id": 919,
            "rating": "8.72",
            "formation_position": 1,
            "formation": "4-3-3"
        },
        {
            "id": 12991,
            "player_id": 22136638,
            "fixture_id": 19136802,
            "round_id": 339435,
            "team_id": 61,
            "rating": "9.51",
            "formation_position": 7,
            "formation": "4-3-3"
        },
        {
            "id": 12990,
            "player_id": 23277869,
            "fixture_id": 19136807,
            "round_id": 339435,
            "team_id": 682,
            "rating": "10",
            "formation_position": 6,
            "formation": "4-3-3"
        },
        {
            "id": 12989,
            "player_id": 37257612,
            "fixture_id": 19136803,
            "round_id": 339435,
            "team_id": 750,
            "rating": "7.86",
            "formation_position": 5,
            "formation": "4-3-3"
        },
        {
            "id": 12992,
            "player_id": 37317434,
            "fixture_id": 19136807,
            "round_id": 339435,
            "team_id": 682,
            "rating": "8.61",
            "formation_position": 8,
            "formation": "4-3-3"
        },
        {
            "id": 12986,
            "player_id": 37342613,
            "fixture_id": 19136806,
            "round_id": 339435,
            "team_id": 494,
            "rating": "8",
            "formation_position": 2,
            "formation": "4-3-3"
        },
        {
            "id": 12988,
            "player_id": 37570131,
            "fixture_id": 19136801,
            "round_id": 339435,
            "team_id": 2345,
            "rating": "7.79",
            "formation_position": 4,
            "formation": "4-3-3"
        },
        {
            "id": 12984,
            "player_id": 37630418,
            "fixture_id": 19136802,
            "round_id": 339435,
            "team_id": 61,
            "rating": "8.43",
            "formation_position": 11,
            "formation": "4-3-3"
        },
        {
            "id": 12994,
            "player_id": 37663893,
            "fixture_id": 19136801,
            "round_id": 339435,
            "team_id": 2345,
            "rating": "7.85",
            "formation_position": 10,
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
