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
  PlayerDetail,
  PlayerTeam,
  PlayerSearchResult,
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
  };
}

// Map league with current season
export function mapLeagueWithCurrentSeason(raw: SportmonksLeagueWithCurrentSeasonRaw): League {
  return {
    id: raw.id,
    name: raw.name,
    shortCode: raw.short_code,
    logo: raw.image_path,
    countryId: raw.country_id,
    country: raw.country ? mapCountry(raw.country) : null,
    type: raw.type,
    currentSeasonId: raw.currentSeason?.id ?? null,
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
      : { id: 0, name: "TBA", shortCode: null, logo: "", isHome: true, isWinner: null },
    awayTeam: awayParticipant
      ? mapTeam(awayParticipant)
      : { id: 0, name: "TBA", shortCode: null, logo: "", isHome: false, isWinner: null },
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
  };
}

// Map standing group
export function mapStandingTable(raw: SportmonksStandingGroupRaw): StandingTable {
  return {
    id: raw.id,
    name: raw.name,
    leagueId: raw.league_id,
    seasonId: raw.season_id,
    standings: raw.standings.map(mapStanding),
  };
}

// Map event
export function mapEvent(raw: SportmonksEventRaw): MatchEvent {
  // Type IDs: 14=goal, 18=yellow, 19=red, 20=substitution, etc.
  let type: MatchEvent["type"] = "other";

  const goalTypes = [14, 15, 16, 17]; // goal, own goal, penalty, missed penalty
  const cardTypes = [18, 19, 20]; // yellow, red, yellowred
  const subTypes = [24]; // substitution
  const varTypes = [27]; // VAR

  if (goalTypes.includes(raw.type_id)) {
    type = "goal";
  } else if (cardTypes.includes(raw.type_id)) {
    type = "card";
  } else if (subTypes.includes(raw.type_id)) {
    type = "substitution";
  } else if (varTypes.includes(raw.type_id)) {
    type = "var";
  }

  return {
    id: raw.id,
    type,
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
  awayStats: Array<SportmonksStatisticRaw>
): Array<MatchStatistic> {
  const statsMap = new Map<number, { home: number | string | null; away: number | string | null; name: string }>();

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
  formation: string | null
): TeamLineup {
  const teamLineups = lineups.filter((l) => l.team_id === teamId);
  const starters = teamLineups.filter((l) => l.type_id === 11).map(mapLineupPlayer);
  const substitutes = teamLineups.filter((l) => l.type_id === 12).map(mapLineupPlayer);

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
function extractScoreForH2H(raw: SportmonksFixtureRaw): { home: number; away: number } {
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
  const homeFormation = formations.find((f) => f.location === "home")?.formation || null;
  const awayFormation = formations.find((f) => f.location === "away")?.formation || null;

  const homeLineup = lineups.some((l) => l.team_id === base.homeTeam.id)
    ? mapTeamLineup(lineups, base.homeTeam.id, homeFormation)
    : null;
  const awayLineup = lineups.some((l) => l.team_id === base.awayTeam.id)
    ? mapTeamLineup(lineups, base.awayTeam.id, awayFormation)
    : null;

  return {
    ...base,
    events,
    statistics,
    homeLineup,
    awayLineup,
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
    positionGroup: position?.stat_group || null,
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
  };
}

// Calculate age from date of birth
function calculateAge(dateOfBirth: string | null): number | null {
  if (!dateOfBirth) return null;
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
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
export function mapPlayerSearchResult(raw: SportmonksPlayerRaw): PlayerSearchResult {
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

// Map full player detail
export function mapPlayerDetail(raw: SportmonksPlayerRaw): PlayerDetail {
  // Map teams
  const teams = (raw.teams || []).map(mapPlayerTeam);

  // Find current team (no end date)
  const currentTeam = teams.find((t) => t.isCurrent) || null;

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
  };
}
