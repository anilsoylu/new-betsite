# Stages

The **Stages** endpoints allow you to retrieve structural phases of a season (e.g. regular season, playoffs, group stage). You can query stages at the season level or individually.

#### Available endpoints

- **GET All Stages:** get all stages available under your subscription
- **GET Stage by ID:** fetch a specific stage
- **GET Stages by Season ID:** get all stages linked to one season
- **GET Stages by Search (Name):** search for stages matching a name

### Include options

[`league`](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#league) [`season`](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#season) [`type`](https://docs.sportmonks.com/football2/v/core/endpoints/types) [`sport`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`rounds`](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#round) [`currentRound`](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#round) [`groups`](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#group) [`fixtures`](https://docs.sportmonks.com/football/entities/fixture#fixture) [`aggregates`](https://docs.sportmonks.com/football/entities/fixture#aggregate) [`topscorers`](https://docs.sportmonks.com/football/entities/standing-and-topscorer#topscorers) [statistics](https://docs.sportmonks.com/football/endpoints-and-entities/entities/statistic)

(Related entity: [Stage](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#stage))

### Why stages have standings?

Not every stage supports standings (i.e. ranking tables). Below is how you can determine which do, how to query standings per stage, and example usage.

**Understanding standings & stage relationships**

- The **standings** endpoints support filtering by **stage IDs**. You can pass `stage_ids` as a parameter [when requesting standings](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/standings).
- Only **table-based stages** (e.g. group stages, regular season) typically yield a standings table. Knockout or elimination stages (e.g. quarter-finals, semi-finals) usually do _not_ produce standings, because they are not cumulative formats.
- If you query standings for a non-standings stage, you'll likely get either an empty array or the API will ignore that stage filter.

**Example: Querying standings by stage**

To get standings restricted to particular stage(s), you use something like:

{% code overflow="wrap" %}

```bash
GET /v3/football/standings/seasons/{season_id}?stage_ids={stage_id1},{stage_id2}&api_token=YOUR_TOKEN
```

{% endcode %}

For example, in a season with:

- **Stage A**: “Regular Season” (table)
- **Stage B**: “Playoffs” (knockout)

You might fetch full standings:

```bash
GET /v3/football/standings/seasons/19686?api_token=YOUR_TOKEN
```

Or drill into stage A only:

```bash
GET /v3/football/standings/seasons/19686?stage_ids=stageA_id&api_token=YOUR_TOKEN
```

If you pass `stage_ids` for a stage that doesn’t support tables (Stage B), the result may exclude it.

**Detecting standings support by stage**

- Use the `type` field on the Stage entity to infer its nature (e.g. “Group Stage”, “Regular Season”)
- In your UI logic, you can first query all stages in a season, then filter out those whose `type` is non-table or known elimination types
- Always combine that logic with a fallback: if standings for a stage come back empty, treat it as non-standings

**Edge cases & tips**

- Some seasons have multiple stages of the same type (e.g. “First Phase”, “Split Phase”); each can have its own standings.
- In group competitions (e.g. Champions League), you might combine `stage_ids` + `group_ids` to filter standings at both the stage and group level.
- For live standings, you can also use the [**Live Standings** endpoint by league ID](https://app.gitbook.com/u/IUBUJiafDZcMtsn0kjaw4GNJJwA2).
