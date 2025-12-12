/**
 * Match Betting Insights Analysis Engine
 * Generates betting recommendations and match analysis
 */

import type {
  FormFixtureData,
  H2HFixture,
  Sidelined,
  TopScorer,
  MarketOdds,
  FormMetrics,
  H2HMetrics,
  BetRecommendation,
  KeyPlayerMissing,
  MatchInsights,
  StandingTable,
} from "@/types/football";
import { BETTING_MARKETS } from "@/lib/api/football-api";

// ==========================================
// Form Metrics Calculation
// ==========================================

/**
 * Calculate form metrics from recent fixtures
 * @param fixtures - Recent fixture results
 * @param teamId - Team ID to calculate form for
 * @param isHomeForm - If true, only consider home games; if false, only away; if null, all games
 */
export function calculateFormMetrics(
  fixtures: Array<FormFixtureData>,
  teamId: number,
  isHomeForm: boolean | null = null,
): FormMetrics {
  // Filter fixtures by home/away if specified
  const filtered =
    isHomeForm === null
      ? fixtures
      : fixtures.filter((f) => f.isHome === isHomeForm);

  if (filtered.length === 0) {
    return createEmptyFormMetrics(isHomeForm);
  }

  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;
  let cleanSheets = 0;
  let bttsCount = 0;
  let over15Count = 0;
  let over25Count = 0;
  let over35Count = 0;

  for (const f of filtered) {
    const homeScore = f.homeScore ?? 0;
    const awayScore = f.awayScore ?? 0;
    const teamGoals = f.isHome ? homeScore : awayScore;
    const oppGoals = f.isHome ? awayScore : homeScore;
    const totalGoals = homeScore + awayScore;

    goalsFor += teamGoals;
    goalsAgainst += oppGoals;

    if (teamGoals > oppGoals) wins++;
    else if (teamGoals < oppGoals) losses++;
    else draws++;

    if (oppGoals === 0) cleanSheets++;
    if (homeScore > 0 && awayScore > 0) bttsCount++;
    if (totalGoals > 1.5) over15Count++;
    if (totalGoals > 2.5) over25Count++;
    if (totalGoals > 3.5) over35Count++;
  }

  const played = filtered.length;
  const points = wins * 3 + draws;

  return {
    played,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
    ppg: played > 0 ? points / played : 0,
    winRate: played > 0 ? wins / played : 0,
    cleanSheetRate: played > 0 ? cleanSheets / played : 0,
    bttsRate: played > 0 ? bttsCount / played : 0,
    over15Rate: played > 0 ? over15Count / played : 0,
    over25Rate: played > 0 ? over25Count / played : 0,
    over35Rate: played > 0 ? over35Count / played : 0,
    isHomeForm,
  };
}

function createEmptyFormMetrics(isHomeForm: boolean | null): FormMetrics {
  return {
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    ppg: 0,
    winRate: 0,
    cleanSheetRate: 0,
    bttsRate: 0,
    over15Rate: 0,
    over25Rate: 0,
    over35Rate: 0,
    isHomeForm,
  };
}

// ==========================================
// H2H Metrics Calculation
// ==========================================

/**
 * Calculate head-to-head metrics between two teams
 * Includes venue-aware analysis (away team as away)
 */
