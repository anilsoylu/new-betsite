# GET All Team Rankings

{% tabs %}
{% tab title="Base URL" %}

```javascript
https://api.sportmonks.com/v3/football/team-rankings
```

{% endtab %}

{% tab title="Example Response" %}

```json
{
    "data": [
        {
            "id": 17694710,
            "team_id": 14754,
            "date": "2005-07-02",
            "current_rank": 1,
            "scaled_score": 100
        },
        {
            "id": 17694711,
            "team_id": 2963,
            "date": "2005-07-02",
            "current_rank": 2,
            "scaled_score": 94.11
        },
        {
            "id": 17694712,
            "team_id": 2352,
            "date": "2005-07-02",
            "current_rank": 3,
            "scaled_score": 91.16
        },
        {
            "id": 17694713,
            "team_id": 18072,
            "date": "2005-07-02",
            "current_rank": 4,
            "scaled_score": 91.16
        },
```

{% endtab %}

{% tab title="Field Description" %}

| Field          | Description                                                               | Type    |
| -------------- | ------------------------------------------------------------------------- | ------- |
| `id`           | Refers the unique id of the team ranking entity                           | integer |
| `team_id`      | Relation to Team Object                                                   | integer |
| `date`         | Date of the ranking (from 2005, until the current day 12:00am UTC update) | string  |
| `current_rank` | Team’s placement on that date                                             | integer |
| `scaled_score` | Scaled score (min 0, max 100)                                             | integer |
| {% endtab %}   |                                                                           |         |
| {% endtabs %}  |                                                                           |         |

{% tabs %}
{% tab title="Query Parameters" %}

<table><thead><tr><th>Name</th><th width="232.66666666666666">Required?</th><th>Description</th></tr></thead><tbody><tr><td><code>api_token</code></td><td><p>YES </p><p>Another option is to provide the API token in the header.</p></td><td>Your unique API token. Ex. ?api_token=YOUR_TOKEN</td></tr><tr><td><code>include</code></td><td>NO</td><td>Enrich the API response with more data by using includes. Ex. &#x26;include=fixture;player;team</td></tr><tr><td><code>select</code></td><td>NO</td><td>Select specific fields on the<a href="https://docs.sportmonks.com/football2/endpoints-and-entities/entities/fixtures"> base entity</a>. Read how to select fields in our <a href="https://docs.sportmonks.com/football2/api/request-options/selecting-fields">tutorial</a>.</td></tr><tr><td><code>sortBy</code></td><td>NO</td><td>Order by specific fields on the <a href="../../entities/fixture">base entity</a>. For more information check out <a href="../../../api/request-options/ordering-and-sorting">this</a> page.</td></tr><tr><td><code>filters</code></td><td>NO</td><td>Filter the API response on multiple related entities. There are static filters and dynamic filters.​<br><br>Please find the possibilities in the Static and Dynamic Filter tab.</td></tr><tr><td><code>locale</code></td><td>NO</td><td>Translate name fields of the API Response in your selected language. Find more information and which languages are available on our <a href="../../../api/translations-beta">translations page</a>.</td></tr></tbody></table>
{% endtab %}

{% tab title="Static Filters" %}

N/A
{% endtab %}

{% tab title="Dynamic Filters" %}
N/A
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

You can use a total of 1 nested includes on this endpoint

### Include options

`team`
