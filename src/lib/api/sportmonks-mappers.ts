import type {
  SportmonksFixtureRaw,
  SportmonksParticipantRaw,
  SportmonksLeagueRaw,
  SportmonksLeagueWithCurrentSeasonRaw,
  SportmonksSeasonRaw,
  SportmonksCountryRaw,
  SportmonksVenueRaw,
  SportmonksStandingRaw,
  SportmonksStandingGroupRaw,
  SportmonksEventRaw,
  SportmonksStatisticRaw,
  SportmonksLineupRaw,
  SportmonksOddRaw,
  SportmonksTeamRaw,
  SportmonksSquadPlayerRaw,
  SportmonksPlayerRaw,
  SportmonksPlayerTeamRaw,
  SportmonksTopScorerRaw,
  SportmonksPlayerStatisticRaw,
  SportmonksTransferRaw,
  SportmonksParticipantTrophyRaw,
  SportmonksPlayerFixtureRaw,
  SportmonksCoachDetailRaw,
  SportmonksCoachTeamRelationRaw,
  SportmonksCoachRaw,
} from "@/types/sportmonks/raw";
import type {
  Fixture,
  Team,
  Score,
  League,
  Season,
  Country,
  Venue,
  Standing,
  StandingTable,
  MatchStatus,
  MatchEvent,
  MatchStatistic,
  LineupPlayer,
  TeamLineup,
  MatchOdds,
  OddValue,
  H2HFixture,
  FixtureDetail,
  TeamDetail,
  TeamSearchResult,
  SquadPlayer,
  Coach,
  CoachDetail,
  CoachTeam,
  CoachTrophy,
  CoachSearchResult,
  PlayerDetail,
  PlayerTeam,
  PlayerSearchResult,
  TopScorer,
  PlayerSeasonStats,
  PlayerTransfer,
  PlayerTrophy,
  PlayerMatch,
  TeamTransfer,
  TeamTrophy,
} from "@/types/football";

// Map state developer_name to MatchStatus
function mapMatchStatus(developerName: string | undefined): MatchStatus {
  if (!developerName) return "unknown";

  const statusMap: Record<string, MatchStatus> = {
    NS: "scheduled",
    LIVE: "live",
    "1ST_HALF": "live",
    "2ND_HALF": "live",
    INPLAY: "live",
    INPLAY_1ST_HALF: "live",
    INPLAY_2ND_HALF: "live",
    ET: "live",
    EXTRA_TIME: "live",
    PEN_LIVE: "live",
    PENALTIES: "live",
    HT: "halftime",
    HALF_TIME: "halftime",
    BREAK: "halftime",
    FT: "finished",
    FULL_TIME: "finished",
    AET: "finished",
    AFTER_EXTRA_TIME: "finished",
    FT_PEN: "finished",
    AFTER_PENALTIES: "finished",
    POSTP: "postponed",
    POSTPONED: "postponed",
    CANC: "cancelled",
    CANCELLED: "cancelled",
    SUSP: "suspended",
    SUSPENDED: "suspended",
    INT: "suspended",
    INTERRUPTED: "suspended",
    ABAN: "cancelled",
    ABANDONED: "cancelled",
    AWARDED: "finished",
    WO: "finished",
    WALKOVER: "finished",
    TBA: "scheduled",
    TO_BE_ANNOUNCED: "scheduled",
  };

  return statusMap[developerName] || "unknown";
}

// Check if match is live
function isMatchLive(developerName: string | undefined): boolean {
  if (!developerName) return false;

  const liveStatuses = [
    "LIVE",
    "1ST_HALF",
    "2ND_HALF",
    "INPLAY",
    "INPLAY_1ST_HALF",
    "INPLAY_2ND_HALF",
    "ET",
    "EXTRA_TIME",
    "PEN_LIVE",
    "PENALTIES",
    "HT",
    "HALF_TIME",
    "BREAK",
  ];
  return liveStatuses.includes(developerName);
}

// Map participant to Team
export function mapTeam(participant: SportmonksParticipantRaw): Team {
  return {
    id: participant.id,
    name: participant.name,
    shortCode: participant.short_code,
    logo: participant.image_path,
    isHome: participant.meta.location === "home",
    isWinner: participant.meta.winner,
  };
}

// Map country
export function mapCountry(raw: SportmonksCountryRaw): Country {
  return {
    id: raw.id,
    name: raw.name,
    iso2: raw.iso2,
    flag: raw.image_path,
  };
}

// Map venue
export function mapVenue(raw: SportmonksVenueRaw): Venue {
  return {
    id: raw.id,
    name: raw.name,
    city: raw.city_name,
    capacity: raw.capacity,
    image: raw.image_path,
  };
}

// Map season
export function mapSeason(raw: SportmonksSeasonRaw): Season {
  return {
    id: raw.id,
    name: raw.name,
    leagueId: raw.league_id,
    isCurrent: raw.is_current,
    isFinished: raw.finished,
    startDate: raw.starting_at,
    endDate: raw.ending_at,
  };
}

