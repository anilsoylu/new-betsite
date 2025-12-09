# GET Transfers Rumours Between Date Range

{% hint style="info" %}
The date should be passed in YYYY-MM-DD format.

The maximum date range is 31 days
{% endhint %}

{% tabs %}
{% tab title="Base URL" %}

```javascript
https://api.sportmonks.com/v3/football/transfer-rumours/between/{startDate}/{endDate}
```

{% endtab %}

{% tab title="Example Response" %}

```json
{
    "data": {
        "id": 5,
        "sport_id": 1,
        "player_id": 34053,
        "position_id": 27,
        "from_team_id": 20,
        "to_team_id": 8,
        "transfer_fee_id": 78367,
        "probability": "LOW",
        "source_name": "The Telegraph",
        "source_url": "http://www.telegraph.co.uk/football/2025/06/20/alexander-isak-liverpool-rumours-whats-going-on/",
        "amount": 77000000,
        "currency": "EUR",
        "date": "2025-06-23",
        "type_id": 219
    },
```

{% endtab %}

{% tab title="Field Description" %}

<table><thead><tr><th width="165.33333333333331">Field</th><th>Description</th><th>Type</th></tr></thead><tbody><tr><td><code>id</code></td><td>Refers to the id of the transfer</td><td>integer</td></tr><tr><td><code>sport_id</code></td><td>Refers to the sport related to the transfer</td><td>integer</td></tr><tr><td><code>player_id</code></td><td>Refers to the player related to the transfer</td><td>integer</td></tr><tr><td><code>position_id</code></td><td>Refers to the position of the player</td><td>integer</td></tr><tr><td><code>from_team_id</code></td><td>Refers to the team the player transferred from</td><td>integer</td></tr><tr><td><code>to_team_id</code></td><td>Refers to the team the player transferred to</td><td>integer</td></tr><tr><td><code>transfer_fee_id</code></td><td>Refers to the transfer free id, you can use the transferFree include for more info</td><td>integer</td></tr><tr><td><code>probability</code></td><td>Inidcates the likelyhood of the transfer</td><td>string</td></tr><tr><td><code>source_name</code></td><td>Refers to the source of the transfer rumour</td><td>string</td></tr><tr><td><code>source_url</code></td><td>Refers to the url of the transfer rumour</td><td>string</td></tr><tr><td><code>amount</code></td><td>Refers the transfer fee of the rumoured player</td><td>integer</td></tr><tr><td><code>currency</code></td><td>Refers to the currency of the transfer</td><td>string</td></tr><tr><td><code>date</code></td><td>Refers to the data of the rumoured transfer</td><td>string</td></tr><tr><td><code>type_id</code></td><td>Refers to the type of the transfer</td><td>integer</td></tr></tbody></table>
{% endtab %}
{% endtabs %}

&#x20;&#x20;

{% tabs %}
{% tab title="Query Parameters" %}

<table><thead><tr><th>Name</th><th width="232.66666666666666">Required?</th><th>Description</th></tr></thead><tbody><tr><td><code>api_token</code></td><td><p>YES </p><p>Another option is to provide the API token in the header.</p></td><td>Your unique API token. Ex. ?api_token=YOUR_TOKEN</td></tr><tr><td><code>include</code></td><td>NO</td><td>Enrich the API response with more data by using includes. Ex. &#x26;include=participants;events</td></tr><tr><td><code>select</code></td><td>NO</td><td>Select specific fields on the<a href="https://docs.sportmonks.com/football2/endpoints-and-entities/entities/fixtures"> base entity</a>. Read how to select fields in our <a href="https://docs.sportmonks.com/football2/api/request-options/selecting-fields">tutorial</a>.</td></tr><tr><td><code>filters</code></td><td>NO</td><td>Filter the API response on multiple related entities. There are static filters and dynamic filters.​<br><br>Please find the possibilities in the Static and Dynamic Filter tab.</td></tr><tr><td><code>locale</code></td><td>NO</td><td>Translate name fields of the API Response in your selected language. Find more information and which languages are available on our <a href="../../../api/translations-beta">translations page</a>.</td></tr></tbody></table>
{% endtab %}

