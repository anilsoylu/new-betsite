/**
 * Core Sportmonks Raw Types
 * Fixture, Participant, Score, State
 */

// Base response wrapper from Sportmonks API
export interface SportmonksResponse<T> {
  data: T;
  subscription: Array<{
    meta: Record<string, unknown>;
    plans: Array<Record<string, unknown>>;
    add_ons: Array<Record<string, unknown>>;
    widgets: Array<Record<string, unknown>>;
  }>;
  rate_limit: {
    resets_in_seconds: number;
    remaining: number;
    requested_entity: string;
  };
  timezone: string;
}

// Pagination wrapper
export interface SportmonksPaginatedResponse<T> extends SportmonksResponse<Array<T>> {
  pagination: {
    count: number;
    per_page: number;
    current_page: number;
    next_page: string | null;
    has_more: boolean;
  };
}

// Match state/status
export interface SportmonksStateRaw {
  id: number;
  state: string;
  name: string;
  short_name: string;
  developer_name: string;
}

// Score information
export interface SportmonksScoreRaw {
  id: number;
  fixture_id: number;
  type_id: number;
  participant_id: number;
  score: {
    goals: number;
    participant: "home" | "away";
  };
  description: string;
}

// Team/participant in a fixture
export interface SportmonksParticipantRaw {
  id: number;
  sport_id: number;
  country_id: number;
  venue_id: number | null;
  gender: string;
  name: string;
  short_code: string | null;
  image_path: string;
  founded: number | null;
  type: string;
  placeholder: boolean;
  last_played_at: string | null;
  meta: {
    location: "home" | "away";
    winner: boolean | null;
    position: number | null;
  };
}

// Formation information
export interface SportmonksFormationRaw {
  id: number;
  fixture_id: number;
  participant_id: number;
  formation: string;
  location: "home" | "away";
}

// Main fixture/match data
export interface SportmonksFixtureRaw {
  id: number;
  sport_id: number;
  league_id: number;
  season_id: number;
  stage_id: number | null;
  group_id: number | null;
  aggregate_id: number | null;
  round_id: number | null;
  state_id: number;
  venue_id: number | null;
  name: string;
  starting_at: string;
  result_info: string | null;
  leg: string;
  details: string | null;
  length: number;
  placeholder: boolean;
  has_odds: boolean;
  has_premium_odds: boolean;
  starting_at_timestamp: number;

  // Included relations (optional based on include params)
  state?: SportmonksStateRaw;
  participants?: Array<SportmonksParticipantRaw>;
  scores?: Array<SportmonksScoreRaw>;
  league?: import("./league").SportmonksLeagueRaw;
  venue?: import("./match-data").SportmonksVenueRaw;
  events?: Array<import("./match-data").SportmonksEventRaw>;
  statistics?: Array<import("./match-data").SportmonksStatisticRaw>;
  lineups?: Array<import("./match-data").SportmonksLineupRaw>;
  periods?: Array<import("./match-data").SportmunksPeriodRaw>;
  formations?: Array<SportmonksFormationRaw>;
  referees?: Array<import("./match-data").SportmonksRefereeRaw>;
}