// Map league
export function mapLeague(raw: SportmonksLeagueRaw): League {
  return {
    id: raw.id,
    name: raw.name,
    shortCode: raw.short_code,
    logo: raw.image_path,
    countryId: raw.country_id,
    country: raw.country ? mapCountry(raw.country) : null,
    type: raw.type,
    currentSeasonId: null,
    category: (raw.category as League["category"]) || 5, // Default to lowest priority if not specified
  };
}

// Map league with current season
export function mapLeagueWithCurrentSeason(
  raw: SportmonksLeagueWithCurrentSeasonRaw,
): League {
  // Handle null/undefined raw data
  if (!raw) {
    throw new Error("League data is null or undefined");
  }

  // Handle both camelCase and snake_case from API (API returns "currentseason" lowercase)
  const currentSeason =
    raw.currentSeason ?? raw.current_season ?? raw.currentseason;

  return {
    id: raw.id,
    name: raw.name,
    shortCode: raw.short_code,
    logo: raw.image_path,
    countryId: raw.country_id,
    country: raw.country ? mapCountry(raw.country) : null,
    type: raw.type,
    currentSeasonId: currentSeason?.id ?? null,
    category: (raw.category as League["category"]) || 5,
  };
}

// Extract scores from fixture
// Score type_ids:
// - 1 = 1ST_HALF (halftime score)
// - 2 = 2ND_HALF (full time score)
// - 1525 = CURRENT (live score during match)
// - 48996 = 2ND_HALF_ONLY (goals in 2nd half only)
function extractScore(raw: SportmonksFixtureRaw): Score | null {
  if (!raw.scores || raw.scores.length === 0) return null;

  let homeScore = 0;
  let awayScore = 0;
  let halftimeHome: number | null = null;
  let halftimeAway: number | null = null;

  for (const score of raw.scores) {
    // Full time score (type_id: 2 = 2ND_HALF means final score)
    if (score.type_id === 2) {
      if (score.score.participant === "home") {
        homeScore = score.score.goals;
      } else {
        awayScore = score.score.goals;
      }
    }
    // Halftime score (type_id: 1 = 1ST_HALF)
    if (score.type_id === 1) {
      if (score.score.participant === "home") {
        halftimeHome = score.score.goals;
      } else {
        halftimeAway = score.score.goals;
      }
    }
    // Current/Live score (type_id: 1525) - use if no final score yet
    if (score.type_id === 1525 && homeScore === 0 && awayScore === 0) {
      if (score.score.participant === "home") {
        homeScore = score.score.goals;
      } else {
        awayScore = score.score.goals;
      }
    }
  }

  return {
    home: homeScore,
    away: awayScore,
    halftimeHome,
    halftimeAway,
  };
}

// Get current minute from fixture state or periods
function getCurrentMinute(raw: SportmonksFixtureRaw): number | null {
  // Check periods for current minute
  if (raw.periods) {
    const activePeriod = raw.periods.find((p) => p.ticking);
    if (activePeriod && activePeriod.minutes) {
      return parseInt(activePeriod.minutes, 10);
    }
  }
  return null;
}

// Map fixture
export function mapFixture(raw: SportmonksFixtureRaw): Fixture {
  const participants = raw.participants || [];
  const homeParticipant = participants.find((p) => p.meta.location === "home");
  const awayParticipant = participants.find((p) => p.meta.location === "away");

  const developerName = raw.state?.developer_name;

  return {
    id: raw.id,
    leagueId: raw.league_id,
    seasonId: raw.season_id,
    startTime: raw.starting_at,
    timestamp: raw.starting_at_timestamp,
    status: mapMatchStatus(developerName),
    statusDetail: raw.state?.name || "",
    minute: getCurrentMinute(raw),
    homeTeam: homeParticipant
      ? mapTeam(homeParticipant)
      : {
          id: 0,
          name: "TBA",
          shortCode: null,
          logo: "",
          isHome: true,
          isWinner: null,
        },
    awayTeam: awayParticipant
      ? mapTeam(awayParticipant)
      : {
          id: 0,
          name: "TBA",
          shortCode: null,
          logo: "",
          isHome: false,
          isWinner: null,
        },
    score: extractScore(raw),
    league: raw.league ? mapLeague(raw.league) : null,
    venue: raw.venue ? mapVenue(raw.venue) : null,
    hasOdds: raw.has_odds,
    isLive: isMatchLive(developerName),
  };
}

