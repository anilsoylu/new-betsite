import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Fixture, PlayerMatch } from "@/types/football";
import { safeExtractIdFromSlug } from "@/lib/validation/schemas";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert text to URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove duplicate hyphens
}

/**
 * Generate fixture URL slug: home-vs-away-id
 */
export function generateFixtureSlug(fixture: Fixture): string {
  const homeSlug = slugify(fixture.homeTeam.name);
  const awaySlug = slugify(fixture.awayTeam.name);
  return `${homeSlug}-vs-${awaySlug}-${fixture.id}`;
}

/**
 * Generate fixture URL path
 */
export function getFixtureUrl(fixture: Fixture): string {
  return `/matches/${generateFixtureSlug(fixture)}`;
}

/**
 * Generate match URL from PlayerMatch data
 */
export function getPlayerMatchUrl(match: PlayerMatch): string {
  const homeSlug = slugify(match.homeTeamName);
  const awaySlug = slugify(match.awayTeamName);
  return `/matches/${homeSlug}-vs-${awaySlug}-${match.id}`;
}

/**
 * Extract fixture ID from slug with validation
 * @example extractFixtureId("man-united-vs-chelsea-12345") => 12345
 */
export function extractFixtureId(slug: string): number | null {
  return safeExtractIdFromSlug(slug);
}

/**
 * Generate team URL slug: team-name-id
 */
export function generateTeamSlug(name: string, id: number): string {
  return `${slugify(name)}-${id}`;
}

/**
 * Generate team URL path
 */
export function getTeamUrl(name: string, id: number): string {
  return `/teams/${generateTeamSlug(name, id)}`;
}

/**
 * Extract team ID from slug with validation
 * @example extractTeamId("manchester-united-123") => 123
 */
export function extractTeamId(slug: string): number | null {
  return safeExtractIdFromSlug(slug);
}

/**
 * Generate player URL slug: player-name-id
 */
export function generatePlayerSlug(name: string, id: number): string {
  return `${slugify(name)}-${id}`;
}

/**
 * Generate player URL path
 */
export function getPlayerUrl(name: string, id: number): string {
  return `/players/${generatePlayerSlug(name, id)}`;
}

/**
 * Extract player ID from slug with validation
 * @example extractPlayerId("lionel-messi-456") => 456
 */
export function extractPlayerId(slug: string): number | null {
  return safeExtractIdFromSlug(slug);
}

/**
 * Generate league URL slug: league-name-id
 */
export function generateLeagueSlug(name: string, id: number): string {
  return `${slugify(name)}-${id}`;
}

/**
 * Generate league URL path
 */
export function getLeagueUrl(name: string, id: number): string {
  return `/leagues/${generateLeagueSlug(name, id)}`;
}

/**
 * Extract league ID from slug with validation
 * @example extractLeagueId("premier-league-8") => 8
 */
export function extractLeagueId(slug: string): number | null {
  return safeExtractIdFromSlug(slug);
}

/**
 * Generate coach URL slug: coach-name-id
 */
export function generateCoachSlug(name: string, id: number): string {
  return `${slugify(name)}-${id}`;
}

/**
 * Generate coach URL path
 */
export function getCoachUrl(name: string, id: number): string {
  return `/coaches/${generateCoachSlug(name, id)}`;
}

/**
 * Extract coach ID from slug with validation
 * @example extractCoachId("pep-guardiola-789") => 789
 */
export function extractCoachId(slug: string): number | null {
  return safeExtractIdFromSlug(slug);
}
