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
}

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
