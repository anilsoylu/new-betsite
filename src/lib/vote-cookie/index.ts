/**
 * Vote Cookie Management
 *
 * Provides anonymous voter identity through HttpOnly cookies with HMAC signatures.
 * This prevents tampering while keeping users anonymous.
 */

import { createHmac, randomUUID } from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";

// Cookie configuration
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 365 * 24 * 60 * 60, // 1 year in seconds
};

const VOTER_ID_COOKIE = "mv_id";
const SIGNATURE_COOKIE = "mv_sig";

/**
 * Get the secret key for HMAC signing
 * Falls back to a derived key if VOTE_COOKIE_SECRET is not set
 */
function getSecret(): string {
  const secret = process.env.VOTE_COOKIE_SECRET;
  if (secret) {
    return secret;
  }

  // Fallback: derive from API key (not recommended for production)
  const apiKey = process.env.API_SPORTMONKS_KEY;
  if (apiKey) {
    return createHmac("sha256", "vote-cookie-fallback")
      .update(apiKey)
      .digest("hex");
  }

  throw new Error(
    "VOTE_COOKIE_SECRET environment variable is required for production",
  );
}

/**
 * Generate a new voter ID (UUID v4)
 */
export function generateVoterId(): string {
  return randomUUID();
}

/**
 * Sign a voter ID with HMAC-SHA256
 */
export function signVoterId(voterId: string): string {
  const secret = getSecret();
  return createHmac("sha256", secret).update(voterId).digest("hex");
}

/**
 * Verify a voter ID signature
 */
export function verifyVoterId(voterId: string, signature: string): boolean {
  const expectedSignature = signVoterId(voterId);
  // Timing-safe comparison
  if (signature.length !== expectedSignature.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < signature.length; i++) {
    result |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Result from reading voter cookie
 */
export interface VoterCookieResult {
  voterId: string;
  isNew: boolean;
}

/**
 * Get or create voter identity from request cookies
 */
export function getOrCreateVoterCookie(request: NextRequest): VoterCookieResult {
  const voterId = request.cookies.get(VOTER_ID_COOKIE)?.value;
  const signature = request.cookies.get(SIGNATURE_COOKIE)?.value;

  // If both cookies exist and signature is valid, return existing voter ID
  if (voterId && signature && verifyVoterId(voterId, signature)) {
    return { voterId, isNew: false };
  }

  // Generate new voter ID
  const newVoterId = generateVoterId();
  return { voterId: newVoterId, isNew: true };
}

/**
 * Set voter cookies on response (mutates in place)
 */
export function setVoterCookies(
  response: NextResponse,
  voterId: string,
): void {
  const signature = signVoterId(voterId);

  response.cookies.set(VOTER_ID_COOKIE, voterId, COOKIE_OPTIONS);
  response.cookies.set(SIGNATURE_COOKIE, signature, COOKIE_OPTIONS);
}

/**
 * Get voter ID from request without creating new one
 * Returns null if no valid voter cookie exists
 */
export function getVoterIdFromRequest(request: NextRequest): string | null {
  const voterId = request.cookies.get(VOTER_ID_COOKIE)?.value;
  const signature = request.cookies.get(SIGNATURE_COOKIE)?.value;

  if (voterId && signature && verifyVoterId(voterId, signature)) {
    return voterId;
  }

  return null;
}
