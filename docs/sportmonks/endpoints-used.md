# Active Sportmonks Endpoints

Comprehensive list of all Sportmonks Football API v3.0 endpoints currently in use in the project.

## Overview

- **Total Active Endpoints**: 13
- **API Base URL**: `https://api.sportmonks.com/v3/football`
- **Core Base URL**: `https://api.sportmonks.com/v3/core` (countries)
- **API Documentation**: https://docs.sportmonks.com/football

---

## Live & Match Data

### Get Live Matches (In-Play)
```
GET /livescores/inplay
```
- **Used in**: `smart-fixture.ts:74`
- **Type**: `SportmonksFixtureRaw[]`
- **Purpose**: Fetch currently live matches
- **Cache**: No cache (real-time)
- **Includes**: participants, scores, state, league

---

### Get Fixtures by Date
```
GET /fixtures/date/{date}
```
- **Used in**: `smart-fixture.ts:118`
- **Type**: `SportmonksFixtureRaw[]`
- **Purpose**: Fetch matches for a specific date (default: today)
- **Cache**: 60 seconds
- **Includes**: participants, scores, state, league, venue

---

### Get Single Fixture
```
GET /fixtures/{id}
```
- **Used in**: Multiple locations (smart-fixture, football-api)
- **Type**: `SportmonksFixtureRaw`
- **Purpose**: Fetch detailed match data by ID
- **Cache**: Variable (60s for upcoming, 3600s for finished)
- **Includes**: participants, scores, state, league, venue, events, statistics, lineups, periods

---

### Get Head-to-Head Matches
```
GET /fixtures/head-to-head/{homeTeamId}/{awayTeamId}
```
- **Used in**: `football-api.ts:154`
- **Type**: `SportmonksFixtureRaw[]`
- **Purpose**: Fetch historical matches between two teams
- **Cache**: 3600 seconds (1 hour)
- **Includes**: participants, scores, state

---

### Get Team Fixtures Between Dates
```
GET /fixtures/between/{startDate}/{endDate}/{teamId}
```
- **Used in**: `queries.ts:256`
- **Type**: `SportmonksFixtureRaw[]`
- **Purpose**: Fetch team fixtures within a date range
- **Cache**: 300 seconds (5 minutes)
- **Includes**: participants, scores, state, league

---

## Betting & Predictions

### Get Pre-Match Odds
```
GET /odds/pre-match/fixtures/{fixtureId}
```
- **Used in**: `football-api.ts:105`
- **Type**: `SportmonksOddRaw[]`
- **Purpose**: Fetch betting odds for a fixture
- **Cache**: 300 seconds (5 minutes)

---

### Get Match Prediction Probabilities
```
GET /predictions/probabilities/fixtures/{fixtureId}
```
- **Used in**: `football-api.ts:300`
- **Type**: `SportmunksPredictionProbabilityRaw[]`
- **Purpose**: Fetch AI-powered match predictions
- **Cache**: 3600 seconds (1 hour)
- **Includes**: type

---

## Standings

### Get Season Standings
```
GET /standings/seasons/{seasonId}
```
- **Used in**: `football-api.ts:248`
- **Type**: `SportmonksStandingRaw[]`
- **Purpose**: Fetch league table/standings for a season
- **Cache**: 300 seconds (5 minutes)
- **Includes**: participant, details

---

## Player Statistics

