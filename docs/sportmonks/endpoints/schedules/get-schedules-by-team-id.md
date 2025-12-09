# GET Schedules by Team ID

{% tabs %}
{% tab title="Base URL" %}

```javascript
https://api.sportmonks.com/v3/football/schedules/teams/{ID}
```

{% endtab %}

{% tab title="Example Response" %}

```json
{
  "data": [
    {
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
      "games_in_current_week": true,
      "aggregates": [

      ],
      "rounds": [
        {
          "id": 274733,
          "sport_id": 1,
          "league_id": 501,
          "season_id": 19735,
          "stage_id": 77457866,
          "name": "20",
          "finished": true,
          "is_current": false,
          "starting_at": "2023-01-02",
          "ending_at": "2023-01-02",
          "games_in_current_week": false,
          "fixtures": [
            {
              "id": 18535605,
              "sport_id": 1,
              "league_id": 501,
              "season_id": 19735,
              "stage_id": 77457866,
              "group_id": null,
              "aggregate_id": null,
              "round_id": 274733,
              "state_id": 5,
              "venue_id": 8914,
              "name": "Rangers vs Celtic",
              "starting_at": "2023-01-02 12:30:00",
              "result_info": "Game ended in draw.",
              "leg": "1/1",
              "details": null,
              "length": 90,
              "placeholder": false,
              "last_processed_at": "2023-02-17 10:19:54",
              "has_odds": true,
              "starting_at_timestamp": 1672662600,
              "participants": [
                {
                  "id": 53,
                  "sport_id": 1,
                  "country_id": 1161,
                  "venue_id": 8909,
                  "gender": "male",
                  "name": "Celtic",
                  "short_code": "CEL",
                  "image_path": "https://cdn.sportmonks.com/images/soccer/teams/21/53.png",
                  "founded": 1888,
                  "type": "domestic",
                  "placeholder": false,
                  "last_played_at": "2023-02-26 15:00:00",
                  "meta": {
                    "location": "away",
                    "winner": false,
                    "position": 1
                  }
                },
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
                  "last_played_at": "2023-02-26 15:00:00",
                  "meta": {
                    "location": "home",
                    "winner": false,
                    "position": 2
                  }
                }
              ],
              "scores": [
                {
                  "id": 11956908,
                  "fixture_id": 18535605,
                  "type_id": 1,
                  "participant_id": 62,
                  "score": {
                    "goals": 0,
                    "participant": "home"
                  },
                  "description": "1ST_HALF"
                },
                {
                  "id": 11956909,
                  "fixture_id": 18535605,
                  "type_id": 1,
                  "participant_id": 53,
                  "score": {
                    "goals": 1,
                    "participant": "away"
                  },
                  "description": "1ST_HALF"
                },
                {
                  "id": 11956914,
                  "fixture_id": 18535605,
                  "type_id": 1525,
                  "participant_id": 53,
                  "score": {
                    "goals": 2,
                    "participant": "away"
                  },
                  "description": "CURRENT"
                },
                {
                  "id": 11956915,
                  "fixture_id": 18535605,
                  "type_id": 1525,
                  "participant_id": 62,
                  "score": {
                    "goals": 2,
                    "participant": "home"
                  },
                  "description": "CURRENT"
                },
                {
                  "id": 11956978,
                  "fixture_id": 18535605,
                  "type_id": 2,
                  "participant_id": 62,
                  "score": {
                    "goals": 2,
                    "participant": "home"
                  },
                  "description": "2ND_HALF"
                },
                {
                  "id": 11956979,
                  "fixture_id": 18535605,
                  "type_id": 2,
                  "participant_id": 53,
                  "score": {
                    "goals": 2,
                    "participant": "away"
                  },
                  "description": "2ND_HALF"
                }
              ]
            }
          ]
        },
        //and more
```

{% endtab %}

{% tab title="Field Description" %}

#### Stage

