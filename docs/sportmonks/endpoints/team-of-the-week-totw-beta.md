# Team of the Week (TOTW) - beta

Our Team of the Week (TOTW) engine automatically picks the top 11 performers of every round using Sportmonks’ proprietary Player Rating model. No editorial bias—just data‑driven, repeatable selection.

### Quick Start

| **Action**                                | **API request**                                                                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Get all available TOTWS                   | <https://api.sportmonks.com/v3/football/team-of-the-week?api_token=YOURTOKEN>                          |
| Get the TOTW for a specific round         | <https://api.sportmonks.com/v3/football/team-of-the-week/rounds/ROUND_ID?api_token=YOURTOKEN>          |
| Get the latest TOTW for a specific league | <https://api.sportmonks.com/v3/football/team-of-the-week/leagues/LEAGUE_ID/latest?api_token=YOURTOKEN> |

All endpoints require your standard `api_token` query parameter.

---

### Includes

Enrich your response by adding includes to your response with ?include=.

| **Include** | **Add**                                                |
| ----------- | ------------------------------------------------------ |
| player      | Player objects (id, name, nationality, height, etc.)   |
| team        | Team objects (id, name, logo, etc.)                    |
| round       | Round metadata (name, start/end dates, fixtures, etc.) |

---

### Coverage & Limitations

- Round‑based competitions only.\
  Knock‑out stages and playoff matches are not supported.
- Player ratings are updated once all fixtures in a round are finished; a TOTW becomes available immediately thereafter.
- Check the league [coverage here](https://docs.google.com/spreadsheets/d/162QAv57Vn4wcZfryTu5Zc6Y3BHBmJq-3qSZP2dlf9Go/edit?gid=0#gid=0)

---

### How do we calculate the TOTW?

Our TOTW logic has been carefully designed to reflect each player’s impact and position on the pitch:

1. **Lineup roles**\
   We begin by collecting player ratings from every lineup and determine each player's specific role based on their actual formation—for example, distinguishing between a centre-back and a left-back.
2. **Formation matching**\
   For several commonly used formations, we then select the highest-rated player for each role, while ensuring no more than 3 players from the same team are chosen. This keeps the lineup competitive and diverse.
3. **Best formation**\
   We calculate the average rating of each possible TOTW lineup, and the formation with the highest score becomes our Team of the Week for that round.<br>

---

### Feedback & Bug Reporting

We 💚 feedback! Email <support@sportmonks.com> with:

1. Full request URL including query string
2. The round or league ID affected
3. What you observed vs. what you expected
4. Any additional screenshots or logs

The more context you provide, the faster we can assist.

---

### Changelog

| Date (UTC) | Version    | Notes                        |
| ---------- | ---------- | ---------------------------- |
| 2025‑05‑02 | 0.9.0‑beta | Initial public beta release. |
