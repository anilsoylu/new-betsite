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
