# GET Last Updated Odds

{% tabs %}
{% tab title="Base URL" %}

```javascript
https://api.sportmonks.com/v3/football/odds/pre-match/latest
```

{% endtab %}

{% tab title="Example Response" %}

```json
{
  "data": [
    {
      "id": 1,
      "fixture_id": 18533878,
      "market_id": 1,
      "bookmaker_id": 34,
      "label": "Home",
      "value": "1.48",
      "name": "Home",
      "sort_order": null,
      "market_description": "Match Winner",
      "probability": "67.57%",
      "dp3": "1.480",
      "fractional": "37/25",
      "american": "-209",
      "winning": false,
      "stopped": false,
      "total": null,
      "handicap": null,
      "participants": null,
      "created_at": "2023-01-11T14:40:25.000000Z",
      "updated_at": "2023-01-11T14:47:50.000000Z",
      "original_label": null,
      "latest_bookmaker_update": "2023-01-11 14:40:25"
    },

```

{% endtab %}

{% tab title="Field Description" %}

<table><thead><tr><th width="206.83826823543797">Field</th><th width="361">Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the odd</td><td>integer</td></tr><tr><td>fixture_id</td><td>Refers to the fixture related to the odd</td><td>integer</td></tr><tr><td>market_id</td><td>Refers to the market related to the odd</td><td>integer</td></tr><tr><td>bookmaker_id</td><td>Refers to the bookmaker related to the odd</td><td>integer</td></tr><tr><td>label</td><td>Displays the label of the odd</td><td>string</td></tr><tr><td>value</td><td>Displays the value of the odd</td><td>string</td></tr><tr><td>name</td><td>Displays the name of the odd</td><td>string</td></tr><tr><td>market_description</td><td>Displays the description of the market</td><td>string</td></tr><tr><td>probability</td><td>Displays the probability odd</td><td>string</td></tr><tr><td>dp3</td><td>Displays the dp3 odd</td><td>string</td></tr><tr><td>fractional</td><td>Displays the fractional odd</td><td>string</td></tr><tr><td>american</td><td>Displays the american odd</td><td>string</td></tr><tr><td>winning</td><td>Determines if the odd is winning or not (only available with <a href="../../../markets/get-all-markets#field-description">markets</a> where <code>has_winning_calculations</code> is <code>true</code>)</td><td>boolean</td></tr><tr><td>stopped</td><td>Determines if the odd is stopped or not</td><td>boolean</td></tr><tr><td>total</td><td>Displays the total of the odd</td><td>string / null</td></tr><tr><td>handicap</td><td>Displays the handicap of the odd</td><td>string / null</td></tr><tr><td>participants</td><td>Displays the participants of the odd</td><td>string / null</td></tr></tbody></table>
{% endtab %}
{% endtabs %}

{% hint style="info" %}
Note this endpoint returns the pre-match odds which were updated in the last 10 seconds.
{% endhint %}

{% tabs %}
{% tab title="Query Parameters" %}

<table><thead><tr><th>Name</th><th width="232.66666666666666">Required?</th><th>Description</th></tr></thead><tbody><tr><td><code>api_token</code></td><td><p>YES </p><p>Another option is to provide the API token in the header.</p></td><td>Your unique API token. Ex. ?api_token=YOUR_TOKEN</td></tr><tr><td><code>include</code></td><td>NO</td><td>Enrich the API response with more data by using includes. Ex. &#x26;include=participants;events</td></tr><tr><td><code>select</code></td><td>NO</td><td>Select specific fields on the<a href="https://docs.sportmonks.com/football2/endpoints-and-entities/entities/fixtures"> base entity</a>. Read how to select fields in our <a href="https://docs.sportmonks.com/football2/api/request-options/selecting-fields">tutorial</a>.</td></tr><tr><td><code>filters</code></td><td>NO</td><td>Filter the API response on multiple related entities. There are static filters and dynamic filters.​<br><br>Please find the possibilities in the Static and Dynamic Filter tab.</td></tr><tr><td><code>locale</code></td><td>NO</td><td>Translate name fields of the API Response in your selected language. Find more information and which languages are available on our <a href="../../../../api/translations-beta">translations page</a>.</td></tr></tbody></table>
{% endtab %}

