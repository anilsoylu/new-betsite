"use client";

import Link from "next/link";
import { format, differenceInYears, parseISO, isValid } from "date-fns";
import type {
  PlayerDetail,
  PlayerSeasonStats,
  PlayerTransfer,
  PlayerTrophy,
  PlayerMatch,
} from "@/types/football";
import { getTeamUrl, getLeagueUrl, getPlayerMatchUrl } from "@/lib/utils";

interface PlayerAboutSectionProps {
  player: PlayerDetail;
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const date = parseISO(dateStr);
  return isValid(date) ? format(date, "MMM d, yyyy") : "";
}

function calculateAge(dateOfBirth: string | null | undefined): number | null {
  if (!dateOfBirth) return null;
  const date = parseISO(dateOfBirth);
  if (!isValid(date)) return null;
  return differenceInYears(new Date(), date);
}

function getPreferredFoot(position: string | null): string {
  // This would ideally come from API, using placeholder logic
  return "right";
}

function formatTransferFee(amount: number | null): string {
  if (!amount) return "free transfer";
  if (amount >= 1000000) return `€${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `€${(amount / 1000).toFixed(0)}K`;
  return `€${amount}`;
}

export function PlayerAboutSection({ player }: PlayerAboutSectionProps) {
  const {
    displayName,
    firstName,
    lastName,
    dateOfBirth,
    age,
    height,
    weight,
    position,
    detailedPosition,
    nationality,
    currentTeam,
    teams,
    seasonStats,
    transfers,
    trophies,
    recentMatches,
  } = player;

  // Calculate career totals
  const careerTotals = seasonStats.reduce(
    (acc, s) => ({
      appearances: acc.appearances + s.appearances,
      goals: acc.goals + s.goals,
      assists: acc.assists + s.assists,
      yellowCards: acc.yellowCards + s.yellowCards,
      redCards: acc.redCards + s.redCards,
    }),
    { appearances: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
  );

  // Get current season stats
  const currentSeasonStats = seasonStats[0];

  // Get last match info
  const lastMatch = recentMatches[0];

  // Get next match (if any upcoming)
  const nextMatch = recentMatches.find((m) => m.status === "scheduled");

  // Count total trophies (winners only)
  const totalTrophies = trophies.filter((t) => t.position === 1).length;

  // Get career span
  const careerTeams = teams.filter(
    (t) => t.teamType === "club" || t.teamType === "domestic",
  );
  const firstTeam = careerTeams[careerTeams.length - 1];
  const careerStart = firstTeam?.startDate
    ? new Date(firstTeam.startDate).getFullYear()
    : null;

  // Get most recent transfer
  const lastTransfer = transfers[0];

  // Calculate goals per game ratio
  const goalsPerGame =
    careerTotals.appearances > 0
      ? (careerTotals.goals / careerTotals.appearances).toFixed(2)
      : null;

  // Position display
  const positionDisplay = detailedPosition || position || "Player";

  return (
    <article className="rounded-xl border border-border bg-card p-5 space-y-5">
      {/* Main Title - H2 for SEO */}
      <h2 className="text-xl font-bold">About {displayName}</h2>

      {/* Main Description */}
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-3">
        <p>
          <strong>{displayName}</strong> is{" "}
          {age ? `${age} years old` : "a professional footballer"}
          {dateOfBirth && ` (${formatDate(dateOfBirth)})`}
          {height && `, ${height} cm tall`}
          {currentTeam && (
            <>
              {" "}
              and plays for{" "}
              <Link
                href={getTeamUrl(currentTeam.teamName, currentTeam.teamId)}
                className="font-bold hover:underline"
              >
                {currentTeam.teamName}
              </Link>
            </>
          )}
          .
        </p>

        {position && (
          <p>
            {displayName} plays as a <strong>{positionDisplay}</strong>
            {currentTeam?.jerseyNumber && (
              <>
                {" "}
                and wears the number <strong>{currentTeam.jerseyNumber}</strong>{" "}
                jersey
              </>
            )}
            .
            {nationality && (
              <>
                {" "}
                The player represents <strong>{nationality.name}</strong> at
                international level.
              </>
            )}
          </p>
        )}

        {careerTotals.appearances > 0 && (
          <p>
            Throughout their career, {firstName || displayName} has made{" "}
            <strong>{careerTotals.appearances} appearances</strong>, scoring{" "}
            <strong>{careerTotals.goals} goals</strong> and providing{" "}
            <strong>{careerTotals.assists} assists</strong>.
            {goalsPerGame && parseFloat(goalsPerGame) > 0.3 && (
              <>
                {" "}
                With a goals-per-game ratio of <strong>{goalsPerGame}</strong>,{" "}
                {firstName || displayName} has proven to be a consistent scorer.
              </>
            )}
          </p>
        )}
      </div>

      {/* Current Season Stats */}
      {currentSeasonStats && currentSeasonStats.appearances > 0 && (
        <section className="space-y-2">
          <h3 className="text-base font-semibold">Current Season</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            In the <strong>{currentSeasonStats.seasonName}</strong> season
            {currentSeasonStats.leagueName && currentSeasonStats.leagueId && (
              <>
                {" "}
                (
                <Link
                  href={getLeagueUrl(
                    currentSeasonStats.leagueName,
                    currentSeasonStats.leagueId,
                  )}
                  className="hover:underline text-foreground"
                >
                  {currentSeasonStats.leagueName}
                </Link>
                )
              </>
            )}
            , {displayName} has made{" "}
            <strong>{currentSeasonStats.appearances} appearances</strong>
            {currentSeasonStats.goals > 0 && (
              <>
                , scoring <strong>{currentSeasonStats.goals} goals</strong>
              </>
            )}
            {currentSeasonStats.assists > 0 && (
              <>
                {" "}
                and providing{" "}
                <strong>{currentSeasonStats.assists} assists</strong>
              </>
            )}
            .
            {currentSeasonStats.rating && (
              <>
                {" "}
                The player maintains an average rating of{" "}
                <strong>{currentSeasonStats.rating.toFixed(2)}</strong>.
              </>
            )}
          </p>
        </section>
      )}

      {/* Last Match */}
      {lastMatch && lastMatch.status === "finished" && (
        <section className="space-y-2">
          <h3 className="text-base font-semibold">Last Match</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {displayName}&apos;s last{" "}
            <Link
              href={getPlayerMatchUrl(lastMatch)}
              className="font-semibold hover:underline text-foreground"
            >
              match
            </Link>{" "}
            was{" "}
            <Link
              href={getTeamUrl(lastMatch.homeTeamName, lastMatch.homeTeamId)}
              className="font-bold hover:underline text-foreground"
            >
              {lastMatch.homeTeamName}
            </Link>
            {" - "}
            <Link
              href={getTeamUrl(lastMatch.awayTeamName, lastMatch.awayTeamId)}
              className="font-bold hover:underline text-foreground"
            >
              {lastMatch.awayTeamName}
            </Link>
            {lastMatch.homeScore !== null && lastMatch.awayScore !== null && (
              <>
                {" "}
                ({lastMatch.homeScore} - {lastMatch.awayScore})
              </>
            )}
            {lastMatch.leagueName && lastMatch.leagueId && (
              <>
                {" "}
                in{" "}
                <Link
                  href={getLeagueUrl(lastMatch.leagueName, lastMatch.leagueId)}
                  className="font-bold hover:underline text-foreground"
                >
                  {lastMatch.leagueName}
                </Link>
              </>
            )}
            {lastMatch.date && <> on {formatDate(lastMatch.date)}</>}.
          </p>
        </section>
      )}

      {/* Transfer History Highlight */}
      {lastTransfer && (
        <section className="space-y-2">
          <h3 className="text-base font-semibold">Transfer History</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {displayName}&apos;s most recent transfer was from{" "}
            <Link
              href={getTeamUrl(
                lastTransfer.fromTeamName,
                lastTransfer.fromTeamId,
              )}
              className="font-bold hover:underline text-foreground"
            >
              {lastTransfer.fromTeamName}
            </Link>{" "}
            to{" "}
            <Link
              href={getTeamUrl(lastTransfer.toTeamName, lastTransfer.toTeamId)}
              className="font-bold hover:underline text-foreground"
            >
              {lastTransfer.toTeamName}
            </Link>
            {lastTransfer.date && <> on {formatDate(lastTransfer.date)}</>}
            {lastTransfer.amount && lastTransfer.amount > 0 && (
              <>
                {" "}
                for a fee of{" "}
                <strong>{formatTransferFee(lastTransfer.amount)}</strong>
              </>
            )}
            {lastTransfer.type === "loan" && <> (loan)</>}
            {lastTransfer.type === "free" && <> (free transfer)</>}.
            {transfers.length > 1 && (
              <>
                {" "}
                The player has had <strong>{transfers.length} transfers</strong>{" "}
                throughout their career.
              </>
            )}
          </p>
        </section>
      )}

      {/* Trophies */}
      {totalTrophies > 0 && (
        <section className="space-y-2">
          <h3 className="text-base font-semibold">Honours</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {displayName} has won{" "}
            <strong>
              {totalTrophies} {totalTrophies === 1 ? "trophy" : "trophies"}
            </strong>{" "}
            in their career, showcasing their winning mentality and contribution
            to team success.
          </p>
        </section>
      )}

      {/* Key Stats */}
      <section className="space-y-2">
        <h3 className="text-base font-semibold">Key Statistics</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          {age && dateOfBirth && (
            <li>
              <strong>Age:</strong> {age} years ({formatDate(dateOfBirth)})
            </li>
          )}
          {height && (
            <li>
              <strong>Height:</strong> {height} cm
            </li>
          )}
          {weight && (
            <li>
              <strong>Weight:</strong> {weight} kg
            </li>
          )}
          {position && (
            <li>
              <strong>Position:</strong> {positionDisplay}
            </li>
          )}
          {currentTeam && (
            <li>
              <strong>Current Club:</strong>{" "}
              <Link
                href={getTeamUrl(currentTeam.teamName, currentTeam.teamId)}
                className="hover:underline"
              >
                {currentTeam.teamName}
              </Link>
              {currentTeam.jerseyNumber && ` (#${currentTeam.jerseyNumber})`}
            </li>
          )}
          {nationality && (
            <li>
              <strong>Nationality:</strong> {nationality.name}
            </li>
          )}
          {careerTotals.appearances > 0 && (
            <li>
              <strong>Career Appearances:</strong> {careerTotals.appearances}
            </li>
          )}
          {careerTotals.goals > 0 && (
            <li>
              <strong>Career Goals:</strong> {careerTotals.goals}
            </li>
          )}
          {careerTotals.assists > 0 && (
            <li>
              <strong>Career Assists:</strong> {careerTotals.assists}
            </li>
          )}
          {totalTrophies > 0 && (
            <li>
              <strong>Trophies Won:</strong> {totalTrophies}
            </li>
          )}
        </ul>
      </section>

      {/* FAQ Section with proper schema markup */}
      <section className="space-y-3 pt-4 border-t border-border">
        <h3 className="text-base font-semibold">Frequently Asked Questions</h3>

        <div className="space-y-4">
          {age && (
            <div
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <h4 itemProp="name" className="text-sm font-medium">
                How old is {displayName}?
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
                  <strong>{displayName}</strong> is{" "}
                  <strong>{age} years old</strong>
                  {dateOfBirth && <>, born on {formatDate(dateOfBirth)}</>}.
                </p>
              </div>
            </div>
          )}

          {currentTeam && (
            <div
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <h4 itemProp="name" className="text-sm font-medium">
                Which team does {displayName} play for?
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
                  <strong>{displayName}</strong> currently plays for{" "}
                  <Link
                    href={getTeamUrl(currentTeam.teamName, currentTeam.teamId)}
                    className="font-bold hover:underline"
                  >
                    {currentTeam.teamName}
                  </Link>
                  {currentTeam.jerseyNumber && (
                    <> wearing the number {currentTeam.jerseyNumber} jersey</>
                  )}
                  .
                </p>
              </div>
            </div>
          )}

          {position && (
            <div
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <h4 itemProp="name" className="text-sm font-medium">
                What position does {displayName} play?
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
                  <strong>{displayName}</strong> plays as a{" "}
                  <strong>{positionDisplay}</strong>.
                </p>
              </div>
            </div>
          )}

          {height && (
            <div
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <h4 itemProp="name" className="text-sm font-medium">
                How tall is {displayName}?
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
                  <strong>{displayName}</strong> is <strong>{height} cm</strong>{" "}
                  tall
                  {weight && <> and weighs {weight} kg</>}.
                </p>
              </div>
            </div>
          )}

          {careerTotals.goals > 0 && (
            <div
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <h4 itemProp="name" className="text-sm font-medium">
                How many goals has {displayName} scored?
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
                  <strong>{displayName}</strong> has scored{" "}
                  <strong>{careerTotals.goals} goals</strong> in{" "}
                  <strong>{careerTotals.appearances} career appearances</strong>
                  {goalsPerGame && (
                    <>, averaging {goalsPerGame} goals per game</>
                  )}
                  .
                </p>
              </div>
            </div>
          )}

          {nationality && (
            <div
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <h4 itemProp="name" className="text-sm font-medium">
                What nationality is {displayName}?
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
                  <strong>{displayName}</strong> is{" "}
                  <strong>{nationality.name}</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
