# Standings

Keep track of the season performances of your favourite teams. The standings endpoint is used to retrieve full league standing tables.&#x20;

{% hint style="warning" %}
The response of the standings endpoint can be returned in two formats depending on the league setup. For ‘normal’ leagues, the response format differs from Cups.&#x20;

Please check your response carefully if you have cups and 'normal' Leagues in your plan.
{% endhint %}

Use one of our 5 standings endpoints. Per endpoint, you can find the details, including base URL, parameters, includes and more.&#x20;

- **GET All Standings:** returns all the standings available within your subscription.
- **GET Standing by Season ID:** returns the full league standing table from your requested season ID.
- **GET Standings by Round ID:** returns the full league standing table from your requested round ID.
- **GET Standing Correction by Season ID:** returns the standing corrections from your requested season ID.
- **Get Live Standings by League ID:** returns the LIVE league standing table from your requested league ID.

### Include options

[`participant`](https://docs.sportmonks.com/football/entities/team-player-squad-coach-and-referee#team) [`season`](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#season) [`league`](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#league) [`stage`](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#stage) [`group`](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#group) [`round`](https://docs.sportmonks.com/football/entities/league-season-schedule-stage-and-round#round) [`rule`](https://docs.sportmonks.com/football/entities/standing-and-topscorer#standingrule) [`details`](https://docs.sportmonks.com/football/entities/standing-and-topscorer#standingdetail) [`form`](https://docs.sportmonks.com/football/entities/standing-and-topscorer#standingform) [`sport`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/)

### **Related Entities:**

Get an overview and explanation of all the fields returned in the API response. The related entities for the standings endpoint are:

- [Standing](https://docs.sportmonks.com/football/entities/standing-and-topscorer#standing)
