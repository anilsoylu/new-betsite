"use client"

import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FixtureDetail, StandingTable, H2HFixture, FormFixtureData } from "@/types/football"
import { getFormFromFixtures } from "@/components/teams/form-strip"

interface MatchArticleProps {
  fixture: FixtureDetail
  standings: Array<StandingTable>
  h2h: Array<H2HFixture>
  homeForm: Array<FormFixtureData>
  awayForm: Array<FormFixtureData>
}

export function MatchArticle({
  fixture,
  standings,
  h2h,
  homeForm,
  awayForm,
}: MatchArticleProps) {
  const { homeTeam, awayTeam, league, venue, startTime, homeLineup, awayLineup, referee } = fixture

  const formattedDate = format(new Date(startTime), "EEEE, MMMM d, yyyy")
  const formattedTime = format(new Date(startTime), "HH:mm")

  // Get form results
  const homeFormResults = getFormFromFixtures(homeForm)
  const awayFormResults = getFormFromFixtures(awayForm)

  // Calculate form stats
  const homeFormStats = calculateFormStats(homeFormResults)
  const awayFormStats = calculateFormStats(awayFormResults)

  // Calculate H2H stats
  const h2hStats = calculateH2HStats(h2h, homeTeam.id, awayTeam.id)

  // Get standings positions
  const homeStanding = findTeamStanding(standings, homeTeam.id)
  const awayStanding = findTeamStanding(standings, awayTeam.id)

  // Determine team strengths for prediction
  const homeStrength = calculateTeamStrength(homeFormStats, homeStanding, true)
  const awayStrength = calculateTeamStrength(awayFormStats, awayStanding, false)

  const venueText = venue ? `at ${venue.name}` : ""
  const leagueText = league?.name || "competitive football"

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Match Preview</CardTitle>
      </CardHeader>
      <CardContent className="prose prose-sm dark:prose-invert max-w-none">
        {/* Main Title - H2 for SEO (H1 is page title) */}
        <h2 className="text-xl font-bold mt-0 mb-4">
          {homeTeam.name} vs {awayTeam.name} Preview: {leagueText} Clash
        </h2>

        {/* Opening paragraph */}
        <p>
          <strong>{homeTeam.name}</strong> will host <strong>{awayTeam.name}</strong> {venueText} on{" "}
          <strong>{formattedDate}</strong> at <strong>{formattedTime} UTC</strong> in what promises to be
          an exciting {leagueText} encounter. Both sides will be looking to secure all three points
          as they continue their campaign this season.
        </p>

        {/* Form Analysis Section */}
        {(homeFormStats.total > 0 || awayFormStats.total > 0) && (
          <>
            <h3 className="text-lg font-semibold mt-6 mb-3">Current Form & Recent Results</h3>
            {homeFormStats.total > 0 && (
              <p>
                <strong>{homeTeam.name}</strong> {describeForm(homeFormStats)}
              </p>
            )}
            {awayFormStats.total > 0 && (
              <p>
                <strong>{awayTeam.name}</strong> {describeForm(awayFormStats)}
              </p>
            )}
          </>
        )}

        {/* League Position Section */}
        {(homeStanding || awayStanding) && (
          <>
            <h3 className="text-lg font-semibold mt-6 mb-3">League Standings & Position</h3>
            {homeStanding && awayStanding ? (
              renderStandingsComparison(homeTeam.name, awayTeam.name, homeStanding, awayStanding)
            ) : homeStanding ? (
              <p>
                <strong>{homeTeam.name}</strong> currently occupy <strong>{getOrdinal(homeStanding.position)} place</strong> in
                the league with <strong>{homeStanding.points} points</strong> from {homeStanding.played} matches.
              </p>
            ) : awayStanding ? (
              <p>
                <strong>{awayTeam.name}</strong> currently sit in <strong>{getOrdinal(awayStanding.position)} position</strong> with{" "}
                <strong>{awayStanding.points} points</strong> from {awayStanding.played} games.
              </p>
            ) : null}
          </>
        )}

        {/* Head-to-Head Section */}
        {h2h.length > 0 && (
          <>
            <h3 className="text-lg font-semibold mt-6 mb-3">Head-to-Head Record</h3>
            {renderH2HAnalysis(homeTeam.name, awayTeam.name, h2hStats, h2h.length)}
          </>
        )}

        {/* Tactical Preview */}
        {(homeLineup?.formation || awayLineup?.formation) && (
          <>
            <h3 className="text-lg font-semibold mt-6 mb-3">Expected Tactics & Formations</h3>
            <p>
              {homeLineup?.formation && awayLineup?.formation ? (
                <>
                  <strong>{homeTeam.name}</strong> are expected to line up in a <strong>{homeLineup.formation}</strong> formation,
                  while <strong>{awayTeam.name}</strong> will likely deploy a <strong>{awayLineup.formation}</strong> system.
                  The tactical battle between these two setups could prove decisive in determining the outcome.
                </>
              ) : homeLineup?.formation ? (
                <>
                  <strong>{homeTeam.name}</strong> are expected to set up in their preferred{" "}
                  <strong>{homeLineup.formation}</strong> formation for this encounter.
                </>
              ) : (
                <>
                  <strong>{awayTeam.name}</strong> will likely line up in their{" "}
                  <strong>{awayLineup?.formation}</strong> formation as they look to secure a positive result on the road.
                </>
              )}
            </p>
          </>
        )}

        {/* Match Officials */}
        {referee && (
          <>
            <h3 className="text-lg font-semibold mt-6 mb-3">Match Officials</h3>
            <p>
              <strong>{referee.name}</strong> will be the referee for this fixture.
            </p>
          </>
        )}

        {/* Prediction & Analysis */}
        <h3 className="text-lg font-semibold mt-6 mb-3">Match Prediction & Analysis</h3>
        {renderPrediction(homeTeam.name, awayTeam.name, homeStrength, awayStrength)}

        {/* Key Facts */}
        <h3 className="text-lg font-semibold mt-6 mb-3">Key Facts</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Kick-off:</strong> {formattedDate}, {formattedTime} UTC
          </li>
          {venue && (
            <li>
              <strong>Venue:</strong> {venue.name}
            </li>
          )}
          {league && (
            <li>
              <strong>Competition:</strong> {league.name}
            </li>
          )}
          {homeStanding && (
            <li>
              <strong>{homeTeam.name} Position:</strong> {getOrdinal(homeStanding.position)} ({homeStanding.points} pts)
            </li>
          )}
          {awayStanding && (
            <li>
              <strong>{awayTeam.name} Position:</strong> {getOrdinal(awayStanding.position)} ({awayStanding.points} pts)
            </li>
          )}
          {h2h.length > 0 && (
            <li>
              <strong>H2H Record (Last {h2h.length}):</strong> {homeTeam.name} {h2hStats.homeWins}W - {h2hStats.draws}D - {h2hStats.awayWins}W {awayTeam.name}
            </li>
          )}
          {referee && (
            <li>
              <strong>Referee:</strong> {referee.name}
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  )
}

function renderStandingsComparison(
  homeTeam: string,
  awayTeam: string,
  homeStanding: NonNullable<ReturnType<typeof findTeamStanding>>,
  awayStanding: NonNullable<ReturnType<typeof findTeamStanding>>
) {
  const posDiff = Math.abs(homeStanding.position - awayStanding.position)
  const pointsDiff = Math.abs(homeStanding.points - awayStanding.points)

  if (posDiff <= 3) {
    return (
      <p>
        This is a closely contested battle between two sides separated by just{" "}
        <strong>{posDiff} {posDiff === 1 ? "place" : "places"}</strong> in the table.{" "}
        <strong>{homeTeam}</strong> currently sit <strong>{getOrdinal(homeStanding.position)}</strong> with{" "}
        <strong>{homeStanding.points} points</strong>, while <strong>{awayTeam}</strong> are{" "}
        <strong>{getOrdinal(awayStanding.position)}</strong> with <strong>{awayStanding.points} points</strong>.
        A win here could prove crucial in the standings.
      </p>
    )
  } else if (homeStanding.position < awayStanding.position) {
    return (
      <p>
        <strong>{homeTeam}</strong> will enter this fixture as favorites, sitting{" "}
        <strong>{getOrdinal(homeStanding.position)}</strong> in the table with{" "}
        <strong>{homeStanding.points} points</strong>. <strong>{awayTeam}</strong>, currently in{" "}
        <strong>{getOrdinal(awayStanding.position)} position</strong> with{" "}
        <strong>{awayStanding.points} points</strong>, will be looking to cause an upset and climb the standings.
      </p>
    )
  } else {
    return (
      <p>
        Despite playing away from home, <strong>{awayTeam}</strong> hold the advantage in the league table,
        sitting <strong>{getOrdinal(awayStanding.position)}</strong> compared to{" "}
        <strong>{homeTeam}&apos;s {getOrdinal(homeStanding.position)}</strong> position.
        The visitors will be confident of extending their <strong>{pointsDiff}-point</strong> lead over their opponents.
      </p>
    )
  }
}

function renderH2HAnalysis(
  homeTeam: string,
  awayTeam: string,
  h2hStats: { homeWins: number; awayWins: number; draws: number },
  h2hCount: number
) {
  const total = h2hStats.homeWins + h2hStats.awayWins + h2hStats.draws

  if (h2hStats.homeWins > h2hStats.awayWins) {
    const dominance = h2hStats.homeWins >= total * 0.6 ? "dominant" : "slight edge in the"
    return (
      <p>
        History favors <strong>{homeTeam}</strong> in this fixture. In their last{" "}
        <strong>{h2hCount} meetings</strong>, the hosts have claimed{" "}
        <strong>{h2hStats.homeWins} {h2hStats.homeWins === 1 ? "victory" : "victories"}</strong>, with{" "}
        <strong>{awayTeam}</strong> winning <strong>{h2hStats.awayWins}</strong> and{" "}
        <strong>{h2hStats.draws}</strong> ending in draws. This {dominance} record could give them
        the psychological advantage heading into this clash.
      </p>
    )
  } else if (h2hStats.awayWins > h2hStats.homeWins) {
    return (
      <p>
        <strong>{awayTeam}</strong> have enjoyed success in this fixture historically, winning{" "}
        <strong>{h2hStats.awayWins}</strong> of the last <strong>{h2hCount}</strong> encounters compared to{" "}
        <strong>{homeTeam}&apos;s {h2hStats.homeWins} {h2hStats.homeWins === 1 ? "win" : "wins"}</strong>.
        With <strong>{h2hStats.draws} draws</strong> between them, the visitors will be confident of
        continuing their positive record.
      </p>
    )
  } else if (h2hStats.draws > h2hStats.homeWins && h2hStats.draws > h2hStats.awayWins) {
    return (
      <p>
        These two sides have found it difficult to separate themselves in recent years, with{" "}
        <strong>{h2hStats.draws}</strong> of their last <strong>{h2hCount}</strong> meetings ending in stalemates.
        Both teams have managed <strong>{h2hStats.homeWins} wins</strong> apiece, suggesting another
        tight contest could be on the cards.
      </p>
    )
  } else {
    return (
      <p>
        The head-to-head record is evenly balanced between these two sides, with{" "}
        <strong>{homeTeam}</strong> winning <strong>{h2hStats.homeWins}</strong>,{" "}
        <strong>{awayTeam}</strong> winning <strong>{h2hStats.awayWins}</strong>, and{" "}
        <strong>{h2hStats.draws}</strong> matches ending in draws from their last{" "}
        <strong>{h2hCount}</strong> encounters.
      </p>
    )
  }
}

function renderPrediction(
  homeTeam: string,
  awayTeam: string,
  homeStrength: number,
  awayStrength: number
) {
  if (homeStrength > awayStrength + 1) {
    return (
      <p>
        With <strong>home advantage</strong> and strong recent form, <strong>{homeTeam}</strong> will
        be the clear favorites heading into this match. However, <strong>{awayTeam}</strong> cannot be
        written off entirely and could pose problems on the counter-attack. Expect the hosts to
        dominate possession and create the better chances.
      </p>
    )
  } else if (awayStrength > homeStrength + 1) {
    return (
      <p>
        Despite playing away from home, <strong>{awayTeam}</strong> look well-placed to take something
        from this game given their <strong>superior form and league position</strong>.{" "}
        <strong>{homeTeam}</strong> will need to raise their game significantly to secure all three points.
        The visitors&apos; confidence should see them through.
      </p>
    )
  } else {
    return (
      <p>
        This promises to be a <strong>tightly contested affair</strong> with little separating these
        two sides on paper. Both teams will fancy their chances of victory, and the match could go
        either way. Expect an entertaining encounter with plenty of action and possibly goals at both ends.
      </p>
    )
  }
}

function describeForm(stats: FormStats): string {
  if (stats.total === 0) return ""

  const winRate = stats.wins / stats.total
  const unbeatenRate = (stats.wins + stats.draws) / stats.total

  if (winRate >= 0.8) {
    return `are in exceptional form, having won ${stats.wins} of their last ${stats.total} matches. This impressive run has boosted their confidence ahead of this crucial fixture.`
  } else if (winRate >= 0.6) {
    return `head into this game in strong form, collecting ${stats.wins} wins from their last ${stats.total} outings.`
  } else if (unbeatenRate >= 0.8) {
    return `have been difficult to beat recently, remaining undefeated in ${stats.wins + stats.draws} of their last ${stats.total} matches despite only winning ${stats.wins}.`
  } else if (stats.losses > stats.wins) {
    return `have struggled for consistency lately, managing just ${stats.wins} ${stats.wins === 1 ? "win" : "wins"} from ${stats.total} games while suffering ${stats.losses} defeats. They'll be eager to turn their fortunes around.`
  } else if (stats.draws >= 3) {
    return `have drawn ${stats.draws} of their last ${stats.total} matches, showing they are competitive but perhaps lacking the clinical edge to convert draws into wins.`
  } else {
    return `recent form shows ${stats.wins} ${stats.wins === 1 ? "win" : "wins"}, ${stats.draws} ${stats.draws === 1 ? "draw" : "draws"} and ${stats.losses} ${stats.losses === 1 ? "loss" : "losses"} from their last ${stats.total} games.`
  }
}

interface FormStats {
  wins: number
  draws: number
  losses: number
  total: number
}

function calculateTeamStrength(
  formStats: FormStats,
  standing: ReturnType<typeof findTeamStanding>,
  isHome: boolean
): number {
  let strength = 0

  // Form contribution (0-3 points)
  if (formStats.total > 0) {
    const winRate = formStats.wins / formStats.total
    strength += winRate * 3
  }

  // Standing contribution (0-2 points)
  if (standing) {
    if (standing.position <= 4) strength += 2
    else if (standing.position <= 8) strength += 1.5
    else if (standing.position <= 12) strength += 1
    else strength += 0.5
  }

  // Home advantage (0.5 points)
  if (isHome) strength += 0.5

  return strength
}

function calculateH2HStats(
  h2h: Array<H2HFixture>,
  homeTeamId: number,
  awayTeamId: number
): { homeWins: number; awayWins: number; draws: number } {
  let homeWins = 0
  let awayWins = 0
  let draws = 0

  for (const match of h2h) {
    if (match.winnerId === homeTeamId) {
      homeWins++
    } else if (match.winnerId === awayTeamId) {
      awayWins++
    } else {
      draws++
    }
  }

  return { homeWins, awayWins, draws }
}

function calculateFormStats(results: string[]): FormStats {
  return {
    wins: results.filter(r => r === "W").length,
    draws: results.filter(r => r === "D").length,
    losses: results.filter(r => r === "L").length,
    total: results.length,
  }
}

function findTeamStanding(standings: Array<StandingTable>, teamId: number) {
  for (const table of standings) {
    const found = table.standings.find((s) => s.teamId === teamId)
    if (found) return found
  }
  return null
}

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
