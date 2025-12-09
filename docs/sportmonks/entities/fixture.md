# Fixture

### Fixture

#### Related endpoints

{% content-ref url="../endpoints/livescores" %}
[livescores](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/livescores)
{% endcontent-ref %}

{% content-ref url="../endpoints/fixtures" %}
[fixtures](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/fixtures)
{% endcontent-ref %}

#### Fields description

| Field        | Description                                      | Type           |
| ------------ | ------------------------------------------------ | -------------- |
| id           | Refers the unique id of the fixture              | integer        |
| sport_id     | Refers to the sport the fixture is played at     | integer        |
| league_id    | Refers to the league the fixture is played in    | integer        |
| season_id    | Refers to the seasons the fixture is played in   | integer        |
| stage_id     | Refers to the stage the fixture is played in     | integer        |
| group_id     | Refers to the group the fixture is played in     | integer / null |
| aggregate_id | Refers to the aggregate the fixture is played at | integer / null |
| state_id     | Refers to the state the fixture is played at     | integer        |
| round_id     | Refers to the round the fixture is played at     | integer / null |
| state_id     | Refers to the state the fixture is played at     | integer        |
| venue_id     | Refers to the venue the fixture is played at     | integer / null |
| name         | Represents the name of the participants          | string / null  |
| starting_at  | Datetime object representing the start time      | date / null    |
| result_info  | Represents the final result info                 | string / null  |
| leg          | Represents the leg of the fixture                | string         |
| details      | Represents details about the fixture             | string / null  |
| length       | Length of the fixture (minutes)                  | integer / null |

#### Include options