export function calculateH2HMetrics(
  h2h: Array<H2HFixture>,
  homeTeamId: number,
  awayTeamId: number,
): H2HMetrics {
  if (h2h.length === 0) {
    return createEmptyH2HMetrics();
  }

  let homeWins = 0;
  let awayWins = 0;
  let draws = 0;
  let homeGoals = 0;
  let awayGoals = 0;
  let bttsCount = 0;
  let over25Count = 0;

  // Venue-specific stats (away team playing away vs this opponent)
  let venueMatches = 0;
  let venueHomeWins = 0;
  let venueAwayWins = 0;
  let venueDraws = 0;

  for (const match of h2h) {
    const isHomeTeamHome = match.homeTeam.id === homeTeamId;
    const homeTeamGoals = isHomeTeamHome ? match.homeScore : match.awayScore;
    const awayTeamGoals = isHomeTeamHome ? match.awayScore : match.homeScore;

    homeGoals += homeTeamGoals;
    awayGoals += awayTeamGoals;

    if (match.winnerId === homeTeamId) homeWins++;
    else if (match.winnerId === awayTeamId) awayWins++;
    else draws++;

    if (match.homeScore > 0 && match.awayScore > 0) bttsCount++;
    if (match.homeScore + match.awayScore > 2.5) over25Count++;

    // Check venue-specific (when away team actually played away vs home team at home)
    if (match.homeTeam.id === homeTeamId && match.awayTeam.id === awayTeamId) {
      venueMatches++;
      if (match.winnerId === homeTeamId) venueHomeWins++;
      else if (match.winnerId === awayTeamId) venueAwayWins++;
      else venueDraws++;
    }
  }

  const totalMatches = h2h.length;
  const totalGoals = homeGoals + awayGoals;

  return {
    totalMatches,
    homeWins,
    awayWins,
    draws,
    homeGoals,
    awayGoals,
    venueMatches,
    venueHomeWins,
    venueAwayWins,
    venueDraws,
    bttsRate: totalMatches > 0 ? bttsCount / totalMatches : 0,
    over25Rate: totalMatches > 0 ? over25Count / totalMatches : 0,
    avgGoals: totalMatches > 0 ? totalGoals / totalMatches : 0,
  };
}

function createEmptyH2HMetrics(): H2HMetrics {
  return {
    totalMatches: 0,
    homeWins: 0,
    awayWins: 0,
    draws: 0,
    homeGoals: 0,
    awayGoals: 0,
    venueMatches: 0,
    venueHomeWins: 0,
    venueAwayWins: 0,
    venueDraws: 0,
    bttsRate: 0,
    over25Rate: 0,
    avgGoals: 0,
  };
}

// ==========================================
// Sidelined Impact Calculation
// ==========================================

/**
 * Identify key players missing due to injury/suspension
 * Cross-references sidelined players with top scorers/assists/ratings
 */
export function identifyKeyPlayersMissing(
  sidelined: Array<Sidelined>,
  keyPlayers: {
    scorers: Array<TopScorer>;
    assists: Array<TopScorer>;
    rated: Array<TopScorer>;
  },
): Array<KeyPlayerMissing> {
  const missing: Array<KeyPlayerMissing> = [];

  for (const player of sidelined) {
    // Check if this player is in top scorers
    const scorerMatch = keyPlayers.scorers.find(
      (s) => s.playerId === player.playerId,
    );
    if (scorerMatch) {
      missing.push({
        player,
        keyType: "topScorer",
        seasonRank: scorerMatch.position,
        seasonStats: { goals: scorerMatch.goals },
        impactLevel: getImpactLevel(scorerMatch.position, "topScorer"),
      });
      continue; // Don't add same player multiple times
    }

    // Check if this player is in top assists
    const assistMatch = keyPlayers.assists.find(
      (s) => s.playerId === player.playerId,
    );
    if (assistMatch) {
      missing.push({
        player,
        keyType: "topAssist",
        seasonRank: assistMatch.position,
        seasonStats: { assists: assistMatch.assists },
        impactLevel: getImpactLevel(assistMatch.position, "topAssist"),
      });
      continue;
    }

    // Check if this player is in top rated (only top 20)
    const ratedMatch = keyPlayers.rated
      .slice(0, 20)
      .find((s) => s.playerId === player.playerId);
    if (ratedMatch) {
      missing.push({
        player,
        keyType: "topRated",
        seasonRank: ratedMatch.position,
        seasonStats: {},
        impactLevel: getImpactLevel(ratedMatch.position, "topRated"),
      });
    }
  }

  return missing;
}

function getImpactLevel(
  rank: number,
  type: "topScorer" | "topAssist" | "topRated",
): "high" | "medium" | "low" {
  if (type === "topScorer" || type === "topAssist") {
    if (rank <= 5) return "high";
    if (rank <= 10) return "medium";
    return "low";
  }
  // For ratings, be more lenient
  if (rank <= 10) return "high";
  if (rank <= 15) return "medium";
  return "low";
}

/**
 * Calculate overall sidelined impact for a team
 */
