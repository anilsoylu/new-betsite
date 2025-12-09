# GET Extended Team Squad by Team ID

{% hint style="info" %}
If a player is no longer part of the squad or is currently a youth team player, the _in_squad_ field is marked false.&#x20;
{% endhint %}

{% tabs %}
{% tab title="Base URL" %}

```javascript
https://api.sportmonks.com/v3/football/squads/teams/{teamID}/extended
```

{% endtab %}

{% tab title="Example Response" %}

```json
{
  "data": [
    {
        "id": 4598752,
        "sport_id": 1,
        "country_id": 38,
        "nationality_id": 38,
        "city_id": 75819,
        "position_id": 25,
        "detailed_position_id": 154,
        "type_id": 25,
        "common_name": "L. Geertruida",
        "firstname": "Lutsharel",
        "lastname": "Geertruida",
        "name": "Lutsharel Geertruida",
        "display_name": "Lutsharel Geertruida",
        "image_path": "https://cdn.sportmonks.com/images/soccer/players/0/4598752.png",
        "height": 184,
        "weight": 69,
        "date_of_birth": "2000-07-18",
        "gender": "male",
        "in_squad": true
    },
    {
        "id": 5270463,
        "sport_id": 1,
        "country_id": 5,
        "nationality_id": 5,
        "city_id": null,
        "position_id": 27,
        "detailed_position_id": 151,
        "type_id": 27,
        "common_name": "D. Pereira da Silva",
        "firstname": "Danilo",
        "lastname": "Pereira da Silva",
        "name": "Danilo Pereira da Silva",
        "display_name": "Danilo",
        "image_path": "https://cdn.sportmonks.com/images/soccer/players/31/5270463.png",
        "height": 174,
        "weight": null,
        "date_of_birth": "1999-04-07",
        "gender": "male",
        "in_squad": false
    },
    {
        "id": 6306068,
        "sport_id": 1,
        "country_id": 38,
        "nationality_id": 38,
        "city_id": 93391,
        "position_id": 26,
        "detailed_position_id": 153,
        "type_id": 26,
        "common_name": "Q. Timber",
        "firstname": "Quinten",
        "lastname": "Timber",
        "name": "Quinten Maduro",
        "display_name": "Quinten Timber",
        "image_path": "https://cdn.sportmonks.com/images/soccer/players/20/6306068.png",
        "height": 177,
        "weight": null,
        "date_of_birth": "2001-06-17",
        "gender": "male",
        "in_squad": true
    }
...
```

{% endtab %}

{% tab title="Field Description" %}

<table><thead><tr><th width="218.87780548628433">Field</th><th width="268.3333333333333">Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the player</td><td>integer</td></tr><tr><td>sport_id</td><td>Refers to the sport of the player</td><td>integer</td></tr><tr><td>country_id</td><td>Refers to the country of the player</td><td>integer</td></tr><tr><td>nationality_id</td><td>Refers to the nationality of the player</td><td>integer</td></tr><tr><td>city_id</td><td>Refers to the birthcity of the player</td><td>string</td></tr><tr><td>position_id</td><td>Refers to the position of the player</td><td>integer</td></tr><tr><td>detailed_position_id</td><td>Refers to the detailed position of the player</td><td>integer</td></tr><tr><td>type_id</td><td>Refers to the type of the player</td><td>integer</td></tr><tr><td>common_name</td><td>Refers to the name the player is known for</td><td>string</td></tr><tr><td>firstname</td><td>Refers to the first name of the player</td><td>string</td></tr><tr><td>lastname</td><td>Refers to the last name of the player</td><td>string</td></tr><tr><td>name</td><td>Refers to the name of the player</td><td>string</td></tr><tr><td>display_name</td><td>Refers to the name that is often used to display in applications</td><td>string</td></tr><tr><td>image_path</td><td>Image path to player headshot</td><td>string</td></tr><tr><td>height</td><td>Refers to the height of the player</td><td>integer</td></tr><tr><td>weight</td><td>Refers to the weight of the player</td><td>integer</td></tr><tr><td>date_of_birth</td><td>Refers to the date of birth of the player</td><td>string</td></tr><tr><td>gender</td><td>Refers to the gender of the player</td><td>string</td></tr><tr><td>in_squad</td><td>Marks whether the player is still in the squad</td><td>boolean</td></tr></tbody></table>
{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="Query Parameters" %}

