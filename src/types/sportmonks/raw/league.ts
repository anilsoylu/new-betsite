/**
 * League & Season Sportmonks Raw Types
 * League, Season, Country
 */

// Country/nation data
export interface SportmonksCountryRaw {
  id: number;
  continent_id: number;
  name: string;
  official_name: string | null;
  fifa_name: string | null;
  iso2: string | null;
  iso3: string | null;
  latitude: string | null;
  longitude: string | null;
  borders: Array<string> | null;
  image_path: string;
}

// Season information
export interface SportmonksSeasonRaw {
  id: number;
  sport_id: number;
  league_id: number;
  tie_breaker_rule_id: number | null;
  name: string;
  finished: boolean;
  pending: boolean;
  is_current: boolean;
  starting_at: string | null;
  ending_at: string | null;
  standings_recalculated_at: string | null;
  games_in_current_week: boolean;
}

// League/competition data
export interface SportmonksLeagueRaw {
  id: number;
  sport_id: number;
  country_id: number;
  name: string;
  active: boolean;
  short_code: string | null;
  image_path: string;
  type: string;
  sub_type: string;
  last_played_at: string | null;
  category: number;
  has_jerseys: boolean;

  // Included relations
  country?: SportmonksCountryRaw;
}

// League with current season included
export interface SportmonksLeagueWithCurrentSeasonRaw extends SportmonksLeagueRaw {
  currentSeason?: SportmonksSeasonRaw;
  current_season?: SportmonksSeasonRaw; // API may return snake_case
  currentseason?: SportmonksSeasonRaw; // API returns lowercase
}