export function calculateSidelinedImpact(
  keyMissing: Array<KeyPlayerMissing>,
): "high" | "medium" | "low" | "none" {
  if (keyMissing.length === 0) return "none";

  const highImpact = keyMissing.filter((m) => m.impactLevel === "high").length;
  const mediumImpact = keyMissing.filter(
    (m) => m.impactLevel === "medium",
  ).length;

  if (highImpact >= 2 || (highImpact >= 1 && mediumImpact >= 2)) return "high";
  if (highImpact >= 1 || mediumImpact >= 2) return "medium";
  return "low";
}

// ==========================================
// Market Recommendation Generation
// ==========================================

interface RecommendationContext {
  homeForm: FormMetrics;
  awayForm: FormMetrics;
  homeFormHome: FormMetrics | null;
  awayFormAway: FormMetrics | null;
  h2h: H2HMetrics;
  homeStanding: { position: number; points: number } | null;
  awayStanding: { position: number; points: number } | null;
  sidelinedImpact: { home: string; away: string };
  marketOdds: MarketOdds | null;
}

/**
 * Generate a bet recommendation for a specific market
 */
function generateMarketRecommendation(
  marketId: number,
  marketName: string,
  context: RecommendationContext,
): BetRecommendation | null {
  const { homeForm, awayForm, h2h, homeStanding, awayStanding, marketOdds } =
    context;

  // Get odds for this market if available
  const odds = marketOdds?.odds || [];

  switch (marketId) {
    case BETTING_MARKETS.FULLTIME_RESULT.id:
      return generate1X2Recommendation(context, odds);

    case BETTING_MARKETS.OVER_UNDER_2_5.id:
      return generateOverUnderRecommendation(2.5, context, odds);

    case BETTING_MARKETS.OVER_UNDER_1_5.id:
      return generateOverUnderRecommendation(1.5, context, odds);

    case BETTING_MARKETS.OVER_UNDER_3_5.id:
      return generateOverUnderRecommendation(3.5, context, odds);

    case BETTING_MARKETS.BTTS.id:
      return generateBTTSRecommendation(context, odds);

    case BETTING_MARKETS.DOUBLE_CHANCE.id:
      return generateDoubleChanceRecommendation(context, odds);

    case BETTING_MARKETS.DRAW_NO_BET.id:
      return generateDrawNoBetRecommendation(context, odds);

    case BETTING_MARKETS.ASIAN_HANDICAP_0.id:
      return generateAsianHandicap0Recommendation(context, odds);

    default:
      return null;
  }
}

// 1X2 Recommendation
function generate1X2Recommendation(
  ctx: RecommendationContext,
  odds: Array<{ label: string; value: number; probability: number | null }>,
): BetRecommendation {
  const {
    homeForm,
    awayForm,
    h2h,
    homeStanding,
    awayStanding,
    sidelinedImpact,
  } = ctx;

  // Calculate base probability from form and standings
  let homeProb = 0.4; // Base home advantage
  let drawProb = 0.25;
  let awayProb = 0.35;

  // Adjust based on form
  const formDiff = homeForm.ppg - awayForm.ppg;
  homeProb += formDiff * 0.1;
  awayProb -= formDiff * 0.1;

  // Adjust based on standings
  if (homeStanding && awayStanding) {
    const posDiff = awayStanding.position - homeStanding.position;
    homeProb += posDiff * 0.01;
    awayProb -= posDiff * 0.01;
  }

  // Adjust based on H2H
  if (h2h.totalMatches > 0) {
    const h2hHomeRate = h2h.homeWins / h2h.totalMatches;
    const h2hAwayRate = h2h.awayWins / h2h.totalMatches;
    homeProb = homeProb * 0.7 + h2hHomeRate * 0.3;
    awayProb = awayProb * 0.7 + h2hAwayRate * 0.3;
  }

  // Adjust for sidelined impact
  if (sidelinedImpact.home === "high") homeProb *= 0.85;
  if (sidelinedImpact.away === "high") awayProb *= 0.85;

  // Normalize probabilities
  const total = homeProb + drawProb + awayProb;
  homeProb /= total;
  drawProb /= total;
  awayProb /= total;

  // Determine best pick
  let pick: string;
  let pickLabel: string;
  let modelProb: number;

  if (homeProb > awayProb && homeProb > drawProb) {
    pick = "1";
    pickLabel = "Home Win";
    modelProb = homeProb;
  } else if (awayProb > homeProb && awayProb > drawProb) {
    pick = "2";
    pickLabel = "Away Win";
    modelProb = awayProb;
  } else {
    pick = "X";
    pickLabel = "Draw";
    modelProb = drawProb;
  }

  const oddValue = odds.find((o) => o.label === pick);
  const impliedProb = oddValue ? 1 / oddValue.value : null;

  return {
    marketId: BETTING_MARKETS.FULLTIME_RESULT.id,
    marketName: "Full Time Result",
    pick,
    pickLabel,
    confidence: Math.round(modelProb * 100),
    reasoning: generateReasoning("1X2", pick, ctx),
    odds: oddValue?.value ?? null,
    impliedProbability: impliedProb,
    modelProbability: modelProb,
    hasValue: impliedProb !== null && modelProb > impliedProb,
  };
}

