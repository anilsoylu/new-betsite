/**
 * Build XI (Lineup Builder) Types
 *
 * Types for the lineup builder feature that allows users to create
 * custom football lineups with formation selection and player search.
 */

/**
 * Position type categories for filtering and assignment
 */
export type PositionType = "goalkeeper" | "defender" | "midfielder" | "attacker";

/**
 * Mode for lineup building (club teams vs national teams)
 */
export type LineupMode = "club" | "country";

/**
 * Individual position slot in a formation
 */
export interface PositionSlot {
  /** Unique slot ID (e.g., "gk", "cb1", "lw") */
  id: string;
  /** Display label (e.g., "GK", "CB", "LW") */
  label: string;
  /** Grid row (1 = goalkeeper, 5 = attackers) */
  row: number;
  /** Grid column position (1-5, left to right) */
  col: number;
  /** Position category for filtering */
  positionType: PositionType;
}

/**
 * Formation configuration
 */
export interface FormationConfig {
  /** Formation ID (e.g., "4-3-3") */
  id: string;
  /** Display name */
  name: string;
  /** Array of 11 position slots */
  positions: PositionSlot[];
}

/**
 * Player assigned to a lineup slot
 */
export interface LineupSlotPlayer {
  /** Player ID from API */
  playerId: number;
  /** Full name */
  name: string;
  /** Display name (shorter version) */
  displayName: string;
  /** Player image URL */
  image: string | null;
  /** Player's natural position */
  position: string | null;
  /** Player's country info */
  country: {
    name: string;
    flag: string | null;
  } | null;
}

/**
 * Complete lineup with all configuration
 */
export interface BuildXILineup {
  /** Unique ID for saved lineups */
  id: string;
  /** User-defined name */
  name: string;
  /** Formation ID */
  formationId: string;
  /** Club or country mode */
  mode: LineupMode;
  /** Players mapped by slot ID */
  players: Record<string, LineupSlotPlayer | null>;
  /** Creation timestamp */
  createdAt: number;
  /** Last update timestamp */
  updatedAt: number;
}

/**
 * Compact lineup format for URL encoding
 * Uses short keys to minimize URL length
 */
export interface CompactLineup {
  /** Formation ID */
  f: string;
  /** Mode: "c" = club, "n" = national */
  m: "c" | "n";
  /** Players array (only filled slots) */
  p: CompactPlayer[];
}

/**
 * Compact player format for URL encoding
 */
export interface CompactPlayer {
  /** Slot ID */
  s: string;
  /** Player ID */
  i: number;
  /** Display name (shortened) */
  n: string;
  /** Image URL (optional, for reconstruction) */
  img?: string;
}

/**
 * Popular team for quick pre-fill
 */
export interface PopularTeam {
  /** Team ID from API */
  id: number;
  /** Team name */
  name: string;
  /** Team logo URL */
  logo: string;
  /** Country name */
  country: string;
}
