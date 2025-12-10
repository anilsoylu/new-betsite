"use client"

import { SITE } from "@/lib/constants"
import type { TeamDetail, Fixture } from "@/types/football"
import { format } from "date-fns"

interface TeamAboutProps {
  team: TeamDetail
  nextMatch: Fixture | null
  lastMatch: Fixture | null
}

export function TeamAbout({ team, nextMatch, lastMatch }: TeamAboutProps) {
  // Group players by position (GK → DEF → MID → FWD order)
  const playersByPosition = {
    goalkeepers: team.squad.filter((p) => p.positionGroup === "Goalkeeper"),
    defenders: team.squad.filter((p) => p.positionGroup === "Defender"),
    midfielders: team.squad.filter((p) => p.positionGroup === "Midfielder"),
    forwards: team.squad.filter((p) => p.positionGroup === "Attacker"),
  }

  const squadCount = team.squad.length
  const countryName = team.country?.name || null

  // Format next match info
  const nextMatchInfo = nextMatch
    ? {
        opponent:
          nextMatch.homeTeam.id === team.id
            ? nextMatch.awayTeam.name
            : nextMatch.homeTeam.name,
        date: format(new Date(nextMatch.startTime), "MMMM d, yyyy"),
        time: format(new Date(nextMatch.startTime), "h:mm a"),
        league: nextMatch.league?.name || "League Match",
        isHome: nextMatch.homeTeam.id === team.id,
      }
    : null

  // Format last match info
  const lastMatchInfo = lastMatch
    ? {
        opponent:
          lastMatch.homeTeam.id === team.id
            ? lastMatch.awayTeam.name
            : lastMatch.homeTeam.name,
        league: lastMatch.league?.name || "League Match",
        score: lastMatch.score
          ? `${lastMatch.score.home} - ${lastMatch.score.away}`
          : null,
        result: getMatchResult(lastMatch, team.id),
        isHome: lastMatch.homeTeam.id === team.id,
      }
    : null

  return (
    <article className="rounded-xl border border-border bg-card p-5 space-y-5">
      {/* Main Title - H2 for SEO */}
      <h2 className="text-xl font-bold">About {team.name}</h2>

      {/* Main Description */}
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-3">
        <p>
          <strong>{team.name}</strong> live scores, players, season schedule and
          today&apos;s results are available on <strong>{SITE.name}</strong>.
          {countryName && (
            <>
              {" "}
              {team.name} is a professional football club from{" "}
              <strong>{countryName}</strong>.
            </>
          )}
          {team.venue?.name && (
            <>
              {" "}
              They play their home matches at <strong>{team.venue.name}</strong>
              {team.venue.city && ` in ${team.venue.city}`}.
            </>
          )}
          {team.founded && (
            <>
              {" "}
              The club was founded in <strong>{team.founded}</strong>.
            </>
          )}
        </p>

        {squadCount > 0 && (
          <p>
            The current squad consists of <strong>{squadCount} players</strong>,
            including {playersByPosition.goalkeepers.length} goalkeepers,{" "}
            {playersByPosition.defenders.length} defenders,{" "}
            {playersByPosition.midfielders.length} midfielders, and{" "}
            {playersByPosition.forwards.length} forwards.
          </p>
        )}

        {team.coach && (
          <p>
            {team.name} is managed by <strong>{team.coach.displayName}</strong>,
            who oversees the team&apos;s tactics and player development.
          </p>
        )}
      </div>

      {/* Next Match Section */}
      {nextMatchInfo && (
        <section className="space-y-2">
          <h3 className="text-base font-semibold">{team.name} Next Match</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {team.name} will play their next match against{" "}
            <strong>{nextMatchInfo.opponent}</strong> on{" "}
            <strong>{nextMatchInfo.date}</strong> at {nextMatchInfo.time} in{" "}
            <strong>{nextMatchInfo.league}</strong>. When the match starts, you
            will be able to follow{" "}
            {nextMatchInfo.isHome
              ? `${team.name} vs ${nextMatchInfo.opponent}`
              : `${nextMatchInfo.opponent} vs ${team.name}`}{" "}
            live score, standings, minute by minute updated live results and
            match statistics.
          </p>
        </section>
      )}

      {/* Previous Match Section */}
      {lastMatchInfo && lastMatchInfo.score && (
        <section className="space-y-2">
          <h3 className="text-base font-semibold">
            {team.name} Previous Match
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {team.name} previous match was against{" "}
            <strong>{lastMatchInfo.opponent}</strong> in{" "}
            <strong>{lastMatchInfo.league}</strong>, the match ended with result{" "}
            <strong>{lastMatchInfo.score}</strong> ({lastMatchInfo.result}).
          </p>
        </section>
      )}

      {/* Current Squad Section - GK → DEF → MID → FWD */}
      {squadCount > 0 && (
        <section className="space-y-2">
          <h3 className="text-base font-semibold">
            Current {team.name} Players
          </h3>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
            {playersByPosition.goalkeepers.length > 0 && (
              <p>
                <strong>Goalkeepers:</strong>{" "}
                {playersByPosition.goalkeepers
                  .map((p) => p.displayName)
                  .join(", ")}
                .
              </p>
            )}
            {playersByPosition.defenders.length > 0 && (
              <p>
                <strong>Defenders:</strong>{" "}
                {playersByPosition.defenders
                  .map((p) => p.displayName)
                  .join(", ")}
                .
              </p>
            )}
            {playersByPosition.midfielders.length > 0 && (
              <p>
                <strong>Midfielders:</strong>{" "}
                {playersByPosition.midfielders
                  .map((p) => p.displayName)
                  .join(", ")}
                .
              </p>
            )}
            {playersByPosition.forwards.length > 0 && (
              <p>
                <strong>Forwards:</strong>{" "}
                {playersByPosition.forwards
                  .map((p) => p.displayName)
                  .join(", ")}
                .
              </p>
            )}
          </div>
        </section>
      )}

      {/* Key Facts List */}
      <section className="space-y-2">
        <h3 className="text-base font-semibold">Key Facts</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          {team.founded && (
            <li>
              <strong>Founded:</strong> {team.founded}
            </li>
          )}
          {countryName && (
            <li>
              <strong>Country:</strong> {countryName}
            </li>
          )}
          {team.venue?.name && (
            <li>
              <strong>Stadium:</strong> {team.venue.name}
              {team.venue.capacity &&
                ` (${team.venue.capacity.toLocaleString()} capacity)`}
            </li>
          )}
          {team.coach && (
            <li>
              <strong>Manager:</strong> {team.coach.displayName}
            </li>
          )}
          {squadCount > 0 && (
            <li>
              <strong>Squad Size:</strong> {squadCount} players
            </li>
          )}
        </ul>
      </section>

      {/* FAQ Section with Schema.org markup */}
      <section className="space-y-3 pt-4 border-t border-border">
        <h3 className="text-base font-semibold">Frequently Asked Questions</h3>

        <div className="space-y-4">
          {team.venue?.name && (
            <div
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <h4 itemProp="name" className="text-sm font-medium">
                Where does {team.name} play their home matches?
              </h4>
              <div
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <p
                  itemProp="text"
                  className="text-sm text-muted-foreground mt-1"
                >
                  <strong>{team.name}</strong> plays their home matches at{" "}
                  <strong>{team.venue.name}</strong>
                  {team.venue.city && <> in {team.venue.city}</>}
                  {team.venue.capacity && (
                    <>
                      , which has a capacity of{" "}
                      {team.venue.capacity.toLocaleString()}
                    </>
                  )}
                  .
                </p>
              </div>
            </div>
          )}

          {team.founded && (
            <div
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <h4 itemProp="name" className="text-sm font-medium">
                When was {team.name} founded?
              </h4>
              <div
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <p
                  itemProp="text"
                  className="text-sm text-muted-foreground mt-1"
                >
                  <strong>{team.name}</strong> was founded in{" "}
                  <strong>{team.founded}</strong>.
                </p>
              </div>
            </div>
          )}

          {team.coach && (
            <div
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <h4 itemProp="name" className="text-sm font-medium">
                Who is the manager of {team.name}?
              </h4>
              <div
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <p
                  itemProp="text"
                  className="text-sm text-muted-foreground mt-1"
                >
                  <strong>{team.name}</strong> is currently managed by{" "}
                  <strong>{team.coach.displayName}</strong>.
                </p>
              </div>
            </div>
          )}

          {squadCount > 0 && (
            <div
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <h4 itemProp="name" className="text-sm font-medium">
                How many players are in {team.name}&apos;s squad?
              </h4>
              <div
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <p
                  itemProp="text"
                  className="text-sm text-muted-foreground mt-1"
                >
                  <strong>{team.name}</strong> currently has{" "}
                  <strong>{squadCount} players</strong> in their squad.
                </p>
              </div>
            </div>
          )}

          {nextMatchInfo && (
            <div
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <h4 itemProp="name" className="text-sm font-medium">
                When is {team.name}&apos;s next match?
              </h4>
              <div
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <p
                  itemProp="text"
                  className="text-sm text-muted-foreground mt-1"
                >
                  <strong>{team.name}</strong>&apos;s next match is against{" "}
                  <strong>{nextMatchInfo.opponent}</strong> on{" "}
                  <strong>{nextMatchInfo.date}</strong> in{" "}
                  {nextMatchInfo.league}.
                </p>
              </div>
            </div>
          )}

          {countryName && (
            <div
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <h4 itemProp="name" className="text-sm font-medium">
                What country is {team.name} from?
              </h4>
              <div
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <p
                  itemProp="text"
                  className="text-sm text-muted-foreground mt-1"
                >
                  <strong>{team.name}</strong> is a football club from{" "}
                  <strong>{countryName}</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </article>
  )
}

function getMatchResult(match: Fixture, teamId: number): string {
  if (!match.score) return "result unknown"

  const isHome = match.homeTeam.id === teamId
  const teamScore = isHome ? match.score.home : match.score.away
  const opponentScore = isHome ? match.score.away : match.score.home

  if (teamScore > opponentScore) {
    return `${
      match.homeTeam.id === teamId ? match.homeTeam.name : match.awayTeam.name
    } won the match`
  } else if (teamScore < opponentScore) {
    return `${
      match.homeTeam.id === teamId ? match.awayTeam.name : match.homeTeam.name
    } won the match`
  } else {
    return "the match ended in a draw"
  }
}
