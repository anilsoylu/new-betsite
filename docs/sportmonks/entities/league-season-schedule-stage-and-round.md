# League, Season, Schedule, Stage and Round

### League

#### **Available in endpoints**

{% content-ref url="../endpoints/leagues" %}
[leagues](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/leagues)
{% endcontent-ref %}

#### **Field Description**

<table><thead><tr><th width="235.8403990024938">Field</th><th width="268.3333333333333"></th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of th league</td><td>integer</td></tr><tr><td>sport_id</td><td>Refers to the sport of the league</td><td>integer</td></tr><tr><td>country_id</td><td>Refers to the country of the league</td><td>integer</td></tr><tr><td>name</td><td>The name of the league</td><td>string</td></tr><tr><td>active</td><td>Indicates if the league is active or inactive</td><td>integer</td></tr><tr><td>short_code</td><td>The short code of the league</td><td>string / null</td></tr><tr><td>image_path</td><td>Image path to the league logo</td><td>string</td></tr><tr><td>type</td><td>Indicates the type of the league</td><td>string</td></tr><tr><td>sub_type</td><td>Indicates the subtype of the league</td><td>string</td></tr><tr><td>last_played_at</td><td>The date of when the last fixture was played in the league</td><td>string</td></tr></tbody></table>

#### Include options

[`sport`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`country`](https://docs.sportmonks.com/football2/v/core/endpoints/countries) [`stages`](#stage) [`latest`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#fixture) [`upcoming`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#fixture) [`inplay`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#fixture) [`today`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#fixture) [`currentSeason`](#season) [`seasons`](#season)

**Sorting options**

`name`

### Season

#### **Available in endpoints**

{% content-ref url="../endpoints/seasons" %}
[seasons](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/seasons)
{% endcontent-ref %}

#### **Field Description**

<table><thead><tr><th>Field</th><th width="268.3333333333333"></th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the id of the season</td><td>integer</td></tr><tr><td>sport_id</td><td>Refers to the sport of the season</td><td>integer</td></tr><tr><td>league_id</td><td>Refers to the league of the season</td><td>integer</td></tr><tr><td>tie_breaker_rule_id</td><td>Refers to the type of tie-breaker rule used to determine the season winner</td><td>integer</td></tr><tr><td>name</td><td>The name of the season</td><td>string</td></tr><tr><td>finished</td><td>Indicates if the season finished or not</td><td>integer</td></tr><tr><td>pending</td><td>Indicates if the season is pending or not</td><td>integer</td></tr><tr><td>is_current</td><td>Indicates if the season is the current season or not</td><td>integer</td></tr><tr><td>standing_method</td><td>Returns the standing calculation used in the season</td><td>string</td></tr><tr><td>starting_at</td><td>The starting date of the season</td><td>string</td></tr><tr><td>ending_at</td><td>The end date of the season</td><td>string</td></tr></tbody></table>

#### Include options

[`sport`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`league`](https://docs.sportmonks.com/football/endpoints-and-entities/entities/league-season-schedule-stage-and-round) [`teams`](https://docs.sportmonks.com/football/endpoints-and-entities/team-player-squad-coach-and-referee#team) [`stages`](#stage) [`currentStage`](#stage) [`fixtures`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#fixture) [`groups`](#group) [`statistics`](https://docs.sportmonks.com/football/endpoints-and-entities/statistic#seasonstatistic) [`topscorers`](https://docs.sportmonks.com/football/endpoints-and-entities/standing-and-topscorer#topscorers)

**Sorting options**

`name`

### **Stage**

#### **Available in endpoints**

{% content-ref url="../endpoints/stages" %}
[stages](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/stages)
{% endcontent-ref %}

#### **Field Description**

| Field       | Description                                        | Type    |
| ----------- | -------------------------------------------------- | ------- |
| id          | Refers to the unique id of the stage               | integer |
| sport_id    | Refers to the sport of the stage                   | integer |
| league_id   | Refers to the league related to the stage          | integer |
| season_id   | Refers to the season related to the stage          | integer |
| type_id     | Indicates what the stage type is                   | integer |
| name        | Returns the name of the stage                      | string  |
| sort_order  | Returns the order of the stage                     | integer |
| finished    | Indicates if the stage is finished or not          | boolean |
| pending     | Indicates if the stage is pending or not           | boolean |
| is_current  | Indicates if the stage is the current stage or not | boolean |
| starting_at | The starting date of the stage                     | string  |
| ending_at   | The end date of the stage                          | string  |

#### Include options

[`league`](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/leagues) [`season`](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/seasons) [`type`](https://docs.sportmonks.com/football2/v/core/endpoints/types) [`sport`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`rounds`](#round) [`currentRound`](#round) [`groups`](#group) [`fixtures`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#fixture) [`aggregates`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#aggregate) [`topscorers`](https://docs.sportmonks.com/football/endpoints-and-entities/standing-and-topscorer#topscorers) [`statistics`](https://docs.sportmonks.com/football/endpoints-and-entities/statistic#fixturestatistic)&#x20;

**Sorting options**

`name`

### Round

#### Available in endpoints

{% content-ref url="../endpoints/rounds" %}
[rounds](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/rounds)
{% endcontent-ref %}

#### Field Description

| Field       | Description                                                | Type    |
| ----------- | ---------------------------------------------------------- | ------- |
| id          | Refers to the unique id of the requested round             | integer |
| sport_id    | Refers to the sport id of the requested round              | integer |
| league_id   | Refers to the league id of the requested round             | integer |
| season_id   | Refers to the season id of the requested round             | integer |
| group_id    | Refers to the group id of the requested round              | integer |
| name        | Returns the name of the requested round                    | string  |
| finished    | Indicates if the requested round is finished or not        | boolean |
| pending     | Indicates if the requested round is finished or not        | boolean |
| is_current  | Indicates if the requested round is the current one or not | boolean |
| starting_at | Returns the starting date of the round                     | string  |
| ending_at   | Returns the ending date of the round                       | string  |

#### Include options

[`sport`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`league`](#league) [`season`](#season) [`stage`](#stage) [`fixtures`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#fixture) [`statistics`](https://docs.sportmonks.com/football/endpoints-and-entities/statistic#fixturestatistic)&#x20;

**Sorting options**

`name`

### Group

#### Field Description

| Field       | Description                                    | Type    |
| ----------- | ---------------------------------------------- | ------- |
| id          | Refers to the unique id of the requested group | integer |
| sport_id    | Refers to the sport id of the requested group  | integer |
| league_id   | Refers to the league id of the requested group | integer |
| season_id   | Refers to the season id of the requested group | integer |
| stage_id    | Refers to the stage id of the requested group  | integer |
| name        | Returns the name of the requested round        | string  |
| starting_at | Returns the starting date of the group         | string  |
| ending_at   | Returns the ending date of the group           | string  |

#### Include options

`none`
