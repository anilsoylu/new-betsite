import { env } from "@/lib/env";
import type { SportmonksResponse, SportmonksPaginatedResponse } from "@/types/sportmonks/raw";

const FOOTBALL_BASE_URL = "https://api.sportmonks.com/v3/football";
const CORE_BASE_URL = "https://api.sportmonks.com/v3/core";

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
  /** Cache revalidation time in seconds (0 = no-store, undefined = default cache) */
  revalidate?: number;
}

// Error types
export class SportmonksError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = "SportmonksError";
  }
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

// Main request function
export async function sportmonksRequest<TData>(
  config: SportmonksRequestConfig
): Promise<SportmonksResponse<TData>> {
  const baseUrl = config.baseUrl === "core" ? CORE_BASE_URL : FOOTBALL_BASE_URL;
  const queryString = buildQueryString(config);
  const url = `${baseUrl}${config.endpoint}${queryString}`;

  const startTime = performance.now();

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: env.API_SPORTMONKS_KEY,
        Accept: "application/json",
      },
      ...(config.revalidate !== undefined && {
        next: { revalidate: config.revalidate }
      }),
    });

    const duration = Math.round(performance.now() - startTime);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const errorMessage = errorBody.message || `HTTP ${response.status}`;

      console.error(`[Sportmonks] ${config.endpoint} failed (${duration}ms):`, {
        status: response.status,
        error: errorMessage,
      });

      throw new SportmonksError(errorMessage, response.status, errorBody.code);
    }

    const data = (await response.json()) as SportmonksResponse<TData>;

    console.log(`[Sportmonks] ${config.endpoint} (${duration}ms)`, {
      rateLimit: data.rate_limit?.remaining,
    });

    return data;
  } catch (error) {
    if (error instanceof SportmonksError) {
      throw error;
    }

    const duration = Math.round(performance.now() - startTime);
    console.error(`[Sportmonks] ${config.endpoint} error (${duration}ms):`, error);

    throw new SportmonksError(
      error instanceof Error ? error.message : "Unknown error",
      0
    );
  }
}

// Paginated request function
export async function sportmonksPaginatedRequest<TItem>(
  config: SportmonksRequestConfig
): Promise<SportmonksPaginatedResponse<TItem>> {
  const baseUrl = config.baseUrl === "core" ? CORE_BASE_URL : FOOTBALL_BASE_URL;
  const queryString = buildQueryString(config);
  const url = `${baseUrl}${config.endpoint}${queryString}`;

  const startTime = performance.now();

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: env.API_SPORTMONKS_KEY,
        Accept: "application/json",
      },
      ...(config.revalidate !== undefined && {
        next: { revalidate: config.revalidate }
      }),
    });

    const duration = Math.round(performance.now() - startTime);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const errorMessage = errorBody.message || `HTTP ${response.status}`;

      console.error(`[Sportmonks] ${config.endpoint} failed (${duration}ms):`, {
        status: response.status,
        error: errorMessage,
      });

      throw new SportmonksError(errorMessage, response.status, errorBody.code);
    }

    const data = (await response.json()) as SportmonksPaginatedResponse<TItem>;

    console.log(`[Sportmonks] ${config.endpoint} (${duration}ms)`, {
      count: data.pagination?.count,
      page: data.pagination?.current_page,
      rateLimit: data.rate_limit?.remaining,
    });

    return data;
  } catch (error) {
    if (error instanceof SportmonksError) {
      throw error;
    }

    const duration = Math.round(performance.now() - startTime);
    console.error(`[Sportmonks] ${config.endpoint} error (${duration}ms):`, error);

    throw new SportmonksError(
      error instanceof Error ? error.message : "Unknown error",
      0
    );
  }
}
