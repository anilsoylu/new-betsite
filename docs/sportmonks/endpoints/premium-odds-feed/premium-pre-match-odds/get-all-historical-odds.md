# GET All Historical Odds

{% hint style="info" %}
Our **Premium Odds Feed** provides a history of pre-match odds for fixtures for up to 7 days after the match has started. Additionally, we offer the history of the odd. We document the opening odds for each fixture, and subsequently, all changes and updates are stored and accessible for your use. So, every (historical) odd value is available for a fixture until 7 days after the match has started (the 'starting_at' timestamp of the fixture).
{% endhint %}

{% tabs %}
{% tab title="Base URL" %}

```javascript
https://api.sportmonks.com/v3/football/odds/premium/history
```

{% endtab %}

{% tab title="Example Response" %}

```json
{
  "data": [
  {
        "id": 351780754,
        "odd_id": 1028288850,
        "value": "1.78",
        "probability": "56.18%",
        "dp3": "1.780",
        "fractional": "39/50",
        "american": "78",
        "bookmaker_update": "2023-11-13 21:15:25"
    },
    {
        "id": 351780753,
        "odd_id": 1028288849,
        "value": "1.82",
        "probability": "54.95%",
        "dp3": "1.820",
        "fractional": "41/50",
        "american": "82",
        "bookmaker_update": "2023-11-13 21:15:25"
    },
    {
        "id": 351780750,
        "odd_id": 1019766847,
        "value": "2.16",
        "probability": "46.3%",
        "dp3": "2.160",
        "fractional": "29/25",
        "american": "116",
        "bookmaker_update": "2023-11-13 21:15:25"
    },
]
```

{% endtab %}

{% tab title="Field Description" %}

| Field            | Description                                            | Type     |
| ---------------- | ------------------------------------------------------ | -------- |
| id               | Unique id of the Premium Odd entity                    | int      |
| odd_id           | The id of the PremiumOdd entity the records belongs to | int      |
| value            | The (historical) value of the referring premium odd    | string   |
| probability      | Displays the probability odd                           | string   |
| dp3              | Displays the dp3 odd                                   | string   |
| fractional       | Displays the fractional odd                            | string   |
| american         | Displays the american odd                              | string   |
| bookmaker_update | Returns the timestamp of the bookmakers latest update  | datetime |
| {% endtab %}     |                                                        |          |
| {% endtabs %}    |                                                        |          |

{% tabs %}
{% tab title="Query Parameters" %}

<table><thead><tr><th>Name</th><th width="232.66666666666666">Required?</th><th>Description</th></tr></thead><tbody><tr><td><code>api_token</code></td><td><p>YES </p><p>Another option is to provide the API token in the header.</p></td><td>Your unique API token. Ex. ?api_token=YOUR_TOKEN</td></tr><tr><td><code>include</code></td><td>NO</td><td>Enrich the API response with more data by using includes. Ex. &#x26;include=fixture;bookmaker;market</td></tr><tr><td><code>select</code></td><td>NO</td><td>Select specific fields on the<a href="https://docs.sportmonks.com/football2/endpoints-and-entities/entities/fixtures"> base entity</a>. Read how to select fields in our <a href="https://docs.sportmonks.com/football2/api/request-options/selecting-fields">tutorial</a>.</td></tr><tr><td><code>filters</code></td><td>NO</td><td>Filter the API response on multiple related entities. There are static filters and dynamic filters.​<br><br>Please find the possibilities in the Static and Dynamic Filter tab.</td></tr><tr><td><code>locale</code></td><td>NO</td><td>Translate name fields of the API Response in your selected language. Find more information and which languages are available on our <a href="../../../../api/translations-beta">translations page</a>.</td></tr></tbody></table>
{% endtab %}

{% tab title="Static Filters" %}
**Static filters** are always the same and filter in one specific way without any custom options. Each static filter is listed below and has a description of how it filters. For more information, please look at our[ Filters page](https://docs.sportmonks.com/football/api/request-options/filtering).

| Static Filters | Available on Entity | Description              | Example                |
| -------------- | ------------------- | ------------------------ | ---------------------- |
| `winningOdds`  | Odds                | Filter all winning odds. | `&filters=winningOdds` |
| {% endtab %}   |                     |                          |                        |

{% tab title="Dynamic Filters" %}
The **dynamic filters** are based on entities and includes. Each dynamic filter uses an entity to filter on and one entity to apply the filter to. Below is an example with an explanation of how filters are set up. For more information, please look at our[ Filters page](https://docs.sportmonks.com/football/api/request-options/filtering).

{% hint style="info" %}
Using an include? Check their respective filters on their entity page. For example if you use `&include=fixtures`, you can apply [fixture-related filters](https://docs.sportmonks.com/football/entities/fixture#fixture-entity-filters).&#x20;
{% endhint %}

<table><thead><tr><th width="143">Dynamic Filters</th><th>Available on Entity</th><th>Description</th><th width="191">Examples</th></tr></thead><tbody><tr><td>N/A</td><td>N/A</td><td>Not available for this endpoint.   </td><td>N/A</td></tr></tbody></table>
{% endtab %}
{% endtabs %}

### Filters

More information on how to use filters can be found on our tutorials on how to [filter](https://docs.sportmonks.com/football2/api/request-options/filtering). If you want more information on which filters to use you can check out the following [endpoint](https://app.gitbook.com/s/z0kWjB5EvZvqGsozw8vP/endpoints/filters/get-all-entity-filters):&#x20;

{% hint style="info" %}

```javascript
https://api.sportmonks.com/v3/my/filters/entity?api_token=YOUR_TOKEN
```

{% endhint %}

### Pagination

YES

### Parameters

<table><thead><tr><th width="168">Parameter</th><th width="110">Required</th><th width="278">Description</th><th width="169">Example</th></tr></thead><tbody><tr><td><code>order</code></td><td>No</td><td>Returns odds ordered by <strong>id</strong> (<code>asc</code> or <code>desc</code>). Defaults to asc</td><td><em>&#x26;order=asc</em></td></tr><tr><td><code>per_page</code></td><td>No</td><td>The amount of results to return per page (max 50.). Defaults to 25.</td><td><em>&#x26;per_page=30</em></td></tr><tr><td><code>page</code></td><td>No</td><td>You can paginate using the <code>has_more</code> parameter to determine if you can still propagate through the results.</td><td><em>&#x26;page=2</em></td></tr></tbody></table>

### Include depth

You can use a total of `1` nested includes on this endpoint

### Include options

[`odd`](https://docs.sportmonks.com/football/entities/odd-and-prediction#premium-odd)

### Related entities

[PremiumOdd](https://docs.sportmonks.com/football/entities/odd-and-prediction#premium-odd)

### Postman

We also offer detailed postman documentation with examples and a complete up-to-date version of all our endpoints. Below is a button that lets your fork the collection or import it.

\
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/11949411-c7a3a0a0-b5c5-4109-9bf6-f430fec65316?action=collection%2Ffork&collection-url=entityId%3D11949411-c7a3a0a0-b5c5-4109-9bf6-f430fec65316%26entityType%3Dcollection%26workspaceId%3D17c720d0-d97b-42a9-9ea7-23260ed53ddf)
