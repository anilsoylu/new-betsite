# Odd and Prediction

### Odd

#### Related endpoints

{% content-ref url="../endpoints/standard-odds-feed/pre-match-odds" %}
[pre-match-odds](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/standard-odds-feed/pre-match-odds)
{% endcontent-ref %}

#### Field description

<table><thead><tr><th width="272.5089974293059">Field</th><th>Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the odd</td><td>integer</td></tr><tr><td>fixture_id</td><td>Refers to the fixture related to the odd</td><td>integer</td></tr><tr><td>market_id</td><td>Refers to the market related to the odd</td><td>integer</td></tr><tr><td>bookmaker_id</td><td>Refers to the bookmaker related to the odd</td><td>integer</td></tr><tr><td>label</td><td>Displays the label of the odd</td><td>string</td></tr><tr><td>value</td><td>Displays the value of the odd</td><td>string</td></tr><tr><td>name</td><td>Displays the name of the odd</td><td>string</td></tr><tr><td>market_description</td><td>Displays the description of the market</td><td>string</td></tr><tr><td>probability</td><td>Displays the probability odd</td><td>string</td></tr><tr><td>dp3</td><td>Displays the dp3 odd</td><td>string</td></tr><tr><td>fractional</td><td>Displays the fractional odd</td><td>string</td></tr><tr><td>american</td><td>Displays the american odd</td><td>string</td></tr><tr><td>winning</td><td>Determines if the odd is winning or not</td><td>boolean</td></tr><tr><td>stopped</td><td>Determines if the odd is stopped or not</td><td>boolean</td></tr><tr><td>total</td><td>Displays the total of the odd</td><td>string / null</td></tr><tr><td>handicap</td><td>Displays the handicap of the odd</td><td>string / null</td></tr><tr><td>participants</td><td>Displays the participants of the odd</td><td>string / null</td></tr></tbody></table>

#### Include options