// Over/Under Recommendation
function generateOverUnderRecommendation(
  line: number,
  ctx: RecommendationContext,
  odds: Array<{ label: string; value: number; probability: number | null }>,
): BetRecommendation {
  const { homeForm, awayForm, h2h } = ctx;

  // Get appropriate rate based on line
  let homeRate: number;
  let awayRate: number;
  let h2hRate: number;

  if (line === 1.5) {
    homeRate = homeForm.over15Rate;
    awayRate = awayForm.over15Rate;
    h2hRate = h2h.avgGoals > 1.5 ? 1 : 0;
  } else if (line === 2.5) {
    homeRate = homeForm.over25Rate;
    awayRate = awayForm.over25Rate;
    h2hRate = h2h.over25Rate;
  } else {
    homeRate = homeForm.over35Rate;
    awayRate = awayForm.over35Rate;
    h2hRate = h2h.avgGoals > 3.5 ? 1 : 0;
  }

  // Calculate over probability
  let overProb =
    homeForm.played > 0 && awayForm.played > 0
      ? (homeRate + awayRate) / 2
      : 0.5;

  // Adjust with H2H if available
  if (h2h.totalMatches > 0) {
    overProb = overProb * 0.7 + h2hRate * 0.3;
  }

  const pick = overProb > 0.5 ? "Over" : "Under";
  const pickLabel = `${pick} ${line}`;
  const modelProb = pick === "Over" ? overProb : 1 - overProb;

  const oddValue = odds.find((o) => o.label === pick);
  const impliedProb = oddValue ? 1 / oddValue.value : null;

  return {
    marketId:
      line === 1.5
        ? BETTING_MARKETS.OVER_UNDER_1_5.id
        : line === 2.5
          ? BETTING_MARKETS.OVER_UNDER_2_5.id
          : BETTING_MARKETS.OVER_UNDER_3_5.id,
    marketName: `Over/Under ${line}`,
    pick,
    pickLabel,
    confidence: Math.round(modelProb * 100),
    reasoning: generateReasoning(`O/U ${line}`, pick, ctx),
    odds: oddValue?.value ?? null,
    impliedProbability: impliedProb,
    modelProbability: modelProb,
    hasValue: impliedProb !== null && modelProb > impliedProb,
  };
}

// BTTS Recommendation
function generateBTTSRecommendation(
  ctx: RecommendationContext,
  odds: Array<{ label: string; value: number; probability: number | null }>,
): BetRecommendation {
  const { homeForm, awayForm, h2h } = ctx;

  // Calculate BTTS probability
  let bttsProb =
    homeForm.played > 0 && awayForm.played > 0
      ? (homeForm.bttsRate + awayForm.bttsRate) / 2
      : 0.5;

  // Adjust with H2H
  if (h2h.totalMatches > 0) {
    bttsProb = bttsProb * 0.7 + h2h.bttsRate * 0.3;
  }

  // Consider clean sheet rates
  const cleanSheetFactor =
    1 - (homeForm.cleanSheetRate + awayForm.cleanSheetRate) / 2;
  bttsProb = bttsProb * 0.6 + cleanSheetFactor * 0.4;

  const pick = bttsProb > 0.5 ? "Yes" : "No";
  const pickLabel = `BTTS ${pick}`;
  const modelProb = pick === "Yes" ? bttsProb : 1 - bttsProb;

  const oddValue = odds.find((o) => o.label === pick);
  const impliedProb = oddValue ? 1 / oddValue.value : null;

  return {
    marketId: BETTING_MARKETS.BTTS.id,
    marketName: "Both Teams To Score",
    pick,
    pickLabel,
    confidence: Math.round(modelProb * 100),
    reasoning: generateReasoning("BTTS", pick, ctx),
    odds: oddValue?.value ?? null,
    impliedProbability: impliedProb,
    modelProbability: modelProb,
    hasValue: impliedProb !== null && modelProb > impliedProb,
  };
}

