# Statistic

### SeasonStatistic

#### Fields description

<table><thead><tr><th width="208.22322953981222">Field</th><th width="266.3333333333333">Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the season statistic</td><td>integer</td></tr><tr><td>model_id</td><td>Refers to the season related to the season statistic</td><td>integer</td></tr><tr><td>type_id</td><td>Refers to the type of the season statistic</td><td>integer</td></tr><tr><td>relation_type</td><td>Refers to the relation of the season statistic</td><td>integer / null</td></tr><tr><td>relation_id</td><td>Refers to the team or player related to the season statistic</td><td>integer / null</td></tr><tr><td>value</td><td>Opens an array with the values of the season statistic</td><td>object</td></tr></tbody></table>

#### Include options

[`type`](https://docs.sportmonks.com/football2/v/core/endpoints/types)[`season`](https://docs.sportmonks.com/football/endpoints-and-entities/league-season-schedule-stage-and-round#season)

{% hint style="danger" %}
Including `.type` is not recommended as an include on any endpoint. Types are used throughout the entire API. We recommend retrieving all types from the types endpoint and storing them in your database or other data structure. Only include the type if no other option is available or when testing the API.
{% endhint %}

### SeasonStatistic entity filters

You can use the `include=statistics` on our [season endpoint](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/seasons) to retrieve the season statistics.

{% tabs %}
{% tab title="Dynamic Filters" %}

<table><thead><tr><th>Dynamic Filters</th><th>Available on Entity</th><th width="202">Description</th><th width="178">Examples</th></tr></thead><tbody><tr><td><code>types</code></td><td>Statistics</td><td>Filter the statistics on a selection of type ids separated by a comma. </td><td><p><code>&#x26;include=statistics&#x26;filters=seasonStatisticTypes:TYPEIDS</code></p><p></p><p><code>&#x26;include=statistics&#x26;filters=seasonStatisticTypes:191,193,194</code></p></td></tr></tbody></table>
{% endtab %}
{% endtabs %}

**Filters**

More information on how to use filters can be found on our tutorials on how to [filter](https://docs.sportmonks.com/football2/api/request-options/filtering). If you want more information on which filters to use you can check out the following endpoint:

```
https://api.sportmonks.com/v3/my/filters/entity?api_token={{YOURTOKEN}}
```

### FixtureStatistic

#### Fields description

<table><thead><tr><th width="208.22322953981222">Field</th><th width="266.3333333333333">Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the fixture statistic</td><td>integer</td></tr><tr><td>fixture_id</td><td>Refers to the fixture related to the fixture statistic</td><td>integer</td></tr><tr><td>type_id</td><td>Refers to the type of the fixture statistic</td><td>integer</td></tr><tr><td>participant_id</td><td>Refers to the team related to the fixture statistic</td><td>integer</td></tr><tr><td>data</td><td>Represents the values of the fixture statistic</td><td>object</td></tr><tr><td>location</td><td>Represents the location of the team related to the fixture statistic</td><td>string</td></tr></tbody></table>

#### Include options

[`fixture`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#fixture) [`type`](https://docs.sportmonks.com/football2/v/core/endpoints/types)

{% hint style="danger" %}
Including `.type` is not recommended as an include on any endpoint. Types are used throughout the entire API. We recommend retrieving all types from the types endpoint and storing them in your database or other data structure. Only include the type if no other option is available or when testing the API.
{% endhint %}

### FixtureStatistic entity filters

You can use the `include=statistics` on our [livescores](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/livescores) and [fixtures](https://docs.sportmonks.com/football/tutorials-and-guides/tutorials/livescores-and-fixtures/fixtures) endpoint to retrieve the fixture statistics.

{% tabs %}
{% tab title="Dynamic Filters" %}

<table><thead><tr><th>Dynamic Filters</th><th>Available on Entity</th><th width="202">Description</th><th width="178">Examples</th></tr></thead><tbody><tr><td><code>types</code></td><td>Statistics</td><td>Filter the statistics on a selection of type ids separated by a comma. </td><td><p><code>&#x26;include=statistics&#x26;filters=fixtureStatisticTypes:TYPEIDS</code></p><p></p><p><code>&#x26;include=statistics&#x26;filters=fixtureStatisticTypes:42,49</code></p></td></tr></tbody></table>
{% endtab %}
{% endtabs %}

**Filters**

More information on how to use filters can be found on our tutorials on how to [filter](https://docs.sportmonks.com/football2/api/request-options/filtering). If you want more information on which filters to use you can check out the following endpoint:

```
https://api.sportmonks.com/v3/my/filters/entity?api_token={{YOURTOKEN}}
```

### TeamStatistic

#### Fields description

<table><thead><tr><th width="207.24813088491487">Field</th><th width="266.3333333333333">Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the team statistic</td><td>integer</td></tr><tr><td>team_id</td><td>Refers to the team related to the team statistic</td><td>integer</td></tr><tr><td>season_id</td><td>Refers to the season related to the team statistic</td><td>integer</td></tr><tr><td>has_values</td><td>Indicates if the team statistic has values</td><td>boolean</td></tr></tbody></table>

#### Include options

[`team`](https://docs.sportmonks.com/football/endpoints-and-entities/team-player-squad-coach-and-referee#team) [`season`](https://docs.sportmonks.com/football/endpoints-and-entities/league-season-schedule-stage-and-round#season) [`details`](#teamstatisticdetail)

### TeamStatistic entity filters

You can use the `include=statistics` on our [team endpoints](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/teams) to retrieve the team statistics.

{% tabs %}
{% tab title="Dynamic Filters" %}

<table><thead><tr><th>Dynamic Filters</th><th>Available on Entity</th><th width="215">Description</th><th width="178">Examples</th></tr></thead><tbody><tr><td><code>season</code></td><td>Statistics</td><td>Filter the statistics on a selection of season ids separated by a comma. </td><td><p><code>&#x26;include=statistics&#x26;filters=teamStatisticSeasons:SEASONIDS</code></p><p></p><p><code>&#x26;include=statistics&#x26;filters=teamStatisticSeasons:19189</code></p></td></tr></tbody></table>
{% endtab %}
{% endtabs %}

**Filters**

More information on how to use filters can be found on our tutorials on how to [filter](https://docs.sportmonks.com/football2/api/request-options/filtering). If you want more information on which filters to use you can check out the following endpoint:

```
https://api.sportmonks.com/v3/my/filters/entity?api_token={{YOURTOKEN}}
```

### TeamStatisticDetail

#### Fields description

<table><thead><tr><th width="276.2232295398122">Field</th><th width="266.3333333333333">Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the team statistic detail</td><td>integer</td></tr><tr><td>team_statistic_id</td><td>Refers to the team statistic related to the team statistic detail</td><td>integer</td></tr><tr><td>type_id</td><td>Refers to the type of the team statistic detail</td><td>integer</td></tr><tr><td>value</td><td>The value(s) off the team statistic detail</td><td>object</td></tr></tbody></table>

#### Include options

[`statistic`](#teamstatistic) [`type`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/)&#x20;

{% hint style="danger" %}
Including `.type` is not recommended as an include on any endpoint. Types are used throughout the entire API. We recommend retrieving all types from the types endpoint and storing them in your database or other data structure. Only include the type if no other option is available or when testing the API.
{% endhint %}

### TeamStatisticDetail entity filters

You can use the `include=statistics` on our [team endpoints](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/teams) to retrieve the team statistics.

{% tabs %}
{% tab title="Dynamic Filters" %}

<table><thead><tr><th>Dynamic Filters</th><th>Available on Entity</th><th width="215">Description</th><th width="178">Examples</th></tr></thead><tbody><tr><td><code>types</code></td><td>Statistics</td><td>Filter the statistics on a selection of type ids separated by a comma. </td><td><p><code>&#x26;include=statistics.details&#x26;filters=teamStatisticDetailTypes:TYPEIDS</code></p><p></p><p><code>&#x26;include=statistics.details&#x26;filters=teamStatisticDetailTypes:216</code></p></td></tr><tr><td><code>season</code></td><td>Statistics</td><td>Filter the statistics on a selection of seasons ids separated by a comma. </td><td><p><code>&#x26;include=statistics&#x26;filters=teamStatisticSeasons:SEASONIDS</code></p><p></p><p><code>&#x26;include=statistics&#x26;filters=teamStatisticSeasons:19189</code></p></td></tr></tbody></table>
{% endtab %}
{% endtabs %}

**Filters**

More information on how to use filters can be found on our tutorials on how to [filter](https://docs.sportmonks.com/football2/api/request-options/filtering). If you want more information on which filters to use you can check out the following endpoint:

```
https://api.sportmonks.com/v3/my/filters/entity?api_token={{YOURTOKEN}}
```

### PlayerStatistic

#### Fields description

<table><thead><tr><th width="255.72762500127465">Field</th><th width="266.3333333333333">Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the player statistic</td><td>integer</td></tr><tr><td>player_id</td><td>Refers to the player related to the player statistic</td><td>integer</td></tr><tr><td>team_id</td><td>Refers to the team related to the player statistic</td><td>integer</td></tr><tr><td>jersey_number</td><td>The jersey number of the player related to the player statistic</td><td>integer</td></tr><tr><td>position_id</td><td>Refers to the position of the player related to the player statistic</td><td>integer</td></tr><tr><td>season_id</td><td>Refers to the season related to the player statistic</td><td>integer</td></tr></tbody></table>

#### Include options

[`player`](https://docs.sportmonks.com/football/endpoints-and-entities/team-player-squad-coach-and-referee#player) [`team`](https://docs.sportmonks.com/football/endpoints-and-entities/team-player-squad-coach-and-referee#team) [`season`](https://docs.sportmonks.com/football/endpoints-and-entities/league-season-schedule-stage-and-round#season) [`position`](https://app.gitbook.com/s/z0kWjB5EvZvqGsozw8vP/) [`details`](#playerstatisticdetail)

### PlayerStatistic entity filters

You can use the `include=statistics` on our [player endpoints](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/players) to retrieve the player statistics.

{% tabs %}
{% tab title="Dynamic Filters" %}

<table><thead><tr><th>Dynamic Filters</th><th>Available on Entity</th><th width="133">Description</th><th width="178">Examples</th></tr></thead><tbody><tr><td><code>season</code></td><td>Statistics</td><td>Filter the statistics on a selection of seasons ids separated by a comma. </td><td><p><code>&#x26;include=statistics&#x26;filters=playerStatisticSeasons:SEASONIDS</code></p><p></p><p><code>&#x26;include=statistics&#x26;filters=playerStatisticSeasons:19735</code></p></td></tr></tbody></table>
{% endtab %}
{% endtabs %}

**Filters**

More information on how to use filters can be found on our tutorials on how to [filter](https://docs.sportmonks.com/football2/api/request-options/filtering). If you want more information on which filters to use you can check out the following endpoint:

```
https://api.sportmonks.com/v3/my/filters/entity?api_token={{YOURTOKEN}}
```

### PlayerStatisticDetail

#### Fields description

<table><thead><tr><th width="240.81620719026623">Field</th><th width="266.3333333333333">Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the player statistic detail</td><td>integer</td></tr><tr><td>player_statistic_id</td><td>Refers to the player statistic related to the player statistic detail</td><td>integer</td></tr><tr><td>type_id</td><td>Refers to the type of the player statistic detail</td><td>integer</td></tr><tr><td>value</td><td>The value(s) of the player statistic detail</td><td>object</td></tr></tbody></table>

#### Include options

[`statistic`](#playerstatistic) [`type`](https://docs.sportmonks.com/football2/v/core/endpoints/types)

{% hint style="danger" %}
Including `.type` is not recommended as an include on any endpoint. Types are used throughout the entire API. We recommend retrieving all types from the types endpoint and storing them in your database or other data structure. Only include the type if no other option is available or when testing the API.
{% endhint %}

### PlayerStatisticDetail entity filters

You can use the `include=statistics` on our [player endpoints](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/players) to retrieve the player statistics.

{% tabs %}
{% tab title="Dynamic Filters" %}

<table><thead><tr><th>Dynamic Filters</th><th>Available on Entity</th><th width="133">Description</th><th width="178">Examples</th></tr></thead><tbody><tr><td><code>types</code></td><td>Statistics</td><td>Filter the statistics on a selection of type ids separated by a comma.</td><td><p><code>&#x26;include=statistics.details&#x26;filters=playerStatisticDetailTypes:TYPEIDS</code></p><p></p><p><code>&#x26;include=statistics.details&#x26;filters=playerStatisticDetailTypes:79</code></p></td></tr><tr><td><code>season</code></td><td>Statistics</td><td>Filter the statistics on a selection of season ids  separated by a comma. </td><td><p><code>&#x26;include=statistics&#x26;filters=playerStatisticSeasons:SEASONIDS</code></p><p></p><p><code>&#x26;include=statistics&#x26;filters=playerStatisticSeasons:19735</code></p></td></tr></tbody></table>
{% endtab %}
{% endtabs %}

**Filters**

More information on how to use filters can be found on our tutorials on how to [filter](https://docs.sportmonks.com/football2/api/request-options/filtering). If you want more information on which filters to use you can check out the following endpoint:

```
https://api.sportmonks.com/v3/my/filters/entity?api_token={{YOURTOKEN}}
```

### CoachStatistic

#### Fields description

<table><thead><tr><th width="255.72762500127465">Field</th><th width="266.3333333333333">Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the player statistic</td><td>integer</td></tr><tr><td>coach_id</td><td>Refers to the coach related to the coach statistic</td><td>integer</td></tr><tr><td>team_id</td><td>Refers to the team related to the coach statistic</td><td>integer</td></tr><tr><td>season_id</td><td>Refers to the season related to the coach statistic</td><td>integer</td></tr></tbody></table>

#### Include options

[`coach`](https://docs.sportmonks.com/football/endpoints-and-entities/team-player-squad-coach-and-referee#coach) [`team`](https://docs.sportmonks.com/football/endpoints-and-entities/team-player-squad-coach-and-referee#team) [`season`](https://docs.sportmonks.com/football/endpoints-and-entities/league-season-schedule-stage-and-round#season) [`details`](#coachstatistic)

### CoachStatistic entity filters

You can use the `include=statistics` on our [coach endpoint](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/coaches) to retrieve the coach statistics.

{% tabs %}
{% tab title="Dynamic Filters" %}

<table><thead><tr><th>Dynamic Filters</th><th>Available on Entity</th><th width="214">Description</th><th width="178">Examples</th></tr></thead><tbody><tr><td><code>season</code></td><td>Statistics</td><td>Filter the statistics on a selection of season ids separated by a comma. </td><td><p><code>&#x26;include=statistics&#x26;filters=coachStatisticSeasons:SEASONIDS</code></p><p></p><p><code>&#x26;include=statistics&#x26;filters=coachStatisticSeasons:19735</code></p></td></tr></tbody></table>
{% endtab %}
{% endtabs %}

**Filters**

More information on how to use filters can be found on our tutorials on how to [filter](https://docs.sportmonks.com/football2/api/request-options/filtering). If you want more information on which filters to use you can check out the following endpoint:

```
https://api.sportmonks.com/v3/my/filters/entity?api_token={{YOURTOKEN}}
```

### CoachStatisticDetail

#### Fields description

<table><thead><tr><th width="255.72762500127465">Field</th><th width="266.3333333333333">Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the player statistic</td><td>integer</td></tr><tr><td>coach_statistic_id</td><td>Refers to the coach statistic related to the coach statistic detail</td><td>integer</td></tr><tr><td>type_id</td><td>Refers to the type of the coach statistic detail</td><td>integer</td></tr><tr><td>value</td><td>The value(s) of the coach statistic detail</td><td>object</td></tr></tbody></table>

#### Include options

[`statistic`](#coachstatistic) [`type`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/)

{% hint style="danger" %}
Including `.type` is not recommended as an include on any endpoint. Types are used throughout the entire API. We recommend retrieving all types from the types endpoint and storing them in your database or other data structure. Only include the type if no other option is available or when testing the API.
{% endhint %}

### CoachStatisticDetail entity filters

You can use the `include=statistics` on our [coach endpoint](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/coaches) to retrieve the coach statistics.

{% tabs %}
{% tab title="Dynamic Filters" %}

<table><thead><tr><th>Dynamic Filters</th><th>Available on Entity</th><th width="214">Description</th><th width="178">Examples</th></tr></thead><tbody><tr><td><code>types</code></td><td>Statistics</td><td>Filter the statistics on a selection of type ids separated by a comma.</td><td><p><code>&#x26;include=statistics.details&#x26;filters=coachStatisticDetailTypes:TYPEIDS</code></p><p></p><p><code>&#x26;include=statistics.details&#x26;filters=coachStatisticDetailTypes:216</code></p></td></tr><tr><td><code>season</code></td><td>Statistics</td><td>Filter the statistics on a selection of season ids separated by a comma. </td><td><p><code>&#x26;include=statistics&#x26;filters=coachStatisticSeasons:SEASONIDS</code></p><p></p><p><code>&#x26;include=statistics&#x26;filters=coachStatisticSeasons:19735</code></p></td></tr></tbody></table>
{% endtab %}
{% endtabs %}

**Filters**

More information on how to use filters can be found on our tutorials on how to [filter](https://docs.sportmonks.com/football2/api/request-options/filtering). If you want more information on which filters to use you can check out the following endpoint:

```
https://api.sportmonks.com/v3/my/filters/entity?api_token={{YOURTOKEN}}
```

### RefereeStatistic

#### Fields description

<table><thead><tr><th width="255.72762500127465">Field</th><th width="266.3333333333333">Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the player statistic</td><td>integer</td></tr><tr><td>referee_id</td><td>Refers to the referee related to the referee statistic</td><td>integer</td></tr><tr><td>season_id</td><td>Refers to the season related to the referee statistic</td><td>integer</td></tr></tbody></table>

#### Include options

[`referee`](https://docs.sportmonks.com/football/endpoints-and-entities/team-player-squad-coach-and-referee#referees) [`season`](https://docs.sportmonks.com/football/endpoints-and-entities/league-season-schedule-stage-and-round#season) [`details`](#refereestatisticdetail)

### RefereeStatistic entity filters

You can use the `include=statistics` on our [referee endpoint](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/referees) to retrieve the referee statistics.

{% tabs %}
{% tab title="Dynamic Filters" %}

<table><thead><tr><th>Dynamic Filters</th><th>Available on Entity</th><th width="214">Description</th><th width="178">Examples</th></tr></thead><tbody><tr><td><code>season</code></td><td>Statistics</td><td>Filter the statistics on a selection of seasons ids separated by a comma. </td><td><p><code>&#x26;include=statistics&#x26;filters=refereeStatisticSeasons:SEASONIDS</code></p><p></p><p><code>&#x26;include=statistics&#x26;filters=refereeStatisticSeasons:19735</code></p></td></tr></tbody></table>
{% endtab %}
{% endtabs %}

**Filters**

More information on how to use filters can be found on our tutorials on how to [filter](https://docs.sportmonks.com/football2/api/request-options/filtering). If you want more information on which filters to use you can check out the following endpoint:

```
https://api.sportmonks.com/v3/my/filters/entity?api_token={{YOURTOKEN}}
```

### RefereeStatisticDetail

#### Fields description

<table><thead><tr><th width="240.81620719026623">Field</th><th width="266.3333333333333">Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the player statistic detail</td><td>integer</td></tr><tr><td>referee_statistic_id</td><td>Refers to the referee statistic related to the referee statistic detail</td><td>integer</td></tr><tr><td>type_id</td><td>Refers to the type of the referee statistic detail</td><td>integer</td></tr><tr><td>value</td><td>The value(s) of the referee statistic detail</td><td>object</td></tr></tbody></table>

#### Include options

[`statistic`](#refereestatistic) [`type`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/)

{% hint style="danger" %}
Including `.type` is not recommended as an include on any endpoint. Types are used throughout the entire API. We recommend retrieving all types from the types endpoint and storing them in your database or other data structure. Only include the type if no other option is available or when testing the API.
{% endhint %}

### RefereeStatisticDetail entity filters

You can use the `include=statistics` on our [referee endpoint](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/referees) to retrieve the referee statistics.

{% tabs %}
{% tab title="Dynamic Filters" %}

<table><thead><tr><th>Dynamic Filters</th><th>Available on Entity</th><th width="214">Description</th><th width="178">Examples</th></tr></thead><tbody><tr><td><code>types</code></td><td>Statistics</td><td>Filter the statistics on a selection of type ids separated by a comma.</td><td><p><code>&#x26;include=statistics.details&#x26;filters=refereeStatisticDetailTypes:TYPEIDS</code></p><p></p><p><code>&#x26;include=statistics.details&#x26;filters=refereeStatisticDetailTypes:83</code></p></td></tr><tr><td><code>season</code></td><td>Statistics</td><td>Filter the statistics on a selection of seasons ids separated by a comma. </td><td><p><code>&#x26;include=statistics&#x26;filters=refereeStatisticSeasons:SEASONIDS</code></p><p></p><p><code>&#x26;include=statistics&#x26;filters=refereeStatisticSeasons:19735</code></p></td></tr></tbody></table>
{% endtab %}
{% endtabs %}

**Filters**

More information on how to use filters can be found on our tutorials on how to [filter](https://docs.sportmonks.com/football2/api/request-options/filtering). If you want more information on which filters to use you can check out the following endpoint:

```
https://api.sportmonks.com/v3/my/filters/entity?api_token={{YOURTOKEN}}
```

### Trend

#### Fields description

<table><thead><tr><th width="240.81620719026623">Field</th><th width="266.3333333333333">Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the trend</td><td>integer</td></tr><tr><td>fixture_id</td><td>Refers to the fixture related to the trend</td><td>integer</td></tr><tr><td>participant_id</td><td>Refers to the team related to the fixture statistic</td><td>integer</td></tr><tr><td>type_id</td><td>Refers to the type of the trend</td><td>integer</td></tr><tr><td>period_id</td><td>Refers to the period of the trend</td><td>integer</td></tr><tr><td>value</td><td>Represents the value of the trend</td><td>integer</td></tr><tr><td>minute</td><td>Represents the minute of the trend</td><td>integer</td></tr></tbody></table>

#### Include options

[`fixture`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#fixture) [`type`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`participant`](https://docs.sportmonks.com/football/endpoints-and-entities/team-player-squad-coach-and-referee#team) [`period`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#period)

{% hint style="danger" %}
Including `.type` is not recommended as an include on any endpoint. Types are used throughout the entire API. We recommend retrieving all types from the types endpoint and storing them in your database or other data structure. Only include the type if no other option is available or when testing the API.
{% endhint %}

### Trend entity filters

You can use the `include=trends` on our on our [livescores](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/livescores) and [fixtures](https://docs.sportmonks.com/football/tutorials-and-guides/tutorials/livescores-and-fixtures/fixtures) endpoint to retrieve the trends.

{% tabs %}
{% tab title="Dynamic Filters" %}

<table><thead><tr><th>Dynamic Filters</th><th>Available on Entity</th><th width="214">Description</th><th width="178">Examples</th></tr></thead><tbody><tr><td><code>types</code></td><td>Statistics</td><td>Filter the trends on a selection of type ids separated by a comma..</td><td><p><code>&#x26;include=trends&#x26;filters=trendTypes:TYPEIDS</code></p><p></p><p></p><p><code>&#x26;include=trends&#x26;filters=trendTypes:52</code></p></td></tr></tbody></table>
{% endtab %}
{% endtabs %}

**Filters**

More information on how to use filters can be found on our tutorials on how to [filter](https://docs.sportmonks.com/football2/api/request-options/filtering). If you want more information on which filters to use you can check out the following endpoint:

```
https://api.sportmonks.com/v3/my/filters/entity?api_token={{YOURTOKEN}}
```
