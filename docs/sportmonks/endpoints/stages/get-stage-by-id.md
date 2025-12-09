# GET Stage by ID

{% tabs %}
{% tab title="Base URL" %}

```javascript
https://api.sportmonks.com/v3/football/stages/{ID}
```

{% endtab %}

{% tab title="Example Response" %}

```json
{
  "data": {
    "id": 77457866,
    "sport_id": 1,
    "league_id": 501,
    "season_id": 19735,
    "type_id": 223,
    "name": "1st Phase",
    "sort_order": 1,
    "finished": false,
    "is_current": true,
    "starting_at": "2022-07-30",
    "ending_at": "2023-04-22",
    "games_in_current_week": true
  },
```

{% endtab %}

{% tab title="Field Description" %}

| Field         | Description                                        | Type    |
| ------------- | -------------------------------------------------- | ------- |
| id            | Refers to the unique id of the stage               | integer |
| sport_id      | Refers to the sport of the stage                   | integer |
| league_id     | Refers to the league related to the stage          | integer |
| season_id     | Refers to the season related to the stage          | integer |
| type_id       | Indicates what the stage type is                   | integer |
| name          | Returns the name of the stage                      | string  |
| sort_order    | Returns the order of the stage                     | integer |
| finished      | Indicates if the stage is finished or not          | boolean |
| pending       | Indicates if the stage is pending or not           | boolean |
| is_current    | Indicates if the stage is the current stage or not | boolean |
| starting_at   | The starting date of the stage                     | string  |
| ending_at     | The end date of the stage                          | string  |
| {% endtab %}  |                                                    |         |
| {% endtabs %} |                                                    |         |

{% tabs %}
{% tab title="Query Parameters" %}

<table><thead><tr><th>Name</th><th width="232.66666666666666">Required?</th><th>Description</th></tr></thead><tbody><tr><td><code>api_token</code></td><td><p>YES </p><p>Another option is to provide the API token in the header.</p></td><td>Your unique API token. Ex. ?api_token=YOUR_TOKEN</td></tr><tr><td><code>include</code></td><td>NO</td><td>Enrich the API response with more data by using includes. Ex. &#x26;include=participants;events</td></tr><tr><td><code>select</code></td><td>NO</td><td>Select specific fields on the<a href="https://docs.sportmonks.com/football2/endpoints-and-entities/entities/fixtures"> base entity</a>. Read how to select fields in our <a href="https://docs.sportmonks.com/football2/api/request-options/selecting-fields">tutorial</a>.</td></tr><tr><td><code>filters</code></td><td>NO</td><td>Filter the API response on multiple related entities. There are static filters and dynamic filters.​<br><br>Please find the possibilities in the Static and Dynamic Filter tab.</td></tr><tr><td><code>locale</code></td><td>NO</td><td>Translate name fields of the API Response in your selected language. Find more information and which languages are available on our <a href="../../../api/translations-beta">translations page</a>.</td></tr></tbody></table>
{% endtab %}

