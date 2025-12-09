# Livescores

You can obtain all the fixtures that are currently in-play via our livescores endpoints.

Responses of the livescore endpoint are highly customizable because many includes are available to extend the response. You can find a list of available includes below, listed per endpoint option.&#x20;

The three options to retrieve livescores are:

- **GET All Inplay Livescores:** returns all the inplay fixtures.
- **GET All Livescores:** returns the fixtures 15 minutes before the game starts. It will also disappear 15 minutes after the game is finished.
- **GET Latest Updated Livescores:** returns all livescores that have received updates within 10 seconds.

#### Include options

[`sport`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`round`](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#round) [`stage`](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#stage) [`group`](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#group) [`aggregate`](https://docs.sportmonks.com/football/entities/fixture#aggregate) [`league`](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#league) [`season`](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#season)[`coaches`](https://docs.sportmonks.com/football/entities/team-player-squad-coach-and-referee#coach) [`tvStations`](https://docs.sportmonks.com/football/entities/other#tvstation) [`venue`](https://docs.sportmonks.com/football/entities/other#venue) [`state`](https://docs.sportmonks.com/football/entities/other#state) [`weatherReport`](https://docs.sportmonks.com/football/entities/other#weatherreport) [`lineups`](https://docs.sportmonks.com/football/entities/fixture#lineup) [`events`](https://docs.sportmonks.com/football/entities/fixture#event) [`timeline`](https://docs.sportmonks.com/football/entities/fixture#event) [`comments`](https://docs.sportmonks.com/football/entities/other#commentary) [`trends`](https://docs.sportmonks.com/football/entities/statistic#trend) [`statistics`](https://docs.sportmonks.com/football/entities/statistic#fixturestatistic) [`periods`](https://docs.sportmonks.com/football/entities/fixture#period) [`participants` ](https://docs.sportmonks.com/football/entities/team-player-squad-coach-and-referee#team)[`odds`](https://docs.sportmonks.com/football/entities/odd-and-prediction#odd)[`premiumOdds`](https://docs.sportmonks.com/football/endpoints-and-entities/entities/odd-and-prediction#premium-odd) [`inplayOdds`](https://docs.sportmonks.com/football/entities/odd-and-prediction#inplayodd) [`prematchNews`](https://docs.sportmonks.com/football/entities/other#news) [`postmatchNews`](https://docs.sportmonks.com/football/entities/other#news) [`metadata`](https://docs.sportmonks.com/football/entities/other#metadata) [`sidelined`](https://docs.sportmonks.com/football/entities/team-player-squad-coach-and-referee#sidelined)[`predictions`](https://docs.sportmonks.com/football/entities/odd-and-prediction#prediction-valuebet) [`referees`](https://docs.sportmonks.com/football/entities/team-player-squad-coach-and-referee#referees) [`formations`](https://docs.sportmonks.com/football/entities/fixture#formation) [`ballCoordinates`](https://docs.sportmonks.com/football/entities/fixture#ballcoordinate) [`scores`](https://docs.sportmonks.com/football/entities/fixture#score) [`xGFixture`](https://docs.sportmonks.com/football/endpoints-and-entities/entities/expected) `expectedLineups`&#x20;

#### **Related Entities:**

Get an overview and explanation of all the fields returned in the API response. The related entities for the livescores endpoints are:

- [Fixture](https://docs.sportmonks.com/football/entities/fixture#fixture)
