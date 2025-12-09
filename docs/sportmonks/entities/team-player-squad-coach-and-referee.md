# Team, Player, Squad, Coach and Referee

### Team

#### Related **endpoints**

{% content-ref url="../endpoints/teams" %}
[teams](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/teams)
{% endcontent-ref %}

#### **Field Description**

<table><thead><tr><th>Field</th><th width="268.3333333333333"></th><th>Type</th></tr></thead><tbody><tr><td>sport_id</td><td>Refers to the sport of the team</td><td>integer</td></tr><tr><td>country_id</td><td>Refers to the country of the team</td><td>integer</td></tr><tr><td>venue_id</td><td>Refers to the home venue of the team</td><td>integer</td></tr><tr><td>gender</td><td>Indicates the gender of the team</td><td>string</td></tr><tr><td>name</td><td>The name of the team</td><td>string</td></tr><tr><td>short_code</td><td>The short code of the team</td><td>string / null</td></tr><tr><td>image_path</td><td>Image path to the team logo</td><td>string</td></tr><tr><td>founded</td><td>The founding date of the team</td><td>integer</td></tr><tr><td>type</td><td>Indicates the type of the team</td><td>string</td></tr><tr><td>placeholder</td><td>Indicates if the team is a placeholder</td><td>boolean</td></tr><tr><td>last_played_at</td><td>Returns the date and time of the last played match of the team</td><td>integer</td></tr></tbody></table>

#### Include options

