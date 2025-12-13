/**
 * SEO Metadata Helpers
 * Centralized utilities for building consistent metadata across pages
 */

import { SITE } from "@/lib/constants";

// ============================================================================
// Types
// ============================================================================

export interface OpenGraphOptions {
  title: string;
  description: string;
  url: string;
  image?: string | null;
  type?: "website" | "article" | "profile";
}

export interface TwitterCardOptions {
  title: string;
  description: string;
  image?: string | null;
  card?: "summary" | "summary_large_image";
}

// ============================================================================
// Canonical URL Builder
// ============================================================================

/**
 * Builds a canonical URL with optional query parameters
 * Filters out undefined/null/empty values from params
 *
 * @example
 * buildCanonicalUrl('/teams/manchester-united-1') => 'https://socceroffices.com/teams/manchester-united-1'
 * buildCanonicalUrl('/teams/manchester-united-1', { tab: 'squad' }) => 'https://socceroffices.com/teams/manchester-united-1?tab=squad'
 */
export function buildCanonicalUrl(
  path: string,
  params?: Record<string, string | undefined | null>,
): string {
  const baseUrl = `${SITE.url}${path}`;

  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }

  // Filter out undefined/null/empty values
  const filteredParams = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .reduce(
      (acc, [key, value]) => {
        acc[key] = value as string;
        return acc;
      },
      {} as Record<string, string>,
    );

  if (Object.keys(filteredParams).length === 0) {
    return baseUrl;
  }

  const searchParams = new URLSearchParams(filteredParams);
  return `${baseUrl}?${searchParams.toString()}`;
}

// ============================================================================
// OG Image Helper
// ============================================================================

/**
 * Returns the image URL or falls back to site default
 * Ensures all pages have a valid OG image
 */
export function getOgImage(image?: string | null): string {
  if (image) {
    // If it's already a full URL, return as-is
    if (image.startsWith("http")) {
      return image;
    }
    // Otherwise, prepend site URL
    return `${SITE.url}${image}`;
  }
  return `${SITE.url}${SITE.defaultImage}`;
}

// ============================================================================
// OpenGraph Builder
// ============================================================================

/**
 * Builds consistent OpenGraph metadata object
 *
 * @example
 * buildOpenGraph({
 *   title: 'Manchester United',
 *   description: 'Team profile...',
 *   url: 'https://socceroffices.com/teams/manchester-united-1',
 *   image: 'https://cdn.example.com/logo.png',
 *   type: 'website'
 * })
 */
export function buildOpenGraph(opts: OpenGraphOptions) {
  return {
    title: opts.title,
    description: opts.description,
    url: opts.url,
    siteName: SITE.name,
    type: opts.type ?? "website",
    locale: "en_US",
    images: [
      {
        url: getOgImage(opts.image),
        width: 1200,
        height: 630,
        alt: opts.title,
      },
    ],
  };
}

// ============================================================================
// Twitter Card Builder
// ============================================================================

/**
 * Builds consistent Twitter Card metadata object
 *
 * @example
 * buildTwitterCard({
 *   title: 'Manchester United',
 *   description: 'Team profile...',
 *   image: 'https://cdn.example.com/logo.png',
 *   card: 'summary_large_image'
 * })
 */
export function buildTwitterCard(opts: TwitterCardOptions) {
  return {
    card: opts.card ?? "summary_large_image",
    title: opts.title,
    description: opts.description,
    site: SITE.twitter,
    images: [getOgImage(opts.image)],
  };
}

// ============================================================================
// Keyword Templates
// ============================================================================

/**
 * Generates SEO keywords based on entity type and data
 * Returns filtered array (removes undefined/null values)
 */
