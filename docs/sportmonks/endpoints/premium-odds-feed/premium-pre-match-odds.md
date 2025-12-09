# Premium Pre-match Odds

Enrich your application with betting functionalities. The premium odds endpoints can be used for Pre-match Odds.

Use one of our four odds endpoints. Per endpoint, you can find the details, including base URL, parameters, include options and more.&#x20;

- **GET All Premium Odds:** returns all the premium pre-match odds.
- **GET Premium Odds by Fixture ID:** returns the premium pre-match odds from your requested fixture ID.
- **GET Premium Odds by Fixture ID and Bookmaker ID:** returns the pre-match odds filtered on Bookmaker ID from your requested fixture ID.
- **GET Premium Odds by Fixture ID and Market ID:** returns the pre-match odds filtered on Market ID from your requested fixture ID.
- **GET Last Updated Premium Pre-match Odds:** returns the last updated pre-match odds.

#### Include options

[`market`](https://docs.sportmonks.com/football2/v/odds/getting-started/endpoints/markets) [`bookmaker`](https://docs.sportmonks.com/football2/v/odds/getting-started/endpoints/bookmakers) [`fixture`](https://docs.sportmonks.com/football/entities/fixture#fixture)

#### Related entities

[Odd](https://docs.sportmonks.com/football/entities/odd-and-prediction#odd)

{% hint style="warning" %}
The Premium Odds Feed is an optional add-on available for activation on [my.sportmonks.com](https://my.sportmonks.com/dashboard). It's important to note that **the Premium Odds Feed is not part of the Standard Odds Feed by default.**
{% endhint %}

{% hint style="info" %}
Our **Premium Odds Feed** provides a **history** of pre-match odds for fixtures for up to **7 days** after the match has started. Additionally, we offer the history of the odd. We document the opening odds for each fixture, and subsequently, all changes and updates are stored and accessible for your use. So, every (historical) odd value is available for a fixture until 7 days after the match has started (the 'starting_at' timestamp of the fixture).\
\
Please note that Premium Odds do not have winning odds functionality yet. However, we are working on adding this functionality to the Premium Odds feed.
{% endhint %}
