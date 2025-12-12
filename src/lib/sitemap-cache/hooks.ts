/**
 * Fire-and-Forget Cache Hooks
 *
 * These functions provide a convenient way to cache domain objects.
 * They extract the necessary fields and call the appropriate upsert function.
 * Errors are caught and logged to prevent cache failures from affecting page rendering.
 */

import type {
  Fixture,
  FixtureDetail,
  League,
  PlayerDetail,
  Coach,
  CoachDetail,
  SquadPlayer,
  TeamDetail,
  TeamSearchResult,
} from "@/types/football";
import {
  upsertLeague,
  upsertMatch,
  upsertPlayer,
  upsertCoach,
  upsertTeam,
} from "./upsert";

/**
 * Cache a league from domain object.
 * Safe to call - errors are logged but don't throw.
 */
export function cacheLeague(league: League): void {
  try {
    upsertLeague({
      id: league.id,
      name: league.name,
      country: league.country?.name ?? null,
      logo: league.logo,
    });
  } catch (error) {
    console.warn("[SitemapCache] Failed to cache league:", league.id, error);
  }
}

/**
 * Cache a team from TeamDetail domain object.
 * Safe to call - errors are logged but don't throw.
 */
export function cacheTeamDetail(team: TeamDetail): void {
  try {
    upsertTeam({
      id: team.id,
      name: team.name,
      country: team.country?.name ?? null,
      logo: team.logo,
    });

    // Also cache all squad players
    if (team.squad && team.squad.length > 0) {
      for (const player of team.squad) {
        cacheSquadPlayer(player, team.id);
      }
    }
    // Also cache coach if available
    if (team.coach) {
      cacheCoachDetail(team.coach, team.id);
    }
  } catch (error) {
    console.warn("[SitemapCache] Failed to cache team detail:", team.id, error);
  }
}

/**
 * Cache a team from TeamSearchResult.
 * Safe to call - errors are logged but don't throw.
 */
export function cacheTeamSearchResult(team: TeamSearchResult): void {
  try {
    upsertTeam({
      id: team.id,
      name: team.name,
      country: team.country?.name ?? null,
      logo: team.logo,
    });
  } catch (error) {
    console.warn(
      "[SitemapCache] Failed to cache team search result:",
      team.id,
      error,
    );
  }
}

/**
 * Cache a team from fixture participant.
 * Simplified version that only has basic team info.
 */
export function cacheTeamFromFixture(team: {
  id: number;
  name: string;
  logo: string;
}): void {
  try {
    upsertTeam({
      id: team.id,
      name: team.name,
      logo: team.logo,
    });
  } catch (error) {
    console.warn(
      "[SitemapCache] Failed to cache team from fixture:",
      team.id,
      error,
    );
  }
}

/**
 * Cache a squad player.
 * Safe to call - errors are logged but don't throw.
 */
export function cacheSquadPlayer(player: SquadPlayer, teamId?: number): void {
  try {
    upsertPlayer({
      id: player.playerId,
      name: player.displayName || player.name,
      teamId: teamId ?? null,
      position: player.position ?? null,
    });
  } catch (error) {
    console.warn(
      "[SitemapCache] Failed to cache squad player:",
      player.playerId,
      error,
    );
  }
}

/**
 * Cache a player from PlayerDetail domain object.
 * Safe to call - errors are logged but don't throw.
 */
export function cachePlayerDetail(player: PlayerDetail): void {
  try {
    upsertPlayer({
      id: player.id,
      name: player.displayName || player.name,
      teamId: player.currentTeam?.teamId ?? null,
      country: player.country?.name ?? null,
      position: player.position ?? null,
    });
  } catch (error) {
    console.warn(
      "[SitemapCache] Failed to cache player detail:",
      player.id,
      error,
    );
  }
}

/**
 * Cache a coach from CoachDetail domain object.
 * Safe to call - errors are logged but don't throw.
 */
export function cacheCoachDetail(
  coach: Coach | CoachDetail,
  teamId?: number,
): void {
  try {
    let derivedTeamId = teamId;
    let countryName: string | null = null;

    if ("currentTeam" in coach && coach.currentTeam) {
      derivedTeamId = derivedTeamId ?? coach.currentTeam.teamId;
    }

    if ("country" in coach && coach.country) {
      countryName = coach.country.name;
    }

    upsertCoach({
      id: coach.id,
      name: coach.displayName || coach.name,
      teamId: derivedTeamId ?? null,
      country: countryName,
    });
  } catch (error) {
    console.warn(
      "[SitemapCache] Failed to cache coach detail:",
      coach.id,
      error,
    );
  }
}

/**
 * Cache a fixture/match from domain object.
 * Also caches both participating teams.
 * Safe to call - errors are logged but don't throw.
 */
export function cacheFixture(fixture: Fixture | FixtureDetail): void {
  try {
    upsertMatch({
      id: fixture.id,
      homeTeamName: fixture.homeTeam.name,
      awayTeamName: fixture.awayTeam.name,
      kickoffAt: fixture.startTime,
      leagueId: fixture.leagueId,
      leagueName: fixture.league?.name ?? null,
    });

    // Also cache both teams
    cacheTeamFromFixture(fixture.homeTeam);
    cacheTeamFromFixture(fixture.awayTeam);
  } catch (error) {
    console.warn("[SitemapCache] Failed to cache fixture:", fixture.id, error);
  }
}

/**
 * Cache multiple fixtures.
 * Safe to call - individual failures don't affect other fixtures.
 */
export function cacheFixtures(fixtures: Fixture[]): void {
  for (const fixture of fixtures) {
    cacheFixture(fixture);
  }
}

/**
 * Cache multiple leagues.
 * Safe to call - individual failures don't affect other leagues.
 */
export function cacheLeagues(leagues: League[]): void {
  for (const league of leagues) {
    cacheLeague(league);
  }
}
