"use client";

import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  PolarRadiusAxis,
} from "recharts";
import type { PlayerDetail } from "@/types/football";

interface PlayerAttributesProps {
  player: PlayerDetail;
}

// Calculate attributes from player's season stats (already from API)
function calculateAttributes(player: PlayerDetail) {
  const stats = player.seasonStats;
  if (!stats || stats.length === 0) return null;

  // Get current season stats (most recent)
  const currentSeasonStats = stats[0];

  // Get career totals
  const totals = stats.reduce(
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

  const gamesPlayed = totals.appearances || 1;

  // Per 90 minutes stats (industry standard)
  const minutesPlayed = totals.minutesPlayed || 1;
  const per90 = minutesPlayed / 90;

  const goalsPer90 = totals.goals / per90 || 0;
  const assistsPer90 = totals.assists / per90 || 0;
  const goalContributions = goalsPer90 + assistsPer90;

  // Calculate percentile-like values based on position
  const position = player.position?.toLowerCase() || "";
  const isAttacker =
    position.includes("forward") ||
    position.includes("striker") ||
    position.includes("attack");
  const isMidfielder = position.includes("midfield");

  // Normalize based on position expectations
  let goalMax = isAttacker ? 1.0 : isMidfielder ? 0.5 : 0.2;
  let assistMax = isAttacker ? 0.5 : isMidfielder ? 0.6 : 0.3;

  // Minutes per game (out of 90)
  const avgMinutes = totals.minutesPlayed / gamesPlayed;
  const availabilityPct = Math.min(100, Math.round((avgMinutes / 90) * 100));

  // Discipline (cards per game, inverted)
  const cardsPerGame = (totals.yellowCards + totals.redCards * 2) / gamesPlayed;
  const disciplinePct = Math.max(0, Math.round(100 - cardsPerGame * 40));

  // Goal involvement
  const goalsPct = Math.min(100, Math.round((goalsPer90 / goalMax) * 100));
  const assistsPct = Math.min(
    100,
    Math.round((assistsPer90 / assistMax) * 100),
  );

  // Experience based on appearances relative to age
  // A top player might play ~50 games/season from age 18-35 (850 max career games)
  // We calculate expected games based on years since turning 18
  const playerAge = player.age || 25;
  const yearsActive = Math.max(1, playerAge - 18);
  const expectedGames = yearsActive * 40; // ~40 games per season average
  const experiencePct = Math.min(
    100,
    Math.round((gamesPlayed / Math.max(expectedGames, 50)) * 100),
  );

  // Aerial/Physical - estimate from goals for strikers (headers), otherwise lower
  const aerialPct = isAttacker ? Math.min(100, goalsPct * 0.7 + 30) : 50;

  return [
    { attribute: "Goals", value: goalsPct },
    { attribute: "Assists", value: assistsPct },
    { attribute: "Aerial", value: Math.round(aerialPct) },
    { attribute: "Discipline", value: disciplinePct },
    { attribute: "Experience", value: experiencePct },
    { attribute: "Availability", value: availabilityPct },
  ];
}

export function PlayerAttributes({ player }: PlayerAttributesProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const attributes = calculateAttributes(player);

  if (!attributes) {
    return null;
  }

  const positionLabel = player.position?.toLowerCase().includes("forward")
    ? "forwards"
    : player.position?.toLowerCase().includes("midfield")
      ? "midfielders"
      : player.position?.toLowerCase().includes("defend")
        ? "defenders"
        : player.position?.toLowerCase().includes("goal")
          ? "goalkeepers"
          : "players";

  // Theme-aware colors
  const gridColor = isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)";
  const textColor = isDark ? "#a1a1aa" : "#71717a";
  const radarColor = "#dc2626"; // Red like FotMob

  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-medium">Player Attributes</CardTitle>
        <p className="text-[11px] text-muted-foreground flex items-center gap-1">
          Compared to other {positionLabel}
          <HelpCircle className="h-3 w-3" />
        </p>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={attributes}>
              <PolarGrid
                stroke={gridColor}
                strokeWidth={1}
                gridType="polygon"
              />
              <PolarRadiusAxis
                tick={false}
                axisLine={false}
                domain={[0, 100]}
              />
              <PolarAngleAxis
                dataKey="attribute"
                tick={({ x, y, payload, index }) => {
                  const attr = attributes[index];
                  // Adjust positions for better fit
                  const offsetX =
                    index === 0
                      ? 0
                      : index === 1
                        ? 8
                        : index === 2
                          ? 8
                          : index === 3
                            ? 0
                            : index === 4
                              ? -8
                              : -8;
                  const offsetY = index === 0 ? -8 : index === 3 ? 12 : 0;

                  return (
                    <g transform={`translate(${x + offsetX},${y + offsetY})`}>
                      <text
                        textAnchor="middle"
                        fill={textColor}
                        fontSize={9}
                        fontWeight={500}
                      >
                        {payload.value}
                      </text>
                      <text
                        textAnchor="middle"
                        y={11}
                        fill={isDark ? "#fff" : "#000"}
                        fontSize={10}
                        fontWeight={600}
                      >
                        %{attr.value}
                      </text>
                    </g>
                  );
                }}
                tickLine={false}
              />
              <Radar
                name="Stats"
                dataKey="value"
                stroke={radarColor}
                fill={radarColor}
                fillOpacity={0.25}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
