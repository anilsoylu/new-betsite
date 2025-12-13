/**
 * SEO Module Exports
 * Centralized exports for all SEO-related utilities
 */

// JSON-LD Schema Generators
export {
  generateWebsiteSchema,
  generateBreadcrumbSchema,
  generateSportsEventSchema,
  generateSportsTeamSchema,
  generatePersonSchema,
  generateCoachSchema,
  generateCoachFAQSchema,
  generateSportsLeagueSchema,
  generateMatchArticleSchema,
  generateMatchFAQSchema,
  generateOddsSchema,
  // ItemList generators (for list pages)
  generateItemListSchema,
  generateFixtureListSchema,
  generateLiveMatchesSchema,
  // FAQ generators
  generatePlayerFAQSchema,
  generateTeamFAQSchema,
  generateLeagueFAQSchema,
} from "./json-ld";

// Metadata Helpers
export {
  buildCanonicalUrl,
  getOgImage,
  buildOpenGraph,
  buildTwitterCard,
  buildPageMetadata,
  KEYWORD_TEMPLATES,
} from "./metadata";

// Types
export type { OpenGraphOptions, TwitterCardOptions } from "./metadata";
