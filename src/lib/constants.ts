/**
 * Application Constants
 * Centralized configuration for easy maintenance
 */

// Site metadata
export const SITE = {
  name: "Soccer Offices",
  description:
    "Live football scores, fixtures, standings, statistics and odds from leagues worldwide. Follow your favorite teams and players in real-time.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://socceroffices.com",
  defaultImage: "/og-image.png",
  twitter: "@socceroffices",
} as const;

// SEO metadata templates
export const SEO = {
  home: {
    title: `Live Football Scores & Fixtures | ${SITE.name}`,
    description:
      "Get live football scores, today's fixtures, match results and standings. Follow your favorite teams and leagues in real-time.",
  },
  matchDetail: {
    titleTemplate: (home: string, away: string) =>
      `${home} vs ${away} | Live Score & Stats`,
    descriptionTemplate: (
      home: string,
      away: string,
      league: string,
      date: string,
    ) =>
      `${home} vs ${away} - ${league} match on ${date}. Get live scores, lineups, statistics and match predictions.`,
  },
  standings: {
    title: `Football Standings & Tables | ${SITE.name}`,
    description:
      "View football league standings, tables and rankings. Track your team's position in the league.",
  },
  leagues: {
    title: `Football Leagues & Competitions | ${SITE.name}`,
    description:
      "Browse all football leagues and competitions. Find fixtures, standings and statistics for every league.",
  },
  leagueDetail: {
    titleTemplate: (leagueName: string) => `${leagueName} | ${SITE.name}`,
    descriptionTemplate: (leagueName: string, country: string) =>
      `${leagueName} standings, fixtures, top scorers, and statistics. Follow ${country} football on ${SITE.name}.`,
  },
  leagueFixtures: {
    titleTemplate: (leagueName: string) =>
      `${leagueName} Fixtures & Results | ${SITE.name}`,
    descriptionTemplate: (leagueName: string) =>
      `View all ${leagueName} fixtures, upcoming matches and recent results. Complete schedule and match information.`,
  },
  leagueStandings: {
    titleTemplate: (leagueName: string) =>
      `${leagueName} Table & Standings | ${SITE.name}`,
    descriptionTemplate: (leagueName: string) =>
      `${leagueName} league table with complete standings. Points, wins, draws, losses and goal difference for all teams.`,
  },
  leagueStats: {
    titleTemplate: (leagueName: string) =>
      `${leagueName} Stats & Top Scorers | ${SITE.name}`,
    descriptionTemplate: (leagueName: string) =>
      `${leagueName} statistics including top scorers, assists, clean sheets and player ratings this season.`,
  },
  teams: {
    title: `Football Teams | ${SITE.name}`,
    description:
      "Browse football teams worldwide. Find squad lists, fixtures, statistics and match results.",
  },
  teamDetail: {
    titleTemplate: (teamName: string) =>
      `${teamName} | Squad, Fixtures & Stats`,
    descriptionTemplate: (teamName: string, country: string) =>
      `${teamName} squad, fixtures and statistics. Follow ${teamName} from ${country} on ${SITE.name}.`,
  },
  teamMatches: {
    titleTemplate: (teamName: string) =>
      `${teamName} Fixtures & Results | ${SITE.name}`,
    descriptionTemplate: (teamName: string) =>
      `${teamName} complete fixtures and results. Upcoming matches, recent results and match schedule.`,
  },
  teamSquad: {
    titleTemplate: (teamName: string) =>
      `${teamName} Squad & Players | ${SITE.name}`,
    descriptionTemplate: (teamName: string) =>
      `${teamName} current squad list. View all players by position including goalkeepers, defenders, midfielders and forwards.`,
  },
  teamStats: {
    titleTemplate: (teamName: string) =>
      `${teamName} Statistics & Form | ${SITE.name}`,
    descriptionTemplate: (teamName: string) =>
      `${teamName} statistics including win rate, goals scored, clean sheets, home and away records.`,
  },
  teamTransfers: {
    titleTemplate: (teamName: string) => `${teamName} Transfers | ${SITE.name}`,
    descriptionTemplate: (teamName: string) =>
      `${teamName} transfer news and history. View incoming and outgoing transfers, loan deals and free agents.`,
  },
  teamHistory: {
    titleTemplate: (teamName: string) =>
      `${teamName} History & Trophies | ${SITE.name}`,
    descriptionTemplate: (teamName: string) =>
      `${teamName} club history, trophies and achievements. Complete historical record and honours.`,
  },
  players: {
    title: `Football Players | ${SITE.name}`,
    description:
      "Search football players worldwide. View player profiles, statistics, career history and transfers.",
  },
  playerDetail: {
    titleTemplate: (playerName: string) =>
      `${playerName} | Stats & Career History`,
    descriptionTemplate: (playerName: string, position: string, team: string) =>
      `${playerName} profile, statistics and career history. ${position} playing for ${team}.`,
  },
  coaches: {
    title: `Football Managers & Coaches | ${SITE.name}`,
    description:
      "Discover football managers and coaches worldwide. View career history, trophies and current teams from top leagues.",
  },
  coachDetail: {
    titleTemplate: (coachName: string) => `${coachName} | Career & Trophies`,
    descriptionTemplate: (coachName: string, teamName: string | null) =>
      teamName
        ? `${coachName} profile, career history and achievements. Currently managing ${teamName}.`
        : `${coachName} profile, career history and managerial achievements.`,
  },
  favorites: {
    title: `Your Favorites | ${SITE.name}`,
    description: "Your saved favorite teams, players and matches.",
  },
  live: {
    title: `Live Football Scores | ${SITE.name}`,
    description:
      "Watch live football scores and real-time match updates. Follow ongoing games with minute-by-minute updates, live statistics and instant notifications.",
  },
  privacy: {
    title: `Privacy Policy | ${SITE.name}`,
    description: `${SITE.name} privacy policy. How we collect, use and protect your data.`,
  },
  terms: {
    title: `Terms of Service | ${SITE.name}`,
    description: `${SITE.name} terms of service and conditions of use.`,
  },
  buildXI: {
    title: `Build Your XI | Create Your Dream Football Lineup | ${SITE.name}`,
    description:
      "Create your dream football starting XI. Choose formations, search players from any team or country, and build the perfect lineup. Save, share, and export your custom formations.",
    keywords: [
      "football lineup builder",
      "build your XI",
      "dream team creator",
      "football formation maker",
      "starting XI builder",
      "custom football lineup",
    ],
  },
} as const;