// Double Chance Recommendation
function generateDoubleChanceRecommendation(
  ctx: RecommendationContext,
  odds: Array<{ label: string; value: number; probability: number | null }>,
): BetRecommendation {
  const { homeForm, awayForm, homeStanding, awayStanding } = ctx;

  // Calculate base probabilities (same as 1X2)
  let homeProb = 0.4;
  let drawProb = 0.25;
  let awayProb = 0.35;

  const formDiff = homeForm.ppg - awayForm.ppg;
  homeProb += formDiff * 0.1;
  awayProb -= formDiff * 0.1;

  if (homeStanding && awayStanding) {
    const posDiff = awayStanding.position - homeStanding.position;
    homeProb += posDiff * 0.01;
    awayProb -= posDiff * 0.01;
  }

  // Normalize
  const total = homeProb + drawProb + awayProb;
  homeProb /= total;
  drawProb /= total;
  awayProb /= total;

  // Double chance probabilities
  const dc1X = homeProb + drawProb;
  const dc12 = homeProb + awayProb;
  const dcX2 = drawProb + awayProb;

  let pick: string;
  let pickLabel: string;
  let modelProb: number;

  if (dc1X >= dc12 && dc1X >= dcX2) {
    pick = "1X";
    pickLabel = "Home or Draw";
    modelProb = dc1X;
  } else if (dc12 >= dc1X && dc12 >= dcX2) {
    pick = "12";
    pickLabel = "Home or Away";
    modelProb = dc12;
  } else {
    pick = "X2";
    pickLabel = "Draw or Away";
    modelProb = dcX2;
  }

  const oddValue = odds.find((o) => o.label === pick);
  const impliedProb = oddValue ? 1 / oddValue.value : null;

  return {
    marketId: BETTING_MARKETS.DOUBLE_CHANCE.id,
    marketName: "Double Chance",
    pick,
    pickLabel,
    confidence: Math.round(modelProb * 100),
    reasoning: generateReasoning("DC", pick, ctx),
    odds: oddValue?.value ?? null,
    impliedProbability: impliedProb,
    modelProbability: modelProb,
    hasValue: impliedProb !== null && modelProb > impliedProb,
  };
}

// Draw No Bet Recommendation
function generateDrawNoBetRecommendation(
  ctx: RecommendationContext,
  odds: Array<{ label: string; value: number; probability: number | null }>,
): BetRecommendation {
  const { homeForm, awayForm, h2h, homeStanding, awayStanding } = ctx;

  // Calculate win probabilities excluding draw
  let homeWinProb = 0.55; // Slight home advantage
  let awayWinProb = 0.45;

  const formDiff = homeForm.winRate - awayForm.winRate;
  homeWinProb += formDiff * 0.15;
  awayWinProb -= formDiff * 0.15;

  if (
    homeStanding &&
    awayStanding &&
    homeStanding.position < awayStanding.position
  ) {
    homeWinProb += 0.05;
    awayWinProb -= 0.05;
  } else if (homeStanding && awayStanding) {
    homeWinProb -= 0.05;
    awayWinProb += 0.05;
  }

  // Normalize
  const total = homeWinProb + awayWinProb;
  homeWinProb /= total;
  awayWinProb /= total;

  const pick = homeWinProb > awayWinProb ? "1" : "2";
  const pickLabel = pick === "1" ? "Home (DNB)" : "Away (DNB)";
  const modelProb = pick === "1" ? homeWinProb : awayWinProb;

  const oddValue = odds.find((o) => o.label === pick);
  const impliedProb = oddValue ? 1 / oddValue.value : null;

  return {
    marketId: BETTING_MARKETS.DRAW_NO_BET.id,
    marketName: "Draw No Bet",
    pick,
    pickLabel,
    confidence: Math.round(modelProb * 100),
    reasoning: generateReasoning("DNB", pick, ctx),
    odds: oddValue?.value ?? null,
    impliedProbability: impliedProb,
    modelProbability: modelProb,
    hasValue: impliedProb !== null && modelProb > impliedProb,
  };
}

