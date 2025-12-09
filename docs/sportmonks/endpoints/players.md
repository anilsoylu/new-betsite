# Players

Retrieve detailed player information via one of our 5 player endpoints.

You can retrieve more detailed information by using the correct includes. Per endpoint you can find the details including base URL, parameters, includes and more.

- **GET All Players:** returns all the players that are accessible within your subscription.
- **GET Player by ID:** returns player information from your requested player ID.
- **GET Players by Country ID:** returns player information from your requested country ID.
- **GET Players Search by Name:** returns all the players that match your search query.
- **GET Last Updated Players:** returns all the players that have received updates in the past two hours.&#x20;

#### Include options

[`sport`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`country`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`city`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`nationality`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`transfers`](https://docs.sportmonks.com/football/entities/other#transfer) [`pendingTransfers`](https://docs.sportmonks.com/football/entities/other#transfer) [`teams`](https://docs.sportmonks.com/football/entities/team-player-squad-coach-and-referee#team) [`statistics`](https://docs.sportmonks.com/football/entities/statistic#playerstatistic) [`latest`](https://docs.sportmonks.com/football/entities/fixture#fixture) [`position`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`detailedPosition`](https://app.gitbook.com/o/-MJWE53IpT91aRTPjruo/s/z0kWjB5EvZvqGsozw8vP/) [`lineups`](https://docs.sportmonks.com/football/entities/fixture#lineup) [`trophies`](https://docs.sportmonks.com/football/entities/other#participanttrophy) [`metadata`](https://docs.sportmonks.com/football/entities/other#metadata)&#x20;

**Related Entities:**

Get an overview and explanation of all the fields returned in the API response. The related entities for the player endpoints are:

- [Player](https://docs.sportmonks.com/football/entities/team-player-squad-coach-and-referee#player)

{% hint style="info" %}
Remember, our historical data will be integrated into the new version of our API gradually. So, the historical data is not yet complete. However, we will be loading more historical data continuously.
{% endhint %}
