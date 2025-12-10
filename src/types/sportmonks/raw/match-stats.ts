/**
 * Match Statistics Sportmonks Raw Types
 * Standing
 */

// Standing detail entry
export interface SportmonksStandingDetailRaw {
  id: number;
  standing_id: number;
  type_id: number;
  value: number;

  // Included relation
  type?: {
    id: number;
    name: string;
    code: string;
    developer_name: string;
    model_type: string;
    stat_group: string | null;
  };
}

// League standing entry
export interface SportmonksStandingRaw {
  id: number;
  participant_id: number;
  sport_id: number;
  league_id: number;
  season_id: number;
  stage_id: number | null;
  group_id: number | null;
  round_id: number | null;
  standing_rule_id: number | null;
  position: number;
  result: string | null;
  points: number;

  // Included relations
  participant?: {
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
  };
  details?: Array<SportmonksStandingDetailRaw>;
  form?: Array<{
    fixture_id: number;
    form: string;
  }>;
  rule?: {
    id: number;
    model_type: string;
    model_id: number;
    type_id: number | null;
    position: number;
  };
  league?: {
    id: number;
    sport_id: number;
    country_id: number;
    name: string;
    active: boolean;
    short_code: string | null;
    image_path: string;
    type: string;
    sub_type: string;
    category: number;
    has_jerseys: boolean;
  };
  group?: {
    id: number;
    sport_id: number;
    league_id: number;
    season_id: number;
    stage_id: number;
    name: string;
  };
}

// Standing response wrapper (grouped by stage/round)
export interface SportmonksStandingGroupRaw {
  id: number;
  name: string | null;
  league_id: number;
  season_id: number;
  stage_id: number | null;
  round_id: number | null;
  sport_id: number;
  resource: string;
  standings: Array<SportmonksStandingRaw>;
}

// Top scorer entry from API
export interface SportmonksTopScorerRaw {
  id: number;
  season_id: number;
  player_id: number;
  type_id: number; // 208 = goals, 209 = assists, 210 = yellow cards, 211 = red cards
  position: number;
  total: number;
  participant_id: number;

  // Included relations
  player?: {
    id: number;
    sport_id: number;
    country_id: number;
    nationality_id: number | null;
    city_id: number | null;
    position_id: number | null;
    detailed_position_id: number | null;
    common_name: string;
    display_name: string;
    name: string;
    firstname: string;
    lastname: string;
    date_of_birth: string | null;
    gender: string;
    height: number | null;
    weight: number | null;
    image_path: string;
  };
  participant?: {
    id: number;
    name: string;
    short_code: string | null;
    image_path: string;
  };
  type?: {
    id: number;
    name: string;
    code: string;
    developer_name: string;
  };
}
