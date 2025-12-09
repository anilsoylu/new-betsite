/**
 * Sportmonks Raw Types - Team
 */

import type { SportmonksCountryRaw, SportmonksSeasonRaw } from "./league";
import type { SportmonksVenueRaw } from "./match-data";

// Team/Club raw data
export interface SportmonksTeamRaw {
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
  // Included relations
  country?: SportmonksCountryRaw;
  venue?: SportmonksVenueRaw;
  coaches?: Array<SportmonksTeamCoachRaw>;
  players?: Array<SportmonksSquadPlayerRaw>;
  activeSeasons?: Array<SportmonksSeasonRaw & { league?: { id: number; name: string; image_path: string } }>;
  latest?: Array<SportmonksTeamFixtureRaw>;
  upcoming?: Array<SportmonksTeamFixtureRaw>;
}

// Team coach relation
export interface SportmonksTeamCoachRaw {
  id: number;
  team_id: number;
  coach_id: number;
  position_id: number;
  active: boolean;
  start: string;
  end: string | null;
  temporary: boolean;
  coach?: SportmonksCoachRaw;
}

// Coach raw data
export interface SportmonksCoachRaw {
  id: number;
  player_id: number | null;
  sport_id: number;
  country_id: number;
  nationality_id: number | null;
  city_id: number | null;
  common_name: string;
  firstname: string;
  lastname: string;
  name: string;
  display_name: string;
  image_path: string | null;
  height: number | null;
  weight: number | null;
  date_of_birth: string | null;
  gender: string;
}

// Squad player relation
export interface SportmonksSquadPlayerRaw {
  id: number;
  transfer_id: number | null;
  player_id: number;
  team_id: number;
  position_id: number | null;
  detailed_position_id: number | null;
  start: string;
  end: string;
  captain: boolean;
  jersey_number: number | null;
  player?: SportmonksPlayerRaw;
  position?: SportmonksPositionRaw;
}

// Player raw data
export interface SportmonksPlayerRaw {
  id: number;
  sport_id: number;
  country_id: number;
  nationality_id: number | null;
  city_id: number | null;
  position_id: number | null;
  detailed_position_id: number | null;
  type_id: number | null;
  common_name: string;
  firstname: string;
  lastname: string;
  name: string;
  display_name: string;
  image_path: string | null;
  height: number | null;
  weight: number | null;
  date_of_birth: string | null;
  gender: string;
  // Included relations (for player detail endpoint)
  country?: SportmonksCountryRaw;
  nationality?: SportmonksCountryRaw;
  position?: SportmonksPositionRaw;
  detailedPosition?: SportmonksPositionRaw;
  teams?: Array<SportmonksPlayerTeamRaw>;
  // Extended includes for player detail page
  statistics?: Array<SportmonksPlayerStatisticRaw>;
  transfers?: Array<SportmonksTransferRaw>;
  trophies?: Array<SportmonksParticipantTrophyRaw>;
  latest?: Array<SportmonksPlayerFixtureRaw>;
  // Metadata (contains preferred foot, etc.)
  metadata?: Array<{
    id: number;
    metadatable_id: number;
    type_id: number;
    value_type: string;
    values: string | number;
  }>;
}

// Player's latest lineups (from include=latest on player endpoint)
// This is lineup/participation data, not fixture data directly
export interface SportmonksPlayerLineupRaw {
  id: number;
  sport_id: number;
  fixture_id: number;
  player_id: number;
  team_id: number;
  position_id: number | null;
  formation_field: string | null;
  type_id: number; // 11 = starter, 12 = substitute
  formation_position: number | null;
  player_name: string;
  jersey_number: number | null;
  // Nested fixture data (from include=latest.fixture.*)
  fixture?: {
    id: number;
    sport_id: number;
    league_id: number;
    season_id: number;
    stage_id: number | null;
    state_id: number;
    venue_id: number | null;
    name: string;
    starting_at: string;
    result_info: string | null;
    leg: string;
    has_odds: boolean;
    starting_at_timestamp: number;
    // Nested includes
    participants?: Array<{
      id: number;
      name: string;
      image_path: string;
      meta?: {
        location: "home" | "away";
        winner?: boolean;
      };
    }>;
    scores?: Array<{
      score: { goals: number };
      description: string;
      participant_id: number;
    }>;
    state?: {
      id: number;
      state: string;
      name: string;
      short_name: string;
      developer_name: string;
    };
    league?: {
      id: number;
      name: string;
      image_path: string;
    };
  };
}

