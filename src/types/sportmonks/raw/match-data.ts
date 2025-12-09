/**
 * Match Data Sportmonks Raw Types
 * Venue, Event, Statistic, Lineup, Period, Referee
 */

// Referee pivot (fixture-referee relation)
export interface SportmonksRefereePivotRaw {
  id: number;
  fixture_id: number;
  referee_id: number;
  type_id: number; // 1 = Main referee, 6 = Fourth official, etc.

  // Nested referee data when using "referees.referee" include
  referee?: SportmonksRefereeDetailRaw;
}

// Referee detail information
export interface SportmonksRefereeDetailRaw {
  id: number;
  sport_id: number;
  country_id: number | null;
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

// Alias for backward compatibility
export type SportmonksRefereeRaw = SportmonksRefereePivotRaw;

// Stadium/venue information
export interface SportmonksVenueRaw {
  id: number;
  country_id: number;
  city_id: number | null;
  name: string;
  address: string | null;
  zipcode: string | null;
  latitude: string | null;
  longitude: string | null;
  capacity: number | null;
  image_path: string | null;
  city_name: string | null;
  surface: string | null;
  national_team: boolean;
}

// Match event (goals, cards, substitutions)
export interface SportmonksEventRaw {
  id: number;
  fixture_id: number;
  period_id: number | null;
  participant_id: number;
  type_id: number;
  section: string;
  player_id: number | null;
  related_player_id: number | null;
  player_name: string;
  related_player_name: string | null;
  result: string | null;
  info: string | null;
  addition: string | null;
  minute: number;
  extra_minute: number | null;
  injured: boolean | null;
  on_bench: boolean;
  coach_id: number | null;
  sub_type_id: number | null;
}

// Match statistics entry
export interface SportmonksStatisticRaw {
  id: number;
  fixture_id: number;
  type_id: number;
  participant_id: number;
  data: {
    value: number | string | null;
  };
  location: "home" | "away";

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

// Team lineup entry
export interface SportmonksLineupRaw {
  id: number;
  sport_id: number;
  fixture_id: number;
  player_id: number;
  team_id: number;
  position_id: number | null;
  formation_field: string | null;
  type_id: number;
  formation_position: number | null;
  player_name: string;
  jersey_number: number;

  // Included relation
  player?: {
    id: number;
    sport_id: number;
    country_id: number;
    nationality_id: number;
    city_id: number | null;
    position_id: number | null;
    detailed_position_id: number | null;
    type_id: number;
    common_name: string;
    firstname: string;
    lastname: string;
    name: string;
    display_name: string;
    image_path: string;
    height: number | null;
    weight: number | null;
    date_of_birth: string | null;
    gender: string;
  };
}

// Period/half information
export interface SportmunksPeriodRaw {
  id: number;
  fixture_id: number;
  type_id: number;
  started: number | null;
  ended: number | null;
  counts_from: number;
  ticking: boolean;
  sort_order: number;
  description: string;
  time_added: number | null;
  period_length: number | null;
  minutes: string | null;
  seconds: string | null;

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
