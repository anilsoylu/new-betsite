# GET Season Statistics by Participant

{% tabs %}
{% tab title="Base URL" %}

```javascript
https://api.sportmonks.com/v3/football/statistics/seasons/{participant}/{id}
```

{% endtab %}

{% tab title="Example Response" %}

```json
{
  "data": [
          {
            "id": 27262200,
            "player_id": 1371,
            "team_id": 9,
            "season_id": 10,
            "has_values": true,
            "position_id": 26,
            "jersey_number": 17,
            "details": [
                {
                    "id": 26847082,
                    "player_statistic_id": 27262200,
                    "type_id": 42,
                    "value": {
                        "total": 45
                    }
                },
                {
                    "id": 26846973,
                    "player_statistic_id": 27262200,
                    "type_id": 51,
                    "value": {
                        "total": 8
                    }
                },
                {
                    "id": 23701480,
                    "player_statistic_id": 27262200,
                    "type_id": 52,
                    "value": {
                        "total": 7,
                        "goals": 7,
                        "penalties": 0
                    }
                },
                {
                    "id": 26846804,
                    "player_statistic_id": 27262200,
                    "type_id": 56,
                    "value": {
                        "total": 16
                    }
                },
                {
                    "id": 1668214,
                    "player_statistic_id": 27262200,
                    "type_id": 59,
                    "value": {
                        "in": 3,
                        "out": 4
                    }
                },
                {
                    "id": 26846895,
                    "player_statistic_id": 27262200,
                    "type_id": 64,
                    "value": {
                        "total": 1
                    }
                },
                {
                    "id": 26847121,
                    "player_statistic_id": 27262200,
                    "type_id": 78,
                    "value": {
                        "total": 28
                    }
                },
                {
                    "id": 23701465,
                    "player_statistic_id": 27262200,
                    "type_id": 79,
                    "value": {
                        "total": 9
                    }
                },
                {
                    "id": 26846993,
                    "player_statistic_id": 27262200,
                    "type_id": 80,
                    "value": {
                        "total": 983
                    }
                },
                {
                    "id": 1668239,
                    "player_statistic_id": 27262200,
                    "type_id": 84,
                    "value": {
                        "total": 2,
                        "home": 1,
                        "away": 1
                    }
                },
                {
                    "id": 26847095,
                    "player_statistic_id": 27262200,
                    "type_id": 86,
                    "value": {
                        "total": 25
                    }
                },
                {
                    "id": 23701486,
                    "player_statistic_id": 27262200,
                    "type_id": 88,
                    "value": {
                        "total": 28
                    }
                },
                {
                    "id": 26846746,
                    "player_statistic_id": 27262200,
                    "type_id": 94,
                    "value": {
                        "total": 14
                    }
                },
                {
                    "id": 26846819,
                    "player_statistic_id": 27262200,
                    "type_id": 96,
                    "value": {
                        "total": 18
                    }
                },
                {
                    "id": 26847149,
                    "player_statistic_id": 27262200,
                    "type_id": 98,
                    "value": {
                        "total": 181
                    }
                },
                {
                    "id": 26846623,
                    "player_statistic_id": 27262200,
                    "type_id": 99,
                    "value": {
                        "total": 49
                    }
                },
                {
                    "id": 26846915,
                    "player_statistic_id": 27262200,
                    "type_id": 100,
                    "value": {
                        "total": 18
                    }
                },
                {
                    "id": 26846735,
                    "player_statistic_id": 27262200,
                    "type_id": 101,
                    "value": {
                        "total": 13
                    }
                },
                {
                    "id": 26846773,
                    "player_statistic_id": 27262200,
                    "type_id": 105,
                    "value": {
                        "total": 248
                    }
                },
                {
                    "id": 26846781,
                    "player_statistic_id": 27262200,
                    "type_id": 106,
                    "value": {
                        "total": 94
                    }
                },
                {
                    "id": 26846665,
                    "player_statistic_id": 27262200,
                    "type_id": 107,
                    "value": {
                        "total": 6
                    }
                },
                {
                    "id": 26846760,
                    "player_statistic_id": 27262200,
                    "type_id": 110,
                    "value": {
                        "total": 48
                    }
                },
                {
                    "id": 26846653,
                    "player_statistic_id": 27262200,
                    "type_id": 116,
                    "value": {
                        "total": 768
                    }
                },
                {
                    "id": 26846928,
                    "player_statistic_id": 27262200,
                    "type_id": 117,
                    "value": {
                        "total": 82
                    }
                },
                {
                    "id": 1668194,
                    "player_statistic_id": 27262200,
                    "type_id": 118,
                    "value": {
                        "average": 7.39,
                        "highest": 10.1,
                        "lowest": 5.71
                    }
                },
                {
                    "id": 23701498,
                    "player_statistic_id": 27262200,
                    "type_id": 119,
                    "value": {
                        "total": 2003
                    }
                },
                {
                    "id": 1668146,
                    "player_statistic_id": 27262200,
                    "type_id": 321,
                    "value": {
                        "total": 25
                    }
                },
                {
                    "id": 1668180,
                    "player_statistic_id": 27262200,
                    "type_id": 322,
                    "value": {
                        "total": 22
                    }
                },
                {
                    "id": 1668159,
                    "player_statistic_id": 27262200,
                    "type_id": 323,
                    "value": {
                        "total": 4
                    }
                },
                {
                    "id": 26846642,
                    "player_statistic_id": 27262200,
                    "type_id": 1584,
                    "value": {
                        "total": 78.13
                    }
                }
            ]
        },
        {
            "id": 27263776,
            "player_id": 1371,
            "team_id": 9,
            "season_id": 13,
            "has_values": true,
            "position_id": 26,
            "jersey_number": 17,
            "details": [
                {
                    "id": 26852578,
                    "player_statistic_id": 27263776,
                    "type_id": 42,
                    "value": {
                        "total": 86
                    }
                },
                {
                    "id": 26852492,
                    "player_statistic_id": 27263776,
                    "type_id": 51,
                    "value": {
                        "total": 2
                    }
                },
                {
                    "id": 23703340,
                    "player_statistic_id": 27263776,
                    "type_id": 52,
                    "value": {
                        "total": 6,
                        "goals": 6,
                        "penalties": 0
                    }
                },
                {
                    "id": 26852329,
                    "player_statistic_id": 27263776,
                    "type_id": 56,
                    "value": {
                        "total": 37
                    }
                },
                {
                    "id": 1701485,
                    "player_statistic_id": 27263776,
                    "type_id": 59,
                    "value": {
                        "in": 3,
                        "out": 11
                    }
                },
                {
                    "id": 26852408,
                    "player_statistic_id": 27263776,
                    "type_id": 64,
                    "value": {
                        "total": 9
                    }
                },
                {
                    "id": 26852633,
                    "player_statistic_id": 27263776,
                    "type_id": 78,
                    "value": {
                        "total": 50
                    }
                },
                {
                    "id": 1701216,
                    "player_statistic_id": 27263776,
                    "type_id": 79,
                    "value": {
                        "total": 18
                    }
                },
                {
                    "id": 26852510,
                    "player_statistic_id": 27263776,
                    "type_id": 80,
                    "value": {
                        "total": 1476
                    }
                },
                {
                    "id": 1701618,
                    "player_statistic_id": 27263776,
                    "type_id": 84,
                    "value": {
                        "total": 4,
                        "home": 2,
                        "away": 2
                    }
                },
                {
                    "id": 26852611,
                    "player_statistic_id": 27263776,
                    "type_id": 86,
                    "value": {
                        "total": 21
                    }
                },
                {
                    "id": 23703345,
                    "player_statistic_id": 27263776,
                    "type_id": 88,
                    "value": {
                        "total": 37
                    }
                },
                {
                    "id": 26852337,
                    "player_statistic_id": 27263776,
                    "type_id": 96,
                    "value": {
                        "total": 40
                    }
                },
                {
                    "id": 26852653,
                    "player_statistic_id": 27263776,
                    "type_id": 98,
                    "value": {
                        "total": 275
                    }
                },
                {
                    "id": 26852126,
                    "player_statistic_id": 27263776,
                    "type_id": 99,
                    "value": {
                        "total": 82
                    }
                },
                {
                    "id": 26852428,
                    "player_statistic_id": 27263776,
                    "type_id": 100,
                    "value": {
                        "total": 24
                    }
                },
                {
                    "id": 26852249,
                    "player_statistic_id": 27263776,
                    "type_id": 101,
                    "value": {
                        "total": 8
                    }
                },
                {
                    "id": 26852298,
                    "player_statistic_id": 27263776,
                    "type_id": 105,
                    "value": {
                        "total": 359
                    }
                },
                {
                    "id": 26852311,
                    "player_statistic_id": 27263776,
                    "type_id": 106,
                    "value": {
                        "total": 156
                    }
                },
                {
                    "id": 26852277,
                    "player_statistic_id": 27263776,
                    "type_id": 110,
                    "value": {
                        "total": 65
                    }
                },
                {
                    "id": 26852166,
                    "player_statistic_id": 27263776,
                    "type_id": 116,
                    "value": {
                        "total": 1212
                    }
                },
                {
                    "id": 26852447,
                    "player_statistic_id": 27263776,
                    "type_id": 117,
                    "value": {
                        "total": 106
                    }
                },
                {
                    "id": 26852522,
                    "player_statistic_id": 27263776,
                    "type_id": 118,
                    "value": {
                        "average": 7.65,
                        "highest": 10.2,
                        "lowest": 6.32
                    }
                },
                {
                    "id": 1701343,
                    "player_statistic_id": 27263776,
                    "type_id": 119,
                    "value": {
                        "total": 2885
                    }
                },
                {
                    "id": 1701200,
                    "player_statistic_id": 27263776,
                    "type_id": 321,
                    "value": {
                        "total": 36
                    }
                },
                {
                    "id": 1701330,
                    "player_statistic_id": 27263776,
                    "type_id": 322,
                    "value": {
                        "total": 33
                    }
                },
                {
                    "id": 1701231,
                    "player_statistic_id": 27263776,
                    "type_id": 323,
                    "value": {
                        "total": 4
                    }
                },
                {
                    "id": 26852148,
                    "player_statistic_id": 27263776,
                    "type_id": 1584,
                    "value": {
                        "total": 82.11
                    }
                }
            ]
        },
```