// Map standing
export function mapStanding(raw: SportmonksStandingRaw): Standing {
  const details = raw.details || [];

  // Extract stats from details
  let played = 0;
  let won = 0;
  let drawn = 0;
  let lost = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;

  for (const detail of details) {
    // Type IDs: 129=played, 130=won, 131=draw, 132=lost, 133=goals_for, 134=goals_against
    switch (detail.type_id) {
      case 129:
        played = detail.value;
        break;
      case 130:
        won = detail.value;
        break;
      case 131:
        drawn = detail.value;
        break;
      case 132:
        lost = detail.value;
        break;
      case 133:
        goalsFor = detail.value;
        break;
      case 134:
        goalsAgainst = detail.value;
        break;
    }
  }

  // Extract form
  const form: Array<"W" | "D" | "L"> = [];
  if (raw.form) {
    for (const f of raw.form.slice(0, 5)) {
      if (f.form === "W" || f.form === "D" || f.form === "L") {
        form.push(f.form);
      }
    }
  }

  // Extract rule type ID (180=UCL, 181=UEL/UECL, 182=Relegation, etc.)
  const ruleTypeId =
    (raw.rule?.type_id as 180 | 181 | 182 | 183 | 184 | null) ?? null;

  return {
    position: raw.position,
    teamId: raw.participant_id,
    teamName: raw.participant?.name || "",
    teamLogo: raw.participant?.image_path || "",
    played,
    won,
    drawn,
    lost,
    goalsFor,
    goalsAgainst,
    goalDifference: goalsFor - goalsAgainst,
    points: raw.points,
    form,
    ruleTypeId,
    nextMatch: null, // Will be populated later with upcoming fixtures
  };
}

// Map flat array of standings to grouped tables
// API returns flat array, we group by league_id and group_id
export function mapStandingsToTables(
  rawStandings: SportmonksStandingRaw[],
  seasonId: number,
): StandingTable[] {
  if (!rawStandings || rawStandings.length === 0) return [];

  // Group standings by league_id + group_id combination
  // This handles Champions League groups (Group A, B, etc.)
  const groupKey = (s: SportmonksStandingRaw) =>
    `${s.league_id}-${s.group_id ?? "main"}`;
  const grouped = new Map<string, SportmonksStandingRaw[]>();

  for (const standing of rawStandings) {
    const key = groupKey(standing);
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(standing);
  }

  // Convert to StandingTable array
  const tables: StandingTable[] = [];

  for (const [, standings] of grouped) {
    // Sort by position
    standings.sort((a, b) => a.position - b.position);

    // Get league and group info from first standing (they all share the same)
    const first = standings[0];
    const leagueName = first.league?.name ?? null;
    const leagueLogo = first.league?.image_path ?? null;
    const groupName = first.group?.name ?? null;

    tables.push({
      id: first.league_id,
      name: groupName,
      leagueId: first.league_id,
      seasonId,
      leagueName,
      leagueLogo,
      groupName,
      standings: standings.map(mapStanding),
    });
  }

  return tables;
}

// Map event
export function mapEvent(raw: SportmonksEventRaw): MatchEvent {
  let type: MatchEvent["type"] = "other";
  let subType: MatchEvent["subType"] = null;

  // SportMonks Event Type IDs:
  // 14 = Goal, 15 = Own Goal, 16 = Penalty, 17 = Missed Penalty
  // 18 = Substitution, 19 = Yellowcard, 20 = Redcard, 21 = Yellowred (2nd yellow)
  // 10 = VAR, 27 = VAR review

  switch (raw.type_id) {
    case 14: // Goal
      type = "goal";
      break;
    case 15: // Own Goal
      type = "goal";
      subType = "ownGoal";
      break;
    case 16: // Penalty
      type = "goal";
      subType = "penalty";
      break;
    case 17: // Missed Penalty
      type = "goal";
      subType = "missedPenalty";
      break;
    case 18: // Substitution
      type = "substitution";
      break;
    case 19: // Yellow Card
      type = "card";
      subType = "yellow";
      break;
    case 20: // Red Card
      type = "card";
      subType = "red";
      break;
    case 21: // Second Yellow (Yellow-Red)
      type = "card";
      subType = "yellowred";
      break;
    case 10: // VAR
    case 27: // VAR review
      type = "var";
      break;
  }

  return {
    id: raw.id,
    type,
    subType,
    minute: raw.minute,
    extraMinute: raw.extra_minute,
    teamId: raw.participant_id,
    playerName: raw.player_name,
    relatedPlayerName: raw.related_player_name,
    result: raw.result,
    info: raw.info,
  };
}

// Map statistic
export function mapStatistic(
  homeStats: Array<SportmonksStatisticRaw>,
  awayStats: Array<SportmonksStatisticRaw>,
): Array<MatchStatistic> {
  const statsMap = new Map<
    number,
    { home: number | string | null; away: number | string | null; name: string }
  >();

  for (const stat of homeStats) {
    if (!statsMap.has(stat.type_id)) {
      statsMap.set(stat.type_id, {
        home: null,
        away: null,
        name: stat.type?.name || `Stat ${stat.type_id}`,
      });
    }
    const existing = statsMap.get(stat.type_id)!;
    existing.home = stat.data.value;
  }

  for (const stat of awayStats) {
    if (!statsMap.has(stat.type_id)) {
      statsMap.set(stat.type_id, {
        home: null,
        away: null,
        name: stat.type?.name || `Stat ${stat.type_id}`,
      });
    }
    const existing = statsMap.get(stat.type_id)!;
    existing.away = stat.data.value;
  }

  return Array.from(statsMap.values()).map((s) => ({
    type: s.name,
    home: s.home,
    away: s.away,
  }));
}

