# GET All Standings

{% tabs %}
{% tab title="Base URL" %}

```javascript
https://api.sportmonks.com/v3/football/standings
```

{% endtab %}

{% tab title="Example Response" %}

```json
{
  "data": [
    {
      "id": 2621,
      "participant_id": 273,
      "sport_id": 1,
      "league_id": 501,
      "season_id": 19735,
      "stage_id": 77457866,
      "group_id": null,
      "round_id": 275092,
      "standing_rule_id": 13219,
      "position": 6,
      "result": "up",
      "points": 35
    },
    {
      "id": 2622,
      "participant_id": 53,
      "sport_id": 1,
      "league_id": 501,
      "season_id": 19735,
      "stage_id": 77457866,
      "group_id": null,
      "round_id": 275092,
      "standing_rule_id": 13224,
      "position": 1,
      "result": "equal",
      "points": 73
    },
    //and more
```

{% endtab %}

{% tab title="Field Description" %}

<table><thead><tr><th width="199.19226283853723">Field</th><th width="268.3333333333333"></th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the standings</td><td>integer</td></tr><tr><td>participant_id</td><td>Refers to the participant related to the standing</td><td>integer</td></tr><tr><td>sport_id</td><td>Refers to the sport related to the standing</td><td>integer</td></tr><tr><td>league_id</td><td>Refers to the league related to the standing</td><td>integer</td></tr><tr><td>season_id</td><td>Refers to the season related to the standing</td><td>integer</td></tr><tr><td>stage_id</td><td>Refers to the stage related to the standing</td><td>integer</td></tr><tr><td>group_id</td><td>Refers to the group related to the standing</td><td>integer / null</td></tr><tr><td>round_id</td><td>Refers to the round related to the standing</td><td>integer / null</td></tr><tr><td>standing_rule_id</td><td>Refers to the standing rule related to the standing</td><td>integer</td></tr><tr><td>position</td><td>The position of the team in the standing</td><td>integer</td></tr><tr><td>result</td><td>Indication of the team in the position went up or down in the standing</td><td>string</td></tr><tr><td>points</td><td>The number of points the team has gathered in the standings</td><td>integer</td></tr></tbody></table>
{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="Query Parameters" %}

<table><thead><tr><th>Name</th><th width="232.66666666666666">Required?</th><th>Description</th></tr></thead><tbody><tr><td><code>api_token</code></td><td><p>YES </p><p>Another option is to provide the API token in the header.</p></td><td>Your unique API token. Ex. ?api_token=YOUR_TOKEN</td></tr><tr><td><code>include</code></td><td>NO</td><td>Enrich the API response with more data by using includes. Ex. &#x26;include=participants;events</td></tr><tr><td><code>select</code></td><td>NO</td><td>Select specific fields on the<a href="https://docs.sportmonks.com/football2/endpoints-and-entities/entities/fixtures"> base entity</a>. Read how to select fields in our <a href="https://docs.sportmonks.com/football2/api/request-options/selecting-fields">tutorial</a>.</td></tr><tr><td><code>filters</code></td><td>NO</td><td>Filter the API response on multiple related entities. There are static filters and dynamic filters.​<br><br>Please find the possibilities in the Static and Dynamic Filter tab.</td></tr><tr><td><code>locale</code></td><td>NO</td><td>Translate name fields of the API Response in your selected language. Find more information and which languages are available on our <a href="../../../api/translations-beta">translations page</a>.</td></tr></tbody></table>
{% endtab %}