// Legacy type alias for backwards compatibility
export type SportmonksPlayerFixtureRaw = SportmonksPlayerLineupRaw;

// Player's team relation (from player endpoint)
export interface SportmonksPlayerTeamRaw {
  id: number;
  transfer_id: number | null;
  player_id: number;
  team_id: number;
  position_id: number | null;
  detailed_position_id: number | null;
  start: string | null;
  end: string | null;
  captain: boolean;
  jersey_number: number | null;
  team?: {
    id: number;
    name: string;
    short_code: string | null;
    image_path: string;
    type: string;
  };
}

// Position raw data
export interface SportmonksPositionRaw {
  id: number;
  name: string;
  code: string;
  developer_name: string;
  model_type: string;
  stat_group: string | null;
}

// Team fixture (for latest/upcoming)
export interface SportmonksTeamFixtureRaw {
  id: number;
  sport_id: number;
  league_id: number;
  season_id: number;
  stage_id: number | null;
  state_id: number;
  venue_id: number | null;
  name: string;
  starting_at: string;
  result_info: string | null;
  leg: string;
  has_odds: boolean;
  starting_at_timestamp: number;
}

// Player statistic (from include=statistics on player endpoint)
export interface SportmonksPlayerStatisticRaw {
  id: number;
  player_id: number;
  team_id: number;
  season_id: number;
  jersey_number: number | null;
  position_id: number | null;
  has_values: boolean;
  // Nested includes
  details?: Array<SportmonksPlayerStatisticDetailRaw>;
  season?: {
    id: number;
    name: string;
    league_id: number;
    league?: {
      id: number;
      name: string;
      image_path: string;
    };
  };
  team?: {
    id: number;
    name: string;
    image_path: string;
  };
}

// Player statistic detail (actual stats)
export interface SportmonksPlayerStatisticDetailRaw {
  id: number;
  player_statistic_id: number;
  type_id: number;
  value: {
    total?: number;
    home?: number;
    away?: number;
    goals?: number;
    assists?: number;
    penalties?: number;
    all?: number;
    average?: string;
    [key: string]: unknown;
  };
}

// Transfer (from include=transfers on player endpoint)
export interface SportmonksTransferRaw {
  id: number;
  sport_id: number;
  player_id: number;
  type_id: number;
  from_team_id: number;
  to_team_id: number;
  position_id: number | null;
  detailed_position_id: number | null;
  date: string;
  career_ended: boolean;
  completed: boolean;
  amount: number | null;
  // Nested includes (API returns lowercase property names)
  fromteam?: {
    id: number;
    name: string;
    image_path: string;
  };
  toteam?: {
    id: number;
    name: string;
    image_path: string;
  };
  type?: {
    id: number;
    name: string;
    code: string;
    developer_name: string;
  };
}

// Trophy (from include=trophies on player endpoint)
export interface SportmonksParticipantTrophyRaw {
  id: number;
  participant_id: number;
  team_id: number | null;
  league_id: number;
  season_id: number;
  trophy_id: number;
  // Nested includes
  trophy?: {
    id: number;
    sport_id: number;
    position: number;
    name: string;
  };
  league?: {
    id: number;
    name: string;
    image_path: string;
  };
  season?: {
    id: number;
    name: string;
  };
}