// Map lineup player
export function mapLineupPlayer(raw: SportmonksLineupRaw): LineupPlayer {
  // type_id: 11 = starting lineup, 12 = substitutes
  return {
    id: raw.id,
    playerId: raw.player_id,
    name: raw.player?.display_name || raw.player_name,
    position: raw.formation_field,
    jerseyNumber: raw.jersey_number,
    isStarter: raw.type_id === 11,
    image: raw.player?.image_path || null,
  };
}

// Map team lineup from lineup array
export function mapTeamLineup(
  lineups: Array<SportmonksLineupRaw>,
  teamId: number,
  formation: string | null,
): TeamLineup {
  const teamLineups = lineups.filter((l) => l.team_id === teamId);
  const starters = teamLineups
    .filter((l) => l.type_id === 11)
    .map(mapLineupPlayer);
  const substitutes = teamLineups
    .filter((l) => l.type_id === 12)
    .map(mapLineupPlayer);

  return {
    teamId,
    formation,
    starters,
    substitutes,
  };
}

// Map 1X2 odds from odds array
export function mapMatchOdds(odds: Array<SportmonksOddRaw>): MatchOdds | null {
  // Market ID 1 = 1X2 (Full Time Result)
  const matchOdds = odds.filter((o) => o.market_id === 1);

  if (matchOdds.length === 0) return null;

  let home: OddValue | null = null;
  let draw: OddValue | null = null;
  let away: OddValue | null = null;
  let bookmaker: string | null = null;
  let updatedAt: string | null = null;

  for (const odd of matchOdds) {
    const value = parseFloat(odd.value);
    const probability = odd.probability ? parseFloat(odd.probability) : null;

    if (!bookmaker && odd.bookmaker) {
      bookmaker = odd.bookmaker.name;
    }
    if (!updatedAt) {
      updatedAt = odd.updated_at;
    }

    // Labels: "1" = Home, "X" = Draw, "2" = Away
    if (odd.label === "1" || odd.label === "Home") {
      home = { label: "1", value, probability };
    } else if (odd.label === "X" || odd.label === "Draw") {
      draw = { label: "X", value, probability };
    } else if (odd.label === "2" || odd.label === "Away") {
      away = { label: "2", value, probability };
    }
  }

  return {
    home,
    draw,
    away,
    bookmaker,
    updatedAt,
  };
}

// Map H2H fixture
export function mapH2HFixture(raw: SportmonksFixtureRaw): H2HFixture {
  const participants = raw.participants || [];
  const homeParticipant = participants.find((p) => p.meta.location === "home");
  const awayParticipant = participants.find((p) => p.meta.location === "away");

  const score = extractScoreForH2H(raw);
  const winnerId = homeParticipant?.meta.winner
    ? homeParticipant.id
    : awayParticipant?.meta.winner
      ? awayParticipant.id
      : null;

  return {
    id: raw.id,
    date: raw.starting_at,
    homeTeam: {
      id: homeParticipant?.id || 0,
      name: homeParticipant?.name || "TBA",
      logo: homeParticipant?.image_path || "",
    },
    awayTeam: {
      id: awayParticipant?.id || 0,
      name: awayParticipant?.name || "TBA",
      logo: awayParticipant?.image_path || "",
    },
    homeScore: score.home,
    awayScore: score.away,
    winnerId,
    league: raw.league
      ? {
          id: raw.league.id,
          name: raw.league.name,
          logo: raw.league.image_path,
        }
      : null,
  };
}

// Extract score for H2H (simplified)
function extractScoreForH2H(raw: SportmonksFixtureRaw): {
  home: number;
  away: number;
} {
  if (!raw.scores || raw.scores.length === 0) return { home: 0, away: 0 };

  let homeScore = 0;
  let awayScore = 0;

  for (const score of raw.scores) {
    // Full time score (type_id: 2 = 2ND_HALF means final score)
    if (score.type_id === 2) {
      if (score.score.participant === "home") {
        homeScore = score.score.goals;
      } else {
        awayScore = score.score.goals;
      }
    }
    // Current/Live score fallback (type_id: 1525)
    if (score.type_id === 1525 && homeScore === 0 && awayScore === 0) {
      if (score.score.participant === "home") {
        homeScore = score.score.goals;
      } else {
        awayScore = score.score.goals;
      }
    }
  }

  return { home: homeScore, away: awayScore };
}

