/**
 * Popular teams for quick lineup pre-fill
 * Team IDs verified from Sportmonks API
 */

export interface PopularTeam {
  id: number;
  name: string;
  country: string;
}

/**
 * Curated list of popular teams for Build XI pre-fill
 * Users can quickly select these without searching
 */
export const POPULAR_TEAMS: PopularTeam[] = [
  // Spain
  { id: 3468, name: "Real Madrid", country: "Spain" },
  { id: 83, name: "FC Barcelona", country: "Spain" },

  // England
  { id: 14, name: "Manchester United", country: "England" },
  { id: 8, name: "Liverpool", country: "England" },
  { id: 19, name: "Arsenal", country: "England" },
  { id: 18, name: "Chelsea", country: "England" },
  { id: 9, name: "Manchester City", country: "England" },
  { id: 6, name: "Tottenham", country: "England" },
  { id: 20, name: "Newcastle United", country: "England" },

  // Germany
  { id: 503, name: "Bayern Munich", country: "Germany" },

  // Italy
  { id: 113, name: "AC Milan", country: "Italy" },
  { id: 2930, name: "Inter Milan", country: "Italy" },
  { id: 625, name: "Juventus", country: "Italy" },

  // Turkey
  { id: 34, name: "Galatasaray", country: "Turkey" },
];

/**
 * Get team logo URL from Sportmonks CDN
 * Pattern: https://cdn.sportmonks.com/images/soccer/teams/{id % 32}/{id}.png
 */
export function getTeamLogoUrl(teamId: number): string {
  return `https://cdn.sportmonks.com/images/soccer/teams/${teamId % 32}/${teamId}.png`;
}
