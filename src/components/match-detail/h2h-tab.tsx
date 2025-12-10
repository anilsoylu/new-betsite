import Image from "next/image";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { H2HFixture } from "@/types/football";

interface H2HTabProps {
  h2h: Array<H2HFixture>;
  homeTeamId: number;
  awayTeamId: number;
}

export function H2HTab({ h2h, homeTeamId, awayTeamId }: H2HTabProps) {
  // Calculate stats
  const stats = calculateH2HStats(h2h, homeTeamId, awayTeamId);

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Head to Head Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">
                {stats.team1Wins}
              </p>
              <p className="text-xs text-muted-foreground">Wins</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-muted-foreground">
                {stats.draws}
              </p>
              <p className="text-xs text-muted-foreground">Draws</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">
                {stats.team2Wins}
              </p>
              <p className="text-xs text-muted-foreground">Wins</p>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">
            Last {h2h.length} meetings
          </p>
        </CardContent>
      </Card>

      {/* Match list */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Previous Matches
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {h2h.map((match) => (
              <H2HMatchRow
                key={match.id}
                match={match}
                highlightTeamId={homeTeamId}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface H2HMatchRowProps {
  match: H2HFixture;
  highlightTeamId: number;
}

function H2HMatchRow({ match, highlightTeamId }: H2HMatchRowProps) {
  const formattedDate = format(new Date(match.date), "dd MMM yyyy");

  // Determine if highlighted team won/lost
  const isHighlightedHome = match.homeTeam.id === highlightTeamId;
  const highlightedScore = isHighlightedHome
    ? match.homeScore
    : match.awayScore;
  const opponentScore = isHighlightedHome ? match.awayScore : match.homeScore;

  let resultClass = "text-muted-foreground";
  if (highlightedScore > opponentScore) {
    resultClass = "text-green-600 dark:text-green-400";
  } else if (highlightedScore < opponentScore) {
    resultClass = "text-red-600 dark:text-red-400";
  }

  return (
    <div className="p-4 hover:bg-muted/30 transition-colors">
      {/* Date and league */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
        <span>{formattedDate}</span>
        {match.league && (
          <div className="flex items-center gap-1">
            {match.league.logo && (
              <Image
                src={match.league.logo}
                alt={match.league.name}
                width={14}
                height={14}
                className="object-contain w-auto h-auto"
              />
            )}
            <span className="truncate max-w-[100px]">{match.league.name}</span>
          </div>
        )}
      </div>

      {/* Teams and score */}
      <div className="flex items-center justify-between gap-2">
        {/* Home team */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {match.homeTeam.logo && (
            <Image
              src={match.homeTeam.logo}
              alt={match.homeTeam.name}
              width={24}
              height={24}
              className="object-contain flex-shrink-0"
            />
          )}
          <span
            className={cn(
              "truncate",
              match.winnerId === match.homeTeam.id && "font-semibold",
            )}
          >
            {match.homeTeam.name}
          </span>
        </div>

        {/* Score */}
        <div className={cn("text-lg font-bold tabular-nums px-4", resultClass)}>
          {match.homeScore} - {match.awayScore}
        </div>

        {/* Away team */}
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span
            className={cn(
              "truncate text-right",
              match.winnerId === match.awayTeam.id && "font-semibold",
            )}
          >
            {match.awayTeam.name}
          </span>
          {match.awayTeam.logo && (
            <Image
              src={match.awayTeam.logo}
              alt={match.awayTeam.name}
              width={24}
              height={24}
              className="object-contain flex-shrink-0"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function calculateH2HStats(
  h2h: Array<H2HFixture>,
  team1Id: number,
  team2Id: number,
): { team1Wins: number; team2Wins: number; draws: number } {
  let team1Wins = 0;
  let team2Wins = 0;
  let draws = 0;

  for (const match of h2h) {
    if (match.winnerId === team1Id) {
      team1Wins++;
    } else if (match.winnerId === team2Id) {
      team2Wins++;
    } else {
      draws++;
    }
  }

  return { team1Wins, team2Wins, draws };
}