// Map fixture to fixture detail with events, stats, lineups
export function mapFixtureDetail(raw: SportmonksFixtureRaw): FixtureDetail {
  const base = mapFixture(raw);

  // Map events
  const events = (raw.events || []).map(mapEvent);

  // Map statistics
  const homeStats = (raw.statistics || []).filter((s) => s.location === "home");
  const awayStats = (raw.statistics || []).filter((s) => s.location === "away");
  const statistics = mapStatistic(homeStats, awayStats);

  // Map lineups
  const lineups = raw.lineups || [];

  // Extract formations from array (API returns array with location: "home" | "away")
  const formations = raw.formations || [];
  const homeFormation =
    formations.find((f) => f.location === "home")?.formation || null;
  const awayFormation =
    formations.find((f) => f.location === "away")?.formation || null;

  const homeLineup = lineups.some((l) => l.team_id === base.homeTeam.id)
    ? mapTeamLineup(lineups, base.homeTeam.id, homeFormation)
    : null;
  const awayLineup = lineups.some((l) => l.team_id === base.awayTeam.id)
    ? mapTeamLineup(lineups, base.awayTeam.id, awayFormation)
    : null;

  // Map referee - find main referee (type_id: 1) or first available
  const refereePivots = raw.referees || [];

  // Find main referee (type_id: 1) or fall back to first one with referee data
  const mainRefereePivot =
    refereePivots.find((r) => r.type_id === 1 && r.referee) ||
    refereePivots.find((r) => r.referee) ||
    refereePivots[0];

  const refereeData = mainRefereePivot?.referee;

  const referee = refereeData
    ? {
        id: refereeData.id,
        name:
          refereeData.display_name ||
          refereeData.common_name ||
          refereeData.name,
        image: refereeData.image_path,
      }
    : null;

  // Map coaches - coach data is directly on array items, not nested
  // Use meta.participant_id to match with team IDs
  const coachesData = raw.coaches || [];

  const homeCoachData = coachesData.find(
    (c) => c.meta?.participant_id === base.homeTeam.id,
  );
  const awayCoachData = coachesData.find(
    (c) => c.meta?.participant_id === base.awayTeam.id,
  );

  const homeCoach = homeCoachData
    ? {
        id: homeCoachData.id,
        name: homeCoachData.name,
        displayName:
          homeCoachData.display_name ||
          homeCoachData.common_name ||
          homeCoachData.name,
        image: homeCoachData.image_path,
        countryId: homeCoachData.country_id,
        dateOfBirth: homeCoachData.date_of_birth,
      }
    : null;

  const awayCoach = awayCoachData
    ? {
        id: awayCoachData.id,
        name: awayCoachData.name,
        displayName:
          awayCoachData.display_name ||
          awayCoachData.common_name ||
          awayCoachData.name,
        image: awayCoachData.image_path,
        countryId: awayCoachData.country_id,
        dateOfBirth: awayCoachData.date_of_birth,
      }
    : null;

  return {
    ...base,
    events,
    statistics,
    homeLineup,
    awayLineup,
    homeCoach,
    awayCoach,
    referee,
  };
}

// Map squad player
export function mapSquadPlayer(raw: SportmonksSquadPlayerRaw): SquadPlayer {
  const player = raw.player;
  const position = raw.position;

  return {
    id: raw.id,
    playerId: raw.player_id,
    name: player?.name || "",
    displayName: player?.display_name || player?.common_name || "",
    image: player?.image_path || null,
    position: position?.name || null,
    // Use stat_group if available, fallback to position name (Goalkeeper, Defender, Midfielder, Attacker)
    positionGroup: position?.stat_group || position?.name || null,
    jerseyNumber: raw.jersey_number,
    countryId: player?.country_id || null,
    dateOfBirth: player?.date_of_birth || null,
    isCaptain: raw.captain,
  };
}

// Map team search result
export function mapTeamSearchResult(raw: SportmonksTeamRaw): TeamSearchResult {
  return {
    id: raw.id,
    name: raw.name,
    shortCode: raw.short_code,
    logo: raw.image_path,
    country: raw.country ? mapCountry(raw.country) : null,
  };
}

// Map full team detail
export function mapTeamDetail(raw: SportmonksTeamRaw): TeamDetail {
  // Find active coach
  const activeCoachRelation = raw.coaches?.find((c) => c.active);
  let coach: Coach | null = null;

  if (activeCoachRelation?.coach) {
    const c = activeCoachRelation.coach;
    coach = {
      id: c.id,
      name: c.name,
      displayName: c.display_name || c.common_name,
      image: c.image_path,
      countryId: c.country_id,
      dateOfBirth: c.date_of_birth,
    };
  }

  // Map squad players
  const squad = (raw.players || []).map(mapSquadPlayer);

  // Map active seasons
  const activeSeasons = (raw.activeSeasons || []).map((s) => ({
    id: s.id,
    name: s.name,
    league: s.league
      ? {
          id: s.league.id,
          name: s.league.name,
          logo: s.league.image_path,
        }
      : null,
  }));

  // Map trophies
  const trophies: TeamTrophy[] = (raw.trophies || [])
    .filter((t) => t.trophy) // Only include trophies with trophy info
    .map((t) => ({
      id: t.id,
      trophyId: t.trophy_id,
      name: t.trophy?.name || "Trophy",
      position: t.trophy?.position || 1,
      leagueId: t.league_id,
      leagueName: t.league?.name || "Competition",
      leagueLogo: t.league?.image_path || null,
      seasonId: t.season_id,
      seasonName: t.season?.name || "",
    }))
    .sort((a, b) => {
      // Sort by season (newest first), then by position (winners first)
      if (a.seasonId !== b.seasonId) {
        return b.seasonId - a.seasonId;
      }
      return a.position - b.position;
    });

  return {
    id: raw.id,
    name: raw.name,
    shortCode: raw.short_code,
    logo: raw.image_path,
    founded: raw.founded,
    country: raw.country ? mapCountry(raw.country) : null,
    venue: raw.venue ? mapVenue(raw.venue) : null,
    coach,
    squad,
    activeSeasons,
    trophies,
  };
}

