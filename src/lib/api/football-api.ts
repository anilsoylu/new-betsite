import { z } from "zod";
import { sportmonksRequest, sportmonksPaginatedRequest } from "./sportmonks-client";
import {
  mapFixture,
  mapFixtureDetail,
  mapLeague,
  mapLeagueWithCurrentSeason,
  mapStandingTable,
  mapH2HFixture,
  mapMatchOdds,
} from "./sportmonks-mappers";
import type {
  SportmonksFixtureRaw,
  SportmonksLeagueRaw,
  SportmonksLeagueWithCurrentSeasonRaw,
  SportmonksStandingGroupRaw,
  SportmonksOddRaw,
} from "@/types/sportmonks/raw";
import type { Fixture, FixtureDetail, League, StandingTable, H2HFixture, MatchOdds } from "@/types/football";
import { API, UI } from "@/lib/constants";

// Validation schemas
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format");
const idSchema = z.number().int().positive();

// Default includes for fixtures
const FIXTURE_INCLUDES = ["participants", "scores", "state", "league"];
const FIXTURE_DETAIL_INCLUDES = [
  "participants",
  "scores",
  "state",
  "league",
  "venue",
  "events",
  "statistics",
  "statistics.type",
  "lineups",
  "lineups.player",
  "periods",
  "formations",
];

// H2H includes
const H2H_INCLUDES = ["participants", "scores", "state", "league"];

/**
 * Get live (in-play) fixtures
 * Endpoint: GET /livescores/inplay
 * Note: This endpoint does not support pagination
 */
export async function getLiveFixtures(): Promise<Array<Fixture>> {
  const response = await sportmonksRequest<Array<SportmonksFixtureRaw>>({
    endpoint: "/livescores/inplay",
    include: FIXTURE_INCLUDES,
  });

  const fixtures = response.data.map(mapFixture);
  return fixtures.slice(0, UI.fixtures.maxLiveFixtures);
}

/**
 * Get fixtures by date (max fixtures for homepage)
 * Endpoint: GET /fixtures/date/{date}
 */
export async function getFixturesByDate(date?: string): Promise<Array<Fixture>> {
  const targetDate = date || new Date().toISOString().split("T")[0];
  dateSchema.parse(targetDate);

  const allFixtures: Array<Fixture> = [];
  let currentPage = 1;
  let hasMore = true;
  const maxFixtures = UI.fixtures.maxHomePageFixtures;

  while (hasMore && allFixtures.length < maxFixtures) {
    const response = await sportmonksPaginatedRequest<SportmonksFixtureRaw>({
      endpoint: `/fixtures/date/${targetDate}`,
      include: FIXTURE_INCLUDES,
      page: currentPage,
      perPage: API.sportmonks.defaultPerPage,
    });

    allFixtures.push(...response.data.map(mapFixture));
    hasMore = response.pagination.has_more;
    currentPage++;
  }

  return allFixtures.slice(0, maxFixtures);
}

/**
 * Get single fixture by ID with full details
 * Endpoint: GET /fixtures/{id}
 */
export async function getFixtureById(fixtureId: number): Promise<FixtureDetail> {
  idSchema.parse(fixtureId);

  const response = await sportmonksRequest<SportmonksFixtureRaw>({
    endpoint: `/fixtures/${fixtureId}`,
    include: FIXTURE_DETAIL_INCLUDES,
  });

  return mapFixtureDetail(response.data);
}

/**
 * Get head-to-head fixtures between two teams
 * Endpoint: GET /fixtures/head-to-head/{homeId}/{awayId}
 */
export async function getHeadToHead(homeId: number, awayId: number): Promise<Array<H2HFixture>> {
  idSchema.parse(homeId);
  idSchema.parse(awayId);

  try {
    const response = await sportmonksPaginatedRequest<SportmonksFixtureRaw>({
      endpoint: `/fixtures/head-to-head/${homeId}/${awayId}`,
      include: H2H_INCLUDES,
      perPage: 10,
    });

    return response.data.map(mapH2HFixture);
  } catch {
    return [];
  }
}

/**
 * Get pre-match odds for a fixture
 * Endpoint: GET /odds/pre-match/fixtures/{fixtureId}
 */
export async function getOddsByFixture(fixtureId: number): Promise<MatchOdds | null> {
  idSchema.parse(fixtureId);

  try {
    const response = await sportmonksPaginatedRequest<SportmonksOddRaw>({
      endpoint: `/odds/pre-match/fixtures/${fixtureId}`,
      include: ["bookmaker"],
      perPage: 50,
    });

    return mapMatchOdds(response.data);
  } catch {
    return null;
  }
}

/**
 * Get standings by season
 * Endpoint: GET /standings/seasons/{seasonId}
 */
export async function getStandingsBySeason(seasonId: number): Promise<Array<StandingTable>> {
  idSchema.parse(seasonId);

  const response = await sportmonksRequest<Array<SportmonksStandingGroupRaw>>({
    endpoint: `/standings/seasons/${seasonId}`,
    include: ["participant", "details"],
  });

  return response.data.map(mapStandingTable);
}

/**
 * Get all leagues (paginated)
 * Endpoint: GET /leagues
 */
export async function getAllLeagues(page = 1): Promise<{
  leagues: Array<League>;
  hasMore: boolean;
  totalCount: number;
}> {
  const response = await sportmonksPaginatedRequest<SportmonksLeagueRaw>({
    endpoint: "/leagues",
    include: ["country"],
    page,
    perPage: API.sportmonks.defaultPerPage,
  });

  return {
    leagues: response.data.map(mapLeague),
    hasMore: response.pagination.has_more,
    totalCount: response.pagination.count,
  };
}

/**
 * Get single league by ID with current season
 * Endpoint: GET /leagues/{leagueId}
 */
export async function getLeagueById(leagueId: number): Promise<League> {
  idSchema.parse(leagueId);

  const response = await sportmonksRequest<SportmonksLeagueWithCurrentSeasonRaw>({
    endpoint: `/leagues/${leagueId}`,
    include: ["country", "currentSeason"],
  });

  return mapLeagueWithCurrentSeason(response.data);
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}
