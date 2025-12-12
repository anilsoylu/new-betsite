import type {
  BuildXILineup,
  CompactLineup,
  CompactPlayer,
  LineupSlotPlayer,
} from "@/types/build-xi";
import { getFormationById, getDefaultFormation } from "./formations";

/**
 * Encode a lineup to a URL-safe string
 *
 * Uses compact JSON format with short keys, then Base64 encodes.
 * URL-safe Base64 replaces + with - and / with _
 */
export function encodeLineupToUrl(lineup: BuildXILineup): string {
  const compact: CompactLineup = {
    f: lineup.formationId,
    m: lineup.mode === "club" ? "c" : "n",
    p: Object.entries(lineup.players)
      .filter((entry): entry is [string, LineupSlotPlayer] => entry[1] !== null)
      .map(([slotId, player]) => {
        const compactPlayer: CompactPlayer = {
          s: slotId,
          i: player.playerId,
          n: shortenName(player.displayName),
        };
        // Only include image if it exists
        if (player.image) {
          compactPlayer.img = player.image;
        }
        return compactPlayer;
      }),
  };

  const json = JSON.stringify(compact);
  // URL-safe Base64 encoding
  return btoa(encodeURIComponent(json))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Decode a URL-encoded lineup string
 */
export function decodeLineupFromUrl(encoded: string): CompactLineup | null {
  try {
    // Restore standard Base64 from URL-safe version
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    // Add padding if needed
    while (base64.length % 4) {
      base64 += "=";
    }
    const json = decodeURIComponent(atob(base64));
    return JSON.parse(json) as CompactLineup;
  } catch {
    console.error("Failed to decode lineup from URL");
    return null;
  }
}

/**
 * Reconstruct a BuildXILineup from compact format
 * Note: This creates a partial lineup - player images may need to be fetched separately
 */
export function reconstructLineup(compact: CompactLineup): BuildXILineup | null {
  const formationId = compact.f;
  const formation = getFormationById(formationId);

  if (!formation) {
    console.error(`Unknown formation: ${formationId}`);
    return null;
  }

  // Create empty players record
  const players: Record<string, LineupSlotPlayer | null> = {};
  for (const pos of formation.positions) {
    players[pos.id] = null;
  }

  // Fill in players from compact format
  for (const p of compact.p) {
    // Verify slot exists in formation
    if (!formation.positions.some((pos) => pos.id === p.s)) {
      console.warn(`Unknown slot ${p.s} in formation ${formationId}`);
      continue;
    }

    players[p.s] = {
      playerId: p.i,
      name: p.n,
      displayName: p.n,
      image: p.img ?? null,
      position: null, // Not stored in compact format
      country: null, // Not stored in compact format
    };
  }

  const now = Date.now();

  return {
    id: `shared-${now}`,
    name: "Shared Lineup",
    formationId,
    mode: compact.m === "c" ? "club" : "country",
    players,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Generate a shareable URL for a lineup
 */
export function generateShareUrl(lineup: BuildXILineup): string {
  const encoded = encodeLineupToUrl(lineup);
  // Use relative URL - will be combined with current origin
  return `/build-xi?l=${encoded}`;
}

/**
 * Generate full shareable URL with origin
 */
export function generateFullShareUrl(lineup: BuildXILineup, origin: string): string {
  const encoded = encodeLineupToUrl(lineup);
  return `${origin}/build-xi?l=${encoded}`;
}

/**
 * Shorten a name for compact URL encoding
 * Uses last name only, or first name if single word
 */
function shortenName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  // Return last name
  return parts[parts.length - 1];
}

/**
 * Check if URL params contain a lineup
 */
export function hasLineupInUrl(searchParams: URLSearchParams): boolean {
  return searchParams.has("l") && searchParams.get("l")!.length > 0;
}

/**
 * Extract and decode lineup from URL params
 */
export function getLineupFromUrl(
  searchParams: URLSearchParams
): BuildXILineup | null {
  const encoded = searchParams.get("l");
  if (!encoded) return null;

  const compact = decodeLineupFromUrl(encoded);
  if (!compact) return null;

  return reconstructLineup(compact);
}