// Page titles and headings
export const PAGES = {
  home: {
    title: "Football Matches",
    liveSection: "Live Matches",
    todaySection: "Today's Matches",
    emptyMessage: "No matches scheduled for today",
  },
  matchDetail: {
    backToMatches: "Back to matches",
    matchInfo: "Match Info",
    date: "Date",
    kickoff: "Kick-off",
    venue: "Venue",
  },
  standings: {
    title: "Standings",
  },
  leagues: {
    title: "Leagues",
  },
} as const;

// Cache profiles (in seconds)
// Used by sportmonks-client.ts for Next.js revalidation
export const CACHE_PROFILES = {
  /** Live/real-time data: scores, match status (30 seconds) */
  live: 30,
  /** Short-term data: today's fixtures, recent results (5 minutes) */
  short: 300,
  /** Medium-term data: standings, team info (1 hour) */
  medium: 3600,
  /** Long-term data: league metadata, player profiles (6 hours) */
  long: 21600,
  /** Static data: country info, historical data (24 hours) */
  static: 86400,
  /** No caching: force-dynamic routes */
  none: 0,
} as const;

export type CacheProfile = keyof typeof CACHE_PROFILES;

// API configuration
export const API = {
  sportmonks: {
    footballBaseUrl: "https://api.sportmonks.com/v3/football",
    coreBaseUrl: "https://api.sportmonks.com/v3/core",
    defaultPerPage: 50,
    maxFixturesPerPage: 100,
    maxPaginationPages: 20,
  },
} as const;

// UI configuration
export const UI = {
  fixtures: {
    maxHomePageFixtures: 100,
    maxLiveFixtures: 50,
  },
  pagination: {
    defaultPageSize: 25,
  },
} as const;

// Date/time formats
export const DATE_FORMATS = {
  time: "HH:mm",
  date: "dd MMM yyyy",
  dateTime: "dd MMM yyyy HH:mm",
  apiDate: "yyyy-MM-dd",
} as const;

// Popular leagues for sidebar
export const POPULAR_LEAGUES = [
  {
    id: 8,
    name: "Premier League",
    shortCode: "ENG",
    logo: "/leagues/premier-league.png",
  },
  { id: 564, name: "La Liga", shortCode: "ESP", logo: "/leagues/la-liga.png" },
  {
    id: 82,
    name: "Bundesliga",
    shortCode: "GER",
    logo: "/leagues/bundesliga.png",
  },
  { id: 384, name: "Serie A", shortCode: "ITA", logo: "/leagues/serie-a.png" },
  { id: 301, name: "Ligue 1", shortCode: "FRA", logo: "/leagues/ligue-1.png" },
  {
    id: 2,
    name: "Champions League",
    shortCode: "UEFA",
    logo: "/leagues/champions-league.png",
  },
  {
    id: 5,
    name: "Europa League",
    shortCode: "UEFA",
    logo: "/leagues/europa-league.png",
  },
] as const;

// Faz 4: League IDs for SQLite-first coaches page (derived from POPULAR_LEAGUES)
export const POPULAR_LEAGUE_IDS = POPULAR_LEAGUES.map((l) => l.id) as number[];