<table><thead><tr><th>Name</th><th width="232.66666666666666">Required?</th><th>Description</th></tr></thead><tbody><tr><td><code>api_token</code></td><td><p>YES </p><p>Another option is to provide the API token in the header.</p></td><td>Your unique API token. Ex. ?api_token=YOUR_TOKEN</td></tr><tr><td><code>include</code></td><td>NO</td><td>Enrich the API response with more data by using includes. Ex. &#x26;include=participants;events</td></tr><tr><td><code>select</code></td><td>NO</td><td>Select specific fields on the<a href="https://docs.sportmonks.com/football2/endpoints-and-entities/entities/fixtures"> base entity</a>. Read how to select fields in our <a href="https://docs.sportmonks.com/football2/api/request-options/selecting-fields">tutorial</a>.</td></tr><tr><td><code>filters</code></td><td>NO</td><td>Filter the API response on multiple related entities. There are static filters and dynamic filters.​<br><br>Please find the possibilities in the Static and Dynamic Filter tab.</td></tr><tr><td><code>locale</code></td><td>NO</td><td>Translate name fields of the API Response in your selected language. Find more information and which languages are available on our <a href="../../../api/translations-beta">translations page</a>.</td></tr></tbody></table>
{% endtab %}

{% tab title="Static Filters" %}
**Static filters** are always the same and filter in one specific way without any custom options. Each static filter is listed below and has a description of how it filters. For more information, please look at our[ Filters page](https://docs.sportmonks.com/football/api/request-options/filtering).

<table><thead><tr><th width="165">Static Filters</th><th width="114">Available on Entity</th><th width="197">Description</th><th width="274">Example</th></tr></thead><tbody><tr><td>N/A</td><td>N/A</td><td>Not available for this endpoint.</td><td>N/A<br></td></tr></tbody></table>
{% endtab %}

{% tab title="Dynamic Filters" %}
The **dynamic filters** are based on entities and includes. Each dynamic filter uses an entity to filter on and one entity to apply the filter to. Below is an example with an explanation of how filters are set up. For more information, please look at our[ Filters page](https://docs.sportmonks.com/football/api/request-options/filtering).

{% hint style="info" %}
Using an include? Check their respective filters on their entity page. For example if you use `&include=fixtures`, you can apply [fixture-related filters](https://docs.sportmonks.com/football/entities/fixture#fixture-entity-filters).&#x20;
{% endhint %}

<table><thead><tr><th width="143">Dynamic Filters</th><th>Available on Entity</th><th>Description</th><th width="191">Examples</th></tr></thead><tbody><tr><td><code>Types</code></td><td>Statistics, Events, Lineup, Stages and way more. Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all possibilities.</td><td>Filter the player statistics only on the types you're interested in. </td><td><p><code>&#x26;include=details&#x26;filters=playerstatisticdetailTypes:TypeIDS</code> </p><p></p><p><code>&#x26;include=details&#x26;filters=playerstatisticdetailTypes:80</code> </p></td></tr></tbody></table>
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

NO

### Include depth

You can use a total of `2` nested includes on this endpoint

### Include options

[`sport`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`country`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`city`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`nationality`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`transfers`](https://docs.sportmonks.com/football/entities/other#transfer) [`pendingTransfers`](https://docs.sportmonks.com/football/entities/other#transfer) [`teams`](https://docs.sportmonks.com/football/entities/team-player-squad-coach-and-referee#team) [`statistics`](https://docs.sportmonks.com/football/entities/statistic#playerstatistic) [`latest`](https://docs.sportmonks.com/football/entities/fixture#fixture) [`position`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`detailedPosition`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`lineups`](https://docs.sportmonks.com/football/entities/fixture#lineup) [`trophies`](https://docs.sportmonks.com/football/entities/other#participanttrophy) [`metadata`](https://docs.sportmonks.com/football/entities/other#metadata) &#x20;

### **Related Entities:**

Get an overview and explanation of all the fields returned in the API response. The related entities for the team squads by season endpoint are:

- [Player](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/players)

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

url = URI("https://api.sportmonks.com/v3/football/squads/seasons/{ID}/teams/{ID}?api_token=YOUR_TOKEN")

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
conn.request("GET", "/v3/football/squads/seasons/{ID}/teams/{ID}?api_token=YOUR_TOKEN", payload, headers)
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
  CURLOPT_URL => 'https://api.sportmonks.com/v3/football/squads/seasons/{ID}/teams/{ID}?api_token=YOUR_TOKEN',
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
  .url("https://api.sportmonks.com/v3/football/squads/seasons/{ID}/teams/{ID}?api_token=YOUR_TOKEN")
  .method("GET", null)
  .build();
Response response = client.newCall(request).execute();
```

{% endtab %}

{% tab title="Node.js" %}

```
var unirest = require('unirest');
var req = unirest('GET', 'https://api.sportmonks.com/v3/football/squads/seasons/{ID}/teams/{ID}?api_token=YOUR_TOKEN')
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

  url := "https://api.sportmonks.com/v3/football/squads/seasons/{ID}/teams/{ID}?api_token=YOUR_TOKEN"
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
