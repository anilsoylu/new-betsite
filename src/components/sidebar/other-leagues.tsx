import { getAllLeaguesFull } from "@/lib/api/cached-football-api";
import { OtherLeaguesClient } from "./other-leagues-client";

// Top leagues IDs - excluded from "Other Leagues"
const TOP_LEAGUE_IDS = new Set([
  8, 564, 82, 384, 301, 600, 72, 462, 2, 5, 2286,
]);

interface OtherLeaguesProps {
  className?: string;
}

export async function OtherLeagues({ className }: OtherLeaguesProps) {
  // Fetch all leagues from API
  const allLeagues = await getAllLeaguesFull();

  // Get all leagues except top leagues
  const otherLeagues = allLeagues
    .filter((league) => !TOP_LEAGUE_IDS.has(league.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Group by country
  const leaguesByCountry = new Map<string, typeof otherLeagues>();

  for (const league of otherLeagues) {
    const countryName = league.country?.name || "International";
    const countryFlag = league.country?.flag || "";
    const key = `${countryName}|||${countryFlag}`;

    if (!leaguesByCountry.has(key)) {
      leaguesByCountry.set(key, []);
    }
    leaguesByCountry.get(key)!.push(league);
  }

  // Convert to array and sort by country name
  const groupedLeagues = Array.from(leaguesByCountry.entries())
    .map(([key, leagues]) => {
      const [countryName, countryFlag] = key.split("|||");
      return { countryName, countryFlag, leagues };
    })
    .sort((a, b) => a.countryName.localeCompare(b.countryName));

  if (groupedLeagues.length === 0) {
    return null;
  }

  return (
    <OtherLeaguesClient
      groupedLeagues={groupedLeagues}
      totalCount={otherLeagues.length}
      className={className}
    />
  );
}
