/**
 * Application Constants
 * Centralized configuration for easy maintenance
 */

// Site metadata
export const SITE = {
  name: "SoccerName",
  description: "Live football scores, fixtures, standings and statistics",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://socceroffices.com",
  defaultImage: "/og-image.png",
  twitter: "@soccername",
} as const

// SEO metadata templates
export const SEO = {
  home: {
    title: `Live Football Scores & Fixtures | ${SITE.name}`,
    description:
      "Get live football scores, today's fixtures, match results and standings. Follow your favorite teams and leagues in real-time.",
  },
  matchDetail: {
    titleTemplate: (home: string, away: string) =>
      `${home} vs ${away} | ${SITE.name}`,
    descriptionTemplate: (
      home: string,
      away: string,
      league: string,
      date: string
    ) =>
      `${home} vs ${away} - ${league} match on ${date}. Get live scores, lineups, statistics and match details.`,
  },
  standings: {
    title: `Football Standings & Tables | ${SITE.name}`,
    description:
      "View football league standings, tables and rankings. Track your team's position in the league.",
  },
  leagues: {
    title: `Football Leagues | ${SITE.name}`,
    description:
      "Browse all football leagues and competitions. Find fixtures, standings and statistics for every league.",
  },
} as const

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
} as const

// API configuration
export const API = {
  sportmonks: {
    footballBaseUrl: "https://api.sportmonks.com/v3/football",
    coreBaseUrl: "https://api.sportmonks.com/v3/core",
    defaultPerPage: 50,
    maxFixturesPerPage: 100,
    maxPaginationPages: 20,
  },
} as const

// UI configuration
export const UI = {
  fixtures: {
    maxHomePageFixtures: 100,
    maxLiveFixtures: 50,
  },
  pagination: {
    defaultPageSize: 25,
  },
} as const

// Date/time formats
export const DATE_FORMATS = {
  time: "HH:mm",
  date: "dd MMM yyyy",
  dateTime: "dd MMM yyyy HH:mm",
  apiDate: "yyyy-MM-dd",
} as const

// Popular leagues for sidebar
export const POPULAR_LEAGUES = [
  { id: 8, name: "Premier League", shortCode: "ENG", logo: "/leagues/premier-league.png" },
  { id: 564, name: "La Liga", shortCode: "ESP", logo: "/leagues/la-liga.png" },
  { id: 82, name: "Bundesliga", shortCode: "GER", logo: "/leagues/bundesliga.png" },
  { id: 384, name: "Serie A", shortCode: "ITA", logo: "/leagues/serie-a.png" },
  { id: 301, name: "Ligue 1", shortCode: "FRA", logo: "/leagues/ligue-1.png" },
  { id: 2, name: "Champions League", shortCode: "UEFA", logo: "/leagues/champions-league.png" },
  { id: 5, name: "Europa League", shortCode: "UEFA", logo: "/leagues/europa-league.png" },
] as const
