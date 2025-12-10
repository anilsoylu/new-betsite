"use client";

import Image from "next/image";
import Link from "next/link";
import { cn, getTeamUrl } from "@/lib/utils";
import type { Standing, StandingRuleType } from "@/types/football";

interface StandingsTableProps {
  standings: Standing[];
  compact?: boolean;
  className?: string;
}

// Get position indicator color based on rule type from API
function getPositionStyle(ruleTypeId: StandingRuleType): {
  bg: string;
  text: string;
  border: string;
} {
  switch (ruleTypeId) {
    case 180: // UCL qualification
      return {
        bg: "bg-green-500/20",
        text: "text-green-600 dark:text-green-400",
        border: "border-l-green-500",
      };
    case 181: // UEL/UECL qualification
      return {
        bg: "bg-blue-500/20",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-l-blue-500",
      };
    case 182: // Relegation
      return {
        bg: "bg-red-500/20",
        text: "text-red-600 dark:text-red-400",
        border: "border-l-red-500",
      };
    case 183: // Promotion playoff
    case 184: // Championship playoff
      return {
        bg: "bg-amber-500/20",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-l-amber-500",
      };
    default:
      return {
        bg: "",
        text: "text-muted-foreground",
        border: "border-l-transparent",
      };
  }
}

export function StandingsTable({
  standings,
  compact = false,
  className,
}: StandingsTableProps) {
  if (standings.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        No standings available
      </div>
    );
  }

  // Get unique position types for legend
  const positionTypes = new Set(
    standings.map((s) => s.ruleTypeId).filter(Boolean),
  );

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground border-b border-border bg-muted/30">
              <th className="text-left font-medium py-3 pl-4 w-10">#</th>
              <th className="text-left font-medium py-3">Team</th>
              <th className="text-center font-medium py-3 w-10">P</th>
              {!compact && (
                <>
                  <th className="text-center font-medium py-3 w-10">W</th>
                  <th className="text-center font-medium py-3 w-10">D</th>
                  <th className="text-center font-medium py-3 w-10">L</th>
                  <th className="text-center font-medium py-3 w-12">GF</th>
                  <th className="text-center font-medium py-3 w-12">GA</th>
                </>
              )}
              <th className="text-center font-medium py-3 w-12">GD</th>
              <th className="text-center font-medium py-3 w-12">Pts</th>
              {!compact && (
                <>
                  <th className="text-center font-medium py-3 w-24">Form</th>
                  <th className="text-center font-medium py-3 pr-4 w-20">
                    Next
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {standings.map((team) => {
              const positionStyle = getPositionStyle(team.ruleTypeId);

              return (
                <tr
                  key={team.teamId}
                  className={cn(
                    "transition-colors hover:bg-muted/30 border-l-2",
                    positionStyle.border,
                  )}
                >
                  {/* Position */}
                  <td className="py-3 pl-4">
                    <div
                      className={cn(
                        "w-6 h-6 rounded flex items-center justify-center text-xs font-bold",
                        positionStyle.bg,
                        positionStyle.text,
                      )}
                    >
                      {team.position}
                    </div>
                  </td>

                  {/* Team */}
                  <td className="py-3">
                    <Link
                      href={getTeamUrl(team.teamName, team.teamId)}
                      className="flex items-center gap-2.5 hover:text-primary transition-colors group"
                    >
                      <Image
                        src={team.teamLogo}
                        alt={team.teamName}
                        width={24}
                        height={24}
                        className="object-contain shrink-0 w-[24px] h-auto"
                      />
                      <span className="font-medium truncate max-w-[150px] group-hover:text-primary">
                        {team.teamName}
                      </span>
                    </Link>
                  </td>

                  {/* Played */}
                  <td className="py-3 text-center text-muted-foreground">
                    {team.played}
                  </td>

                  {!compact && (
                    <>
                      {/* Won */}
                      <td className="py-3 text-center text-muted-foreground">
                        {team.won}
                      </td>
                      {/* Drawn */}
                      <td className="py-3 text-center text-muted-foreground">
                        {team.drawn}
                      </td>
                      {/* Lost */}
                      <td className="py-3 text-center text-muted-foreground">
                        {team.lost}
                      </td>
                      {/* Goals For */}
                      <td className="py-3 text-center text-muted-foreground">
                        {team.goalsFor}
                      </td>
                      {/* Goals Against */}
                      <td className="py-3 text-center text-muted-foreground">
                        {team.goalsAgainst}
                      </td>
                    </>
                  )}

                  {/* Goal Difference */}
                  <td
                    className={cn(
                      "py-3 text-center font-medium",
                      team.goalDifference > 0 &&
                        "text-green-600 dark:text-green-400",
                      team.goalDifference < 0 &&
                        "text-red-600 dark:text-red-400",
                      team.goalDifference === 0 && "text-muted-foreground",
                    )}
                  >
                    {team.goalDifference > 0
                      ? `+${team.goalDifference}`
                      : team.goalDifference}
                  </td>

                  {/* Points */}
                  <td className="py-3 text-center">
                    <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-1 rounded bg-muted font-bold">
                      {team.points}
                    </span>
                  </td>

                  {/* Form */}
                  {!compact && (
                    <>
                      <td className="py-3">
                        <div className="flex items-center justify-center gap-0.5">
                          {team.form.slice(-5).map((result, idx) => (
                            <span
                              key={idx}
                              className={cn(
                                "w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold text-white",
                                result === "W" && "bg-green-500",
                                result === "D" && "bg-gray-400",
                                result === "L" && "bg-red-500",
                              )}
                            >
                              {result}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Next Match */}
                      <td className="py-3 pr-4">
                        {team.nextMatch ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="text-[10px] text-muted-foreground">
                              {team.nextMatch.isHome ? "H" : "A"}
                            </span>
                            <Image
                              src={team.nextMatch.teamLogo}
                              alt={team.nextMatch.teamName}
                              width={20}
                              height={20}
                              className="object-contain w-[20px] h-auto"
                              title={team.nextMatch.teamName}
                            />
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            -
                          </span>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      {positionTypes.size > 0 && (
        <div className="px-4 py-3 border-t border-border bg-muted/20">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {positionTypes.has(180) && (
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-green-500" />
                <span>Champions League</span>
              </div>
            )}
            {positionTypes.has(181) && (
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                <span>Europa League</span>
              </div>
            )}
            {(positionTypes.has(183) || positionTypes.has(184)) && (
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                <span>Playoff</span>
              </div>
            )}
            {positionTypes.has(182) && (
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-red-500" />
                <span>Relegation</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