| Field             | Description                                                                   | Type    |
| ----------------- | ----------------------------------------------------------------------------- | ------- |
| id                | Refers to the unique id of the requested stage                                | integer |
| continues_from_id | Refers to the previous stage id related to the season and the requested stage | integer |
| sport_id          | Refers to the sport of the requested stage                                    | integer |
| league_id         | Refers to the league related to the requested stage                           | integer |
| season_id         | Refers to the season related to the requested stage                           | integer |
| type_id           | Indicates what the stage type is                                              | integer |
| name              | Returns the name of the requested stage                                       | string  |
| sort_order        | Returns the order of the requested stage                                      | integer |
| finished          | Indicates if the requested stage is finished or not                           | integer |
| pending           | Inidcates if the requested stage is pending or not                            | integer |
| is_current        | Indicates if the requested stage is the current stage or not                  | integer |
| starting_at       | The starting date of the requested stage                                      | string  |
| ending_at         | The end date of the requested stage                                           | string  |

####

#### Rounds

| Field       | Description                                                | Type    |
| ----------- | ---------------------------------------------------------- | ------- |
| id          | Refers to the unique id of the requested round             | integer |
| sport_id    | Refers to the sport id of the requested round              | integer |
| league_id   | Refers to the league id of the requested round             | integer |
| season_id   | Refers to the season id of the requested round             | integer |
| group_id    | Refers to the group id of the requested round              | integer |
| name        | Returns the name of the requested round                    | string  |
| finished    | Indicates if the requested round is finished or not        | integer |
| pending     | Indicates if the requested round is finished or not        | integer |
| is_current  | Indicates if the requested round is the current one or not | integer |
| starting_at | Returns the starting date of the round                     | string  |
| ending_at   | Returns the ending date of the round                       | string  |

####

#### Fixtures

| Field         | Description                                      | Type           |
| ------------- | ------------------------------------------------ | -------------- |
| id            | Refers the unique id of the fixture              | integer        |
| sport_id      | Refers to the sport the fixture is played at     | integer        |
| league_id     | Refers to the league the fixture is played in    | integer        |
| season_id     | Refers to the seasons the fixture is played in   | integer        |
| stage_id      | Refers to the stage the fixture is played in     | integer        |
| group_id      | Refers to the group the fixture is played in     | integer / null |
| aggregate_id  | Refers to the aggregate the fixture is played at | integer / null |
| state_id      | Refers to the state the fixture is played at     | integer        |
| round_id      | Refers to the round the fixture is played at     | integer / null |
| state_id      | Refers to the state the fixture is played at     | integer        |
| venue_id      | Refers to the venue the fixture is played at     | integer / null |
| name          | Represents the name of the participants          | string / null  |
| home_score    | Score for the home participant                   | integer / null |
| away_score    | Score for the visiting participant               | integer / null |
| starting_at   | Datetime object representing the start time      | date / null    |
| result_info   | Represents the final result info                 | string / null  |
| leg           | Represents the leg of the fixture                | string         |
| details       | Represents details about the fixture             | string / null  |
| length        | Length of the fixture (minutes)                  | integer / null |
| {% endtab %}  |                                                  |                |
| {% endtabs %} |                                                  |                |

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

<table><thead><tr><th width="143">Dynamic Filters</th><th>Available on Entity</th><th>Description</th><th width="191">Examples</th></tr></thead><tbody><tr><td>N/A</td><td>N/A</td><td>Not available on this endpoint</td><td>N/A</td></tr></tbody></table>
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

No

### Include depth

You can use a total of `0` nested includes on this endpoint

### Include options

`NONE`

### **Related Entities:**

Get an overview and explanation of all the fields returned in the API response. The related entities for the schedules endpoint are:

- [Stage](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#stages)
- [Round](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#round)
- [Fixtures](https://docs.sportmonks.com/football/entities/fixture#fixture)

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

url = URI("https://api.sportmonks.com/v3/football/schedules/teams/{id}?api_token=YOUR_TOKEN")

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
conn.request("GET", "/v3/football/schedules/teams/{id}?api_token=YOUR_TOKEN", payload, headers)
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
  CURLOPT_URL => 'https://api.sportmonks.com/v3/football/schedules/teams/{id}?api_token=YOUR_TOKEN',
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
  .url("https://api.sportmonks.com/v3/football/schedules/teams/{id}?api_token=YOUR_TOKEN")
  .method("GET", null)
  .build();
Response response = client.newCall(request).execute();
```

{% endtab %}

{% tab title="Node.js" %}

```
var unirest = require('unirest');
var req = unirest('GET', 'https://api.sportmonks.com/v3/football/schedules/teams/{id}?api_token=YOUR_TOKEN')
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

  url := "https://api.sportmonks.com/v3/football/schedules/teams/{id}?api_token=YOUR_TOKEN"
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
