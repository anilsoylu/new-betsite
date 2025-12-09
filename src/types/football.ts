/**
 * Domain Types for Football
 * Clean types used by UI components
 */

// Match status enum
export type MatchStatus =
  | "scheduled"
  | "live"
  | "halftime"
  | "finished"
  | "postponed"
  | "cancelled"
  | "suspended"
  | "unknown";

// Team information
export interface Team {
  id: number;
  name: string;
  shortCode: string | null;
  logo: string;
  isHome: boolean;
  isWinner: boolean | null;
}

// Score information
export interface Score {
  home: number;
  away: number;
  halftimeHome: number | null;
  halftimeAway: number | null;
}

// Venue information
export interface Venue {
  id: number;
  name: string;
  city: string | null;
  capacity: number | null;
  image: string | null;
}

// League information
export interface League {
  id: number;
  name: string;
  shortCode: string | null;
  logo: string;
  countryId: number;
  country: Country | null;
  type: string;
  currentSeasonId: number | null;
}

// Country information
export interface Country {
  id: number;
  name: string;
  iso2: string | null;
  flag: string;
}

// Season information
export interface Season {
  id: number;
  name: string;
  leagueId: number;
  isCurrent: boolean;
  isFinished: boolean;
  startDate: string | null;
  endDate: string | null;
}

// Main fixture/match type
export interface Fixture {
  id: number;
  leagueId: number;
  seasonId: number;
  startTime: string;
  timestamp: number;
  status: MatchStatus;
  statusDetail: string;
  minute: number | null;
  homeTeam: Team;
  awayTeam: Team;
  score: Score | null;
  league: League | null;
  venue: Venue | null;
  hasOdds: boolean;
  isLive: boolean;
}

// Standing entry
export interface Standing {
  position: number;
  teamId: number;
  teamName: string;
  teamLogo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: Array<"W" | "D" | "L">;
}

// Standing table (grouped)
export interface StandingTable {
  id: number;
  name: string | null;
  leagueId: number;
  seasonId: number;
  standings: Array<Standing>;
}

// Match event (goal, card, substitution)
export interface MatchEvent {
  id: number;
  type: "goal" | "card" | "substitution" | "var" | "other";
  minute: number;
  extraMinute: number | null;
  teamId: number;
  playerName: string;
  relatedPlayerName: string | null;
  result: string | null;
  info: string | null;
}

// Match statistic
export interface MatchStatistic {
  type: string;
  home: number | string | null;
  away: number | string | null;
}

// Lineup player
export interface LineupPlayer {
  id: number;
  playerId: number;
  name: string;
  position: string | null;
  jerseyNumber: number;
  isStarter: boolean;
  image: string | null;
}

// Team lineup
export interface TeamLineup {
  teamId: number;
  formation: string | null;
  starters: Array<LineupPlayer>;
  substitutes: Array<LineupPlayer>;
}

// Home page data
export interface HomePageData {
  liveFixtures: Array<Fixture>;
  todayFixtures: Array<Fixture>;
  updatedAt: string;
}

// Odds for a single outcome (1, X, 2)
export interface OddValue {
  label: string;
  value: number;
  probability: number | null;
}

// Match odds (1X2 market)
export interface MatchOdds {
  home: OddValue | null;
  draw: OddValue | null;
  away: OddValue | null;
  bookmaker: string | null;
  updatedAt: string | null;
}

// H2H fixture (simplified for display)
export interface H2HFixture {
  id: number;
  date: string;
  homeTeam: {
    id: number;
    name: string;
    logo: string;
  };
  awayTeam: {
    id: number;
    name: string;
    logo: string;
  };
  homeScore: number;
  awayScore: number;
  winnerId: number | null;
  league: {
    id: number;
    name: string;
    logo: string;
  } | null;
}

// Extended fixture with all match details
export interface FixtureDetail extends Fixture {
  events: Array<MatchEvent>;
  statistics: Array<MatchStatistic>;
  homeLineup: TeamLineup | null;
  awayLineup: TeamLineup | null;
}

// Match detail page data
export interface MatchDetailData {
  fixture: FixtureDetail;
  standings: Array<StandingTable>;
  h2h: Array<H2HFixture>;
  odds: MatchOdds | null;
}

// Team detail (full team info for team page)
export interface TeamDetail {
  id: number;
  name: string;
  shortCode: string | null;
  logo: string;
  founded: number | null;
  country: Country | null;
  venue: Venue | null;
  coach: Coach | null;
  squad: Array<SquadPlayer>;
  activeSeasons: Array<{
    id: number;
    name: string;
    league: {
      id: number;
      name: string;
      logo: string;
    } | null;
  }>;
}

// Coach info
export interface Coach {
  id: number;
  name: string;
  displayName: string;
  image: string | null;
  countryId: number | null;
  dateOfBirth: string | null;
}

// Squad player
export interface SquadPlayer {
  id: number;
  playerId: number;
  name: string;
  displayName: string;
  image: string | null;
  position: string | null;
  positionGroup: string | null;
  jerseyNumber: number | null;
  countryId: number | null;
  dateOfBirth: string | null;
  isCaptain: boolean;
}

// Team search result (for listing)
export interface TeamSearchResult {
  id: number;
  name: string;
  shortCode: string | null;
  logo: string;
  country: Country | null;
}

// Team page data
export interface TeamPageData {
  team: TeamDetail;
  recentFixtures: Array<Fixture>;
  upcomingFixtures: Array<Fixture>;
}
