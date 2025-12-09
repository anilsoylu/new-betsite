# GET Teams by Search by Name

{% tabs %}
{% tab title="Base URL" %}

```javascript
https://api.sportmonks.com/v3/football/teams/search/{search_query}
```

{% endtab %}

{% tab title="Example Response" %}

```json
{
  "data": [
    {
      "id": 62,
      "sport_id": 1,
      "country_id": 1161,
      "venue_id": 8914,
      "gender": "male",
      "name": "Rangers",
      "short_code": "RAN",
      "image_path": "https://cdn.sportmonks.com/images/soccer/teams/30/62.png",
      "founded": 1873,
      "type": "domestic",
      "placeholder": false,
      "last_played_at": "2023-02-26 15:00:00"
    }
```

{% endtab %}

{% tab title="Field Description" %}

| Field          | Description                                                    | Type    |
| -------------- | -------------------------------------------------------------- | ------- |
| id             | Refers to the unique id of the team                            | integer |
| sport_id       | Refers to the sport of the team                                | integer |
| country_id     | Refers to the country of the team                              | integer |
| venue_id       | Refers to the home venue of the team                           | integer |
| gender         | Indicates the gender of the team                               | string  |
| name           | The name of the team                                           | string  |
| short_code     | The short code of the team                                     | string  |
| image_path     | Image path to the team logo                                    | string  |
| founded        | The founding date of the team                                  | integer |
| type           | Indicates the type of the team                                 | string  |
| placeholder    | Indicates if the team is a placeholder                         | boolean |
| last_played_at | Returns the date and time of the last played match of the team | integer |
| {% endtab %}   |                                                                |         |
| {% endtabs %}  |                                                                |         |

{% tabs %}
{% tab title="Query Parameters" %}

<table><thead><tr><th>Name</th><th width="232.66666666666666">Required?</th><th>Description</th></tr></thead><tbody><tr><td><code>api_token</code></td><td><p>YES </p><p>Another option is to provide the API token in the header.</p></td><td>Your unique API token. Ex. ?api_token=YOUR_TOKEN</td></tr><tr><td><code>include</code></td><td>NO</td><td>Enrich the API response with more data by using includes. Ex. &#x26;include=participants;events</td></tr><tr><td><code>select</code></td><td>NO</td><td>Select specific fields on the<a href="https://docs.sportmonks.com/football2/endpoints-and-entities/entities/fixtures"> base entity</a>. Read how to select fields in our <a href="https://docs.sportmonks.com/football2/api/request-options/selecting-fields">tutorial</a>.</td></tr><tr><td><code>filters</code></td><td>NO</td><td>Filter the API response on multiple related entities. There are static filters and dynamic filters.​<br><br>Please find the possibilities in the Static and Dynamic Filter tab.</td></tr><tr><td><code>locale</code></td><td>NO</td><td>Translate name fields of the API Response in your selected language. Find more information and which languages are available on our <a href="../../../api/translations-beta">translations page</a>.</td></tr></tbody></table>
{% endtab %}

