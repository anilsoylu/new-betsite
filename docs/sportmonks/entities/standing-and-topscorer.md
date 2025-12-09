# Standing and Topscorer

### Standing

#### **Available in endpoints**

{% content-ref url="../endpoints/standings" %}
[standings](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/standings)
{% endcontent-ref %}

#### **Field Description**

<table><thead><tr><th width="199.19226283853723">Field</th><th width="268.3333333333333"></th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the standings</td><td>integer</td></tr><tr><td>participant_id</td><td>Refers to the participant related to the standing</td><td>integer</td></tr><tr><td>sport_id</td><td>Refers to the sport related to the standing</td><td>integer</td></tr><tr><td>league_id</td><td>Refers to the league related to the standing</td><td>integer</td></tr><tr><td>season_id</td><td>Refers to the season related to the standing</td><td>integer</td></tr><tr><td>stage_id</td><td>Refers to the stage related to the standing</td><td>integer</td></tr><tr><td>group_id</td><td>Refers to the group related to the standing</td><td>integer / null</td></tr><tr><td>round_id</td><td>Refers to the round related to the standing</td><td>integer / null</td></tr><tr><td>standing_rule_id</td><td>Refers to the standing rule related to the standing</td><td>integer</td></tr><tr><td>position</td><td>The position of the team in the standing</td><td>integer</td></tr><tr><td>result</td><td>Indication of the team in the position went up or down in the standing</td><td>string</td></tr><tr><td>points</td><td>The number of points the team has gathered in the standings</td><td>integer</td></tr></tbody></table>

#### Include options

[`participant`](https://docs.sportmonks.com/football/endpoints-and-entities/team-player-squad-coach-and-referee#team) [`season`](https://docs.sportmonks.com/football/endpoints-and-entities/league-season-schedule-stage-and-round#season) [`league`](https://docs.sportmonks.com/football/endpoints-and-entities/league-season-schedule-stage-and-round#league) [`stage`](https://docs.sportmonks.com/football/endpoints-and-entities/league-season-schedule-stage-and-round#stage) [`group`](https://docs.sportmonks.com/football/endpoints-and-entities/league-season-schedule-stage-and-round#group) [`round`](https://docs.sportmonks.com/football/endpoints-and-entities/league-season-schedule-stage-and-round#round) [`rule`](#standingrule) [`details`](#standingdetail) [`form`](#standingform) [`sport`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/)

### StandingRule

#### **Field Description**

<table><thead><tr><th width="215.51860123878407">Field</th><th width="268.3333333333333"></th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the standing rule</td><td>integer</td></tr><tr><td>model_type</td><td>Refers the entity type related to the standing rule</td><td>string</td></tr><tr><td>model_id</td><td>Refers the entity id related to the standing rule</td><td>integer</td></tr><tr><td>type_id</td><td>Refers to the type of the standing rule</td><td>integer</td></tr><tr><td>position</td><td>The position in the standings of the standing rule</td><td>integer</td></tr></tbody></table>

#### Include options

[`type`](https://docs.sportmonks.com/football2/v/core/endpoints/types)

### StandingDetail

#### **Field Description**

<table><thead><tr><th width="215.51860123878407">Field</th><th width="268.3333333333333"></th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the standing detail</td><td>integer</td></tr><tr><td>standing_type</td><td>Indicates if the standing is a live standing or a normal standing</td><td>string</td></tr><tr><td>standing_id</td><td>Refers the standing related to the standing detail</td><td>integer</td></tr><tr><td>type_id</td><td>Refers the type of the standing detail</td><td>integer</td></tr><tr><td>value</td><td>The value of the standing detail</td><td>integer</td></tr></tbody></table>

#### Include options

[type](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/)

### StandingForm

#### **Field Description**

<table><thead><tr><th width="215.51860123878407">Field</th><th width="268.3333333333333"></th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the standing form</td><td>integer</td></tr><tr><td>standing_type</td><td>Indicates if the standing is a live standing or a normal standing</td><td>string</td></tr><tr><td>standing_id</td><td>Refers the standing related to the standing form</td><td>integer</td></tr><tr><td>fixture_id</td><td>Refers to the fixture the form relates to</td><td>integer</td></tr><tr><td>form</td><td>The value of the standingform: W(win), D(draw) or L (los)</td><td>string</td></tr><tr><td>sort_order</td><td>Refers to the fixtures from old to newest </td><td>integer</td></tr></tbody></table>

#### Include options

[`fixture`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#fixture)

### StandingCorrection

| Field            | Description                                        | Type          |
| ---------------- | -------------------------------------------------- | ------------- |
| id               | Refers to the unique id                            | integer       |
| season_id        | Refers to the season of the correction             | integer       |
| stage_id         | Refers to the stage the correction applies on      | integer       |
| group_id         | Refers to the group of the correction              | integer\|null |
| type_id          | Refers to the type of the correction               | integer       |
| value            | Amount of points that apply to the correction      | integer       |
| calc_type        | Calculation method for the correction (e.g + or -) | string\|null  |
| participant_type | Participant type of the correction                 | string        |
| participant_id   | Participant id of the correction                   | integer       |
| active           | Indicates whether the correction is active         | boolean       |

### Topscorers

#### Related endpoints

{% content-ref url="../endpoints/topscorers" %}
[topscorers](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/topscorers)
{% endcontent-ref %}

#### Field Description

| Field          | Description                                             | Type    |
| -------------- | ------------------------------------------------------- | ------- |
| league_id      | Refers to the league related to the topscorer           | integer |
| season_id      | Refers to the season related to the topscorer           | integer |
| stage_id       | Refers to the stage related to the topscorer            | integer |
| player_id      | Refers to the player related to the topscorer           | integer |
| participant_id | Refers to the team related to the topscorer             | integer |
| type_id        | Refers to the type related to the topscorer             | integer |
| position       | Displays the position of the topscorer                  | integer |
| total          | The number of goals, assists or cards off the topscorer | integer |

#### Include options

[`season`](https://docs.sportmonks.com/football/endpoints-and-entities/league-season-schedule-stage-and-round#season) [`stage`](https://docs.sportmonks.com/football/endpoints-and-entities/league-season-schedule-stage-and-round#stage) [`player`](https://docs.sportmonks.com/football/endpoints-and-entities/team-player-squad-coach-and-referee#player) `participant` [`type`](https://docs.sportmonks.com/football2/v/core/endpoints/types)
