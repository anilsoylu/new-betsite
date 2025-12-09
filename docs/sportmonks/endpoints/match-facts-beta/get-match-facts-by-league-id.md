# GET Match Facts by league ID

{% tabs %}
{% tab title="Base URL" %}

```javascript
https://api.sportmonks.com/v3/football/match-facts/leagues/LEAGUE_ID
```

{% endtab %}

{% tab title="Example Response" %}

```json
{
    "data": [
        {
            "id": 5,
            "sport_id": 1,
            "fixture_id": 19426556,
            "type_id": 76088,
            "team": "away",
            "category": "h2h",
            "data": {
                "all": {
                    "count": 2,
                    "percentage": 40
                },
                "home": {
                    "count": 1,
                    "percentage": 50
                },
                "away": {
                    "count": 1,
                    "percentage": 50
                }
            },
            "natural_language": "Karbala has 2 wins against Newroz SC"
        },
```

{% endtab %}

{% tab title="Field Description" %}

| Field         | Description                                   | Type    |
| ------------- | --------------------------------------------- | ------- |
| `id`          | Refers the unique id of the match fact entity | integer |
| `sport_id`    | Refers to the sport of the match fact         | integer |
| `fixture_id`  | Refers to the fixture                         | integer |
| `type_id`     | Refers to the type of the match fact          | integer |
| `team`        | Refers to the team the home or away team      | string  |
| `category`    | Refers to the category of the match fact      | string  |
| {% endtab %}  |                                               |         |
| {% endtabs %} |                                               |         |

{% tabs %}
{% tab title="Query Parameters" %}

<table><thead><tr><th>Name</th><th width="232.66666666666666">Required?</th><th>Description</th></tr></thead><tbody><tr><td><code>api_token</code></td><td><p>YES </p><p>Another option is to provide the API token in the header.</p></td><td>Your unique API token. Ex. ?api_token=YOUR_TOKEN</td></tr><tr><td><code>include</code></td><td>NO</td><td>Enrich the API response with more data by using includes. Ex. &#x26;include=fixture;player;team</td></tr><tr><td><code>select</code></td><td>NO</td><td>Select specific fields on the<a href="https://docs.sportmonks.com/football2/endpoints-and-entities/entities/fixtures"> base entity</a>. Read how to select fields in our <a href="https://docs.sportmonks.com/football2/api/request-options/selecting-fields">tutorial</a>.</td></tr><tr><td><code>sortBy</code></td><td>NO</td><td>Order by specific fields on the <a href="../../entities/fixture">base entity</a>. For more information check out <a href="../../../api/request-options/ordering-and-sorting">this</a> page.</td></tr><tr><td><code>filters</code></td><td>NO</td><td>Filter the API response on multiple related entities. There are static filters and dynamic filters.​<br><br>Please find the possibilities in the Static and Dynamic Filter tab.</td></tr><tr><td><code>locale</code></td><td>NO</td><td>Translate name fields of the API Response in your selected language. Find more information and which languages are available on our <a href="../../../api/translations-beta">translations page</a>.</td></tr></tbody></table>
{% endtab %}

{% tab title="Static Filters" %}
When you opt for the `matchFacts` include on one of the fixtures endpoint, you can also use the `havingLiveMatchFacts` filter. This filters fixtures that have live match facts, such as outcomes by players sent off field & outcomes by goals&#x20;
{% endtab %}

{% tab title="Dynamic Filters" %}
The **dynamic filters** are based on entities and includes. Each dynamic filter uses an entity to filter on and one entity to apply the filter on. Below are examples with explanations of how filters are set up. For more information, please look at our[ Filters page](https://docs.sportmonks.com/football/api/request-options/filtering).

{% hint style="info" %}
Using an include? Check their respective filters on their entity page. For example if you use `&include=fixtures`, you can apply [fixture-related filters](https://docs.sportmonks.com/football/entities/fixture#fixture-entity-filters).&#x20;
{% endhint %}

<table><thead><tr><th width="147">Dynamic Filters</th><th>Available on Entity</th><th width="172">Description</th><th>Examples</th></tr></thead><tbody><tr><td><code>types</code></td><td>Statistics, Events, Lineup, Transfers and way more. Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all filter possibilities.</td><td>Filter the transfers on a selection of type ids separated by a comma. </td><td><p><code>&#x26;include=type&#x26;filters=facts:FACTS_TYPES</code></p><p></p><p><code>&#x26;include=type&#x26;filters=facts:1601,1602</code> </p><p></p></td></tr></tbody></table>

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

`type` `sport` `fixture` &#x20;

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/11949411-c7a3a0a0-b5c5-4109-9bf6-f430fec65316?action=collection%2Ffork&collection-url=entityId%3D11949411-c7a3a0a0-b5c5-4109-9bf6-f430fec65316%26entityType%3Dcollection%26workspaceId%3D17c720d0-d97b-42a9-9ea7-23260ed53ddf)
