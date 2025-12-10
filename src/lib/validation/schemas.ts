/**
 * Centralized Zod Validation Schemas
 * Used for API route input validation and type-safe parameter handling
 */

import { z } from "zod";

// ============================================================================
// Primitive Schemas
// ============================================================================

/**
 * Positive integer ID (for fixture, team, player, league IDs)
 */
export const idSchema = z.coerce
  .number()
  .int("ID must be an integer")
  .positive("ID must be a positive number")
  .max(2147483647, "ID exceeds maximum value");

/**
 * Date in YYYY-MM-DD format
 */
export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
  .refine(
    (date) => {
      const parsed = new Date(date);
      return !isNaN(parsed.getTime());
    },
    { message: "Invalid date" },
  );

/**
 * Search query with length limits and character validation
 * Prevents DOS attacks and injection attempts
 */
export const searchQuerySchema = z
  .string()
  .min(2, "Search query must be at least 2 characters")
  .max(100, "Search query must be at most 100 characters")
  .regex(
    /^[\p{L}\p{N}\s\-'.\u00C0-\u024F]+$/u,
    "Search query contains invalid characters",
  )
  .transform((val) => val.trim());

/**
 * Slug format: name-with-dashes-123
 */
export const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .max(200, "Slug is too long")
  .regex(/^[\w-]+-\d+$/, "Invalid slug format");

/**
 * Pagination parameters
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

// ============================================================================
// API Route Schemas
// ============================================================================

/**
 * Player search route: /api/players/search?q=...
 */
export const playerSearchSchema = z.object({
  q: searchQuerySchema,
});

/**
 * Team search route: /api/teams/search?q=...
 */
export const teamSearchSchema = z.object({
  q: searchQuerySchema,
});

/**
 * Fixtures by date route: /api/fixtures?date=...
 */
export const fixturesQuerySchema = z.object({
  date: dateSchema,
});

/**
 * Fixture by ID route: /api/fixtures/[id]/live
 */
export const fixtureIdParamsSchema = z.object({
  id: idSchema,
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Validates URLSearchParams against a Zod schema
 * @throws ZodError if validation fails
 */
export function validateSearchParams<T extends z.ZodType>(
  schema: T,
  searchParams: URLSearchParams,
): z.infer<T> {
  const params = Object.fromEntries(searchParams.entries());
  return schema.parse(params);
}

/**
 * Safely validates URLSearchParams, returning result object
 * Returns { success: true, data } or { success: false, error }
 */
export function safeValidateSearchParams<T extends z.ZodType>(
  schema: T,
  searchParams: URLSearchParams,
): { success: true; data: z.infer<T> } | { success: false; error: z.ZodError } {
  const params = Object.fromEntries(searchParams.entries());
  const result = schema.safeParse(params);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

/**
 * Extracts and validates numeric ID from a slug
 * @example extractIdFromSlug("manchester-united-123") => 123
 * @throws ValidationError if slug format is invalid
 */
export function extractIdFromSlug(slug: string): number {
  // First validate the slug format
  slugSchema.parse(slug);

  // Extract the ID from the end
  const match = slug.match(/-(\d+)$/);
  if (!match) {
    throw new Error("Invalid slug: no ID found");
  }

  return parseInt(match[1], 10);
}

/**
 * Safely extracts ID from slug, returning null on failure
 */
export function safeExtractIdFromSlug(slug: string): number | null {
  try {
    return extractIdFromSlug(slug);
  } catch {
    return null;
  }
}

// ============================================================================
// Type Exports
// ============================================================================

export type PlayerSearchParams = z.infer<typeof playerSearchSchema>;
export type TeamSearchParams = z.infer<typeof teamSearchSchema>;
export type FixturesQueryParams = z.infer<typeof fixturesQuerySchema>;
export type FixtureIdParams = z.infer<typeof fixtureIdParamsSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