{% endtab %}
{% endtabs %}

{% hint style="info" %}
Supported types for _participant_ are:

- Players
- Teams
- Coaches
- Referees
  {% endhint %}

{% tabs %}
{% tab title="Query Parameters" %}

<table><thead><tr><th>Name</th><th width="232.66666666666666">Required?</th><th>Description</th></tr></thead><tbody><tr><td><code>api_token</code></td><td><p>YES </p><p>Another option is to provide the API token in the header.</p></td><td>Your unique API token. Ex. ?api_token=YOUR_TOKEN</td></tr><tr><td><code>include</code></td><td>NO</td><td>Enrich the API response with more data by using includes. Ex. &#x26;include=participants;events</td></tr><tr><td><code>select</code></td><td>NO</td><td>Select specific fields on the<a href="https://docs.sportmonks.com/football2/endpoints-and-entities/entities/fixtures"> base entity</a>. Read how to select fields in our <a href="https://docs.sportmonks.com/football2/api/request-options/selecting-fields">tutorial</a>.</td></tr><tr><td><code>filters</code></td><td>NO</td><td>Filter the API response on multiple related entities. There are static filters and dynamic filters.​<br><br>Please find the possibilities in the Static and Dynamic Filter tab.</td></tr><tr><td><code>locale</code></td><td>NO</td><td>Translate name fields of the API Response in your selected language. Find more information and which languages are available on our <a href="../../../api/translations-beta">translations page</a>.</td></tr></tbody></table>
{% endtab %}

