import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Fixture } from "@/types/football"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
    .replace(/-+/g, "-") // Remove duplicate hyphens
}

/**
 * Generate fixture URL slug: home-vs-away-id
 */
export function generateFixtureSlug(fixture: Fixture): string {
  const homeSlug = slugify(fixture.homeTeam.name)
  const awaySlug = slugify(fixture.awayTeam.name)
  return `${homeSlug}-vs-${awaySlug}-${fixture.id}`
}

/**
 * Generate fixture URL path
 */
export function getFixtureUrl(fixture: Fixture): string {
  return `/matches/${generateFixtureSlug(fixture)}`
}

/**
 * Extract fixture ID from slug
 */
export function extractFixtureId(slug: string): number | null {
  const match = slug.match(/-(\d+)$/)
  return match ? parseInt(match[1], 10) : null
}

/**
 * Generate team URL slug: team-name-id
 */
export function generateTeamSlug(name: string, id: number): string {
  return `${slugify(name)}-${id}`
}

/**
 * Generate team URL path
 */
export function getTeamUrl(name: string, id: number): string {
  return `/teams/${generateTeamSlug(name, id)}`
}

/**
 * Extract team ID from slug
 */
export function extractTeamId(slug: string): number | null {
  const match = slug.match(/-(\d+)$/)
  return match ? parseInt(match[1], 10) : null
}

/**
 * Generate player URL slug: player-name-id
 */
export function generatePlayerSlug(name: string, id: number): string {
  return `${slugify(name)}-${id}`
}

/**
 * Generate player URL path
 */
export function getPlayerUrl(name: string, id: number): string {
  return `/players/${generatePlayerSlug(name, id)}`
}

/**
 * Extract player ID from slug
 */
export function extractPlayerId(slug: string): number | null {
  const match = slug.match(/-(\d+)$/)
  return match ? parseInt(match[1], 10) : null
}

/**
 * Generate league URL slug: league-name-id
 */
export function generateLeagueSlug(name: string, id: number): string {
  return `${slugify(name)}-${id}`
}

/**
 * Generate league URL path
 */
export function getLeagueUrl(name: string, id: number): string {
  return `/leagues/${generateLeagueSlug(name, id)}`
}

/**
 * Extract league ID from slug
 */
export function extractLeagueId(slug: string): number | null {
  const match = slug.match(/-(\d+)$/)
  return match ? parseInt(match[1], 10) : null
}
