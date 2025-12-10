import { env } from "@/lib/env";
import { CACHE_PROFILES, type CacheProfile } from "@/lib/constants";
import type {
  SportmonksResponse,
  SportmonksPaginatedResponse,
} from "@/types/sportmonks/raw";

const FOOTBALL_BASE_URL = "https://api.sportmonks.com/v3/football";
const CORE_BASE_URL = "https://api.sportmonks.com/v3/core";

// Default cache profile when none specified
const DEFAULT_CACHE_PROFILE: CacheProfile = "medium";

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
  // Only retry on these status codes (rate limit + server errors)
  retryableStatuses: [429, 500, 502, 503, 504],
} as const;

// Request configuration
export interface SportmonksRequestConfig {
  endpoint: string;
  baseUrl?: "football" | "core";
  include?: Array<string>;
  filters?: Record<string, string | number>;
  page?: number;
  perPage?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  timezone?: string;
  /**
   * Cache profile or explicit seconds for revalidation
   * - Profile name: "live" | "short" | "medium" | "long" | "static" | "none"
   * - Number: explicit seconds (0 = no-store)
   * - Default: "medium" (1 hour)
   */
  cache?: CacheProfile | number;
  /** @deprecated Use `cache` instead */
  revalidate?: number;
}

/**
 * Resolves cache configuration to revalidation seconds
 */
function resolveCacheSeconds(config: SportmonksRequestConfig): number {
  // Legacy support: prefer explicit revalidate if set
  if (config.revalidate !== undefined) {
    return config.revalidate;
  }

  // New cache profile system
  if (config.cache !== undefined) {
    return typeof config.cache === "string"
      ? CACHE_PROFILES[config.cache]
      : config.cache;
  }

  // Default to medium cache
  return CACHE_PROFILES[DEFAULT_CACHE_PROFILE];
}

// Error types
export class SportmonksError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = "SportmonksError";
  }
}

/**
 * Calculate delay for exponential backoff with jitter
 */
function calculateBackoffDelay(attempt: number): number {
  const exponentialDelay = RETRY_CONFIG.baseDelayMs * Math.pow(2, attempt);
  const jitter = Math.random() * 0.3 * exponentialDelay; // 0-30% jitter
  return Math.min(exponentialDelay + jitter, RETRY_CONFIG.maxDelayMs);
}

/**
 * Check if a status code is retryable
 */
function isRetryableStatus(status: number): boolean {
  return RETRY_CONFIG.retryableStatuses.includes(
    status as (typeof RETRY_CONFIG.retryableStatuses)[number],
  );
}

