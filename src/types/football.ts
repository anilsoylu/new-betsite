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

// League category (from API)
// 1 = Top tier (Premier League, Champions League, La Liga, etc.)
// 2+ = Secondary tier (FA Cup, lower divisions, etc.)
export type LeagueCategory = 1 | 2 | 3 | 4 | 5;

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
  category: LeagueCategory;
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

// Standing rule types (from API)
// 180 = UCL qualification
// 181 = UEL/UECL qualification
// 182 = Relegation
// 183 = Promotion playoff
// 184 = Championship playoff
// null = No special position
export type StandingRuleType = 180 | 181 | 182 | 183 | 184 | null;

// Upcoming opponent info for standings
export interface NextOpponent {
  teamId: number;
  teamName: string;
  teamLogo: string;
  isHome: boolean;
  matchDate: string;
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
  ruleTypeId: StandingRuleType;
  nextMatch: NextOpponent | null;
}

// Standing table (grouped)
export interface StandingTable {
  id: number;
  name: string | null;
  leagueId: number;
  seasonId: number;
  leagueName: string | null;
  leagueLogo: string | null;
  groupName: string | null;
  standings: Array<Standing>;
}

// Match event (goal, card, substitution)
export interface MatchEvent {
  id: number;
  type: "goal" | "card" | "substitution" | "var" | "other";
  subType?:
    | "yellow"
    | "red"
    | "yellowred"
    | "penalty"
    | "ownGoal"
    | "missedPenalty"
    | null;
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

// Match referee
export interface Referee {
  id: number;
  name: string;
  image: string | null;
}

// Extended fixture with all match details
export interface FixtureDetail extends Fixture {
  events: Array<MatchEvent>;
  statistics: Array<MatchStatistic>;
  homeLineup: TeamLineup | null;
  awayLineup: TeamLineup | null;
  referee: Referee | null;
}

// Form fixture data (for team recent form)
export interface FormFixtureData {
  homeScore: number | null;
  awayScore: number | null;
  isHome: boolean;
}

// Match detail page data
export interface MatchDetailData {
  fixture: FixtureDetail;
  standings: Array<StandingTable>;
  h2h: Array<H2HFixture>;
  odds: MatchOdds | null;
  homeForm: Array<FormFixtureData>;
  awayForm: Array<FormFixtureData>;
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
  trophies: Array<TeamTrophy>;
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

// Player detail (full player info for player page)
export interface PlayerDetail {
  id: number;
  name: string;
  displayName: string;
  commonName: string;
  firstName: string;
  lastName: string;
  image: string | null;
  dateOfBirth: string | null;
  age: number | null;
  height: number | null;
  weight: number | null;
  position: string | null;
  detailedPosition: string | null;
  country: Country | null;
  nationality: Country | null;
  currentTeam: PlayerTeam | null;
  teams: Array<PlayerTeam>;
  // Additional attributes
  preferredFoot: "left" | "right" | "both" | null;
  marketValue: number | null; // From latest transfer or metadata
  // Extended data for player detail page
  seasonStats: Array<PlayerSeasonStats>;
  transfers: Array<PlayerTransfer>;
  trophies: Array<PlayerTrophy>;
  recentMatches: Array<PlayerMatch>;
}

// Player's team info
export interface PlayerTeam {
  id: number;
  teamId: number;
  teamName: string;
  teamLogo: string;
  teamType: string;
  jerseyNumber: number | null;
  isCaptain: boolean;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
}

// Player's season statistics
export interface PlayerSeasonStats {
  seasonId: number;
  seasonName: string;
  leagueId: number | null;
  leagueName: string | null;
  leagueLogo: string | null;
  teamId: number;
  teamName: string;
  teamLogo: string;
  jerseyNumber: number | null;
  // Core stats
  appearances: number;
  minutesPlayed: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  // Additional stats
  rating: number | null;
  cleanSheets: number;
  saves: number;
  penaltiesScored: number;
  penaltiesMissed: number;
}

// Player transfer record
export interface PlayerTransfer {
  id: number;
  date: string;
  type: "loan" | "permanent" | "free" | "end_of_loan" | "unknown";
  fromTeamId: number;
  fromTeamName: string;
  fromTeamLogo: string;
  toTeamId: number;
  toTeamName: string;
  toTeamLogo: string;
  amount: number | null; // Transfer fee in currency
  completed: boolean;
}

// Team transfer record (includes player info)
export interface TeamTransfer {
  id: number;
  date: string;
  type: "loan" | "permanent" | "free" | "end_of_loan" | "unknown";
  direction: "in" | "out"; // Whether player joined or left the team
  playerId: number;
  playerName: string;
  playerImage: string | null;
  fromTeamId: number;
  fromTeamName: string;
  fromTeamLogo: string | null;
  toTeamId: number;
  toTeamName: string;
  toTeamLogo: string | null;
  amount: number | null; // Transfer fee
  completed: boolean;
}

// Team trophy/achievement
export interface TeamTrophy {
  id: number;
  trophyId: number;
  name: string; // e.g. "Winner", "Runner-up"
  position: number; // 1 = winner, 2 = runner-up, etc.
  leagueId: number;
  leagueName: string;
  leagueLogo: string | null;
  seasonId: number;
  seasonName: string;
}

// Player trophy/achievement
export interface PlayerTrophy {
  id: number;
  name: string; // e.g. "Winner", "Runner-up"
  position: number; // 1 = winner, 2 = runner-up, etc.
  leagueId: number;
  leagueName: string;
  leagueLogo: string;
  seasonId: number;
  seasonName: string;
}

// Player's recent match
export interface PlayerMatch {
  id: number;
  date: string;
  leagueId: number;
  leagueName: string;
  leagueLogo: string;
  homeTeamId: number;
  homeTeamName: string;
  homeTeamLogo: string;
  awayTeamId: number;
  awayTeamName: string;
  awayTeamLogo: string;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
}

// Player search result
export interface PlayerSearchResult {
  id: number;
  name: string;
  displayName: string;
  commonName: string;
  image: string | null;
  position: string | null;
  country: Country | null;
}

// Top scorer entry
export interface TopScorer {
  id: number;
  playerId: number;
  playerName: string;
  playerImage: string | null;
  teamId: number;
  teamName: string;
  teamLogo: string;
  position: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

// League page data (comprehensive)
export interface LeaguePageData {
  league: League;
  standings: StandingTable[];
  topScorers: TopScorer[];
  topAssists: TopScorer[];
  recentFixtures: Fixture[];
  upcomingFixtures: Fixture[];
  liveFixtures: Fixture[];
}