{% tab title="Static Filters" %}
**Static filters** are always the same and filter in one specific way without any custom options. Each static filter is listed below and has a description of how it filters. For more information, please look at our[ Filters page](https://docs.sportmonks.com/football/api/request-options/filtering).

| Static Filters | Available on Entity | Description                                                                     | Example                                                                                                                                          |
| -------------- | ------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `markets`      | Odds                | Filter the odds on a selection of markets separated by a comma.                 | <p><code>\&include=market\&filters=markets:marketIDs</code><br><br><code>\&include=market\&filters=markets:12,14</code></p>                      |
| `bookmakers`   | Odds                | Filter the odds on a selection of bookmakers separated by a comma. (e.g: 2,14). | <p><code>\&include=bookmaker\&filters=bookmakers:bookmakerIDs</code> </p><p></p><p><code>\&include=bookmaker\&filters=bookmakers:2,14</code></p> |
| `WinningOdds`  | Odds                | Filter all winning odds.                                                        | `&filters=winningOdds`                                                                                                                           |
| {% endtab %}   |                     |                                                                                 |                                                                                                                                                  |

{% tab title="Dynamic Filters" %}
The **dynamic filters** are based on entities and includes. Each dynamic filter uses an entity to filter on and one entity to apply the filter to. Below is an example with an explanation of how filters are set up. For more information, please look at our[ Filters page](https://docs.sportmonks.com/football/api/request-options/filtering).

{% hint style="info" %}
Using an include? Check their respective filters on their entity page. For example if you use `&include=fixtures`, you can apply [fixture-related filters](https://docs.sportmonks.com/football/entities/fixture#fixture-entity-filters).&#x20;
{% endhint %}

<table><thead><tr><th width="143">Dynamic Filters</th><th>Available on Entity</th><th>Description</th><th width="191">Examples</th></tr></thead><tbody><tr><td>N/A</td><td>N/A</td><td>Not available for this endpoint.   </td><td>N/A</td></tr></tbody></table>
{% endtab %}
{% endtabs %}

### Definition of “Latest Updated”

This endpoint returns every fixture whose odds data has changed in the last 10 seconds. The odds data fields include market_id, bookmaker_id, value, name, market_description, probability, winning, stopped, created_at, updated_at, and latest_bookmaker_update. The 10-second update window is fixed and cannot be changed.

A change in any of these fields during the last 10 seconds means that the fixture is included in the response:

- market_id
  - Change means the fixture moved to a different betting market.
- bookmaker_id
  - Change means a different bookmaker provided or updated the odds.
- value
  - Change means the numeric odd value (for example, 1.48) was adjusted.
- name
  - Change means the label name (for example “Home” or “Away”) was modified.
- market_description
  - Change means the description of the market (for example “Match Winner”) was edited.
- probability
  - Change means the implied probability (for example “67.57%”) was recalculated.
- winning
  - Change means the boolean flag indicating if this odd is the current winning outcome was toggled.
- stopped
  - Change means the boolean flag indicating if this odd is no longer available was toggled.
- created_at
  - Change means a new odd entry was created within the last 10 seconds.
- updated_at
  - Change means the timestamp of the last update to this odd entry was modified.
- latest_bookmaker_update
  - Change means the bookmaker’s own timestamp for their last update was modified.

### Frequency of updates & no-change responses

Any fixture with at least one of the above fields changed in the last 10 seconds will appear on each API call. If no fixture changed during that window, the API returns HTTP 200 with an empty data array. An empty array means there is nothing new to process.

### Polling frequency & rate limits

- Poll every 10 seconds to match the fixed update window exactly (360 calls per hour).
- Optionally poll every 5 to 8 seconds to reduce end-to-end latency, provided your rate limits allow the extra calls.
- Monitor for network jitter and clock skew to avoid missing updates or sending duplicate requests.

### Caching strategy & best practices

- Cache all returned fields per fixture in your local store.
- On each response, compare each fixture’s new payload against the cache.
- Discard fixtures with no actual differences.
- Update the cache with only the changed fixtures.
- Cache rarely changing lookup data (such as bookmaker names and market descriptions) locally.
- If you observe long runs of empty responses, temporarily reduce your polling frequency to minimise unnecessary calls.

### Filters

More information on how to use filters can be found on our tutorials on how to [filter](https://docs.sportmonks.com/football2/api/request-options/filtering). If you want more information on which filters to use you can check out the following [endpoint](https://app.gitbook.com/s/z0kWjB5EvZvqGsozw8vP/endpoints/filters/get-all-entity-filters):&#x20;

{% hint style="info" %}

```javascript
https://api.sportmonks.com/v3/my/filters/entity?api_token=YOUR_TOKEN
```

{% endhint %}

### Pagination

NO

### Include depth

You can use a total of `1` nested includes on this endpoint

### Include options

[`market`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`bookmaker`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`fixture`](https://docs.sportmonks.com/football/entities/fixture#fixture)

### Related entities

[Odd](https://docs.sportmonks.com/football/entities/odd-and-prediction#odd)

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

url = URI("https://api.sportmonks.com/v3/football/odds/pre-match/latest?api_token=YOUR_TOKEN")

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
conn.request("GET", "/v3/football/odds/pre-match/latest?api_token=YOUR_TOKEN", payload, headers)
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
  CURLOPT_URL => 'https://api.sportmonks.com/v3/football/odds/pre-match/latest?api_token=YOUR_TOKEN',
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
  .url("https://api.sportmonks.com/v3/football/odds/pre-match/latest?api_token=YOUR_TOKEN")
  .method("GET", null)
  .build();
Response response = client.newCall(request).execute();
```

{% endtab %}

{% tab title="Node.js" %}

```
var unirest = require('unirest');
var req = unirest('GET', 'https://api.sportmonks.com/v3/football/odds/pre-match/latest?api_token=YOUR_TOKEN')
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

  url := "https://api.sportmonks.com/v3/football/odds/pre-match/latest?api_token=YOUR_TOKEN"
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