/**
 * Sleep for a given duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Build query string from config
function buildQueryString(config: SportmonksRequestConfig): string {
  const params = new URLSearchParams();

  // Add includes
  if (config.include && config.include.length > 0) {
    params.set("include", config.include.join(";"));
  }

  // Add filters
  if (config.filters) {
    const filterParts: Array<string> = [];
    for (const [key, value] of Object.entries(config.filters)) {
      filterParts.push(`${key}:${value}`);
    }
    if (filterParts.length > 0) {
      params.set("filters", filterParts.join(";"));
    }
  }

  // Add pagination
  if (config.page) {
    params.set("page", config.page.toString());
  }
  if (config.perPage) {
    params.set("per_page", config.perPage.toString());
  }

  // Add sorting
  if (config.sortBy) {
    params.set("sortBy", config.sortBy);
  }
  if (config.order) {
    params.set("order", config.order);
  }

  // Add timezone
  if (config.timezone) {
    params.set("timezone", config.timezone);
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

// Main request function with retry support
export async function sportmonksRequest<TData>(
  config: SportmonksRequestConfig,
): Promise<SportmonksResponse<TData>> {
  const baseUrl = config.baseUrl === "core" ? CORE_BASE_URL : FOOTBALL_BASE_URL;
  const queryString = buildQueryString(config);
  const url = `${baseUrl}${config.endpoint}${queryString}`;
  const cacheSeconds = resolveCacheSeconds(config);

  let lastError: SportmonksError | null = null;

  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    const startTime = performance.now();

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: env.API_SPORTMONKS_KEY,
          Accept: "application/json",
        },
        next: { revalidate: cacheSeconds },
      });

      const duration = Math.round(performance.now() - startTime);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const errorMessage = errorBody.message || `HTTP ${response.status}`;

        // Check if we should retry
        if (
          isRetryableStatus(response.status) &&
          attempt < RETRY_CONFIG.maxRetries
        ) {
          const delay = calculateBackoffDelay(attempt);
          console.warn(
            `[Sportmonks] ${config.endpoint} returned ${response.status}, retrying in ${Math.round(delay)}ms (attempt ${attempt + 1}/${RETRY_CONFIG.maxRetries})`,
          );
          await sleep(delay);
          lastError = new SportmonksError(
            errorMessage,
            response.status,
            errorBody.code,
          );
          continue;
        }

        console.error(
          `[Sportmonks] ${config.endpoint} failed (${duration}ms):`,
          {
            status: response.status,
            error: errorMessage,
          },
        );

        throw new SportmonksError(
          errorMessage,
          response.status,
          errorBody.code,
        );
      }

      const data = (await response.json()) as SportmonksResponse<TData>;
      return data;
    } catch (error) {
      if (error instanceof SportmonksError) {
        // If it's already a SportmonksError and not retryable, throw it
        if (!isRetryableStatus(error.status)) {
          throw error;
        }
        lastError = error;
      } else {
        // Network errors - these are retryable
        const duration = Math.round(performance.now() - startTime);
        if (attempt < RETRY_CONFIG.maxRetries) {
          const delay = calculateBackoffDelay(attempt);
          console.warn(
            `[Sportmonks] ${config.endpoint} network error, retrying in ${Math.round(delay)}ms (attempt ${attempt + 1}/${RETRY_CONFIG.maxRetries})`,
          );
          await sleep(delay);
          lastError = new SportmonksError(
            error instanceof Error ? error.message : "Network error",
            0,
          );
          continue;
        }

        console.error(
          `[Sportmonks] ${config.endpoint} error (${duration}ms):`,
          error,
        );

        throw new SportmonksError(
          error instanceof Error ? error.message : "Unknown error",
          0,
        );
      }
    }
  }

  // If we've exhausted all retries, throw the last error
  throw lastError || new SportmonksError("Max retries exceeded", 0);
}

// Paginated request function with retry support
export async function sportmonksPaginatedRequest<TItem>(
  config: SportmonksRequestConfig,
): Promise<SportmonksPaginatedResponse<TItem>> {
  const baseUrl = config.baseUrl === "core" ? CORE_BASE_URL : FOOTBALL_BASE_URL;
  const queryString = buildQueryString(config);
  const url = `${baseUrl}${config.endpoint}${queryString}`;
  const cacheSeconds = resolveCacheSeconds(config);

  let lastError: SportmonksError | null = null;

  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    const startTime = performance.now();

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: env.API_SPORTMONKS_KEY,
          Accept: "application/json",
        },
        next: { revalidate: cacheSeconds },
      });

      const duration = Math.round(performance.now() - startTime);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const errorMessage = errorBody.message || `HTTP ${response.status}`;

        // Check if we should retry
        if (
          isRetryableStatus(response.status) &&
          attempt < RETRY_CONFIG.maxRetries
        ) {
          const delay = calculateBackoffDelay(attempt);
          console.warn(
            `[Sportmonks] ${config.endpoint} returned ${response.status}, retrying in ${Math.round(delay)}ms (attempt ${attempt + 1}/${RETRY_CONFIG.maxRetries})`,
          );
          await sleep(delay);
          lastError = new SportmonksError(
            errorMessage,
            response.status,
            errorBody.code,
          );
          continue;
        }

        console.error(
          `[Sportmonks] ${config.endpoint} failed (${duration}ms):`,
          {
            status: response.status,
            error: errorMessage,
          },
        );

        throw new SportmonksError(
          errorMessage,
          response.status,
          errorBody.code,
        );
      }

      const data =
        (await response.json()) as SportmonksPaginatedResponse<TItem>;
      return data;
    } catch (error) {
      if (error instanceof SportmonksError) {
        if (!isRetryableStatus(error.status)) {
          throw error;
        }
        lastError = error;
      } else {
        const duration = Math.round(performance.now() - startTime);
        if (attempt < RETRY_CONFIG.maxRetries) {
          const delay = calculateBackoffDelay(attempt);
          console.warn(
            `[Sportmonks] ${config.endpoint} network error, retrying in ${Math.round(delay)}ms (attempt ${attempt + 1}/${RETRY_CONFIG.maxRetries})`,
          );
          await sleep(delay);
          lastError = new SportmonksError(
            error instanceof Error ? error.message : "Network error",
            0,
          );
          continue;
        }

        console.error(
          `[Sportmonks] ${config.endpoint} error (${duration}ms):`,
          error,
        );

        throw new SportmonksError(
          error instanceof Error ? error.message : "Unknown error",
          0,
        );
      }
    }
  }

  throw lastError || new SportmonksError("Max retries exceeded", 0);
}
