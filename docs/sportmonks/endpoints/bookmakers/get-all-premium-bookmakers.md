# GET All Premium Bookmakers

{% tabs %}
{% tab title="Base URL" %}

```javascript
https://api.sportmonks.com/v3/odds/bookmakers/premium
```

{% endtab %}

{% tab title="Example Response" %}

```json
{
  "data": [
    {
      "id": 1,
      "legacy_id": 1,
      "name": "10Bet"
    },
    {
      "id": 2,
      "legacy_id": 2,
      "name": "bet365"
    },
    {
      "id": 3,
      "legacy_id": 3,
      "name": "188Bet"
    },
```

{% endtab %}

{% tab title="Field Description" %}

<table><thead><tr><th width="272.5089974293059">Field</th><th>Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the bookmaker</td><td>integer</td></tr><tr><td>name</td><td>Refers to the name of the bookmaker</td><td>string</td></tr></tbody></table>
{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="Query Parameters" %}

<table><thead><tr><th>Name</th><th width="232.66666666666666">Required?</th><th>Description</th></tr></thead><tbody><tr><td><code>api_token</code></td><td><p>YES </p><p>Another option is to provide the API token in the header.</p></td><td>Your unique API token. Ex. ?api_token=YOUR_TOKEN</td></tr><tr><td><code>include</code></td><td>NO</td><td>Enrich the API response with more data by using includes. Ex. &#x26;include=participants;events</td></tr><tr><td><code>select</code></td><td>NO</td><td>Select specific fields on the<a href="https://docs.sportmonks.com/football2/endpoints-and-entities/entities/fixtures"> base entity</a>. Read how to select fields in our <a href="https://docs.sportmonks.com/football2/api/request-options/selecting-fields">tutorial</a>.</td></tr><tr><td><code>filters</code></td><td>NO</td><td>Filter the API response on multiple related entities. There are static filters and dynamic filters.​<br><br>Please find the possibilities in the Static and Dynamic Filter tab.</td></tr><tr><td><code>locale</code></td><td>NO</td><td>Translate name fields of the API Response in your selected language. Find more information and which languages are available on our <a href="../../../api/translations-beta">translations page</a>.</td></tr></tbody></table>
{% endtab %}

{% tab title="Static Filters" %}
**Static filters** are always the same and filter in one specific way without any custom options. Each static filter is listed below and has a description of how it filters. For more information, please look at our[ Filters page](https://docs.sportmonks.com/football/api/request-options/filtering).

| Static Filters | Available on Entity | Description                                                                                                                                                | Example                                                                                                   |
| -------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `IdAfter`      | All                 | Filter all bookmakers starting from a certain bookmaker ID. Handy if you're doing an import for all pre-match odds and want to continue from a certain ID. | <p><code>\&filters=IdAfter:bookmakerID</code> </p><p></p><p><code>\&filters=IdAfter:70</code></p>         |
| `bookmakers`   | Odds                | Filter the bookmakers on a selection of bookmakers separated by a comma.                                                                                   | <p><code>\&filters=bookmakers:bookmakerID</code> </p><p></p><p><code>\&filters=bookmakers:1,70</code></p> |
| {% endtab %}   |                     |                                                                                                                                                            |                                                                                                           |

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

### File

You can find all the bookmakers we offer in our Premium Odds Feed below.

{% file src="<https://3469464275-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F9zsNGu3HAzSnl5DWBD3Y%2Fuploads%2FgCJgGcnWP3ZyhIAf5qdr%2FAll_Premium_Bookmakers.json?alt=media&token=40e948de-0f3f-4123-b6f4-bdb155bea09d>" %}

### Pagination

NO

### Parameters

<table><thead><tr><th width="168">Parameter</th><th width="110">Required</th><th width="244">Description</th><th width="169">Example</th></tr></thead><tbody><tr><td><code>order</code></td><td>No</td><td>Returns bookmakers ordered by <strong>id</strong> (<code>asc</code> or <code>desc</code>). Defaults to asc</td><td><em>&#x26;order=desc</em></td></tr></tbody></table>

### Include options

Not applicable.&#x20;

### Related entities

[Odds](https://docs.sportmonks.com/football/tutorials-and-guides/tutorials/odds-and-predictions)

### Postman

We also offer detailed postman documentation with examples and a complete up-to-date version of all our endpoints. Below is a button that lets your fork the collection or import it.

\
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/11949411-c7a3a0a0-b5c5-4109-9bf6-f430fec65316?action=collection%2Ffork&collection-url=entityId%3D11949411-c7a3a0a0-b5c5-4109-9bf6-f430fec65316%26entityType%3Dcollection%26workspaceId%3D17c720d0-d97b-42a9-9ea7-23260ed53ddf)

### Code Example

{% tabs %}
{% tab title="Ruby" %}

```ruby
require "uri"
require "json"
require "net/http"

url = URI("https://api.sportmonks.com/v3/odds/bookmakers?api_token=[yourtoken]")

https = Net::HTTP.new(url.host, url.port)
https.use_ssl = true

request = Net::HTTP::Get.new(url)
request["Accept"] = "application/json"
request["Content-Type"] = "application/json"

response = https.request(request)
puts response.read_body
```

{% endtab %}

{% tab title="Python" %}

```python
import http.client
import json

conn = http.client.HTTPSConnection("api.sportmonks.com")
payload = ''
headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}
conn.request("GET", "/v3/odds/bookmakers?api_token=[yourtoken]", payload, headers)
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
  CURLOPT_URL => 'https://api.sportmonks.com/v3/odds/bookmakers?api_token=[yourtoken]',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET',
  CURLOPT_HTTPHEADER => array(
    'Accept: application/json',
    'Content-Type: application/json'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;
```

{% endtab %}

{% tab title="Java" %}

```java
OkHttpClient client = new OkHttpClient().newBuilder()
  .build();
MediaType mediaType = MediaType.parse("application/json");
RequestBody body = RequestBody.create(mediaType, "");
Request request = new Request.Builder()
  .url("https://api.sportmonks.com/v3/odds/bookmakers?api_token=[yourtoken]")
  .method("GET", body)
  .addHeader("Accept", "application/json")
  .addHeader("Content-Type", "application/json")
  .build();
Response response = client.newCall(request).execute();
```

{% endtab %}

{% tab title="Node.js" %}

```
var axios = require('axios');

var config = {
  method: 'get',
  url: 'https://api.sportmonks.com/v3/odds/bookmakers?api_token=[yourtoken]',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
```

{% endtab %}

{% tab title="Go" %}

```go
import (
  "fmt"
  "net/http"
  "io/ioutil"
)

func main() {

  url := "https://api.sportmonks.com/v3/odds/bookmakers?api_token=[yourtoken]"
  method := "GET"

  client := &http.Client {
  }
  req, err := http.NewRequest(method, url, nil)

  if err != nil {
    fmt.Println(err)
    return
  }
  req.Header.Add("Accept", "application/json")
  req.Header.Add("Content-Type", "application/json")

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