// Calculate age from date of birth
function calculateAge(dateOfBirth: string | null): number | null {
  if (!dateOfBirth) return null;
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

// Map player's team relation
export function mapPlayerTeam(raw: SportmonksPlayerTeamRaw): PlayerTeam {
  const team = raw.team;
  return {
    id: raw.id,
    teamId: raw.team_id,
    teamName: team?.name || "",
    teamLogo: team?.image_path || "",
    teamType: team?.type || "club",
    jerseyNumber: raw.jersey_number,
    isCaptain: raw.captain,
    startDate: raw.start,
    endDate: raw.end,
    isCurrent: raw.end === null,
  };
}

// Map player search result
export function mapPlayerSearchResult(
  raw: SportmonksPlayerRaw,
): PlayerSearchResult {
  return {
    id: raw.id,
    name: raw.name,
    displayName: raw.display_name,
    commonName: raw.common_name,
    image: raw.image_path,
    position: raw.position?.name || null,
    country: raw.country ? mapCountry(raw.country) : null,
  };
}

// Map player season statistics
function mapPlayerSeasonStats(
  raw: SportmonksPlayerStatisticRaw,
): PlayerSeasonStats {
  const details = raw.details || [];

  // Type IDs from SportMonks API v3
  // 321 = appearances, 119 = minutes played, 52 = goals, 79 = assists
  // 84 = yellow cards, 83 = red cards, 118 = rating, 214 = clean sheets
  // 99 = saves, 76 = penalties scored, 78 = penalties missed
  const findDetailValue = (typeId: number): number => {
    const detail = details.find((d) => d.type_id === typeId);
    return detail?.value?.total ?? detail?.value?.all ?? 0;
  };

  const findDetailRating = (): number | null => {
    const detail = details.find((d) => d.type_id === 118);
    if (!detail?.value?.average) return null;
    return parseFloat(detail.value.average);
  };

  return {
    seasonId: raw.season_id,
    seasonName: raw.season?.name || "",
    leagueId: raw.season?.league_id || null,
    leagueName: raw.season?.league?.name || null,
    leagueLogo: raw.season?.league?.image_path || null,
    teamId: raw.team_id,
    teamName: raw.team?.name || "",
    teamLogo: raw.team?.image_path || "",
    jerseyNumber: raw.jersey_number,
    // Core stats
    appearances: findDetailValue(321),
    minutesPlayed: findDetailValue(119),
    goals: findDetailValue(52),
    assists: findDetailValue(79),
    yellowCards: findDetailValue(84),
    redCards: findDetailValue(83),
    // Additional stats
    rating: findDetailRating(),
    cleanSheets: findDetailValue(214),
    saves: findDetailValue(99),
    penaltiesScored: findDetailValue(76),
    penaltiesMissed: findDetailValue(78),
  };
}

// Map player transfer
function mapPlayerTransfer(raw: SportmonksTransferRaw): PlayerTransfer {
  // Type IDs: 219 = loan, 220 = permanent/normal, etc.
  const typeMap: Record<number, PlayerTransfer["type"]> = {
    219: "loan",
    220: "permanent",
    221: "free",
    222: "end_of_loan",
  };

  return {
    id: raw.id,
    date: raw.date,
    type: typeMap[raw.type_id] || "unknown",
    fromTeamId: raw.from_team_id,
    fromTeamName: raw.fromteam?.name || "",
    fromTeamLogo: raw.fromteam?.image_path || "",
    toTeamId: raw.to_team_id,
    toTeamName: raw.toteam?.name || "",
    toTeamLogo: raw.toteam?.image_path || "",
    amount: raw.amount,
    completed: raw.completed,
  };
}

// Map player trophy
function mapPlayerTrophy(raw: SportmonksParticipantTrophyRaw): PlayerTrophy {
  return {
    id: raw.id,
    name: raw.trophy?.name || "Trophy",
    position: raw.trophy?.position || 1,
    leagueId: raw.league_id,
    leagueName: raw.league?.name || "",
    leagueLogo: raw.league?.image_path || "",
    seasonId: raw.season_id,
    seasonName: raw.season?.name || "",
  };
}

// Map player's recent match (raw is lineup data with nested fixture)
function mapPlayerMatch(raw: SportmonksPlayerFixtureRaw): PlayerMatch | null {
  // raw is actually lineup data, fixture is nested inside
  const fixture = raw.fixture;
  if (!fixture) return null;

  const participants = fixture.participants || [];
  const scores = fixture.scores || [];

  const homeParticipant = participants.find((p) => p.meta?.location === "home");
  const awayParticipant = participants.find((p) => p.meta?.location === "away");

  // Find CURRENT score (full time or current for live)
  const homeScoreObj = scores.find(
    (s) =>
      s.participant_id === homeParticipant?.id && s.description === "CURRENT",
  );
  const awayScoreObj = scores.find(
    (s) =>
      s.participant_id === awayParticipant?.id && s.description === "CURRENT",
  );

  // Parse match name if participants not available (format: "Team A vs Team B")
  let homeName = homeParticipant?.name || "";
  let awayName = awayParticipant?.name || "";
  if (!homeName && !awayName && fixture.name) {
    const parts = fixture.name.split(" vs ");
    if (parts.length === 2) {
      homeName = parts[0].trim();
      awayName = parts[1].trim();
    }
  }

  return {
    id: fixture.id,
    date: fixture.starting_at,
    leagueId: fixture.league_id,
    leagueName: fixture.league?.name || "",
    leagueLogo: fixture.league?.image_path || "",
    homeTeamId: homeParticipant?.id || 0,
    homeTeamName: homeName,
    homeTeamLogo: homeParticipant?.image_path || "",
    awayTeamId: awayParticipant?.id || 0,
    awayTeamName: awayName,
    awayTeamLogo: awayParticipant?.image_path || "",
    homeScore: homeScoreObj?.score?.goals ?? null,
    awayScore: awayScoreObj?.score?.goals ?? null,
    status: mapMatchStatus(fixture.state?.developer_name),
  };
}

// Extract preferred foot from metadata (type_id 229)
function extractPreferredFoot(
  metadata: SportmonksPlayerRaw["metadata"],
): PlayerDetail["preferredFoot"] {
  if (!metadata) return null;
  const footMeta = metadata.find((m) => m.type_id === 229);
  if (!footMeta) return null;
  const value = String(footMeta.values).toLowerCase();
  if (value === "left") return "left";
  if (value === "right") return "right";
  if (value === "both") return "both";
  return null;
}

// Map full player detail
export function mapPlayerDetail(raw: SportmonksPlayerRaw): PlayerDetail {
  // Map teams
  const teams = (raw.teams || []).map(mapPlayerTeam);

  // Find current team (no end date)
  let currentTeam = teams.find((t) => t.isCurrent) || null;

  // Map extended data
  const seasonStats = (raw.statistics || [])
    .filter((s) => s.has_values !== false)
    .map(mapPlayerSeasonStats)
    .sort((a, b) => b.seasonId - a.seasonId); // Most recent first

  // Enrich currentTeam with jersey_number from latest statistics
  // (teams endpoint doesn't include jersey_number, but statistics does)

  // If no current team found (all have end dates), use the most recent from stats
  if (!currentTeam && seasonStats.length > 0) {
    const mostRecentTeamId = seasonStats[0].teamId;
    currentTeam = teams.find((t) => t.teamId === mostRecentTeamId) || null;
  }

  // Always try to enrich jersey number from stats (teams endpoint doesn't include it)
  if (currentTeam && seasonStats.length > 0) {
    const latestStatForTeam = seasonStats.find(
      (s) => s.teamId === currentTeam!.teamId,
    );
    if (latestStatForTeam?.jerseyNumber) {
      currentTeam = {
        ...currentTeam,
        jerseyNumber: latestStatForTeam.jerseyNumber,
      };
    }
  }

  const transfers = (raw.transfers || [])
    .map(mapPlayerTransfer)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const trophies = (raw.trophies || [])
    .map(mapPlayerTrophy)
    .sort((a, b) => b.seasonId - a.seasonId);

  const recentMatches = (raw.latest || [])
    .filter((lineup) => lineup.fixture?.starting_at) // Filter out lineups without fixture data
    .map(mapPlayerMatch)
    .filter((m): m is PlayerMatch => m !== null && !!m.date) // Filter nulls and ensure date exists
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (isNaN(dateA) || isNaN(dateB)) return 0;
      return dateB - dateA;
    })
    .slice(0, 10); // Last 10 matches

  return {
    id: raw.id,
    name: raw.name,
    displayName: raw.display_name,
    commonName: raw.common_name,
    firstName: raw.firstname,
    lastName: raw.lastname,
    image: raw.image_path,
    dateOfBirth: raw.date_of_birth,
    age: calculateAge(raw.date_of_birth),
    height: raw.height,
    weight: raw.weight,
    position: raw.position?.name || null,
    detailedPosition: raw.detailedPosition?.name || null,
    country: raw.country ? mapCountry(raw.country) : null,
    nationality: raw.nationality ? mapCountry(raw.nationality) : null,
    currentTeam,
    teams,
    // Additional attributes
    preferredFoot: extractPreferredFoot(raw.metadata),
    // Get market value from most recent transfer (if available)
    marketValue: transfers.length > 0 ? transfers[0].amount : null,
    // Extended data
    seasonStats,
    transfers,
    trophies,
    recentMatches,
  };
}

