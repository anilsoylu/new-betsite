# Sportmonks API Type Reference

Comprehensive documentation for all Sportmonks API raw types used in the project.

## Overview

All Sportmonks raw types are centralized in `src/types/sportmonks/raw/` and organized by domain.

**Import all types from:**
```typescript
import type {
  SportmonksFixtureRaw,
  SportmonksLeagueRaw,
  // ... other types
} from "@/types/sportmonks/raw";
```

## Type Organization

### Core Types (`src/types/sportmonks/raw/core.ts`)

**SportmonksFixtureRaw** - Match/fixture data with all metadata
- Contains: match details, teams, scores, state, venue, events, statistics
- Used in: match listings, match details, live scores
- Relations: participants, scores, state, league, venue, events, statistics, lineups, periods

**SportmonksParticipantRaw** - Team/participant in a fixture
- Contains: team metadata, location (home/away), winner status
- Used in: fixtures, standings, match details

**SportmonksScoreRaw** - Score information for a fixture
- Contains: goals, participant (home/away), score type
- Used in: fixtures, match details, live scores

**SportmonksStateRaw** - Match state/status
- Contains: state name, short name, developer name
- Used in: fixtures to determine match status (live, finished, upcoming)

---

### League Types (`src/types/sportmonks/raw/league.ts`)

**SportmonksLeagueRaw** - League/competition data
- Contains: league metadata, country, activity status
- Used in: league listings, fixtures, standings

**SportmonksSeasonRaw** ⭐ _NEW_ - Season information
- Contains: season name, league ID, current season status
- Used in: standings, season selection
- Example endpoint: `GET /seasons?filters=leagueId:8`

**SportmonksLeagueWithCurrentSeasonRaw** ⭐ _NEW_ - League with active season
- Extends: `SportmonksLeagueRaw`
- Contains: league data + current season info
- Used in: standings, league pages
- Example endpoint: `GET /leagues/{id}?include=currentSeason`

**SportmonksCountryRaw** - Country/nation data
- Contains: country metadata, ISO codes, geographical coordinates
- Used in: leagues, venues, teams

---

### Match Data Types (`src/types/sportmonks/raw/match-data.ts`)

**SportmonksVenueRaw** - Stadium/venue information
- Contains: venue name, location, capacity, surface type
- Used in: fixtures, match details

**SportmonksEventRaw** - Match events (goals, cards, substitutions)
- Contains: event type, player, minute, result info
- Used in: match details, live match updates

**SportmonksStatisticRaw** - Match statistics
- Contains: stat type, value, location (home/away)
- Used in: match details, post-match analysis

**SportmonksLineupRaw** - Team lineup entry
- Contains: player, position, jersey number, formation
- Used in: match details, pre-match lineups

**SportmunksPeriodRaw** - Period/half information
- Contains: period type, start/end times, duration
- Used in: match details, live match tracking

---

### Betting Types (`src/types/sportmonks/raw/betting.ts`)

**SportmonksOddRaw** - Betting odds from bookmakers
- Contains: odd value, market type, bookmaker, probability
- Used in: match betting odds display
- Example endpoint: `GET /odds/pre-match/fixtures/{fixtureId}`

**SportmunksPredictionRaw** - Legacy prediction data
- Contains: prediction type, yes/no probabilities
- Status: ⚠️ Deprecated - use `SportmunksPredictionProbabilityRaw` instead

**SportmunksPredictionProbabilityRaw** ⭐ _NEW_ - Match prediction probabilities
- Contains: outcome probabilities (yes/no), prediction type
- Used in: match prediction displays
- Example endpoint: `GET /predictions/probabilities/fixtures/{fixtureId}`

---

### Player Types (`src/types/sportmonks/raw/players.ts`)

**SportmonksPlayerRaw** - Player detailed information
- Contains: player metadata, position, nationality, physical stats
- Used in: player profiles, lineups, transfers

