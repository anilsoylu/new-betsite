import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PlayerSeasonStats } from "@/types/football";

interface PlayerStatsProps {
  stats: Array<PlayerSeasonStats>;
}

export function PlayerStats({ stats }: PlayerStatsProps) {
  if (stats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Season Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No statistics available
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate career totals
  const careerTotals = stats.reduce(
    (acc, s) => ({
      appearances: acc.appearances + s.appearances,
      goals: acc.goals + s.goals,
      assists: acc.assists + s.assists,
      minutesPlayed: acc.minutesPlayed + s.minutesPlayed,
      yellowCards: acc.yellowCards + s.yellowCards,
      redCards: acc.redCards + s.redCards,
    }),
    {
      appearances: 0,
      goals: 0,
      assists: 0,
      minutesPlayed: 0,
      yellowCards: 0,
      redCards: 0,
    },
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Season Statistics</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {stats.length} seasons
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Career Summary */}
        <div className="px-4 pb-4 grid grid-cols-3 gap-2">
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <p className="text-xl font-bold">{careerTotals.appearances}</p>
            <p className="text-[10px] text-muted-foreground uppercase">
              Matches
            </p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <p className="text-xl font-bold">{careerTotals.goals}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Goals</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <p className="text-xl font-bold">{careerTotals.assists}</p>
            <p className="text-[10px] text-muted-foreground uppercase">
              Assists
            </p>
          </div>
        </div>

        {/* Stats Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-t bg-muted/30">
                <th className="text-left p-2 font-medium">Season</th>
                <th className="text-center p-2 font-medium w-10">M</th>
                <th className="text-center p-2 font-medium w-10">G</th>
                <th className="text-center p-2 font-medium w-10">A</th>
                <th className="text-center p-2 font-medium w-14">Min</th>
                <th className="text-center p-2 font-medium w-10">
                  <span className="inline-block w-2 h-3 bg-yellow-400 rounded-sm" />
                </th>
                <th className="text-center p-2 font-medium w-10">
                  <span className="inline-block w-2 h-3 bg-red-500 rounded-sm" />
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.map((season) => (
                <tr
                  key={`${season.seasonId}-${season.teamId}`}
                  className="border-t hover:bg-muted/30"
                >
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      {season.teamLogo && (
                        <Image
                          src={season.teamLogo}
                          alt={season.teamName}
                          width={16}
                          height={16}
                          className="object-contain"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="font-medium truncate">
                          {season.seasonName}
                        </p>
                        {season.leagueName && (
                          <p className="text-[10px] text-muted-foreground truncate">
                            {season.leagueName}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="text-center p-2 tabular-nums">
                    {season.appearances || "-"}
                  </td>
                  <td className="text-center p-2 tabular-nums font-medium">
                    {season.goals || "-"}
                  </td>
                  <td className="text-center p-2 tabular-nums">
                    {season.assists || "-"}
                  </td>
                  <td className="text-center p-2 tabular-nums text-muted-foreground">
                    {season.minutesPlayed || "-"}
                  </td>
                  <td className="text-center p-2 tabular-nums">
                    {season.yellowCards || "-"}
                  </td>
                  <td className="text-center p-2 tabular-nums">
                    {season.redCards || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