{% tab title="Static Filters" %}
**Static filters** are always the same and filter in one specific way without any custom options. Each static filter is listed below and has a description of how it filters. For more information, please look at our[ Filters page](https://docs.sportmonks.com/football/api/request-options/filtering).

<table><thead><tr><th width="165">Static Filters</th><th width="114">Available on Entity</th><th width="197">Description</th><th width="274">Example</th></tr></thead><tbody><tr><td>N/A</td><td>N/A</td><td>Not available on this endpoint</td><td>N/A<br></td></tr></tbody></table>

{% endtab %}

{% tab title="Dynamic Filters" %}
The **dynamic filters** are based on entities and includes. Each dynamic filter uses an entity to filter on and one entity to apply the filter on. Below are examples with explanations of how filters are set up. For more information, please look at our[ Filters page](https://docs.sportmonks.com/football/api/request-options/filtering).

{% hint style="info" %}
Using an include? Check their respective filters on their entity page. For example if you use `&include=fixtures`, you can apply [fixture-related filters](https://docs.sportmonks.com/football/entities/fixture#fixture-entity-filters).&#x20;
{% endhint %}

<table><thead><tr><th width="147">Dynamic Filters</th><th>Available on Entity</th><th width="172">Description</th><th>Examples</th></tr></thead><tbody><tr><td><code>types</code></td><td>Statistics, Events, Lineup, Transfers and way more. Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all filter possibilities.</td><td>Filter the transfers on a selection of type ids separated by a comma. </td><td><p><code>&#x26;include=type&#x26;filters=transferTypes:TypeIDs</code> </p><p></p><p><code>&#x26;include=type&#x26;filters=transferTypes:219,220</code> </p><p></p></td></tr></tbody></table>
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

### Paramaters

<table><thead><tr><th width="168">Parameter</th><th width="110">Required</th><th width="244">Description</th><th width="169">Example</th></tr></thead><tbody><tr><td><code>order</code></td><td>No</td><td>Returns transfers ordered by <strong>date</strong> (<code>asc</code> or <code>desc</code>). Defaults to asc</td><td><em>&#x26;order=desc</em></td></tr><tr><td><code>per_page</code></td><td>No</td><td>The amount of results to return per page (max 50.). Defaults to 25.</td><td><em>&#x26;per_page=30</em></td></tr><tr><td><code>page</code></td><td>No</td><td>You can paginate using the <code>has_more</code> parameter to determine if you can still propagate through the results.</td><td><em>&#x26;page=2</em></td></tr></tbody></table>

### Include depth

You can use a total of `1` nested includes on this endpoint

### Include options

[`sport`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`player`](https://docs.sportmonks.com/football/entities/team-player-squad-coach-and-referee#player) [`type`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`fromTeam`](https://docs.sportmonks.com/football/entities/team-player-squad-coach-and-referee#team) [`toTeam`](https://docs.sportmonks.com/football/entities/team-player-squad-coach-and-referee#team) [`position`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`detailedPosition`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/)

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

url = URI("https://api.sportmonks.com/v3/football/transfer-rumours/between/{startDate}/{endDate}?api_token=YOUR_TOKEN")

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
conn.request("GET", "/v3/football/transfer-rumours/between/{startDate}/{endDate}?api_token=YOUR_TOKEN", payload, headers)
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
  CURLOPT_URL => 'https://api.sportmonks.com/v3/football/transfer-rumours/between/{startDate}/{endDate}?api_token=YOUR_TOKEN',
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
  .url("https://api.sportmonks.com/v3/football/transfer-rumours/between/{startDate}/{endDate}?api_token=YOUR_TOKEN}")
  .method("GET", null)
  .build();
Response response = client.newCall(request).execute();
```

{% endtab %}

{% tab title="Node.js" %}

```
var unirest = require('unirest');
var req = unirest('GET', 'https://api.sportmonks.com/v3/football/transfer-rumours/between/{startDate}/{endDate}?api_token=YOUR_TOKEN')
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

  url := "https://api.sportmonks.com/v3/football/transfer-rumours/between/{startDate}/{endDate}?api_token=YOUR_TOKEN"
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