**SportmonksTopScorerRaw** ⭐ _NEW_ - Top scorer/assist rankings
- Contains: player ranking, total goals/assists, team info
- Used in: top scorers table, top assists table
- Example endpoints:
  - `GET /topscorers/seasons/{seasonId}` (top scorers)
  - `GET /topscorers/seasons/{seasonId}?typeId=209` (top assists)

---

### Team Statistics Types (`src/types/sportmonks/raw/team-statistics.ts`)

**SportmonksTeamStatisticsDetailRaw** ⭐ _NEW_ - Individual statistic detail
- Contains: stat type, values (all/home/away), percentages
- Used in: team profile statistics

**SportmonksTeamSeasonStatisticsRaw** ⭐ _NEW_ - Team season statistics
- Contains: team ID, season ID, detailed statistics array
- Used in: team profiles, season analysis
- Example endpoint: `GET /statistics/seasons/teams/{teamId}`

---

### Match Statistics Types (`src/types/sportmonks/raw/match-stats.ts`)

**SportmonksStandingRaw** - League standing entry
- Contains: position, points, participant, detailed stats, form
- Used in: league standings tables
- Example endpoint: `GET /standings/seasons/{seasonId}`

---

## Type Flow Diagram

```
┌─────────────────────────┐
│ Raw API Response        │
│ (Sportmonks API v3.0)   │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ Raw Type                │
│ (src/types/sportmonks/  │
│  raw/*.ts)              │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ Mapper Function         │
│ (sportmonks-mappers.ts) │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ Domain Type             │
│ (src/types/football.ts) │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ UI Component            │
│ (React components)      │
└─────────────────────────┘
```

## Usage Examples

### Importing Types

```typescript
// Import specific types
import type {
  SportmonksFixtureRaw,
  SportmonksLeagueRaw,
} from "@/types/sportmonks/raw";

// Import all types
import type * as SportmonksRaw from "@/types/sportmonks/raw";
```

### Using in API Functions

```typescript
import { sportmonksRequest } from "@/lib/api/sportmonks-client";
import type { SportmonksFixtureRaw } from "@/types/sportmonks/raw";

export async function getFixture(id: number) {
  const response = await sportmonksRequest<SportmonksFixtureRaw>({
    endpoint: `/fixtures/${id}`,
    include: ["participants", "scores", "state"],
  });

  return mapSportmonksFixture(response.data);
}
```

### Using with Mappers

```typescript
import { mapSportmonksFixture } from "@/lib/api/sportmonks-mappers";
import type { SportmonksFixtureRaw } from "@/types/sportmonks/raw";

function processFixture(rawData: SportmonksFixtureRaw) {
  // Map raw data to domain type
  const fixture = mapSportmonksFixture(rawData);

  // Use domain type in UI
  return fixture;
}
```

## Type Naming Convention

All Sportmonks raw types follow the naming pattern:
- `Sportmonks{Entity}Raw`
- Example: `SportmonksFixtureRaw`, `SportmonksLeagueRaw`

## Related Documentation

- **API Functions**: `src/lib/api/football-api.ts`
- **Mappers**: `src/lib/api/sportmonks-mappers.ts`
- **Domain Types**: `src/types/football.ts`
- **Endpoints**: See `docs/sportmonks/endpoints-used.md`
- **API Documentation**: https://docs.sportmonks.com/football

## Maintenance

When adding new Sportmonks endpoints:

1. **Define raw type** in appropriate file under `src/types/sportmonks/raw/`
2. **Export type** from `src/types/sportmonks/raw/index.ts`
3. **Create mapper** in `src/lib/api/sportmonks-mappers.ts`
4. **Add API function** in `src/lib/api/football-api.ts` or `src/lib/queries.ts`
5. **Update this documentation** with the new type

⚠️ **Important**: Never define anonymous inline types in `sportmonksRequest<...>` calls. All types must be centralized and named.
