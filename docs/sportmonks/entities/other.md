# Other

### **News**

#### **Related endpoints**

{% content-ref url="../endpoints/news" %}
[news](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/news)
{% endcontent-ref %}

#### **Field Description**

<table><thead><tr><th>Field</th><th width="268.3333333333333"></th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the news article</td><td>integer</td></tr><tr><td>fixture_id</td><td>Refers to the fixture related to the news article</td><td>integer</td></tr><tr><td>league_id</td><td>Refers to the league related to the news article</td><td>integer</td></tr><tr><td>title</td><td>The title of the news article</td><td>string</td></tr><tr><td>type</td><td>The type of the news</td><td>string</td></tr></tbody></table>

#### Include options

[`fixture`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#fixture) [`league`](https://docs.sportmonks.com/football/endpoints-and-entities/league-season-schedule-stage-and-round#league) [`lines`](#newsitemline)

### **NewsItemLine**

#### **Field Description**

<table><thead><tr><th>Field</th><th width="268.3333333333333"></th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the news article line</td><td>integer</td></tr><tr><td>newsitem_id</td><td>Refers to the news article related to the news article line</td><td>integer</td></tr><tr><td>text</td><td>The text of the news article line</td><td>string</td></tr><tr><td>type</td><td>The type of the news article line</td><td>string</td></tr></tbody></table>

#### Include options

`none`

### Commentary

#### **Related endpoints**

{% content-ref url="../endpoints/commentaries" %}
[commentaries](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/commentaries)
{% endcontent-ref %}

#### **Field Description**

<table><thead><tr><th>Field</th><th width="268.3333333333333"></th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the commentary</td><td>string</td></tr><tr><td>fixture_id</td><td>Refers to the fixture related to the commentary</td><td>integer</td></tr><tr><td>comment</td><td>The textual representation of the event in the fixture</td><td>string</td></tr><tr><td>minute</td><td>The minute of the comment in the fixture </td><td>integer</td></tr><tr><td>extra_minute</td><td>The extra minute of the comment in the fixture </td><td>integer</td></tr><tr><td>is_goal</td><td>Indicates if the comment is a goal</td><td>boolean</td></tr><tr><td>is_important</td><td>Indicates if the comment is important</td><td>boolean</td></tr><tr><td>order</td><td>The order of the comment</td><td>integer</td></tr></tbody></table>

#### Include options

[`fixture`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#fixture) &#x20;

### Video Highlight

#### **Related endpoints**

{% hint style="warning" %}
Currently, the video highlights are removed due to a lack of service. We're working on finding a new data partner to adjust this.
{% endhint %}

#### **Field Description**

<table><thead><tr><th>Field</th><th width="268.3333333333333"></th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the id of the video highlight</td><td>integer</td></tr><tr><td>fixture_id</td><td>Refers to the fixture related to the video highlights</td><td>integer</td></tr><tr><td>type_id</td><td>Refers to the type related to the video highlights</td><td>integer</td></tr><tr><td>event_id</td><td>Refers to the event related to the video highlights</td><td>integer</td></tr><tr><td>location</td><td>Returns the location URL of the video highlight</td><td>string</td></tr></tbody></table>

#### Include options

[`fixture`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#fixture)

### TvStation

#### **Related endpoints**

{% content-ref url="../endpoints/tv-stations" %}
[tv-stations](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/tv-stations)
{% endcontent-ref %}

#### **Field Description**

<table><thead><tr><th>Field</th><th width="268.3333333333333"></th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the tv station</td><td>integer</td></tr><tr><td>name</td><td>Displays the name of the tv station</td><td>string</td></tr><tr><td>url</td><td>Displays the url of the tv station</td><td>string / null</td></tr><tr><td>image_path</td><td>Displays the image path of the tv station</td><td>string / null</td></tr></tbody></table>

#### Include options

[`fixtures`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#fixture) [`countries`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/)

### Venue

#### Related endpoints

{% content-ref url="../endpoints/venues" %}
[venues](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/venues)
{% endcontent-ref %}

#### Field description

<table><thead><tr><th width="248.33333333333331">Field</th><th>Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the venue</td><td>integer</td></tr><tr><td>country_id</td><td>Refers to the country of the venue</td><td>integer</td></tr><tr><td>name</td><td>Returns the name of the venue</td><td>string</td></tr><tr><td>address</td><td>Returns the address of the venue</td><td>string</td></tr><tr><td>zipcode</td><td>Returns the zipcode of the venue</td><td>string</td></tr><tr><td>state</td><td>Returns the state of the venue</td><td>string / null</td></tr><tr><td>latitude</td><td>Returns the latitude of the venue</td><td>string</td></tr><tr><td>longitude</td><td>Returns the longitude of the venue</td><td>string</td></tr><tr><td>capacity</td><td>Returns the seating capacity of the venue</td><td>integer</td></tr><tr><td>image_path</td><td>Returns the image path of the venue</td><td>string / null</td></tr><tr><td>city_name</td><td>Returns the name of the city the venue is located in</td><td>string</td></tr><tr><td>surface</td><td>Returns the surface type of the venue</td><td>string</td></tr><tr><td>national_team</td><td>Indicates if the venue is used for the national team of the country</td><td>boolean</td></tr></tbody></table>

#### Include options

[`country`](https://docs.sportmonks.com/football2/v/core/endpoints/countries) [`city`](https://docs.sportmonks.com/football2/v/core/endpoints/cities) [`fixtures`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#fixture)

### WeatherReport

#### Field description

<table><thead><tr><th width="248.33333333333331">Field</th><th>Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the weather report</td><td>integer</td></tr><tr><td>fixture_id</td><td>Refers to the fixture related to the weather report</td><td>integer</td></tr><tr><td>venue_id</td><td>Refers to the venue related to the weather report</td><td>integer</td></tr><tr><td>temperature</td><td>Displays the temperatures over the day</td><td>object</td></tr><tr><td>feels_like</td><td>Displays the perceived temperatures over the day</td><td>object</td></tr><tr><td>wind</td><td>Displays the wind speed and direction</td><td>object</td></tr><tr><td>humidity</td><td>Displays the degree of humidity of the weather report</td><td>string</td></tr><tr><td>pressure</td><td>Displays the pressure of the weather report</td><td>integer</td></tr><tr><td>clouds</td><td>Displays the degree of clouds of the weather report</td><td>string</td></tr><tr><td>description</td><td>Displays the description of the weather report</td><td>string</td></tr><tr><td>icon</td><td>Displays the Sportmonks icon related to the weather report</td><td>string</td></tr><tr><td>type</td><td>Displays the type of the weather report</td><td>string</td></tr><tr><td>metric</td><td>Displays the metric of temperature of the weather report</td><td>string</td></tr><tr><td>current</td><td>Indicates if the weather is current. Only available when the type is actual.</td><td>string / null</td></tr></tbody></table>

#### Include options

[`venue`](#venue) [`fixture`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#fixture)

### Transfer

**Related endpoints**

{% content-ref url="../endpoints/transfers" %}
[transfers](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/transfers)
{% endcontent-ref %}

**Field Description**

<table><thead><tr><th width="165.33333333333331">Field</th><th>Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the id of the transfer</td><td>integer</td></tr><tr><td>sport_id</td><td>Refers to the sport related to the transfer</td><td>integer</td></tr><tr><td>player_id</td><td>Refers to the player related to the transfer</td><td>integer</td></tr><tr><td>type_id</td><td>Refers to the type of the transfer</td><td>integer</td></tr><tr><td>from_team_id</td><td>Refers to the team the player transferred from</td><td>integer</td></tr><tr><td>to_team_id</td><td>Refers to the team the player transferred to</td><td>integer</td></tr><tr><td>position_id</td><td>Refers to the position of the player</td><td>integer</td></tr><tr><td>detailed_position_id</td><td>Refers to the detailed position of the player</td><td>integer</td></tr><tr><td>date</td><td>Displays the date of the transfer</td><td>string</td></tr><tr><td>career_ended</td><td>Indicates if the player has ended his career</td><td>integer</td></tr><tr><td>amount</td><td>Displays the amount of the transfer</td><td>string</td></tr><tr><td>completed</td><td>Indicates if the transfer is completed or not</td><td>boolean</td></tr><tr><td>completed_at</td><td>Displays the date time of when the transfer has been completed</td><td>string</td></tr></tbody></table>

#### Include options

[`sport`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`player`](https://docs.sportmonks.com/football/endpoints-and-entities/team-player-squad-coach-and-referee#player) [`type`](https://docs.sportmonks.com/football2/v/core/endpoints/types) [`fromTeam`](https://docs.sportmonks.com/football/endpoints-and-entities/team-player-squad-coach-and-referee#team) [`toTeam`](https://docs.sportmonks.com/football/endpoints-and-entities/team-player-squad-coach-and-referee#team) [`position`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`detailedPosition`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/)

### Transfer Entity Filters

{% tabs %}
{% tab title="Query Parameters" %}

| Query Parameters | Required                                                      | Description                                                                                                                                                                                                 |
| ---------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `api_token`      | YES Another option is to provide the API token in the header. | Your unique API token. Ex. ?api_token={{YOURTOKEN}}                                                                                                                                                         |
| `include`        | NO                                                            | Enrich the API response with more data by using [includes](https://docs.sportmonks.com/football2/tutorials-and-guides/tutorials/enrich-your-response/includes). Ex. \&include=type;fromTeam                 |
| `select`         | NO                                                            | ​[Select](https://docs.sportmonks.com/football2/api/request-options/selecting-fields) specific fields on the [base entity](https://docs.sportmonks.com/football2/endpoints-and-entities/entities/fixtures)​ |
| `filters`        | NO                                                            | Filter the API response on multiple related entities. There are static filters and dynamic filters.​Please find the possibilities in the Static and Dynamic Filter tab.                                     |

{% endtab %}

{% tab title="Static Filters" %}
No Static Filters available for this entity, beside the Get All Transfers endpoint where you can use the `idAfter` filter
{% endtab %}

{% tab title="Dynamic Filters" %}
The **dynamic filters** are based on entities and includes. Each dynamic filter uses an entity to filter on and one entity to apply the filter on. Below are examples with explanations of how filters are set up. For more information, please look at our[ Filters page](https://docs.sportmonks.com/football/api/request-options/filtering).

<table><thead><tr><th width="147">Dynamic Filters</th><th>Available on Entity</th><th width="172">Description</th><th>Examples</th></tr></thead><tbody><tr><td><code>types</code></td><td>Statistics, Events, Lineup, Transfers and way more. Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all possibilities.</td><td>Filter the Types on a selection of Transfers separated by a comma. </td><td><p>&#x26;include=<code>type</code>&#x26;filters=transferTypes:TypeIDs </p><p></p><p>&#x26;include=<code>type</code>&#x26;filters=transferTypes:219,220 </p><p></p></td></tr></tbody></table>
{% endtab %}
{% endtabs %}

### Transfer rumours

<table><thead><tr><th width="165.33333333333331">Field</th><th>Description</th><th>Type</th></tr></thead><tbody><tr><td><code>id</code></td><td>Refers to the id of the transfer</td><td>integer</td></tr><tr><td><code>sport_id</code></td><td>Refers to the sport related to the transfer</td><td>integer</td></tr><tr><td><code>player_id</code></td><td>Refers to the player related to the transfer</td><td>integer</td></tr><tr><td><code>position_id</code></td><td>Refers to the position of the player</td><td>integer</td></tr><tr><td><code>from_team_id</code></td><td>Refers to the team the player transferred from</td><td>integer</td></tr><tr><td><code>to_team_id</code></td><td>Refers to the team the player transferred to</td><td>integer</td></tr><tr><td><code>transfer_fee_id</code></td><td>Refers to the transfer free id, you can use the transferFree include for more info</td><td>integer</td></tr><tr><td><code>probability</code></td><td>Inidcates the likelyhood of the transfer</td><td>string</td></tr><tr><td><code>source_name</code></td><td>Refers to the source of the transfer rumour</td><td>string</td></tr><tr><td><code>source_url</code></td><td>Refers to the url of the transfer rumour</td><td>string</td></tr><tr><td><code>amount</code></td><td>Refers the transfer fee of the rumoured player</td><td>integer</td></tr><tr><td><code>currency</code></td><td>Refers to the currency of the transfer</td><td>string</td></tr><tr><td><code>date</code></td><td>Refers to the data of the rumoured transfer</td><td>string</td></tr><tr><td><code>type_id</code></td><td>Refers to the type of the transfer</td><td>integer</td></tr></tbody></table>

### Rival

**Related endpoints**

{% content-ref url="../endpoints/rivals" %}
[rivals](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/rivals)
{% endcontent-ref %}

**Field Description**

| Field      | Description                                 | Type    |
| ---------- | ------------------------------------------- | ------- |
| `sport_id` | Refers to the sport of the rival            | integer |
| `team_id`  | Refers to the team of the team              | integer |
| `rival_id` | Refers to the team of the rival of the team | integer |

#### Include options

[`team`](https://docs.sportmonks.com/football/endpoints-and-entities/team-player-squad-coach-and-referee#team) [`rival`](https://docs.sportmonks.com/football/endpoints-and-entities/team-player-squad-coach-and-referee#team)&#x20;

### MetaData

**Field Description**

| Field            | Description                                       | Type    |
| ---------------- | ------------------------------------------------- | ------- |
| id               | Refers to the id of the meta data object          | integer |
| metadatable_type | Displays the type of the related meta data object | string  |
| metadatable_id   | Refers to the id of the related meta data object  | integer |
| type_id          | Refers to the type of the meta data object        | integer |
| value            | Displays the values of the meta data object       | mixed   |
| value_type       | Displays the type of the value                    | string  |

#### Include options

[`type`](https://docs.sportmonks.com/football2/v/core/endpoints/types)

### State

**Related endpoints**

{% content-ref url="../endpoints/states" %}
[states](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/states)
{% endcontent-ref %}

**Field Description**

| Field          | Description                              | Type    |
| -------------- | ---------------------------------------- | ------- |
| id             | Refers to the id of the state            | integer |
| state          | Displays the state of the state          | string  |
| name           | Displays the full name of the state      | string  |
| short_name     | Displays the short name of the state     | string  |
| developer_name | Displays the developer name of the state | string  |

#### Include options

[`type`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/)

### ParticipantTrophy

**Field Description**

| Field          | Description                                             | Type    |
| -------------- | ------------------------------------------------------- | ------- |
| id             | Refers to the id of the participant trophy              | integer |
| participant_id | Refers to the id of the related participant             | integer |
| team_id        | Refers to the id of the related team of the participant | integer |
| league_id      | Refers to the id of the related league                  | integer |
| season_id      | Refers to the id of the related season                  | integer |
| trophy_id      | Refers to the id of the related trophy                  | integer |

#### Include options

[`team`](https://docs.sportmonks.com/football/endpoints-and-entities/team-player-squad-coach-and-referee#team) [`league`](https://docs.sportmonks.com/football/endpoints-and-entities/league-season-schedule-stage-and-round#league) [`season`](https://docs.sportmonks.com/football/endpoints-and-entities/league-season-schedule-stage-and-round#season) [`trophy`](#trophy)

### Trophy

**Field Description**

| Field    | Description                                  | Type    |
| -------- | -------------------------------------------- | ------- |
| id       | Refers to the id of the trophy               | integer |
| sport_id | Refers to the id of the related sport        | integer |
| position | Displays the position of the trophy          | integer |
| name     | Displays the name of the trophy (eg. Winner) | integer |

#### Include options

`none`

### Social

**Field Description**

| Field             | Description                                           | Type    |
| ----------------- | ----------------------------------------------------- | ------- |
| id                | Refers to the id of the social                        | integer |
| social_id         | Refers to the id of the related entity of the social  | integer |
| social_channel_id | Refers to the id of the related channel of the social | integer |
| value             | Displays the value of the social (eg. account name)   | string  |

#### Include options

[`channel`](#socialchannel)

### SocialChannel

**Field Description**

| Field     | Description                                   | Type    |
| --------- | --------------------------------------------- | ------- |
| id        | Refers to the id of the social channel        | integer |
| name      | Displays the name of the social channel       | string  |
| base_url  | Displays the url of the social channel        | string  |
| hex_color | Displays the main color of the social channel | string  |

#### Include options

`none`

### Ranking

**Field Description**

| Field          | Description                                         | Type    |
| -------------- | --------------------------------------------------- | ------- |
| id             | Refers to the id of the ranking.                    | integer |
| position       | Refers to the position of the team in the rankings. | integer |
| participant_id | Refers to the id of the participant.                | integer |
| points         | Refers to the number of points by the participant.  | integer |
| sport_id       | Refers to the sport of the rankings.                | integer |
| type           | Refers to the type of rankings.                     | string  |

**Include options**

`None`