// Map top scorer entry
export function mapTopScorer(raw: SportmonksTopScorerRaw): TopScorer {
  // Type IDs: 208 = goals, 209 = assists, 210 = yellow cards, 211 = red cards
  const isGoals = raw.type_id === 208;
  const isAssists = raw.type_id === 209;

  return {
    id: raw.id,
    playerId: raw.player_id,
    playerName: raw.player?.display_name || raw.player?.name || "Unknown",
    playerImage: raw.player?.image_path || null,
    teamId: raw.participant_id,
    teamName: raw.participant?.name || "",
    teamLogo: raw.participant?.image_path || "",
    position: raw.position,
    goals: isGoals ? raw.total : 0,
    assists: isAssists ? raw.total : 0,
    yellowCards: raw.type_id === 210 ? raw.total : 0,
    redCards: raw.type_id === 211 ? raw.total : 0,
  };
}

// Map team transfer entry
export function mapTeamTransfer(
  raw: SportmonksTransferRaw,
  teamId: number,
): TeamTransfer {
  // Determine transfer direction based on teamId
  const direction: "in" | "out" = raw.to_team_id === teamId ? "in" : "out";

  // Map transfer type from API
  const typeCode = raw.type?.code?.toLowerCase() || "";
  let type: TeamTransfer["type"] = "unknown";
  if (typeCode.includes("loan")) {
    type = raw.type?.developer_name?.includes("end") ? "end_of_loan" : "loan";
  } else if (typeCode.includes("free") || raw.amount === 0) {
    type = "free";
  } else if (typeCode.includes("permanent") || raw.amount) {
    type = "permanent";
  }

  return {
    id: raw.id,
    date: raw.date,
    type,
    direction,
    playerId: raw.player_id,
    playerName:
      raw.player?.display_name ||
      raw.player?.common_name ||
      `${raw.player?.firstname || ""} ${raw.player?.lastname || ""}`.trim() ||
      "Unknown Player",
    playerImage: raw.player?.image_path || null,
    fromTeamId: raw.from_team_id,
    fromTeamName: raw.fromteam?.name || "Unknown",
    fromTeamLogo: raw.fromteam?.image_path || null,
    toTeamId: raw.to_team_id,
    toTeamName: raw.toteam?.name || "Unknown",
    toTeamLogo: raw.toteam?.image_path || null,
    amount: raw.amount,
    completed: raw.completed,
  };
}

