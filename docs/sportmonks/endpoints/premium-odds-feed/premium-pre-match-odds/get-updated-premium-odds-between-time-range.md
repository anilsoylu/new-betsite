# GET Updated Premium Odds Between Time Range

{% hint style="info" %}
Our **Premium Odds Feed** provides a history of pre-match odds for fixtures for up to 7 days after the match has started. Additionally, we offer the history of the odd. We document the opening odds for each fixture, and subsequently, all changes and updates are stored and accessible for your use. So, every (historical) odd value is available for a fixture until 7 days after the match has started (the 'starting_at' timestamp of the fixture).
{% endhint %}

{% tabs %}
{% tab title="Base URL" %}

```javascript
https://api.sportmonks.com/v3/football/odds/premium/updated/between/{timestamp}/{timestamp}
```

{% endtab %}

{% tab title="Example Response" %}

```json
{
  "data": [
    {
        "id": 350099286,
        "fixture_id": 18772634,
        "market_id": 101,
        "bookmaker_id": 130,
        "label": "1st Half",
        "value": "3.35",
        "name": "1st Half",
        "sort_order": 1,
        "market_description": "Half with Most Goals",
        "probability": "29.85%",
        "dp3": "3.350",
        "fractional": "47/20",
        "american": "235",
        "stopped": false,
        "total": null,
        "handicap": null,
        "created_at": "2023-10-16T15:37:11.000000Z",
        "updated_at": "2023-10-16T15:37:10.000000Z",
        "latest_bookmaker_update": "2023-10-16 15:36:40"
    },
    {
        "id": 350099287,
        "fixture_id": 18772634,
        "market_id": 101,
        "bookmaker_id": 130,
        "label": "Draw",
        "value": "2.70",
        "name": "Draw",
        "sort_order": 2,
        "market_description": "Half with Most Goals",
        "probability": "37.04%",
        "dp3": "2.700",
        "fractional": "17/10",
        "american": "170",
        "stopped": false,
        "total": null,
        "handicap": null,
        "created_at": "2023-10-16T15:37:11.000000Z",
        "updated_at": "2023-10-16T15:37:10.000000Z",
        "latest_bookmaker_update": "2023-10-16 15:36:40"
    },
    {
        "id": 350099288,
        "fixture_id": 18772634,
        "market_id": 101,
        "bookmaker_id": 130,
        "label": "2nd Half",
        "value": "2.10",
        "name": "2nd Half",
        "sort_order": 3,
        "market_description": "Half with Most Goals",
        "probability": "47.62%",
        "dp3": "2.100",
        "fractional": "11/10",
        "american": "110",
        "stopped": false,
        "total": null,
        "handicap": null,
        "created_at": "2023-10-16T15:37:11.000000Z",
        "updated_at": "2023-10-16T15:37:10.000000Z",
        "latest_bookmaker_update": "2023-10-16 15:36:40"
    }
]
```

{% endtab %}

{% tab title="Field Description" %}

<table><thead><tr><th width="272.5089974293059">Field</th><th>Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the odd</td><td>integer</td></tr><tr><td>fixture_id</td><td>Refers to the fixture related to the odd</td><td>integer</td></tr><tr><td>market_id</td><td>Refers to the market related to the odd</td><td>integer</td></tr><tr><td>bookmaker_id</td><td>Refers to the bookmaker related to the odd</td><td>integer</td></tr><tr><td>label</td><td>Displays the label of the odd</td><td>string</td></tr><tr><td>value</td><td>Displays the value of the odd</td><td>string</td></tr><tr><td>name</td><td>Displays the name of the odd</td><td>string</td></tr><tr><td>market_description</td><td>Displays the description of the market</td><td>string</td></tr><tr><td>probability</td><td>Displays the probability odd</td><td>string</td></tr><tr><td>dp3</td><td>Displays the dp3 odd</td><td>string</td></tr><tr><td>fractional</td><td>Displays the fractional odd</td><td>string</td></tr><tr><td>american</td><td>Displays the american odd</td><td>string</td></tr><tr><td>stopped</td><td>Determines if the odd is stopped or not</td><td>boolean</td></tr><tr><td>total</td><td>Displays the total of the odd</td><td>string / null</td></tr><tr><td>handicap</td><td>Displays the handicap of the odd</td><td>string / null</td></tr><tr><td>created_at</td><td>Displays the time that the odd was created</td><td>string</td></tr><tr><td>updated_at</td><td>Displays the time the odd was last updated</td><td>string </td></tr><tr><td>latest_bookmaker_update</td><td>Returns the timestamp of the bookmakers latest update</td><td>string / null</td></tr></tbody></table>
{% endtab %}
{% endtabs %}

