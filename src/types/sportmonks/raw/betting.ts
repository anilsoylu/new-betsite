/**
 * Betting Sportmonks Raw Types
 * Odds and betting market data
 */

// Market type (1X2, Over/Under, etc.)
export interface SportmonksMarketRaw {
  id: number;
  legacy_id: number | null;
  name: string;
  developer_name: string;
  has_winning_calculations: boolean;
}

// Bookmaker info
export interface SportmonksBookmakerRaw {
  id: number;
  legacy_id: number | null;
  name: string;
}

// Single odd value
export interface SportmonksOddValueRaw {
  id: number;
  odds_id: number;
  label: string;
  value: string;
  name: string | null;
  sort_order: number | null;
  market_description: string | null;
  probability: string | null;
  dp3: string | null;
  fractional: string | null;
  american: string | null;
  winning: boolean | null;
  stopped: boolean;
  total: string | null;
  handicap: string | null;
  participants: string | null;
  created_at: string;
  updated_at: string;
  original_label: string | null;
  latest_bookmaker_update: string | null;
}

// Main odds entry
export interface SportmonksOddRaw {
  id: number;
  fixture_id: number;
  market_id: number;
  bookmaker_id: number;
  label: string;
  value: string;
  name: string | null;
  sort_order: number | null;
  market_description: string | null;
  probability: string | null;
  dp3: string | null;
  fractional: string | null;
  american: string | null;
  winning: boolean | null;
  stopped: boolean;
  total: string | null;
  handicap: string | null;
  participants: string | null;
  created_at: string;
  updated_at: string;
  original_label: string | null;
  latest_bookmaker_update: string | null;

  // Included relations
  market?: SportmonksMarketRaw;
  bookmaker?: SportmonksBookmakerRaw;
}

// Pre-match odds response structure
export interface SportmonksPreMatchOddsRaw {
  id: number;
  fixture_id: number;
  market_id: number;
  bookmaker_id: number;
  label: string;
  value: string;
  name: string | null;
  sort_order: number | null;
  market_description: string | null;
  probability: string | null;
  dp3: string | null;
  fractional: string | null;
  american: string | null;
  winning: boolean | null;
  stopped: boolean;
  total: string | null;
  handicap: string | null;
  participants: string | null;
  created_at: string;
  updated_at: string;
  original_label: string | null;
  latest_bookmaker_update: string | null;
}
