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
// Contact Form Schema
// ============================================================================

/**
 * Contact form validation
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters"),
  surname: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters"),
  company: z
    .string()
    .max(100, "Company name must be at most 100 characters")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Please enter a valid email address"),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject must be at most 100 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be at most 2000 characters"),
  captchaToken: z.string().min(1, "Please verify that you are not a robot"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

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
 * Coach search route: /api/coaches/search?q=...
 */
export const coachSearchSchema = z.object({
  q: searchQuerySchema,
});

/**
 * Fixtures by date route: /api/fixtures?date=...
 */
export const fixturesQuerySchema = z.object({
  date: dateSchema,
});

/**
 * Matches page searchParams: /matches?date=...
 * Optional date with today as default fallback
 */
export const matchesDateSchema = z.object({
  date: dateSchema.optional(),
});

/**
 * Fixture by ID route: /api/fixtures/[id]/live
 */
export const fixtureIdParamsSchema = z.object({
  id: idSchema,
});

// ============================================================================
// Vote Schemas
// ============================================================================

/**
 * Vote choice: home, draw, or away
 */
export const voteChoiceSchema = z.enum(["home", "draw", "away"]);

/**
 * Submit vote request body
 */
export const submitVoteSchema = z.object({
  choice: voteChoiceSchema,
});

export type VoteChoice = z.infer<typeof voteChoiceSchema>;
export type SubmitVoteBody = z.infer<typeof submitVoteSchema>;

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

/**
 * Validates slug params from Next.js page props
 * @throws ZodError if slug format is invalid
 */
export function validateSlugParams(params: { slug: string }): { slug: string } {
  return z.object({ slug: slugSchema }).parse(params);
}

/**
 * Safely validates slug params, returning result object
 * Returns { success: true, data } or { success: false, error }
 */
export function safeValidateSlugParams(
  params: { slug: string },
): { success: true; data: { slug: string } } | { success: false; error: z.ZodError } {
  const result = z.object({ slug: slugSchema }).safeParse(params);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

// ============================================================================
// Type Exports
// ============================================================================

export type PlayerSearchParams = z.infer<typeof playerSearchSchema>;
export type TeamSearchParams = z.infer<typeof teamSearchSchema>;
export type CoachSearchParams = z.infer<typeof coachSearchSchema>;
export type FixturesQueryParams = z.infer<typeof fixturesQuerySchema>;
export type MatchesDateParams = z.infer<typeof matchesDateSchema>;
export type FixtureIdParams = z.infer<typeof fixtureIdParamsSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