{% hint style="warning" %}
Please note that Premium Odds do not have winning odds functionality yet. However, we are working on adding this functionality to the Premium Odds feed.
{% endhint %}

{% hint style="info" %}
Since this endpoint may return lots of data, we recommend using the populate filter to allow a maximum of 1000 results per page to be returned.
{% endhint %}

{% tabs %}
{% tab title="Query Parameters" %}

<table><thead><tr><th>Name</th><th width="232.66666666666666">Required?</th><th>Description</th></tr></thead><tbody><tr><td><code>api_token</code></td><td><p>YES </p><p>Another option is to provide the API token in the header.</p></td><td>Your unique API token. Ex. ?api_token=YOUR_TOKEN</td></tr><tr><td><code>include</code></td><td>NO</td><td>Enrich the API response with more data by using includes. Ex. &#x26;include=fixture;bookmaker;market</td></tr><tr><td><code>select</code></td><td>NO</td><td>Select specific fields on the<a href="https://docs.sportmonks.com/football2/endpoints-and-entities/entities/fixtures"> base entity</a>. Read how to select fields in our <a href="https://docs.sportmonks.com/football2/api/request-options/selecting-fields">tutorial</a>.</td></tr><tr><td><code>filters</code></td><td>NO</td><td>Filter the API response on multiple related entities. There are static filters and dynamic filters.​<br><br>Please find the possibilities in the Static and Dynamic Filter tab.</td></tr><tr><td><code>locale</code></td><td>NO</td><td>Translate name fields of the API Response in your selected language. Find more information and which languages are available on our <a href="../../../../api/translations-beta">translations page</a>.</td></tr></tbody></table>
{% endtab %}

{% tab title="Static Filters" %}
**Static filters** are always the same and filter in one specific way without any custom options. Each static filter is listed below and has a description of how it filters. For more information, please look at our[ Filters page](https://docs.sportmonks.com/football/api/request-options/filtering).

| Static Filters | Available on Entity | Description                                                                     | Example                                                                                                                                          |
| -------------- | ------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `markets`      | Odds                | Filter the odds on a selection of markets separated by a comma.                 | <p><code>\&include=market\&filters=markets:marketIDs</code><br><br><code>\&include=market\&filters=markets:12,14</code></p>                      |
| `bookmakers`   | Odds                | Filter the odds on a selection of bookmakers separated by a comma. (e.g: 2,14). | <p><code>\&include=bookmaker\&filters=bookmakers:bookmakerIDs</code> </p><p></p><p><code>\&include=bookmaker\&filters=bookmakers:2,14</code></p> |
| {% endtab %}   |                     |                                                                                 |                                                                                                                                                  |

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

<table><thead><tr><th width="168">Parameter</th><th width="110">Required</th><th width="278">Description</th><th width="169">Example</th></tr></thead><tbody><tr><td><code>order</code></td><td>No</td><td>Returns odds ordered by <strong>latest_bookmaker_update</strong> (<code>asc</code> or <code>desc</code>). Defaults to desc</td><td><em>&#x26;order=asc</em></td></tr><tr><td><code>per_page</code></td><td>No</td><td>The amount of results to return per page (max 50.). Defaults to 25.</td><td><em>&#x26;per_page=30</em></td></tr><tr><td><code>page</code></td><td>No</td><td>You can paginate using the <code>has_more</code> parameter to determine if you can still propagate through the results.</td><td><em>&#x26;page=2</em></td></tr></tbody></table>

### Include depth

You can use a total of `1` nested includes on this endpoint

### Include options

[`market`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`bookmaker`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`fixture`](https://docs.sportmonks.com/football/entities/fixture#fixture) [`history`](https://docs.sportmonks.com/football/entities/odd-and-prediction#premiumoddhistory)

### Related entities

[PremiumOdd](https://docs.sportmonks.com/football/entities/odd-and-prediction#premium-odd)

### Postman

We also offer detailed postman documentation with examples and a complete up-to-date version of all our endpoints. Below is a button that lets your fork the collection or import it.

\
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/11949411-c7a3a0a0-b5c5-4109-9bf6-f430fec65316?action=collection%2Ffork&collection-url=entityId%3D11949411-c7a3a0a0-b5c5-4109-9bf6-f430fec65316%26entityType%3Dcollection%26workspaceId%3D17c720d0-d97b-42a9-9ea7-23260ed53ddf)
