"use client";

import Link from "next/link";
import { format, differenceInYears, parseISO, isValid } from "date-fns";
import type { CoachDetail, PlayerDetail } from "@/types/football";
import { getTeamUrl, getPlayerUrl, getLeagueUrl } from "@/lib/utils";

interface CoachAboutSectionProps {
  coach: CoachDetail;
  playerCareer?: PlayerDetail | null;
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

function getCareerYears(startYear: number | null, endYear: number | null): string {
  if (!startYear) return "";
  if (!endYear) return `${startYear} - Present`;
  return `${startYear} - ${endYear}`;
}

export function CoachAboutSection({ coach, playerCareer }: CoachAboutSectionProps) {
  const {
    displayName,
    firstName,
    dateOfBirth,
    age,
    height,
    weight,
    nationality,
    currentTeam,
    teams,
    trophies,
    formerPlayerId,
  } = coach;

  // Coaching career stats
  const headCoachTeams = teams.filter((t) => t.position === "Head Coach");
  const assistantTeams = teams.filter((t) => t.position !== "Head Coach");
  const nationalTeams = teams.filter((t) => t.teamType === "national");
  const titlesWonAsCoach = trophies.filter((t) => t.position === 1).length;

  // Get coaching career span
  const coachingTeamsSorted = [...teams].sort((a, b) => {
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });
  const firstCoachingJob = coachingTeamsSorted[0];
  const coachingStartYear = firstCoachingJob?.startDate
    ? new Date(firstCoachingJob.startDate).getFullYear()
    : null;

  // Player career stats (if available)
  const playerCareerTotals = playerCareer?.seasonStats.reduce(
    (acc, s) => ({
      appearances: acc.appearances + s.appearances,
      goals: acc.goals + s.goals,
      assists: acc.assists + s.assists,
    }),
    { appearances: 0, goals: 0, assists: 0 },
  );

  const playerTeams = playerCareer?.teams.filter(
    (t) => t.teamType === "club" || t.teamType === "domestic",
  );
  const playerFirstTeam = playerTeams?.[playerTeams.length - 1];
  const playerLastTeam = playerTeams?.[0];
  const playerCareerStart = playerFirstTeam?.startDate
    ? new Date(playerFirstTeam.startDate).getFullYear()
    : null;
  const playerCareerEnd = playerLastTeam?.endDate
    ? new Date(playerLastTeam.endDate).getFullYear()
    : null;

  const playerTitlesWon = playerCareer?.trophies.filter((t) => t.position === 1).length || 0;

  return (
    <article className="rounded-xl border border-border bg-card p-5 space-y-5">
      {/* Main Title - H2 for SEO */}
      <h2 className="text-xl font-bold">About {displayName}</h2>

      {/* Main Description */}
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-3">
        <p>
          <strong>{displayName}</strong> is{" "}
          {nationality ? `a ${nationality.name} ` : "a "}
          professional football manager
          {age ? `, ${age} years old` : ""}
          {dateOfBirth && ` (born ${formatDate(dateOfBirth)})`}.
          {currentTeam && (
            <>
              {" "}
              Currently serving as {currentTeam.position || "Head Coach"} at{" "}
              <Link
                href={getTeamUrl(currentTeam.teamName, currentTeam.teamId)}
                className="font-bold hover:underline"
              >
                {currentTeam.teamName}
              </Link>
              .
            </>
          )}
        </p>

        {headCoachTeams.length > 0 && (
          <p>
            Throughout their managerial career, {firstName || displayName} has
            managed{" "}
            <strong>
              {headCoachTeams.length}{" "}
              {headCoachTeams.length === 1 ? "team" : "teams"}
            </strong>{" "}
            as head coach
            {nationalTeams.length > 0 && (
              <>
                , including{" "}
                <strong>
                  {nationalTeams.length} national{" "}
                  {nationalTeams.length === 1 ? "team" : "teams"}
                </strong>
              </>
            )}
            {titlesWonAsCoach > 0 && (
              <>
                , winning{" "}
                <strong>
                  {titlesWonAsCoach}{" "}
                  {titlesWonAsCoach === 1 ? "title" : "titles"}
                </strong>
              </>
            )}
            .
          </p>
        )}
      </div>

      {/* Playing Career Section */}
      {playerCareer && formerPlayerId && (
        <section className="space-y-2">
          <h3 className="text-base font-semibold">Playing Career</h3>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Before transitioning to management, {displayName} had a
              professional playing career
              {playerCareer.position && (
                <>
                  {" "}
                  as a <strong>{playerCareer.detailedPosition || playerCareer.position}</strong>
                </>
              )}
              {playerCareerStart && (
                <> from {getCareerYears(playerCareerStart, playerCareerEnd)}</>
              )}
              .
              {playerCareerTotals && playerCareerTotals.appearances > 0 && (
                <>
                  {" "}
                  During their playing days, {firstName || displayName} made{" "}
                  <strong>{playerCareerTotals.appearances} appearances</strong>
                  {playerCareerTotals.goals > 0 && (
                    <>
                      , scoring <strong>{playerCareerTotals.goals} goals</strong>
                    </>
                  )}
                  {playerCareerTotals.assists > 0 && (
                    <>
                      {" "}
                      and providing{" "}
                      <strong>{playerCareerTotals.assists} assists</strong>
                    </>
                  )}
                  .
                </>
              )}
              {playerTitlesWon > 0 && (
                <>
                  {" "}
                  As a player, they won{" "}
                  <strong>
                    {playerTitlesWon} {playerTitlesWon === 1 ? "trophy" : "trophies"}
                  </strong>
                  .
                </>
              )}
            </p>
            <p className="mt-2">
              <Link
                href={getPlayerUrl(playerCareer.displayName, playerCareer.id)}
                className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
              >
                View full playing career
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </p>
          </div>
        </section>
      )}

      {/* Managerial Career Section */}
      {headCoachTeams.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-base font-semibold">Managerial Career</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {displayName}&apos;s managerial career
            {coachingStartYear && <> began in {coachingStartYear}</>}. They have
            served as head coach for{" "}
            {headCoachTeams.slice(0, 3).map((team, index, arr) => (
              <span key={team.id}>
                <Link
                  href={getTeamUrl(team.teamName, team.teamId)}
                  className="font-bold hover:underline text-foreground"
                >
                  {team.teamName}
                </Link>
                {index < arr.length - 2 && ", "}
                {index === arr.length - 2 && " and "}
              </span>
            ))}
            {headCoachTeams.length > 3 && (
              <> and {headCoachTeams.length - 3} other teams</>
            )}
            .
            {assistantTeams.length > 0 && (
              <>
                {" "}
                Additionally, {firstName || displayName} has worked as an
                assistant coach at {assistantTeams.length}{" "}
                {assistantTeams.length === 1 ? "club" : "clubs"}.
              </>
            )}
          </p>
        </section>
      )}

      {/* Honours Section */}
      {(titlesWonAsCoach > 0 || playerTitlesWon > 0) && (
        <section className="space-y-2">
          <h3 className="text-base font-semibold">Honours</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {titlesWonAsCoach > 0 && (
              <>
                As a manager, {displayName} has won{" "}
                <strong>
                  {titlesWonAsCoach}{" "}
                  {titlesWonAsCoach === 1 ? "title" : "titles"}
                </strong>
                , demonstrating their ability to lead teams to success.
              </>
            )}
            {playerTitlesWon > 0 && titlesWonAsCoach > 0 && " "}
            {playerTitlesWon > 0 && (
              <>
                During their playing career, they also collected{" "}
                <strong>
                  {playerTitlesWon}{" "}
                  {playerTitlesWon === 1 ? "trophy" : "trophies"}
                </strong>
                .
              </>
            )}
            {titlesWonAsCoach > 0 && playerTitlesWon > 0 && (
              <>
                {" "}
                In total, {firstName || displayName} has been part of{" "}
                <strong>
                  {titlesWonAsCoach + playerTitlesWon} title-winning campaigns
                </strong>{" "}
                as both player and manager.
              </>
            )}
          </p>
        </section>
      )}

      {/* Key Statistics */}
      <section className="space-y-2">
        <h3 className="text-base font-semibold">Key Statistics</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          {currentTeam && (
            <li>
              <strong>Current Team:</strong>{" "}
              <Link
                href={getTeamUrl(currentTeam.teamName, currentTeam.teamId)}
                className="hover:underline"
              >
                {currentTeam.teamName}
              </Link>
            </li>
          )}
          {nationality && (
            <li>
              <strong>Nationality:</strong> {nationality.name}
            </li>
          )}
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
          <li>
            <strong>Teams Managed:</strong> {headCoachTeams.length}
            {assistantTeams.length > 0 && ` (+${assistantTeams.length} as assistant)`}
          </li>
          <li>
            <strong>Titles Won (as manager):</strong> {titlesWonAsCoach}
          </li>
          {formerPlayerId && playerCareer && (
            <li>
              <strong>Former Player:</strong>{" "}
              <Link
                href={getPlayerUrl(playerCareer.displayName, playerCareer.id)}
                className="hover:underline"
              >
                View playing career
              </Link>
              {playerCareerTotals && playerCareerTotals.appearances > 0 && (
                <> ({playerCareerTotals.appearances} apps, {playerCareerTotals.goals} goals)</>
              )}
            </li>
          )}
        </ul>
      </section>

      {/* FAQ Section with proper schema markup */}
      <section className="space-y-3 pt-4 border-t border-border">
        <h3 className="text-base font-semibold">Frequently Asked Questions</h3>

        <div className="space-y-4">
          {/* Current team question */}
          <div
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <h4 itemProp="name" className="text-sm font-medium">
              What team does {displayName} manage?
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
                {currentTeam ? (
                  <>
                    <strong>{displayName}</strong> is currently the{" "}
                    {currentTeam.position || "Head Coach"} of{" "}
                    <Link
                      href={getTeamUrl(currentTeam.teamName, currentTeam.teamId)}
                      className="font-bold hover:underline"
                    >
                      {currentTeam.teamName}
                    </Link>
                    .
                  </>
                ) : (
                  <>
                    <strong>{displayName}</strong> is not currently managing any
                    team.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Titles won question */}
          {titlesWonAsCoach > 0 && (
            <div
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <h4 itemProp="name" className="text-sm font-medium">
                How many titles has {displayName} won as a manager?
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
                  <strong>{displayName}</strong> has won{" "}
                  <strong>
                    {titlesWonAsCoach}{" "}
                    {titlesWonAsCoach === 1 ? "title" : "titles"}
                  </strong>{" "}
                  throughout their managerial career.
                </p>
              </div>
            </div>
          )}

          {/* Playing career question */}
          {formerPlayerId && (
            <div
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <h4 itemProp="name" className="text-sm font-medium">
                Was {displayName} a professional footballer?
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
                  Yes, <strong>{displayName}</strong> had a professional playing
                  career
                  {playerCareer?.position && (
                    <> as a {playerCareer.detailedPosition || playerCareer.position}</>
                  )}
                  {playerCareerTotals && playerCareerTotals.appearances > 0 && (
                    <>
                      , making {playerCareerTotals.appearances} appearances
                      {playerCareerTotals.goals > 0 && (
                        <> and scoring {playerCareerTotals.goals} goals</>
                      )}
                    </>
                  )}
                  {" "}before transitioning to management.{" "}
                  {playerCareer && (
                    <Link
                      href={getPlayerUrl(playerCareer.displayName, playerCareer.id)}
                      className="font-medium hover:underline"
                    >
                      View playing career
                    </Link>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Nationality question */}
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
                  <strong>{displayName}</strong> is from{" "}
                  <strong>{nationality.name}</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Age question */}
          {age && dateOfBirth && (
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
                  <strong>{age} years old</strong>, born on{" "}
                  {formatDate(dateOfBirth)}.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
