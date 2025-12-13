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
  // Rich venue data from Sportmonks API
  address: string | null;
  latitude: string | null;
  longitude: string | null;
  surface: string | null;
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
  homeCoach: Coach | null;
  awayCoach: Coach | null;
  referee: Referee | null;
  sidelined: {
    home: Array<Sidelined>;
    away: Array<Sidelined>;
  };
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
  insights: MatchInsights | null;
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

// Coach info (basic - used in team detail)
export interface Coach {
  id: number;
  name: string;
  displayName: string;
  image: string | null;
  countryId: number | null;
  dateOfBirth: string | null;
}

// Coach detail (full - for coach profile page)
export interface CoachDetail {
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
  country: Country | null;
  nationality: Country | null;
  currentTeam: CoachTeam | null;
  teams: Array<CoachTeam>;
  trophies: Array<CoachTrophy>;
  formerPlayerId: number | null;
}

// Coach's team history entry
export interface CoachTeam {
  id: number;
  teamId: number;
  teamName: string;
  teamLogo: string;
  teamType: string;
  position: string; // Head Coach, Assistant, etc.
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  isTemporary: boolean;
}

// Coach trophy/achievement
export interface CoachTrophy {
  id: number;
  name: string;
  position: number;
  leagueId: number;
  leagueName: string;
  leagueLogo: string;
  seasonId: number;
  seasonName: string;
  teamId: number | null;
}

// Coach search result (for listing/search)
export interface CoachSearchResult {
  id: number;
  name: string;
  displayName: string;
  commonName: string;
  image: string | null;
  country: Country | null;
  currentTeamId: number | null;
  currentTeamName: string | null;
  currentTeamLogo: string | null;
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

// ==========================================
// Betting Insights Types
// ==========================================

// Sidelined player (injury/suspension)
export interface Sidelined {
  id: number;
  playerId: number;
  playerName: string;
  playerImage: string | null;
  teamId: number;
  category: string; // "injury" | "suspension" | etc.
  startDate: string;
  endDate: string | null;
  gamesMissed: number;
  isActive: boolean;
  positionId: number | null;
}

// Form metrics for a team
export interface FormMetrics {
  // Basic stats
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  // Calculated metrics
  ppg: number; // Points per game
  winRate: number;
  cleanSheetRate: number;
  bttsRate: number; // Both teams to score rate
  over15Rate: number;
  over25Rate: number;
  over35Rate: number;
  // Home/away specific
  isHomeForm: boolean | null; // null means overall form
}

// Head-to-head metrics
export interface H2HMetrics {
  totalMatches: number;
  homeWins: number;
  awayWins: number;
  draws: number;
  homeGoals: number;
  awayGoals: number;
  // Venue-specific (away team as away in this fixture)
  venueMatches: number;
  venueHomeWins: number;
  venueAwayWins: number;
  venueDraws: number;
  // Trends
  bttsRate: number;
  over25Rate: number;
  avgGoals: number;
}

// Single market odds
export interface MarketOdds {
  marketId: number;
  marketName: string;
  odds: Array<{
    label: string;
    value: number;
    probability: number | null;
    total?: string | null; // For over/under lines
    handicap?: string | null; // For handicap markets
  }>;
  bookmaker: string | null;
  updatedAt: string | null;
}

// Bet recommendation
export interface BetRecommendation {
  marketId: number;
  marketName: string;
  pick: string; // "Over 2.5", "Home", "BTTS Yes"
  pickLabel: string; // Display label
  confidence: number; // 0-100
  reasoning: string;
  odds: number | null;
  impliedProbability: number | null;
  modelProbability: number | null;
  hasValue: boolean; // model prob > implied prob
}

// Key player missing due to injury/suspension
export interface KeyPlayerMissing {
  player: Sidelined;
  keyType: "topScorer" | "topAssist" | "topRated";
  seasonRank: number; // Position in top scorers/assists list
  seasonStats: {
    goals?: number;
    assists?: number;
    rating?: number;
  };
  impactLevel: "high" | "medium" | "low";
}

// Complete match insights
export interface MatchInsights {
  // Form analysis
  homeFormMetrics: FormMetrics;
  awayFormMetrics: FormMetrics;
  homeFormHome: FormMetrics | null; // Home team's home form
  awayFormAway: FormMetrics | null; // Away team's away form

  // H2H analysis
  h2hMetrics: H2HMetrics;

  // Injuries & suspensions
  sidelined: {
    home: Sidelined[];
    away: Sidelined[];
  };
  keyPlayersMissing: KeyPlayerMissing[];
  sidelinedImpact: {
    home: "high" | "medium" | "low" | "none";
    away: "high" | "medium" | "low" | "none";
  };

  // Market recommendations
  recommendations: BetRecommendation[];
  topPicks: BetRecommendation[]; // Top 3-5 by confidence

  // Multi-market odds
  marketOdds: MarketOdds[];

  // Metadata
  dataQuality: {
    hasForm: boolean;
    hasH2H: boolean;
    hasSidelined: boolean;
    hasOdds: boolean;
    hasKeyPlayers: boolean;
  };
}
