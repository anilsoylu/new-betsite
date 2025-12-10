/**
 * Centralized Error Handling Utilities
 * Provides consistent error types, logging, and API response formatting
 */

import { z } from "zod";

// ============================================================================
// Error Classes
// ============================================================================

/**
 * Base application error with code, status, and optional details
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 500,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * Validation error for invalid input (400)
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public zodError?: z.ZodError,
  ) {
    super(message, "VALIDATION_ERROR", 400, {
      issues: zodError?.issues,
    });
    this.name = "ValidationError";
  }
}

/**
 * Not found error for missing resources (404)
 */
export class NotFoundError extends AppError {
  constructor(resource: string, id?: string | number) {
    super(
      `${resource} not found${id !== undefined ? `: ${id}` : ""}`,
      "NOT_FOUND",
      404,
    );
    this.name = "NotFoundError";
  }
}

/**
 * API error for upstream service failures
 */
export class ApiError extends AppError {
  constructor(
    message: string,
    status: number,
    public upstream?: string,
  ) {
    super(message, "API_ERROR", status, { upstream });
    this.name = "ApiError";
  }
}

/**
 * Rate limit error (429)
 */
export class RateLimitError extends AppError {
  constructor(retryAfter?: number) {
    super("Too many requests", "RATE_LIMIT", 429, { retryAfter });
    this.name = "RateLimitError";
  }
}

// ============================================================================
// Logging
// ============================================================================

interface LogErrorMetadata {
  url?: string;
  method?: string;
  duration?: number;
  [key: string]: unknown;
}

/**
 * Structured error logging for observability
 * Outputs JSON format suitable for log aggregation services
 */
export function logError(
  context: string,
  error: unknown,
  metadata?: LogErrorMetadata,
): void {
  const timestamp = new Date().toISOString();

  const errorInfo =
    error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          stack:
            process.env.NODE_ENV === "development" ? error.stack : undefined,
          ...(error instanceof AppError && {
            code: error.code,
            status: error.status,
            details: error.details,
          }),
        }
      : { message: String(error) };

  console.error(
    JSON.stringify({
      timestamp,
      level: "error",
      context,
      ...errorInfo,
      ...metadata,
    }),
  );
}

/**
 * Structured info logging
 */
export function logInfo(
  context: string,
  message: string,
  metadata?: Record<string, unknown>,
): void {
  if (process.env.NODE_ENV === "development") {
    console.info(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "info",
        context,
        message,
        ...metadata,
      }),
    );
  }
}

// ============================================================================
// API Response Helpers
// ============================================================================

/**
 * Standard API error response shape
 */
export interface ApiErrorResponse {
  error: string;
  code: string;
  details?: unknown;
}

/**
 * Converts any error to a consistent API response format
 * @returns Object with body and status for NextResponse.json()
 */
export function createErrorResponse(error: unknown): {
  body: ApiErrorResponse;
  status: number;
} {
  // Handle our custom errors
  if (error instanceof AppError) {
    return {
      body: {
        error: error.message,
        code: error.code,
        details: error.details,
      },
      status: error.status,
    };
  }

  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    return {
      body: {
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      status: 400,
    };
  }

  // Generic error fallback
  const message =
    error instanceof Error ? error.message : "Internal server error";

  return {
    body: {
      error: message,
      code: "INTERNAL_ERROR",
    },
    status: 500,
  };
}

/**
 * Type guard to check if error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Wraps an async handler with error logging and response formatting
 * Useful for API route handlers
 */
export async function withErrorHandling<T>(
  context: string,
  fn: () => Promise<T>,
  metadata?: LogErrorMetadata,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    logError(context, error, metadata);
    throw error;
  }
}