{% tab title="Static Filters" %}
**Static filters** are always the same and filter in one specific way without any custom options. Each static filter is listed below and has a description of how it filters. For more information, please look at our[ Filters page](https://docs.sportmonks.com/football/api/request-options/filtering).<br>

<table><thead><tr><th>Static filters</th><th>Available on Entity</th><th width="154">Description</th><th>Example</th></tr></thead><tbody><tr><td><code>IdAfter</code></td><td>All</td><td>Filter all seasons starting from a certain season ID. </td><td><code>&#x26;filters=IdAfter:seasonId</code><br><br><code>&#x26;filters=IdAfter:18017</code></td></tr></tbody></table>
{% endtab %}

{% tab title="Dynamic Filters" %}

The **dynamic filters** are based on entities and includes. Each dynamic filter uses an entity to filter on and one entity to apply the filter on. Below are examples with explanations of how filters are set up. For more information, please look at our[ Filters page](https://docs.sportmonks.com/football/api/request-options/filtering).

{% hint style="info" %}
Using an include? Check their respective filters on their entity page. For example if you use `&include=fixtures`, you can apply [fixture-related filters](https://docs.sportmonks.com/football/entities/fixture#fixture-entity-filters).&#x20;
{% endhint %}

<table><thead><tr><th width="153">Dynamic Filters</th><th>Available on Entity</th><th>Description</th><th width="191">Examples</th></tr></thead><tbody><tr><td><code>types</code></td><td>Statistics, Events, Lineup, and way more.<br><br>Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all possibilities.</td><td>Filter the season statistics on a selection of types separated by a comma. </td><td><code>&#x26;filters=teamstatisticdetailTypes:TypeIDs</code><br><br><code>&#x26;filters=teamstatisticdetailTypes:52,88</code></td></tr><tr><td><code>leagues</code></td><td>Fixtures, Seasons, Standings, and way more.<br><br>Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all possibilities.</td><td>Filter the seasons based on leagues.</td><td><p><code>&#x26;include=league&#x26;&#x26;filters=seasonLeagues:leagueIDs</code></p><p></p><p><code>&#x26;include=league&#x26;&#x26;filters=seasonLeagues:2,8</code></p></td></tr><tr><td><code>stages</code></td><td>Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all possibilities.</td><td>Filter season stages based on stage IDs</td><td><p><code>&#x26;filters=stageStages:stageIDS</code> </p><p></p><p><code>&#x26;filters=stageStages:77457866</code></p></td></tr><tr><td><code>topscorers</code></td><td>Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all possibilities.</td><td>Filter season topscorers based on type IDs</td><td><code>&#x26;include=topscorers&#x26;filters=seasonTopscorerTypes:TypeIDs</code><br><br><code>&#x26;include=topscorers&#x26;filters=seasonTopscorerTypes:208</code></td></tr></tbody></table>
{% endtab %}
{% endtabs %}

### Filters

More information on how to use filters can be found on our tutorials on how to [filter](https://docs.sportmonks.com/football2/api/request-options/filtering). If you want more information on which filters to use you can check out the following [endpoint](https://app.gitbook.com/s/z0kWjB5EvZvqGsozw8vP/endpoints/filters/get-all-entity-filters):&#x20;

{% hint style="info" %}

```
https://api.sportmonks.com/v3/my/filters/entity?api_token=YOUR_TOKEN
```

{% endhint %}

### Pagination

YES

### Parameters

<table><thead><tr><th width="168">Parameter</th><th width="110">Required</th><th width="244">Description</th><th width="169">Example</th></tr></thead><tbody><tr><td><code>order</code></td><td>No</td><td>Returns seasons ordered by <strong>season_id</strong> (<code>asc</code> or <code>desc</code>). Defaults to desc</td><td><em>&#x26;order=asc</em></td></tr><tr><td><code>per_page</code></td><td>No</td><td>The amount of results to return per page (max 50.). Defaults to 25.</td><td><em>&#x26;per_page=30</em></td></tr><tr><td><code>page</code></td><td>No</td><td>You can paginate using the <code>has_more</code> parameter to determine if you can still propagate through the results.</td><td><em>&#x26;page=2</em></td></tr></tbody></table>

### Include depth

You can use a total of `3` nested includes on this endpoint

### Include options

[`player`](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/players)[`season`](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/seasons)[`coach` ](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/coaches)[`team`](https://docs.sportmonks.com/football/tutorials-and-guides/tutorials/teams-players-coaches-and-referees/teams)[`referee`](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/referees)[`position`](https://docs.sportmonks.com/football/definitions/types/lineups-positions-and-formations)

### **Related Entities**

Get an overview and explanation of all the fields returned in the API response. The related entities are:

- [PlayerStatistic](https://docs.sportmonks.com/football/endpoints-and-entities/entities/statistic#playerstatistic)
- [CoachStatistic](https://docs.sportmonks.com/football/endpoints-and-entities/entities/statistic#coachstatistic)
- [TeamStatistic](https://docs.sportmonks.com/football/endpoints-and-entities/entities/statistic#teamstatistic)
- [RefereeStatistic](https://docs.sportmonks.com/football/endpoints-and-entities/entities/statistic#refereestatistic)

### Postman

We also offer detailed postman documentation with examples and a complete up-to-date version of all our endpoints. Below is a button that lets your fork the collection or import it.

\
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/11949411-c7a3a0a0-b5c5-4109-9bf6-f430fec65316?action=collection%2Ffork&collection-url=entityId%3D11949411-c7a3a0a0-b5c5-4109-9bf6-f430fec65316%26entityType%3Dcollection%26workspaceId%3D17c720d0-d97b-42a9-9ea7-23260ed53ddf)

### Code Example

{% tabs %}
{% tab title="Ruby" %}

```ruby
require "uri"
require "net/http"

url = URI("https://api.sportmonks.com/v3/football/seasons?api_token=YOUR_TOKEN")

https = Net::HTTP.new(url.host, url.port)
https.use_ssl = true

request = Net::HTTP::Get.new(url)

response = https.request(request)
puts response.read_body

```

{% endtab %}

{% tab title="Python" %}

```python
import http.client

conn = http.client.HTTPSConnection("api.sportmonks.com")
payload = ''
headers = {}
conn.request("GET", "/v3/football/seasons?api_token=YOUR_TOKEN", payload, headers)
res = conn.getresponse()
data = res.read()
print(data.decode("utf-8"))
```

{% endtab %}

{% tab title="PHP" %}

```php
<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://api.sportmonks.com/v3/football/seasons?api_token=YOUR_TOKEN',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET',
));

$response = curl_exec($curl);

curl_close($curl);
echo $respons
```

{% endtab %}

{% tab title="Java" %}

```java
OkHttpClient client = new OkHttpClient().newBuilder()
  .build();
Request request = new Request.Builder()
  .url("https://api.sportmonks.com/v3/football/seasons?api_token=YOUR_TOKEN")
  .method("GET", null)
  .build();
Response response = client.newCall(request).execute();
```

{% endtab %}

{% tab title="Node.js" %}

```
var unirest = require('unirest');
var req = unirest('GET', 'https://api.sportmonks.com/v3/football/seasons?api_token=YOUR_TOKEN')
  .end(function (res) {
    if (res.error) throw new Error(res.error);
    console.log(res.raw_body);
  });
```

{% endtab %}

{% tab title="Go" %}

```go
package main

import (
  "fmt"
  "net/http"
  "io/ioutil"
)

func main() {

  url := "https://api.sportmonks.com/v3/football/seasons?api_token=YOUR_TOKEN"
  method := "GET"

  client := &http.Client {
  }
  req, err := http.NewRequest(method, url, nil)

  if err != nil {
    fmt.Println(err)
    return
  }
  res, err := client.Do(req)
  if err != nil {
    fmt.Println(err)
    return
  }
  defer res.Body.Close()

  body, err := ioutil.ReadAll(res.Body)
  if err != nil {
    fmt.Println(err)
    return
  }
  fmt.Println(string(body))
}
```

{% endtab %}
{% endtabs %}