{% tab title="Static Filters" %}
**Static filters** are always the same and filter in one specific way without any custom options. Each static filter is listed below and has a description of how it filters. For more information, please look at our[ Filters page](https://docs.sportmonks.com/football/api/request-options/filtering).

<table><thead><tr><th width="165">Static Filters</th><th width="114">Available on Entity</th><th width="197">Description</th><th width="274">Example</th></tr></thead><tbody><tr><td><code>IdAfter</code></td><td>GET All endpoints</td><td>Filter all standings starting from a certain standing ID. Handy if you're doing an import for all standings and want to continue from a certain ID.</td><td><code>&#x26;filters=IdAfter:standingID</code><br><br><code>&#x26;filters=IdAfter:10210</code><br></td></tr></tbody></table>
{% endtab %}

{% tab title="Dynamic Filters" %}
The **dynamic filters** are based on entities and includes. Each dynamic filter uses an entity to filter on and one entity to apply the filter on. Below are examples with explanations of how filters are set up. For more information, please look at our [Filters page.](https://docs.sportmonks.com/football/api/request-options/filtering)

{% hint style="info" %}
Using an include? Check their respective filters on their entity page. For example if you use `&include=participants` you can apply [team-related filters](https://docs.sportmonks.com/football/entities/team-player-squad-coach-and-referee#team).&#x20;
{% endhint %}

<table><thead><tr><th width="143">Dynamic Filters</th><th>Available on Entity</th><th>Description</th><th width="191">Examples</th></tr></thead><tbody><tr><td><code>types</code></td><td><code>Standingdetails</code>, <code>standingrule</code>.<br><br>Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all possibilities.</td><td>Filter the Types on a selection of certain standing rules, or standing details. </td><td><p><code>&#x26;include=details.type&#x26;filters=standingdetailTypes:TypeIDs</code><br><br><code>&#x26;include=details.type&#x26;filters=standingdetailTypes:129</code><br></p><p> </p></td></tr><tr><td><code>leagues</code></td><td>Fixtures, Seasons, Standings, and way more.<br><br>Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all possibilities.</td><td>Filter the standings based on leagues.</td><td><p><code>&#x26;filters=standingLeagues:leagueIDs</code></p><p></p><p><code>&#x26;filters=standingLeagues:501,271</code></p></td></tr><tr><td><code>groups</code></td><td>Fixtures, Standing, and more.<br><br>Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all possibilities.</td><td>Filter the standings based on groups.</td><td><code>&#x26;include=group&#x26;filters=standingGroups:groupIDs</code><br><br><code>&#x26;include=group&#x26;filters=standingGroups:243691</code></td></tr><tr><td><code>seasons</code></td><td>Statistics (players, team, coaches, referees), Standings, and way more.<br><br>Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all possibilities.</td><td>Filter the standings on seasons.</td><td><code>&#x26;include=season&#x26;filters=standingSeasons:seasonIDS</code><br><br><code>&#x26;include=season&#x26;filters=standingSeasons:18334</code></td></tr><tr><td><code>stages</code></td><td>Standing, and more.<br><br>Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all possibilities.</td><td>Filter the standings on stages. </td><td><code>&#x26;include=stage&#x26;filters=standingStages:stageIDS</code><br><br><code>&#x26;include=stage&#x26;filters=standingStages:77453568</code></td></tr></tbody></table>
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

<table><thead><tr><th width="168">Parameter</th><th width="110">Required</th><th width="244">Description</th><th width="169">Example</th></tr></thead><tbody><tr><td><code>order</code></td><td>No</td><td>Returns standings ordered by <strong>id</strong> (<code>asc</code> or <code>desc</code>). Defaults to asc</td><td><em>&#x26;order=desc</em></td></tr><tr><td><code>per_page</code></td><td>No</td><td>The amount of results to return per page (max 50.). Defaults to 25.</td><td><em>&#x26;per_page=30</em></td></tr><tr><td><code>page</code></td><td>No</td><td>You can paginate using the <code>has_more</code> parameter to determine if you can still propagate through the results.</td><td><em>&#x26;page=2</em></td></tr></tbody></table>

### Include depth

You can use a total of `2` nested includes on this endpoint

### Include options

[`participant`](https://docs.sportmonks.com/football/entities/team-player-squad-coach-and-referee#team) [`season`](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#season) [`league`](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#league) [`stage`](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#stage) [`group`](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#group) [`round`](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#round) [`rule`](https://docs.sportmonks.com/football/entities/standing-and-topscorer#standingrule) [`details`](https://docs.sportmonks.com/football/entities/standing-and-topscorer#standingdetail) [`form`](https://docs.sportmonks.com/football/entities/standing-and-topscorer#standingform) [`sport`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/)

### **Related Entities:**

Get an overview and explanation of all the fields returned in the API response. The related entities for the standings endpoint are:

- [Standing](https://docs.sportmonks.com/football/entities/standing-and-topscorer#standing)

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

url = URI("https://api.sportmonks.com/v3/football/standings?api_token=YOUR_TOKEN")

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
conn.request("GET", "/v3/football/standings?api_token=YOUR_TOKEN", payload, headers)
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
  CURLOPT_URL => 'https://api.sportmonks.com/v3/football/standings?api_token=YOUR_TOKEN',
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
  .url("https://api.sportmonks.com/v3/football/standings?api_token=YOUR_TOKEN")
  .method("GET", null)
  .build();
Response response = client.newCall(request).execute();
```

{% endtab %}

{% tab title="Node.js" %}

```
var unirest = require('unirest');
var req = unirest('GET', 'https://api.sportmonks.com/v3/football/standings?api_token=YOUR_TOKEN')
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

  url := "https://api.sportmonks.com/v3/football/standings?api_token=YOUR_TOKEN"
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