// Asian Handicap 0 Recommendation
function generateAsianHandicap0Recommendation(
  ctx: RecommendationContext,
  odds: Array<{ label: string; value: number; probability: number | null }>,
): BetRecommendation {
  // AH 0 is essentially the same as DNB
  return {
    ...generateDrawNoBetRecommendation(ctx, odds),
    marketId: BETTING_MARKETS.ASIAN_HANDICAP_0.id,
    marketName: "Asian Handicap 0",
  };
}

// Generate reasoning text - pick-aware to avoid contradictory statements
function generateReasoning(
  market: string,
  pick: string,
  ctx: RecommendationContext,
): string {
  const { homeForm, awayForm, h2h, sidelinedImpact } = ctx;
  const parts: string[] = [];

  // Market-specific reasoning based on pick direction
  if (market.includes("O/U")) {
    // Over/Under markets - reasoning should match the pick
    const avgOverRate = (homeForm.over25Rate + awayForm.over25Rate) / 2;
    if (pick === "Over") {
      if (avgOverRate > 0.6) parts.push("Both teams have high-scoring records");
      else if (h2h.avgGoals > 2.5)
        parts.push("H2H matches tend to be high-scoring");
      else parts.push("Attack-minded teams");
    } else {
      if (avgOverRate < 0.4) parts.push("Both teams in low-scoring form");
      else if (homeForm.cleanSheetRate > 0.4 || awayForm.cleanSheetRate > 0.4)
        parts.push("Strong defensive record");
      else parts.push("Tight match expected");
    }
  } else if (market === "BTTS") {
    // BTTS market - reasoning should match Yes/No pick
    const avgBttsRate = (homeForm.bttsRate + awayForm.bttsRate) / 2;
    if (pick === "Yes") {
      if (avgBttsRate > 0.6) parts.push("Both teams score frequently");
      else if (h2h.bttsRate > 0.6)
        parts.push("H2H shows both teams usually score");
      else parts.push("Open match expected");
    } else {
      if (homeForm.cleanSheetRate > 0.4)
        parts.push("Home team keeps clean sheets");
      else if (awayForm.cleanSheetRate > 0.4)
        parts.push("Away team keeps clean sheets");
      else parts.push("One-sided match expected");
    }
  } else {
    // 1X2, DC, DNB markets - form-based reasoning
    if (homeForm.played > 0 && awayForm.played > 0) {
      if (homeForm.ppg > awayForm.ppg + 0.5) {
        parts.push("Home team in better form");
      } else if (awayForm.ppg > homeForm.ppg + 0.5) {
        parts.push("Away team in better form");
      }
    }

    // H2H reasoning (only for result markets)
    if (h2h.totalMatches >= 3) {
      if (h2h.homeWins > h2h.awayWins * 2) {
        parts.push("Strong H2H record for home");
      } else if (h2h.awayWins > h2h.homeWins * 2) {
        parts.push("Strong H2H record for away");
      }
    }
  }

  // Sidelined reasoning (applies to all markets)
  if (sidelinedImpact.home === "high") {
    parts.push("Key home players missing");
  }
  if (sidelinedImpact.away === "high") {
    parts.push("Key away players missing");
  }

  return parts.length > 0
    ? parts.join(". ") + "."
    : "Based on statistical analysis.";
}

// ==========================================
// Main Builder Function
// ==========================================

