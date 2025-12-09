# GET Last Updated Coaches

{% tabs %}
{% tab title="Base URL" %}

```javascript
https://api.sportmonks.com/v3/football/coaches/latest
```

{% endtab %}

{% tab title="Example Response" %}

```json
{
  "data": [
    {
      "id": 50,
      "player_id": 50,
      "sport_id": 1,
      "country_id": 462,
      "nationality_id": null,
      "city_id": null,
      "common_name": "S. Gerrard",
      "firstname": "Steven",
      "lastname": "Gerrard",
      "name": "Steven Gerrard",
      "display_name": "Steven Gerrard",
      "image_path": "https://cdn.sportmonks.com/images/soccer/players/18/50.png",
      "height": 183,
      "weight": 83,
      "date_of_birth": "1980-05-30",
      "gender": "male"
    }
  ],
```

{% endtab %}

{% tab title="Field Description" %}

| Field            | Description                                                    | Type    |
| ---------------- | -------------------------------------------------------------- | ------- |
| <p></p><p>id</p> | Refers to the unique id of the coach                           | integer |
| player_id        | Refers to the player related to the coach                      | integer |
| sport_id         | Refers to the sport related to the coach                       | integer |
| country_id       | Refers to the country of the coach                             | integer |
| nationality_id   | Refers to the nationality of the coach                         | integer |
| city_id          | Refers to the birthcity of the coach                           | string  |
| common_name      | Returns to the common name of the coach                        | string  |
| firstname        | Returns the first name of the coach                            | string  |
| lastname         | Returns the last name of the coach                             | string  |
| name             | Returns the first and last name of the coach                   | string  |
| display_name     | Returns the name that is often used to display in applications | string  |
| image_path       | Image path to the coach' headshot                              | string  |
| height           | Returns the height of the coach                                | integer |
| weight           | Returns the weight of the coach                                | integer |
| date_of_birth    | Returns the date of birth of the coach                         | string  |
| gender           | Returns the gender of the coach                                | string  |
| {% endtab %}     |                                                                |         |
| {% endtabs %}    |                                                                |         |

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

<table><thead><tr><th width="143">Dynamic Filters</th><th>Available on Entity</th><th>Description</th><th width="191">Examples</th></tr></thead><tbody><tr><td><code>detailTypes</code></td><td>Statistics<br><br>Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all possibilities.</td><td>Filter the coach statistics (detailTypes) on a selection of types separated by a comma.       </td><td><code>&#x26;include=statistics.details.type&#x26;filters=coachstatisticdetailTypes:typeIDS</code><br><br><code>&#x26;include=statistics.details.type&#x26;filters=coachstatisticdetailTypes:59</code></td></tr><tr><td><code>seasons</code></td><td>Statistics (players, team, coaches, referees), Standings, and way more.<br><br>Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all possibilities.</td><td>Filter coach statistics based on seasons.</td><td><p><code>&#x26;include=statistics.details.type&#x26;filters=coachstatisticSeasons:seasonIDS</code>  </p><p></p><p><code>&#x26;include=statistics.details.type&#x26;filters=coachstatisticSeasons:19735</code></p></td></tr></tbody></table>
{% endtab %}
{% endtabs %}

### Definition of “Latest Updated”

This endpoint returns every coach whose data has changed in the last two hours. The coach data fields include country_id, nationality_id, city_id, weight, and gender. The two-hour update window is fixed and cannot be altered.

A change in any of these fields during the last two hours means that the coach's record is included in the response:

1. country_id
   - Change means the coach’s associated country has been modified.
2. nationality_id
   - Change means the coach’s nationality assignment has been modified or added.
3. city_id
   - Change means the coach’s city association has been modified or added.
4. weight
   - Change means the coach’s weight value (in kilograms) was adjusted.
5. gender
   - Change means the coach’s gender field was modified.

### Frequency of updates & no-change responses

Any coach with at least one of the above fields changed in the last two hours will appear on each API call. If no coach record changed during that window, the API returns HTTP 200 with an empty data array. An empty array means there is nothing new to process.

### Polling frequency & rate limits

- It is recommended to poll every 1h 59m 55s or 1h 59m 58s to reduce end-to-end latency.
- Monitor for network jitter and clock skew to avoid missing updates or sending duplicate requests.

### Caching strategy & best practices

1. Cache all returned fields per coach in your local store.
2. On each response, compare each coach’s new payload against the cache.
3. Discard coach records with no actual differences.
4. Update the cache with only the changed records.
5. Cache rarely changing lookup data (such as country and city names) locally.
6. If you observe long runs of empty responses, back off your polling frequency temporarily to reduce unnecessary calls.

### Filters

More information on how to use filters can be found in our tutorials on how to [filter](https://docs.sportmonks.com/football2/api/request-options/filtering). If you want more information on which filters to use, you can check out the following [endpoint](https://app.gitbook.com/s/z0kWjB5EvZvqGsozw8vP/endpoints/filters/get-all-entity-filters):&#x20;

{% hint style="info" %}

```javascript
https://api.sportmonks.com/v3/my/filters/entity?api_token=YOUR_TOKEN
```

{% endhint %}

### Pagination

YES

### Include depth

You can use a total of `3` nested includes on this endpoint

### Include options

[`sport`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`country` ](https://docs.sportmonks.com/football2/v/core/endpoints/countries)[`teams`](https://docs.sportmonks.com/football/entities/team-player-squad-coach-and-referee#team) [`statistics`](https://docs.sportmonks.com/football/entities/statistic#coachstatistic) [`nationality`](https://app.gitbook.com/s/z0kWjB5EvZvqGsozw8vP/entities/core#country) [`trophies`](https://docs.sportmonks.com/football/entities/other#participanttrophy) [`player`](https://docs.sportmonks.com/football/entities/team-player-squad-coach-and-referee#player) [`fixtures`](https://docs.sportmonks.com/football/entities/fixture#fixture)

### **Related Entities:**

Get an overview and explanation of all the fields returned in the API response. The related entities for the coaches endpoints are:

- [Coach](https://docs.sportmonks.com/football/entities/team-player-squad-coach-and-referee#coach)

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

url = URI("https://api.sportmonks.com/v3/football/coaches/latest?api_token=YOUR_TOKEN")

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
conn.request("GET", "/v3/football/coaches/latest?api_token=YOUR_TOKEN", payload, headers)
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
  CURLOPT_URL => 'https://api.sportmonks.com/v3/football/coaches/latest?api_token=YOUR_TOKEN',
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
  .url("https://api.sportmonks.com/v3/football/coaches/latest?api_token=YOUR_TOKEN")
  .method("GET", null)
  .build();
Response response = client.newCall(request).execute();
```

{% endtab %}

{% tab title="Node.js" %}

```
var unirest = require('unirest');
var req = unirest('GET', 'https://api.sportmonks.com/v3/football/coaches/latest?api_token=YOUR_TOKEN')
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

  url := "https://api.sportmonks.com/v3/football/coaches/latest?api_token=YOUR_TOKEN"
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