export const KEYWORD_TEMPLATES = {
  /**
   * Match keywords
   * @example KEYWORD_TEMPLATES.match('Liverpool', 'Chelsea', 'Premier League')
   */
  match: (home: string, away: string, league?: string | null): string[] =>
    [
      home,
      away,
      league,
      "live score",
      "match statistics",
      "betting odds",
      "predictions",
      "H2H",
      "football",
      "soccer",
    ].filter((k): k is string => Boolean(k)),

  /**
   * Team keywords
   * @example KEYWORD_TEMPLATES.team('Manchester United', 'England', 'Premier League')
   */
  team: (
    name: string,
    country?: string | null,
    league?: string | null,
  ): string[] =>
    [
      name,
      country,
      league,
      "squad",
      "fixtures",
      "results",
      "statistics",
      "transfers",
      "football team",
    ].filter((k): k is string => Boolean(k)),

  /**
   * Player keywords
   * @example KEYWORD_TEMPLATES.player('Mohamed Salah', 'Forward', 'Liverpool')
   */
  player: (
    name: string,
    position?: string | null,
    team?: string | null,
  ): string[] =>
    [
      name,
      position,
      team,
      "stats",
      "goals",
      "assists",
      "career",
      "transfers",
      "football player",
    ].filter((k): k is string => Boolean(k)),

  /**
   * Coach keywords
   * @example KEYWORD_TEMPLATES.coach('Pep Guardiola', 'Manchester City')
   */
  coach: (name: string, team?: string | null): string[] =>
    [
      name,
      team,
      "manager",
      "trophies",
      "career",
      "football manager",
    ].filter((k): k is string => Boolean(k)),

  /**
   * League keywords
   * @example KEYWORD_TEMPLATES.league('Premier League', 'England')
   */
  league: (name: string, country?: string | null): string[] =>
    [
      name,
      country,
      "standings",
      "table",
      "fixtures",
      "top scorers",
      "football league",
    ].filter((k): k is string => Boolean(k)),

  /**
   * Live matches page keywords (static)
   */
  live: (): string[] => [
    "live football scores",
    "live soccer scores",
    "real-time football",
    "live match updates",
    "football live streaming",
    "live score today",
  ],

  /**
   * Matches list page keywords (static)
   */
  matches: (): string[] => [
    "football matches",
    "soccer fixtures",
    "match results",
    "upcoming matches",
    "today matches",
    "football schedule",
  ],

  /**
   * Teams list page keywords (static)
   */
  teams: (): string[] => [
    "football teams",
    "soccer clubs",
    "team profiles",
    "squad lists",
    "team statistics",
    "club information",
  ],

  /**
   * Players list page keywords (static)
   */
  players: (): string[] => [
    "football players",
    "soccer players",
    "player profiles",
    "player statistics",
    "top scorers",
    "football stars",
  ],

  /**
   * Coaches list page keywords (static)
   */
  coaches: (): string[] => [
    "football managers",
    "soccer coaches",
    "manager profiles",
    "coaching careers",
    "football coaches",
    "top managers",
  ],

  /**
   * Leagues list page keywords (static)
   */
  leagues: (): string[] => [
    "football leagues",
    "soccer competitions",
    "league standings",
    "football tournaments",
    "league fixtures",
    "football championships",
  ],
};

// ============================================================================
// Combined Metadata Builder
// ============================================================================

/**
 * Builds complete metadata object for a page
 * Combines canonical URL, OpenGraph, and Twitter Card
 */
export function buildPageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  pathParams?: Record<string, string | undefined | null>;
  image?: string | null;
  keywords?: string[];
  type?: "website" | "article" | "profile";
  twitterCard?: "summary" | "summary_large_image";
}) {
  const canonicalUrl = buildCanonicalUrl(opts.path, opts.pathParams);

  return {
    title: opts.title,
    description: opts.description,
    ...(opts.keywords && opts.keywords.length > 0 && { keywords: opts.keywords }),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: buildOpenGraph({
      title: opts.title,
      description: opts.description,
      url: canonicalUrl,
      image: opts.image,
      type: opts.type,
    }),
    twitter: buildTwitterCard({
      title: opts.title,
      description: opts.description,
      image: opts.image,
      card: opts.twitterCard,
    }),
  };
}