export interface MatchInsightsInput {
  homeTeamId: number;
  awayTeamId: number;
  homeForm: Array<FormFixtureData>;
  awayForm: Array<FormFixtureData>;
  h2h: Array<H2HFixture>;
  standings: Array<StandingTable>;
  sidelined: {
    home: Array<Sidelined>;
    away: Array<Sidelined>;
  };
  keyPlayers: {
    scorers: Array<TopScorer>;
    assists: Array<TopScorer>;
    rated: Array<TopScorer>;
  };
  marketOdds: Array<MarketOdds>;
}

/**
 * Build comprehensive match betting insights
 */
export function buildMatchBettingInsights(
  input: MatchInsightsInput,
): MatchInsights {
  const {
    homeTeamId,
    awayTeamId,
    homeForm,
    awayForm,
    h2h,
    standings,
    sidelined,
    keyPlayers,
    marketOdds,
  } = input;

  // Calculate form metrics
  const homeFormMetrics = calculateFormMetrics(homeForm, homeTeamId, null);
  const awayFormMetrics = calculateFormMetrics(awayForm, awayTeamId, null);
  const homeFormHome = calculateFormMetrics(homeForm, homeTeamId, true);
  const awayFormAway = calculateFormMetrics(awayForm, awayTeamId, false);

  // Calculate H2H metrics
  const h2hMetrics = calculateH2HMetrics(h2h, homeTeamId, awayTeamId);

  // Identify key players missing
  const homeKeyMissing = identifyKeyPlayersMissing(sidelined.home, keyPlayers);
  const awayKeyMissing = identifyKeyPlayersMissing(sidelined.away, keyPlayers);
  const keyPlayersMissing = [...homeKeyMissing, ...awayKeyMissing];

  // Calculate sidelined impact
  const sidelinedImpact = {
    home: calculateSidelinedImpact(homeKeyMissing),
    away: calculateSidelinedImpact(awayKeyMissing),
  };

  // Find standings for both teams
  const homeStanding = findTeamStanding(standings, homeTeamId);
  const awayStanding = findTeamStanding(standings, awayTeamId);

  // Build recommendation context
  const context: RecommendationContext = {
    homeForm: homeFormMetrics,
    awayForm: awayFormMetrics,
    homeFormHome,
    awayFormAway,
    h2h: h2hMetrics,
    homeStanding,
    awayStanding,
    sidelinedImpact: {
      home: sidelinedImpact.home,
      away: sidelinedImpact.away,
    },
    marketOdds: null,
  };

  // Generate recommendations for all markets
  const recommendations: BetRecommendation[] = [];

  for (const [, marketConfig] of Object.entries(BETTING_MARKETS)) {
    const odds = marketOdds.find((o) => o.marketId === marketConfig.id);
    context.marketOdds = odds || null;

    const rec = generateMarketRecommendation(
      marketConfig.id,
      marketConfig.name,
      context,
    );
    if (rec) {
      recommendations.push(rec);
    }
  }

  // Sort by confidence and get top picks
  const sortedRecs = [...recommendations].sort(
    (a, b) => b.confidence - a.confidence,
  );
  const topPicks = sortedRecs.slice(0, 5);

  return {
    homeFormMetrics,
    awayFormMetrics,
    homeFormHome: homeFormHome.played > 0 ? homeFormHome : null,
    awayFormAway: awayFormAway.played > 0 ? awayFormAway : null,
    h2hMetrics,
    sidelined,
    keyPlayersMissing,
    sidelinedImpact,
    recommendations,
    topPicks,
    marketOdds,
    dataQuality: {
      hasForm: homeFormMetrics.played > 0 || awayFormMetrics.played > 0,
      hasH2H: h2hMetrics.totalMatches > 0,
      hasSidelined: sidelined.home.length > 0 || sidelined.away.length > 0,
      hasOdds: marketOdds.length > 0,
      hasKeyPlayers: keyPlayers.scorers.length > 0,
    },
  };
}

// Helper to find team standing
function findTeamStanding(
  standings: Array<StandingTable>,
  teamId: number,
): { position: number; points: number } | null {
  for (const table of standings) {
    const found = table.standings.find((s) => s.teamId === teamId);
    if (found) {
      return { position: found.position, points: found.points };
    }
  }
  return null;
}