{% tab title="Static Filters" %}
**Static filters** are always the same and filter in one specific way without any custom options. Each static filter is listed below and has a description of how it filters. For more information, please look at our[ Filters page](https://docs.sportmonks.com/football/api/request-options/filtering).

<table><thead><tr><th width="165">Static Filters</th><th width="114">Available on Entity</th><th width="197">Description</th><th width="274">Example</th></tr></thead><tbody><tr><td>N/A</td><td>N/A</td><td>Not available for this endpoint.</td><td>N/A<br></td></tr></tbody></table>
{% endtab %}

{% tab title="Dynamic Filters" %}
The **dynamic filters** are based on entities and includes. Each dynamic filter uses an entity to filter on and one entity to apply the filter on. Below are examples with explanations of how filters are set up. For more information, please look at our[ Filters page](https://docs.sportmonks.com/football/api/request-options/filtering).

{% hint style="info" %}
Using an include? Check their respective filters on their entity page. For example if you use `&include=fixtures`, you can apply [fixture-related filters](https://docs.sportmonks.com/football/entities/fixture#fixture-entity-filters).&#x20;
{% endhint %}

<table><thead><tr><th width="143">Dynamic Filters</th><th>Available on Entity</th><th>Description</th><th width="191">Examples</th></tr></thead><tbody><tr><td><code>Types</code></td><td>Statistics, Events, Lineup, Stages and way more.<br><br>Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all possibilities.</td><td>Filter the stages on a selection of type IDs separated by a comma.       </td><td><code>&#x26;include=type&#x26;filters=stageTypes:typeIDS</code><br><br><code>&#x26;include=type&#x26;filters=stageTypes:223</code></td></tr><tr><td><code>ParticipantSearch</code></td><td>Using the fixtures include? Check the <a href="../fixtures">fixture endpoint</a> for all possible filters.</td><td>Filter the fixtures of certain participants</td><td><p><code>&#x26;include=fixtures&#x26;filters=ParticipantSearch:search_query</code></p><p></p><p><code>&#x26;include=fixtures&#x26;filters=ParticipantSearch:Celtic</code></p></td></tr><tr><td><code>Fixture statistics</code></td><td>Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all possibilities.</td><td>Include the fixtures and only filter on the statistics you're interested in. </td><td><p><code>&#x26;include=fixtures&#x26;filters=fixturestatisticTypes:typeIDS</code></p><p></p><p><code>&#x26;include=fixtures&#x26;filters=fixturestatisticTypes:84</code></p></td></tr></tbody></table>
{% endtab %}
{% endtabs %}

### **Filters**

More information on how to use filters can be found on our tutorials on how to [filter](https://docs.sportmonks.com/football2/api/request-options/filtering). If you want more information on which filters to use you can check out the following [endpoint](https://app.gitbook.com/s/z0kWjB5EvZvqGsozw8vP/endpoints/filters/get-all-entity-filters):

{% hint style="info" %}

```
https://api.sportmonks.com/v3/my/filters/entity?api_token=YOUR_TOKEN
```

{% endhint %}

### Pagination

NO

### Include depth

You can use a total of `4` nested includes on this endpoint

### Include options

[`league`](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#league) [`season`](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#season) [`type`](https://docs.sportmonks.com/football2/v/core/endpoints/types) [`sport`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`rounds`](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#round) [`currentRound`](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#round) [`groups`](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#group) [`fixtures`](https://docs.sportmonks.com/football/entities/fixture#fixture) [`aggregates`](https://docs.sportmonks.com/football/entities/fixture#aggregate) [`topscorers`](https://docs.sportmonks.com/football/entities/standing-and-topscorer#topscorers) [`statistics`](https://docs.sportmonks.com/football/entities/statistic#fixturestatistic)&#x20;

### **Related Entities:**

Get an overview and explanation of all the fields returned in the API response. The related entities for the stages endpoints are:

- [Stage](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#stage)

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

url = URI("https://api.sportmonks.com/v3/football/stages/{ID}?api_token=YOUR_TOKEN")

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
conn.request("GET", "/v3/football/stages/{ID}?api_token=YOUR_TOKEN", payload, headers)
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
  CURLOPT_URL => 'https://api.sportmonks.com/v3/football/stages/{ID}?api_token=YOUR_TOKEN',
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
  .url("https://api.sportmonks.com/v3/football/stages/{ID}?api_token=YOUR_TOKEN")
  .method("GET", null)
  .build();
Response response = client.newCall(request).execute();
```

{% endtab %}

{% tab title="Node.js" %}

```
var unirest = require('unirest');
var req = unirest('GET', 'https://api.sportmonks.com/v3/football/stages/{ID}?api_token=YOUR_TOKEN')
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

  url := "https://api.sportmonks.com/v3/football/stages/{ID}?api_token=YOUR_TOKEN"
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