### Get Top Scorers
```
GET /topscorers/seasons/{seasonId}
```
- **Used in**: `football-api.ts:697`
- **Type**: `SportmonksTopScorerRaw[]`
- **Purpose**: Fetch top goal scorers for a season
- **Cache**: 3600 seconds (1 hour)
- **Filters**: ⚠️ **None** (API doesn't support typeId filter - filter client-side by type_id === 208)
- **Includes**: player, participant

---

### Get Top Assists
```
GET /topscorers/seasons/{seasonId}
```
- **Used in**: `football-api.ts:771`
- **Type**: `SportmonksTopScorerRaw[]`
- **Purpose**: Fetch top assist providers for a season
- **Cache**: 3600 seconds (1 hour)
- **Filters**: ⚠️ **None** (API doesn't support typeId filter - filter client-side by type_id === 209)
- **Includes**: player, participant

---

## Team Statistics

### Get Team Season Statistics
```
GET /statistics/seasons/teams/{teamId}
```
- **Used in**: `queries.ts:313`
- **Type**: `SportmonksTeamSeasonStatisticsRaw[]`
- **Purpose**: Fetch comprehensive team statistics for all seasons
- **Cache**: 300 seconds (5 minutes)
- **Includes**: details.type

---

## Leagues & Seasons

### Get All Leagues
```
GET /leagues
```
- **Used in**: `football-api.ts:458`, `football-api.ts:514`
- **Type**: `SportmonksLeagueRaw[]`
- **Purpose**: Fetch all leagues with pagination
- **Cache**: 3600 seconds (1 hour)
- **Includes**: country
- **Pagination**: 50 per page

---

### Get Single League
```
GET /leagues/{leagueId}
```
- **Used in**: `football-api.ts:206`
- **Type**: `SportmonksLeagueWithCurrentSeasonRaw`
- **Purpose**: Fetch league with current season info
- **Cache**: 3600 seconds (1 hour)
- **Includes**: country, currentSeason

---

### Get Leagues by Country
```
GET /leagues/countries/{countryId}
```
- **Used in**: `football-api.ts:624`
- **Type**: `SportmonksLeagueRaw[]`
- **Purpose**: Fetch all leagues in a specific country
- **Cache**: 3600 seconds (1 hour)
- **Includes**: country

---

### Get Seasons
```
GET /seasons
```
- **Used in**: `football-api.ts:224`
- **Type**: `SportmonksSeasonRaw[]`
- **Purpose**: Fetch seasons with league filtering
- **Cache**: 3600 seconds (1 hour)
- **Filters**: `seasonLeagues: {leagueId}`

---

## Injuries & Suspensions

### Get Fixture with Sidelined Players
```
GET /fixtures/{id}?include=sidelined
```
- **Used in**: `football-api.ts:358`
- **Type**: `SportmonksFixtureRaw` (with sidelined include)
- **Purpose**: Fetch match with injury and suspension data
- **Cache**: 300 seconds (5 minutes)
- **Includes**: sidelined

---

## Endpoint Usage by Category

| Category | Count | Endpoints |
|----------|-------|-----------|
| **Live & Match Data** | 5 | inplay, date, fixtures, h2h, between |
| **Betting** | 2 | odds, predictions |
| **Standings** | 1 | standings |
| **Player Stats** | 2 | top scorers, top assists |
| **Team Stats** | 1 | team statistics |
| **Leagues & Seasons** | 4 | leagues, league by id, countries, seasons |
| **Injuries** | 1 | sidelined |

---

## Caching Strategy

| Duration | Use Case | Endpoints |
|----------|----------|-----------|
| **No Cache (0s)** | Real-time data | Live matches |
| **60 seconds** | Frequently changing | Upcoming fixtures |
| **300 seconds (5m)** | Moderate updates | Standings, team stats, odds |
| **3600 seconds (1h)** | Stable data | Finished fixtures, leagues, predictions |

---

## Common Include Parameters

| Include | Purpose | Used In |
|---------|---------|---------|
| `participants` | Team information | Most fixtures |
| `scores` | Match scores | Most fixtures |
| `state` | Match status | Most fixtures |
| `league` | League information | Fixtures |
| `venue` | Stadium info | Match details |
| `events` | Goals, cards, subs | Match details |
| `statistics` | Match stats | Match details |
| `lineups` | Team lineups | Match details |
| `periods` | Half times | Match details |
| `details` | Standing details | Standings |
| `type` | Type information | Predictions, stats |
| `player` | Player data | Top scorers |
| `participant` | Team data | Top scorers |
| `country` | Country info | Leagues |
| `currentSeason` | Active season | Leagues |
| `sidelined` | Injuries/suspensions | Fixtures |

---

## API Subscription Requirements

Different endpoints require different Sportmonks subscription tiers:

| Tier | Endpoints Available |
|------|---------------------|
| **Basic** | Fixtures, leagues, standings |
| **Advanced** | Live scores, odds, predictions |
| **Premium** | Full statistics, detailed events |

⚠️ **Note**: Verify your subscription tier supports the endpoints you're using.

---

## Related Files

- **API Functions**: `src/lib/api/football-api.ts`, `src/lib/api/smart-fixture.ts`, `src/lib/queries.ts`
- **Client**: `src/lib/api/sportmonks-client.ts`
- **Mappers**: `src/lib/api/sportmonks-mappers.ts`
- **Types**: See `docs/sportmonks/types.md`
- **Raw Types**: `src/types/sportmonks/raw/`

---

## Maintenance

When adding new endpoints:

1. **Add to this documentation** with all details (path, type, purpose, cache, includes)
2. **Create raw type** in `src/types/sportmonks/raw/`
3. **Add mapper** in `sportmonks-mappers.ts`
4. **Implement API function** in appropriate file
5. **Update types.md** with new type information