[`sport`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`country`](https://docs.sportmonks.com/football2/v/core/endpoints/countries) [`venue`](https://docs.sportmonks.com/football/endpoints-and-entities/other#venue) [`coaches`](#coach) [`rivals`](https://docs.sportmonks.com/football/endpoints-and-entities/other#rival) [`players`](#player) [`latest`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#fixture) [`upcoming`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#fixture) [`seasons`](https://docs.sportmonks.com/football/endpoints-and-entities/league-season-schedule-stage-and-round#season) [`activeSeasons`](https://docs.sportmonks.com/football/endpoints-and-entities/league-season-schedule-stage-and-round#season) [`sidelined`](#sidelined) [`sidelinedHistory`](#sidelined) [`statistics`](https://docs.sportmonks.com/football/endpoints-and-entities/statistic#teamstatistic) [`socials`](https://docs.sportmonks.com/football/endpoints-and-entities/other#social) [`trophies`](https://docs.sportmonks.com/football/endpoints-and-entities/other#participanttrophy) [`rankings`](https://docs.sportmonks.com/football/endpoints-and-entities/other#ranking)

**Sorting options**

`name`

### Player

#### Related **endpoints**

{% content-ref url="../endpoints/players" %}
[players](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/players)
{% endcontent-ref %}

#### **Field Description**

<table><thead><tr><th>Field</th><th width="268.3333333333333">Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the player</td><td>integer</td></tr><tr><td>sport_id</td><td>Refers to the sport of the player</td><td>integer</td></tr><tr><td>country_id</td><td>Refers to the country of the player</td><td>integer</td></tr><tr><td>nationality_id</td><td>Refers to the nationality of the player</td><td>integer</td></tr><tr><td>city_id</td><td>Refers to the birthcity of the player</td><td>string</td></tr><tr><td>position_id</td><td>Refers to the position of the player</td><td>integer</td></tr><tr><td>detailed_position_id</td><td>Refers to the detailed position of the player</td><td>integer</td></tr><tr><td>type_id</td><td>Refers to the type of the player</td><td>integer</td></tr><tr><td>common_name</td><td>Refers to the name the player is known for</td><td>string</td></tr><tr><td>firstname</td><td>Refers to the first name of the player</td><td>string</td></tr><tr><td>lastname</td><td>Refers to the last name of the player</td><td>string</td></tr><tr><td>name</td><td>Refers to the name of the player</td><td>string</td></tr><tr><td>display_name</td><td>Refers to the name that is often used to display in applications</td><td>string</td></tr><tr><td>image_path</td><td>Image path to player headshot</td><td>string</td></tr><tr><td>height</td><td>Refers to the height of the player</td><td>integer</td></tr><tr><td>weight</td><td>Refers to the weight of the player</td><td>integer</td></tr><tr><td>date_of_birth</td><td>Refers to the date of birth of the player</td><td>string</td></tr><tr><td>gender</td><td>Refers to the gender of the player</td><td>string</td></tr></tbody></table>

#### Include options

[`sport`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`country`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`city`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`nationality`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`transfers`](https://docs.sportmonks.com/football/endpoints-and-entities/other#transfer) [`pendingTransfers`](https://docs.sportmonks.com/football/endpoints-and-entities/other#transfer) [`teams`](#team) [`statistics`](https://docs.sportmonks.com/football/endpoints-and-entities/statistic#playerstatistic) [`latest`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#fixture) [`position`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`detailedPosition`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`lineups`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#lineup) [`metadata`](https://docs.sportmonks.com/football/endpoints-and-entities/other#metadata) [`trophies`](https://docs.sportmonks.com/football/endpoints-and-entities/other#participanttrophy)

**Sorting options**

`name`

### Coach

#### Related **endpoints**

{% content-ref url="../endpoints/coaches" %}
[coaches](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/coaches)
{% endcontent-ref %}

**Field Description**

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

#### Include options

[`country`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`teams`](#team) [`statistics`](https://docs.sportmonks.com/football/endpoints-and-entities/statistic#coachstatistic) [`nationality`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`trophies`](https://docs.sportmonks.com/football/endpoints-and-entities/other#participanttrophy) [`fixtures`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#fixture) [`player`](#player)

**Sorting options**

`name`

### Team Squad

#### Available in endpoints

{% content-ref url="../endpoints/team-squads" %}
[team-squads](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/team-squads)
{% endcontent-ref %}

#### Field Description

| Field                | Description                                                   | Type           |
| -------------------- | ------------------------------------------------------------- | -------------- |
| id                   | Refers to the unique id of the squad record                   | integer        |
| transfer_id          | Refers to the id of the transfer of the squad record          | integer / null |
| player_id            | Refers to the id of the player in the squad                   | integer        |
| team_id              | Refers to the team id of the squad                            | integer        |
| position_id          | Refers to the position id of the player in the squad          | integer        |
| detailed_position_id | Refers to the detailed position id of the player in the squad | integer        |
| jersey_number        | Returns the jersey number of the player in the squad          | integer        |
| start                | Returns the start contract date of the player                 | string         |
| end                  | Returns the end contract date of the player                   | string         |

#### Includes

[`team`](#team) [`player`](#player) [`position`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`detailedPosition`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`transfer`](https://docs.sportmonks.com/football/endpoints-and-entities/other#transfer)

### Referee

**Available in endpoints**

{% content-ref url="../endpoints/referees" %}
[referees](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/referees)
{% endcontent-ref %}

**Field Description**

| Field            | Description                                                    | Type    |
| ---------------- | -------------------------------------------------------------- | ------- |
| <p></p><p>id</p> | Refers to the unique id of the referee                         | integer |
| sport_id         | Refers to the sport related to the referee                     | integer |
| country_id       | Refers to the country of the referee                           | integer |
| nationality_id   | Refers to the nationality of the referee                       | integer |
| city_id          | Refers to the birthcity of the referee                         | string  |
| common_name      | Returns to the common name of the referee                      | string  |
| firstname        | Returns the first name of the referee                          | string  |
| lastname         | Returns the last name of the referee                           | string  |
| name             | Returns the first and last name of the referee                 | string  |
| display_name     | Returns the name that is often used to display in applications | string  |
| image_path       | Image path to the referees' headshot                           | string  |
| height           | Returns the height of the referee                              | integer |
| weight           | Returns the weight of the referee                              | integer |
| date_of_birth    | Refers to the date of birth of the referee                     | string  |
| gender           | Returns the gender of the referee                              | string  |

#### Include options

[`sport`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`country`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`statistics`](https://docs.sportmonks.com/football/endpoints-and-entities/statistic#refereestatistic) [`nationality`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`city`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/)

**Sorting options**

`name`

### Sidelined

**Field Description**

| Field            | Description                                                 | Type          |
| ---------------- | ----------------------------------------------------------- | ------------- |
| <p></p><p>id</p> | Refers to the unique id of the sidelined                    | integer       |
| player_id        | Refers to the player related to the sidelined               | integer       |
| type_id          | Refers to the type of the sidelined                         | integer       |
| category         | Category of the sidelined                                   | string        |
| team_id          | Refers to the team related to the sidelined                 | integer       |
| season_id        | Refers to the season related to the sidelined               | integer       |
| start_date       | The start date of when the sidelined started                | string        |
| end_date         | The end date of when the sidelined ended                    | string / null |
| games_missed     | The amount of games the sidelined player has missed         | integer       |
| completed        | Indicates if the sidelined player is still sidelined or not | boolean       |

#### Include options

[`player`](#player) [`team`](#team) [`season`](https://docs.sportmonks.com/football/endpoints-and-entities/league-season-schedule-stage-and-round#season) [`type`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`fixture`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#fixture) `sideline`

{% hint style="info" %}
Use the sideline (_sidelined.sideline_) include to get detailed info about the sidelined record (if available), like the start date, end date, injury category, and more.
{% endhint %}