[`sport`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`round`](https://docs.sportmonks.com/football/endpoints-and-entities/league-season-schedule-stage-and-round#rounds) [`stage`](https://docs.sportmonks.com/football/endpoints-and-entities/league-season-schedule-stage-and-round#stages) [`group`](https://docs.sportmonks.com/football/endpoints-and-entities/league-season-schedule-stage-and-round#group) [`aggregate`](#aggregate) [`league`](https://docs.sportmonks.com/football/endpoints-and-entities/entities/league-season-schedule-stage-and-round) [`season`](https://docs.sportmonks.com/football/endpoints-and-entities/league-season-schedule-stage-and-round#season) [`venue`](https://docs.sportmonks.com/football/endpoints-and-entities/other#venues) [`state`](https://docs.sportmonks.com/football/endpoints-and-entities/other#states) [`weatherReport`](https://docs.sportmonks.com/football/endpoints-and-entities/other#weatherreport) [`lineups`](#lineup) [`events`](#event) [`timeline`](#event) [`comments`](https://docs.sportmonks.com/football/endpoints-and-entities/other#commentaries) [`trends`](https://docs.sportmonks.com/football/endpoints-and-entities/statistic#trend) [`statistics`](https://docs.sportmonks.com/football/endpoints-and-entities/statistic#fixturestatistic) [`periods`](#period) [`participants`](https://docs.sportmonks.com/football/endpoints-and-entities/team-player-squad-coach-and-referee#team) [`odds`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/d833Stdf2lpP4dN5FgEm/)[`premiumOdds`](https://docs.sportmonks.com/football/endpoints-and-entities/entities/odd-and-prediction#premium-odd) [`inplayOdds`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/d833Stdf2lpP4dN5FgEm/) [`postmatchNews`](https://docs.sportmonks.com/football/endpoints-and-entities/other#news) [`prematchNews`](https://docs.sportmonks.com/football/endpoints-and-entities/other#news) [`metadata`](https://docs.sportmonks.com/football/endpoints-and-entities/other#metadata) [`tvStations`](https://docs.sportmonks.com/football/endpoints-and-entities/other#tvstation) [`predictions`](https://docs.sportmonks.com/football/endpoints-and-entities/odd-and-prediction#prediction-valuebet) [`referees`](https://docs.sportmonks.com/football/endpoints-and-entities/team-player-squad-coach-and-referee#referees) [`formations`](#formation) [`ballCoordinates`](#ballcoordinate) [`sidelined`](#sidelined) [`metadata`](https://docs.sportmonks.com/football/endpoints-and-entities/other#metadata) [`scores`](#score)

**Sorting options**

`name` `starting_at`

### Fixture entity filters

{% tabs %}
{% tab title="Query Parameters" %}

| Name         | Required?                                                               | Description                                                                                                                                                                           |
| ------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `api_token`  | <p>YES<br>Another option is to provide the API token in the header.</p> | Your unique API token. Ex. ?api_token={{YOURTOKEN}}                                                                                                                                   |
| `include`    | NO                                                                      | Enrich the API response with more data by using includes. Ex. \&include=participants;events                                                                                           |
| `select`     | NO                                                                      | Select specific fields on the[ base entity](https://docs.sportmonks.com/football2/endpoints-and-entities/entities/fixtures)                                                           |
| `filters`    | Available on Entity                                                     | <p>Filter the API response on multiple related entities. There are static filters and dynamic filters.<br><br>Please find the possibilities in the Static and Dynamic Filter tab.</p> |
| {% endtab %} |                                                                         |                                                                                                                                                                                       |

{% tab title="Static Filters" %}

<table><thead><tr><th width="226">Static Filters</th><th>Available on Entity</th><th>Description</th><th width="196">Example</th></tr></thead><tbody><tr><td><code>ParticipantSearch</code></td><td>Fixture</td><td>Filter on the matches of specific participants.</td><td>&#x26;include=<code>participants</code>&#x26;filters=participantSearch:{Celtic}</td></tr><tr><td><code>TodayDate</code></td><td>Fixture</td><td>Filter all fixtures to find only the fixtures of today.</td><td>&#x26;filters=todayDate</td></tr><tr><td><code>Venues</code></td><td>Fixture</td><td>Find all fixtures that are played in a specific venue.</td><td>&#x26;include=<code>venue</code>&#x26;filters=venues:{venueIDs}<br><br>&#x26;include=venue&#x26;filters=venues:10,12</td></tr><tr><td><code>Deleted</code></td><td>Fixture</td><td>Filter on deleted fixtures only. This filter helps to keep your database in sync.</td><td>&#x26;filters=IsDeleted</td></tr><tr><td><code>IdAfter</code></td><td>All</td><td>Filter all fixtures starting from a certain fixture ID. Handy when you are only interested in the most recent fixtures.</td><td>&#x26;filters=IdAfter:{fixtureID}<br><br>&#x26;filters=IdAfter:18535487<br></td></tr><tr><td><code>Markets</code></td><td>Odds</td><td>Filter the odds on a selection of markets separated by a comma. </td><td>&#x26;include=<code>odds</code>&#x26;filters=markets:{marketIDs}<br><br>&#x26;include=odds&#x26;filters=markets:{12,14}</td></tr><tr><td><code>Bookmakers</code></td><td>Odds</td><td>Filter the odds on a selection of bookmakers separated by a comma. (e.g: 12,24). </td><td>&#x26;include=<code>odds</code>&#x26;filters=bookmakers:{bookmakerIDs}<br><br>&#x26;include=odds&#x26;filters=bookmakers:2,14</td></tr><tr><td><code>WinningOdds</code></td><td>Odds</td><td>Filter all winning odds.</td><td>&#x26;include=odds&#x26;filters=WinningOdds</td></tr></tbody></table>
{% endtab %}

{% tab title="Dynamic Filters" %}

<table><thead><tr><th>Dynamic Filters</th><th>Available on Entity</th><th width="202">Description</th><th width="178">Examples</th></tr></thead><tbody><tr><td><code>types</code></td><td>Statistics, Events, Lineup, Metadata, Periods, Predictability, Predictions, Sidelined, States, Trends</td><td>Filter the Types on a selection of Fixture statistics separated by a comma. <br><br>Filter on the specific trends you want to show.</td><td>&#x26;include=<code>statistics</code>&#x26;filters=statisticTypes:42,49<br><br>&#x26;include=events&#x26;filters=eventTypes:14</td></tr><tr><td><code>states</code></td><td>Fixtures</td><td>Filter the states of fixtures separated by a comma.</td><td>&#x26;include=state&#x26;filters=fixtureStates:1</td></tr><tr><td><code>leagues</code></td><td>Aggregates, Fixtures, News, Predictability, Rounds, Seasons, Stages, Standings</td><td>Filter the fixtures based on leagues and their rounds.</td><td>&#x26;filters=fixtureLeagues:{leagueID}<br><br>&#x26;filters=roundLeagues:501</td></tr><tr><td><code>groups</code></td><td>Fixtures, Standing, Standing corrections</td><td>Filter the fixtures based on groups. Get their fixtures and standings.</td><td>&#x26;include=group&#x26;filters=fixtureGroups:{groupIDs}<br><br>&#x26;include=group&#x26;filters=fixtureGroups:246691</td></tr><tr><td><code>countries</code></td><td>Coaches, Leagues, Players, Referees, Standings, Teams, Venues</td><td>Filter the coaches, leagues, players and more based on countries.</td><td>&#x26;include=coaches&#x26;filterscoachCountries:1161</td></tr><tr><td><code>seasons</code></td><td>Aggregates, Statistics (players, team, coaches, referees), Rounds, Sidelined, Stages, Standings, Standing Corrections, Topscorers.</td><td>Filter statistics, standings and topscorers based on seasons.</td><td>&#x26;include=season.statistics&#x26;filters=seasonStatisticTypes:52</td></tr></tbody></table>
{% endtab %}
{% endtabs %}

**Filters**

More information on how to use filters can be found on our tutorials on how to [filter](https://docs.sportmonks.com/football2/api/request-options/filtering). If you want more information on which filters to use you can check out the following endpoint:

```
https://api.sportmonks.com/v3/my/filters/entity?api_token={{YOURTOKEN}}
```

### Period

#### Fields description

<table><thead><tr><th width="222.1596807012462">Field</th><th width="266.3333333333333">Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the period</td><td>integer</td></tr><tr><td>fixture_id</td><td>Refers to the fixture related to the period</td><td>integer</td></tr><tr><td>type_id</td><td>Refers to the type of the period</td><td>integer</td></tr><tr><td>started</td><td>UNIX timestamp of when the period started</td><td>integer</td></tr><tr><td>ended</td><td>UNIX timestamp of when the period ended</td><td>integer / null</td></tr><tr><td>counts_from</td><td>Represents the minute the period starts counting from</td><td>integer</td></tr><tr><td>ticking</td><td>Determines if the period is being played at the moment</td><td>boolean</td></tr><tr><td>sort_order</td><td>Represents the sort order of the period</td><td>integer</td></tr><tr><td>description</td><td>Represents the description of the period</td><td>string</td></tr><tr><td>time_added</td><td>Represents the time added to the period</td><td>integer / null</td></tr><tr><td>period_length</td><td>Represents the scheduled length of the period.</td><td>integer</td></tr><tr><td>minutes</td><td>Represents the current minute of the period</td><td>integer</td></tr><tr><td>seconds</td><td>Represents the amount of seconds after the current minute</td><td>integer</td></tr><tr><td>has_timer</td><td>Marks if we have detailed timer information for minutes and seconds available</td><td>boolean</td></tr></tbody></table>

#### Include options

[`fixture`](#fixture) [`type`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`events`](#event) [`timeline`](#event) [`statistics`](https://docs.sportmonks.com/football/endpoints-and-entities/statistic#fixturestatistic)&#x20;

### Aggregate

#### Fields description

<table><thead><tr><th width="225.51225612806405">Field</th><th width="266.3333333333333">Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the aggregate</td><td>integer</td></tr><tr><td>league_id</td><td>Refers to the league of the aggregate</td><td>integer</td></tr><tr><td>season_id</td><td>Refers to the season of the aggregate</td><td>integer</td></tr><tr><td>stage_id</td><td>Refers to the stage the aggregate</td><td>integer</td></tr><tr><td>name</td><td>Represents the name of the aggregate</td><td>string</td></tr><tr><td>fixture_ids</td><td>Represent the fixture id's related to the aggregate</td><td>array</td></tr><tr><td>result</td><td>Represents the final result of the aggregate</td><td>string / null</td></tr><tr><td>detail</td><td>Gives details of the result of the aggregate</td><td>string / null</td></tr><tr><td>winner_participant_id</td><td>Refers to the winner of the aggregate</td><td>integer</td></tr></tbody></table>

#### Include options

[`stage`](https://docs.sportmonks.com/football/endpoints-and-entities/league-season-schedule-stage-and-round#stage) [`league`](https://docs.sportmonks.com/football/endpoints-and-entities/league-season-schedule-stage-and-round#league) [`season`](https://docs.sportmonks.com/football/endpoints-and-entities/league-season-schedule-stage-and-round#season) [`winner`](https://docs.sportmonks.com/football/endpoints-and-entities/team-player-squad-coach-and-referee#team)

### Lineup

#### Fields description

<table><thead><tr><th>Field</th><th width="266.3333333333333">Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the lineup</td><td>integer</td></tr><tr><td>sport_id</td><td>Refers to the sport of the lineup</td><td>integer</td></tr><tr><td>fixture_id</td><td>Refers to the fixture the lineup is from</td><td>integer</td></tr><tr><td>player_id</td><td>Refers to the player linked to the lineup</td><td>integer</td></tr><tr><td>team_id</td><td>Refers to the team of the lineup</td><td>integer</td></tr><tr><td>position_id</td><td>Refers to the position of the lineup</td><td>integer</td></tr><tr><td>detailed_position_id</td><td>Refers to the detailed position of the lineup</td><td>integer / null</td></tr><tr><td>formation_field</td><td>Represents the lineup's position in the formation</td><td>string / null</td></tr><tr><td>type_id</td><td>Refers to the type of the lineup</td><td>integer</td></tr><tr><td>jersey_number</td><td>Represents the lineup's jersey number</td><td>integer</td></tr><tr><td>formation_position</td><td>Represents the numeric position of the lineup</td><td>integer</td></tr><tr><td>player_name</td><td>Represents the player name of the lineup</td><td>string</td></tr></tbody></table>

#### Include options

&#x20;[`fixture`](#fixture) [`player`](https://docs.sportmonks.com/football/endpoints-and-entities/team-player-squad-coach-and-referee#player) [`type`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`position`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`detailedPosition`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`details`](#lineupdetail)

### Sidelined

#### Fields description

| Field          | Description                                         | Type    |
| -------------- | --------------------------------------------------- | ------- |
| id             | Refers to the unique id of the lineup detail object | integer |
| fixture_id     | Refers to the fixture related to the fixture object | integer |
| sideline_id    | Refers to the sideline related to the fixture       | integer |
| participant_id | Refers to the participant related to the fixture    | integer |

#### Include options

[`fixture`](#fixture) [`sideline`](#sidelined) `participant`

### LineupDetail

#### Fields description

<table><thead><tr><th width="199.57892568998443">Field</th><th width="266.3333333333333">Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the lineup detail object</td><td>integer</td></tr><tr><td>fixture_id</td><td>Refers to the fixture related to the lineup detail object</td><td>integer</td></tr><tr><td>player_id</td><td>Refers to the player related to the lineup detail object</td><td>integer</td></tr><tr><td>team_id</td><td>Refers to the team related to the lineup detail object</td><td>integer</td></tr><tr><td>lineup_id</td><td>Refers to the lineup related to the lineup detail object</td><td>integer</td></tr><tr><td>type_id</td><td>Refers to the type of the lineup detail object</td><td>integer</td></tr><tr><td>data</td><td>Represents the value of the lineup detail object</td><td>object</td></tr></tbody></table>

#### Include options

&#x20;[`fixture`](#fixture) [`type`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/)&#x20;

### Event

#### Fields description

<table><thead><tr><th width="206.51225612806405">Field</th><th width="266.3333333333333">Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the event</td><td>integer</td></tr><tr><td>fixture_id</td><td>Refers to the fixture related to the event</td><td>integer</td></tr><tr><td>period_id</td><td>Refers to the period related to the event</td><td>integer</td></tr><tr><td>participant_id</td><td>Refers to the participant related to the event</td><td>integer</td></tr><tr><td>type_id</td><td>Refers to the type of the event</td><td>integer</td></tr><tr><td>player_id</td><td>Refers to the player related to the event</td><td>integer</td></tr><tr><td>related_player_id</td><td>Refers to the related player of the event</td><td>integer / null</td></tr><tr><td>player_name</td><td>Represents the name of the player</td><td>string</td></tr><tr><td>related_player_name</td><td>Represents the name of the related player</td><td>string / null</td></tr><tr><td>result</td><td>Represents the score after the event happened</td><td>string / null</td></tr><tr><td>info</td><td>Represents info about the event</td><td>string / null</td></tr><tr><td>addition</td><td>Represents extra info about the event</td><td>string / null</td></tr><tr><td>minute</td><td>Represents the minute the event occurred</td><td>integer</td></tr><tr><td>extra_minute</td><td>Represents the extra minutes of injury time</td><td>integer / null</td></tr><tr><td>injured</td><td>Determines if the player of substitution event is injured or not</td><td>boolean</td></tr><tr><td>rescinded</td><td>Determines if the card is rescinded by the referee (card events only)</td><td>boolean</td></tr></tbody></table>

#### Include options

&#x20;[`fixture`](#fixture) [`subType`](https://app.gitbook.com/s/z0kWjB5EvZvqGsozw8vP/) [`type`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`player`](https://docs.sportmonks.com/football/endpoints-and-entities/team-player-squad-coach-and-referee#player) [`relatedPlayer`](https://docs.sportmonks.com/football/endpoints-and-entities/team-player-squad-coach-and-referee#player) [`period`](#period) [`participant`](https://docs.sportmonks.com/football/endpoints-and-entities/team-player-squad-coach-and-referee#team)

### Formation

#### Fields description

<table><thead><tr><th width="199.57892568998443">Field</th><th width="266.3333333333333">Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the formation</td><td>integer</td></tr><tr><td>fixture_id</td><td>Refers to the fixture related to the formation</td><td>integer</td></tr><tr><td>participant_id</td><td>Refers to the participant related to the formation</td><td>integer</td></tr><tr><td>formation</td><td>Displays the formation used by the participant</td><td>string</td></tr><tr><td>location</td><td>Displays the location (home/away) of the formation</td><td>string</td></tr></tbody></table>

#### Include options

&#x20;[`fixture`](#fixture) [`participant`](https://docs.sportmonks.com/football/endpoints-and-entities/team-player-squad-coach-and-referee#team)&#x20;

### Score

#### Fields description

<table><thead><tr><th width="199.57892568998443">Field</th><th width="266.3333333333333">Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the score</td><td>integer</td></tr><tr><td>fixture_id</td><td>Refers to the fixture related to the score</td><td>integer</td></tr><tr><td>type_id</td><td>Refers to the type of the score</td><td>integer</td></tr><tr><td>participant_id</td><td>Refers to the participant related to the score</td><td>integer</td></tr><tr><td>score</td><td>The score object with the goals and the participant (home/away)</td><td>object</td></tr><tr><td>description</td><td>Displays the description of the score (eg. 1ST_HALF)</td><td>string</td></tr></tbody></table>

#### Include options

&#x20;[`fixture`](#fixture) [`participant`](https://docs.sportmonks.com/football/endpoints-and-entities/team-player-squad-coach-and-referee#team) [`type`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/)&#x20;

### BallCoordinate

#### Fields description

<table><thead><tr><th width="199.57892568998443">Field</th><th width="266.3333333333333">Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the ball coordinate</td><td>integer</td></tr><tr><td>fixture_id</td><td>Refers to the fixture related to the ball coordinate</td><td>integer</td></tr><tr><td>period_id</td><td>Refers to the period related to the ball coordinate</td><td>integer</td></tr><tr><td>timer</td><td>Displays the time of the ball coordinate</td><td>string</td></tr><tr><td>x</td><td>Displays the X-coordinate of the ball coordinate</td><td>string</td></tr><tr><td>y</td><td>Displays the Y-coordinate of the ball coordinate</td><td>string</td></tr></tbody></table>

#### Include options

&#x20;[`fixture`](#fixture) [`period`](#period)&#x20;