// ============================================
// COACH MAPPERS
// ============================================

// Map coach's team relation (career history)
export function mapCoachTeam(raw: SportmonksCoachTeamRelationRaw): CoachTeam {
  const team = raw.team;

  // Map position ID to position name
  // Position IDs: 1 = Head Coach, 2 = Assistant Coach, 3 = Goalkeeping Coach, etc.
  const positionMap: Record<number, string> = {
    1: "Head Coach",
    2: "Assistant Coach",
    3: "Goalkeeping Coach",
    4: "Fitness Coach",
    5: "Technical Director",
  };

  return {
    id: raw.id,
    teamId: raw.team_id,
    teamName: team?.name || "",
    teamLogo: team?.image_path || "",
    teamType: team?.type || "club",
    position: positionMap[raw.position_id] || "Coach",
    startDate: raw.start,
    endDate: raw.end,
    isCurrent: raw.active && raw.end === null,
    isTemporary: raw.temporary,
  };
}

// Map coach trophy
function mapCoachTrophy(raw: SportmonksParticipantTrophyRaw): CoachTrophy {
  return {
    id: raw.id,
    name: raw.trophy?.name || "Trophy",
    position: raw.trophy?.position || 1,
    leagueId: raw.league_id,
    leagueName: raw.league?.name || "",
    leagueLogo: raw.league?.image_path || "",
    seasonId: raw.season_id,
    seasonName: raw.season?.name || "",
    teamId: raw.team_id,
  };
}

// Map full coach detail
export function mapCoachDetail(raw: SportmonksCoachDetailRaw): CoachDetail {
  // Map teams (career history)
  const teams = (raw.teams || []).map(mapCoachTeam);

  // Find current team
  const currentTeam = teams.find((t) => t.isCurrent) || null;

  // Map trophies
  const trophies = (raw.trophies || [])
    .map(mapCoachTrophy)
    .sort((a, b) => b.seasonId - a.seasonId); // Most recent first

  return {
    id: raw.id,
    name: raw.name,
    displayName: raw.display_name || raw.common_name,
    commonName: raw.common_name,
    firstName: raw.firstname,
    lastName: raw.lastname,
    image: raw.image_path,
    dateOfBirth: raw.date_of_birth,
    age: calculateAge(raw.date_of_birth),
    height: raw.height,
    weight: raw.weight,
    country: raw.country ? mapCountry(raw.country) : null,
    nationality: raw.nationality ? mapCountry(raw.nationality) : null,
    currentTeam,
    teams,
    trophies,
    formerPlayerId: raw.player_id,
  };
}

// Map coach search result
export function mapCoachSearchResult(
  raw: SportmonksCoachRaw,
  currentTeam?: { id: number; name: string; logo: string },
): CoachSearchResult {
  return {
    id: raw.id,
    name: raw.name,
    displayName: raw.display_name || raw.common_name,
    commonName: raw.common_name,
    image: raw.image_path,
    country: null, // Would need country include
    currentTeamId: currentTeam?.id || null,
    currentTeamName: currentTeam?.name || null,
    currentTeamLogo: currentTeam?.logo || null,
  };
}
