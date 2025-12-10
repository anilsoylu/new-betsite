import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn, getTeamUrl } from "@/lib/utils";
import type { StandingTable, Standing } from "@/types/football";

interface StandingsTabProps {
  standings: Array<StandingTable>;
  homeTeamId: number;
  awayTeamId: number;
}

export function StandingsTab({
  standings,
  homeTeamId,
  awayTeamId,
}: StandingsTabProps) {
  // Use first standing table (main table)
  const mainTable = standings[0];

  if (!mainTable) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <p>No standings available</p>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        {mainTable.name && (
          <div className="px-4 py-3 border-b">
            <h3 className="font-medium">{mainTable.name}</h3>
          </div>
        )}

        {/* Table header */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 w-8">#</th>
                <th className="text-left p-3">Team</th>
                <th className="text-center p-3 w-10">P</th>
                <th className="text-center p-3 w-10">W</th>
                <th className="text-center p-3 w-10">D</th>
                <th className="text-center p-3 w-10">L</th>
                <th className="text-center p-3 w-12">GD</th>
                <th className="text-center p-3 w-10 font-semibold">Pts</th>
                <th className="text-center p-3 w-24 hidden sm:table-cell">
                  Form
                </th>
              </tr>
            </thead>
            <tbody>
              {mainTable.standings.map((standing) => (
                <StandingRow
                  key={standing.teamId}
                  standing={standing}
                  isHighlighted={
                    standing.teamId === homeTeamId ||
                    standing.teamId === awayTeamId
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

interface StandingRowProps {
  standing: Standing;
  isHighlighted: boolean;
}

function StandingRow({ standing, isHighlighted }: StandingRowProps) {
  return (
    <tr
      className={cn(
        "border-b last:border-0 hover:bg-muted/30 transition-colors",
        isHighlighted && "bg-primary/5",
      )}
    >
      <td className="p-3 text-muted-foreground">{standing.position}</td>
      <td className="p-3">
        <Link
          href={getTeamUrl(standing.teamName, standing.teamId)}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          {standing.teamLogo && (
            <Image
              src={standing.teamLogo}
              alt={standing.teamName}
              width={20}
              height={20}
              className="object-contain"
            />
          )}
          <span
            className={cn(
              "truncate max-w-[120px] sm:max-w-[180px]",
              isHighlighted && "font-semibold",
            )}
          >
            {standing.teamName}
          </span>
        </Link>
      </td>
      <td className="p-3 text-center tabular-nums">{standing.played}</td>
      <td className="p-3 text-center tabular-nums">{standing.won}</td>
      <td className="p-3 text-center tabular-nums">{standing.drawn}</td>
      <td className="p-3 text-center tabular-nums">{standing.lost}</td>
      <td className="p-3 text-center tabular-nums">
        <span
          className={cn(
            standing.goalDifference > 0 && "text-green-600 dark:text-green-400",
            standing.goalDifference < 0 && "text-red-600 dark:text-red-400",
          )}
        >
          {standing.goalDifference > 0
            ? `+${standing.goalDifference}`
            : standing.goalDifference}
        </span>
      </td>
      <td className="p-3 text-center font-semibold tabular-nums">
        {standing.points}
      </td>
      <td className="p-3 hidden sm:table-cell">
        <div className="flex justify-center gap-1">
          {standing.form.slice(0, 5).map((result, index) => (
            <FormBadge key={index} result={result} />
          ))}
        </div>
      </td>
    </tr>
  );
}

function FormBadge({ result }: { result: "W" | "D" | "L" }) {
  const colors = {
    W: "bg-green-500",
    D: "bg-gray-400",
    L: "bg-red-500",
  };

  return (
    <span
      className={cn(
        "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white",
        colors[result],
      )}
    >
      {result}
    </span>
  );
}