[`market`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`bookmaker`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`fixture`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#fixture)

### InplayOdd

#### Related endpoints

{% content-ref url="../endpoints/standard-odds-feed/inplay-odds" %}
[inplay-odds](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/standard-odds-feed/inplay-odds)
{% endcontent-ref %}

#### Field description

<table><thead><tr><th width="248.33333333333331">Field</th><th>Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the odd</td><td>integer</td></tr><tr><td>external_id</td><td>The external id of the odd</td><td>integer</td></tr><tr><td>fixture_id</td><td>Refers to the fixture related to the odd</td><td>integer</td></tr><tr><td>market_id</td><td>Refers to the market related to the odd</td><td>integer</td></tr><tr><td>bookmaker_id</td><td>Refers to the bookmaker related to the odd</td><td>integer</td></tr><tr><td>label</td><td>Displays the label of the odd</td><td>string</td></tr><tr><td>value</td><td>Displays the value of the odd</td><td>string</td></tr><tr><td>name</td><td>Displays the name of the odd</td><td>string</td></tr><tr><td>market_description</td><td>Displays the description of the market</td><td>string</td></tr><tr><td>probability</td><td>Displays the probability odd</td><td>string</td></tr><tr><td>dp3</td><td>Displays the dp3 odd</td><td>string</td></tr><tr><td>fractional</td><td>Displays the fractional odd</td><td>string</td></tr><tr><td>american</td><td>Displays the american odd</td><td>string</td></tr><tr><td>suspended</td><td>Determines if the odd is suspended or not</td><td>boolean</td></tr><tr><td>stopped</td><td>Determines if the odd is stopped or not</td><td>boolean</td></tr><tr><td>total</td><td>Displays the total of the odd</td><td>string / null</td></tr><tr><td>handicap</td><td>Displays the handicap of the odd</td><td>string / null</td></tr><tr><td>participants</td><td>Displays the participants of the odd</td><td>string / null</td></tr></tbody></table>

#### Include options

[`market`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`bookmaker`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`fixture`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#fixture)

### Premium Odd

#### Related endpoints

{% content-ref url="../endpoints/premium-odds-feed" %}
[premium-odds-feed](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/premium-odds-feed)
{% endcontent-ref %}

#### Field description

{% hint style="info" %}
Please note that Premium Odds do not have winning odds functionality yet. However, we are working on adding this functionality to the Premium Odds feed.
{% endhint %}

<table><thead><tr><th width="272.5089974293059">Field</th><th>Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of the odd</td><td>integer</td></tr><tr><td>fixture_id</td><td>Refers to the fixture related to the odd</td><td>integer</td></tr><tr><td>market_id</td><td>Refers to the market related to the odd</td><td>integer</td></tr><tr><td>bookmaker_id</td><td>Refers to the bookmaker related to the odd</td><td>integer</td></tr><tr><td>label</td><td>Displays the label of the odd</td><td>string</td></tr><tr><td>value</td><td>Displays the value of the odd</td><td>string</td></tr><tr><td>name</td><td>Displays the name of the odd</td><td>string</td></tr><tr><td>market_description</td><td>Displays the description of the market</td><td>string</td></tr><tr><td>probability</td><td>Displays the probability odd</td><td>string</td></tr><tr><td>dp3</td><td>Displays the dp3 odd</td><td>string</td></tr><tr><td>fractional</td><td>Displays the fractional odd</td><td>string</td></tr><tr><td>american</td><td>Displays the american odd</td><td>string</td></tr><tr><td>stopped</td><td>Determines if the odd is stopped or not</td><td>boolean</td></tr><tr><td>total</td><td>Displays the total of the odd</td><td>string / null</td></tr><tr><td>handicap</td><td>Displays the handicap of the odd</td><td>string / null</td></tr><tr><td>latest_bookmaker_update</td><td>Returns the timestamp of the bookmakers latest update</td><td>string / null</td></tr></tbody></table>

### PremiumOddHistory

| Field            | Description                                            | Type     |
| ---------------- | ------------------------------------------------------ | -------- |
| id               | Unique id of the Premium Odd entity                    | int      |
| odd_id           | The id of the PremiumOdd entity the records belongs to | int      |
| value            | The (historical) value of the referring premium odd    | string   |
| probability      | Displays the probability odd                           | string   |
| dp3              | Displays the dp3 odd                                   | string   |
| fractional       | Displays the fractional odd                            | string   |
| american         | Displays the american odd                              | string   |
| bookmaker_update | Returns the timestamp of the bookmakers latest update  | datetime |

#### Include options

[`market`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`bookmaker`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`fixture`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#fixture)

### Prediction/ValueBet

**Related endpoints**

{% content-ref url="../endpoints/predictions" %}
[predictions](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/predictions)
{% endcontent-ref %}

**Field Description**

| Field       | Description                                     | Type    |
| ----------- | ----------------------------------------------- | ------- |
| id          | Refers to the id of the state                   | integer |
| fixture_id  | Refers to the fixture related to the prediction | integer |
| predictions | The data object with prediction values          | object  |
| type_id     | Refers to the type of the prediction            | integer |

#### Include options

[`type`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`fixture`](https://docs.sportmonks.com/football/endpoints-and-entities/fixture#fixture)

### Probability

**Related endpoints**

{% content-ref url="../endpoints/predictions" %}
[predictions](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/predictions)
{% endcontent-ref %}

**Field Description**

| Field     | Description                                     | Type    |
| --------- | ----------------------------------------------- | ------- |
| id        | Refers to the id of the probability             | integer |
| league_id | Refers to the league related to the probability | integer |
| type_id   | Refers to the type of the probability           | integer |
| data      | The data object with probability values         | object  |

#### Probability - Data Object

<table><thead><tr><th width="231.10197710718">Field</th><th width="305.3211009174312">Description</th><th>Type</th></tr></thead><tbody><tr><td>fulltime_result</td><td>The predictability of the full time result market</td><td>float</td></tr><tr><td>away_over_under_0_5</td><td>The predictability of the away_over_under_0_5 market</td><td>float</td></tr><tr><td>away_over_under_1_5</td><td>The predictability of the away_over_under_1_5 market</td><td>float</td></tr><tr><td>both_teams_to_score</td><td>The predictability of the both_teams_to_score market</td><td>float</td></tr><tr><td>team_to_score_first</td><td>The predictability of the team_to_score_first market</td><td>float</td></tr><tr><td>home_over_under_0_5</td><td>The predictability of the home_over_under_0_5 market</td><td>float</td></tr><tr><td>home_over_under_1_5</td><td>The predictability of the home_over_under_1_5 market</td><td>float</td></tr><tr><td>over_under_1_5</td><td>The predictability of the over_under_1_5 market</td><td>float</td></tr><tr><td>over_under_2_5</td><td>The predictability of the over_under_2_5 market</td><td>float</td></tr><tr><td>over_under_3_5</td><td>The predictability of the over_under_3_5 market</td><td>float</td></tr><tr><td>correct_score</td><td>The predictability of the correct_score market</td><td>float</td></tr><tr><td>ht_ft</td><td>The predictability of the half time/full time market</td><td>float</td></tr><tr><td>fulltime_result_1st_half</td><td>The predictability of the fulltime_result_1st_half market</td><td>float</td></tr></tbody></table>

#### Include options

[`type`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`league`](https://docs.sportmonks.com/football/endpoints-and-entities/league-season-schedule-stage-and-round#league)
