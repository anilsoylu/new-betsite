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