{% tab title="Static Filters" %}
**Static filters** are always the same and filter in one specific way without any custom options. Each static filter is listed below and has a description of how it filters. For more information, please look at our[ Filters page](https://docs.sportmonks.com/football/api/request-options/filtering).

<table><thead><tr><th width="165">Static Filters</th><th width="114">Available on Entity</th><th width="197">Description</th><th width="274">Example</th></tr></thead><tbody><tr><td>N/A</td><td>N/A</td><td>Not available on this endpoint</td><td><p></p><p>N/A<br></p></td></tr></tbody></table>
{% endtab %}

{% tab title="Dynamic Filters" %}
The **dynamic filters** are based on entities and includes. Each dynamic filter uses an entity to filter on and one entity to apply the filter on. Below are examples with explanations of how filters are set up. For more information, please look at our[ Filters page](https://docs.sportmonks.com/football/api/request-options/filtering).

{% hint style="info" %}
Using an include? Check their respective filters on their entity page. For example if you use `&include=fixtures`, you can apply [fixture-related filters](https://docs.sportmonks.com/football/entities/fixture#fixture-entity-filters).&#x20;
{% endhint %}

<table><thead><tr><th width="143">Dynamic Filters</th><th>Available on Entity</th><th>Description</th><th width="191">Examples</th></tr></thead><tbody><tr><td><code>Types</code></td><td>Statistics<br><br>Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all possibilities.</td><td>Filter the team statistics (detailTypes) on a selection of types separated by a comma.       </td><td><code>&#x26;include=statistics.details.type&#x26;filters=teamstatisticdetailTypes:typeIDS</code><br><br><code>&#x26;include=statistics.details.type&#x26;filters=teamstatisticdetailTypes:59</code></td></tr><tr><td><code>countries</code></td><td>Coaches, Leagues, Players, Teams, and way more.<br><br>Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all possibilities.</td><td>Filter teams and more based on countries.</td><td><p><code>&#x26;include=country&#x26;filters=teamCountries:countryIDS</code></p><p></p><p><code>&#x26;include=country&#x26;filters=teamCountries:462</code></p></td></tr><tr><td><code>seasons</code></td><td>Statistics (players, team, coaches, referees), Standings, and way more.<br><br>Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all possibilities.</td><td>Filter team statistics based on seasons.</td><td><p><code>&#x26;include=statistics.details.type&#x26;filters=teamstatisticSeasons:seasonIDS</code>  </p><p></p><p><code>&#x26;include=statistics.details.type&#x26;filters=teamstatisticSeasons:19735</code></p></td></tr></tbody></table>
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

### Parameters

<table><thead><tr><th width="168">Parameter</th><th width="110">Required</th><th width="244">Description</th><th width="169">Example</th></tr></thead><tbody><tr><td><code>order</code></td><td>No</td><td>Returns teams ordered by <strong>id</strong> (<code>asc</code> or <code>desc</code>). Defaults to asc</td><td><em>&#x26;order=desc</em></td></tr><tr><td><code>per_page</code></td><td>No</td><td>The amount of results to return per page (max 50.). Defaults to 25.</td><td><em>&#x26;per_page=30</em></td></tr><tr><td><code>page</code></td><td>No</td><td>You can paginate using the <code>has_more</code> parameter to determine if you can still propagate through the results.</td><td><em>&#x26;page=2</em></td></tr></tbody></table>

### Include depth

You can use a total of `3` nested includes on this endpoint

### Include options

[`sport`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`country`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`venue`](https://docs.sportmonks.com/football/entities/other#venue) [`coaches`](https://docs.sportmonks.com/football/entities/team-player-squad-coach-and-referee#coach) [`rivals`](https://docs.sportmonks.com/football/entities/other#rival) [`players`](https://docs.sportmonks.com/football/entities/team-player-squad-coach-and-referee#player) [`latest`](https://docs.sportmonks.com/football/entities/fixture#fixture) [`upcoming`](https://docs.sportmonks.com/football/entities/fixture#fixture) [`seasons`](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#season) [`activeSeasons`](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#season) [`sidelined`](https://docs.sportmonks.com/football/entities/team-player-squad-coach-and-referee#sidelined) [`sidelinedHistory`](https://docs.sportmonks.com/football/entities/team-player-squad-coach-and-referee#sidelined) [`statistics`](https://docs.sportmonks.com/football/entities/statistic#teamstatistic) [`trophies`](https://docs.sportmonks.com/football/entities/other#participanttrophy) [`socials`](https://docs.sportmonks.com/football/entities/other#social) [`rankings`](https://docs.sportmonks.com/football/entities/other#ranking)

**Related Entities:**

Get an overview and explanation of all the fields returned in the API response. The related entities for the teams' endpoint are:

- [Team](https://docs.sportmonks.com/football/entities/team-player-squad-coach-and-referee#team)

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

url = URI("ttps://api.sportmonks.com/v3/football/teams/search/{search_query}?api_token=YOUR_TOKEN")

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
conn.request("GET", "/v3/football/teams/search/{search_query}?api_token=YOUR_TOKEN", payload, headers)
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
  CURLOPT_URL => 'https://api.sportmonks.com/v3/football/teams/search/{search_query}?api_token=YOUR_TOKEN',
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
  .url("https://api.sportmonks.com/v3/football/teams/search/{search_query}?api_token=YOUR_TOKEN")
  .method("GET", null)
  .build();
Response response = client.newCall(request).execute();
```

{% endtab %}

{% tab title="Node.js" %}

```
var unirest = require('unirest');
var req = unirest('GET', 'https://api.sportmonks.com/v3/football/teams/search/{search_query}?api_token=YOUR_TOKEN')
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

  url := "https://api.sportmonks.com/v3/football/teams/search/{search_query}?api_token=YOUR_TOKEN"
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
