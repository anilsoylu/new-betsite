import { Card, CardContent } from "@/components/ui/card";
import type { MatchStatistic, Team } from "@/types/football";

interface StatisticsTabProps {
  statistics: Array<MatchStatistic>;
  homeTeam: Team;
  awayTeam: Team;
}

// Priority order for statistics display
const STAT_PRIORITY: Record<string, number> = {
  "Ball Possession": 1,
  Possession: 1,
  "Total Shots": 2,
  "Shots Total": 2,
  "Shots On Target": 3,
  "Shots on Goal": 3,
  "Shots Off Target": 4,
  "Shots off Goal": 4,
  "Corner Kicks": 5,
  Corners: 5,
  Fouls: 6,
  Offsides: 7,
  "Yellow Cards": 8,
  "Red Cards": 9,
  Saves: 10,
  "Goalkeeper Saves": 10,
  "Passes Total": 11,
  "Total Passes": 11,
  "Passes Accurate": 12,
  "Accurate Passes": 12,
  "Pass Accuracy": 13,
};

export function StatisticsTab({
  statistics,
  homeTeam,
  awayTeam,
}: StatisticsTabProps) {
  // Sort statistics by priority
  const sortedStats = [...statistics].sort((a, b) => {
    const priorityA = STAT_PRIORITY[a.type] || 100;
    const priorityB = STAT_PRIORITY[b.type] || 100;
    return priorityA - priorityB;
  });

  return (
    <Card>
      <CardContent className="p-6">
        {/* Team names header */}
        <div className="flex justify-between items-center gap-2 mb-6 pb-4 border-b">
          <span className="font-semibold text-xs sm:text-sm md:text-base truncate max-w-[80px] sm:max-w-[120px] md:max-w-none">{homeTeam.name}</span>
          <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">Statistics</span>
          <span className="font-semibold text-xs sm:text-sm md:text-base truncate max-w-[80px] sm:max-w-[120px] md:max-w-none text-right">{awayTeam.name}</span>
        </div>

        {/* Statistics list */}
        <div className="space-y-4">
          {sortedStats.map((stat, index) => (
            <StatBar key={index} stat={stat} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface StatBarProps {
  stat: MatchStatistic;
}

function StatBar({ stat }: StatBarProps) {
  const homeValue = parseStatValue(stat.home);
  const awayValue = parseStatValue(stat.away);
  const total = homeValue + awayValue;

  // Calculate percentages for bar
  const homePercent = total > 0 ? (homeValue / total) * 100 : 50;
  const awayPercent = total > 0 ? (awayValue / total) * 100 : 50;

  // Determine if it's a percentage stat (like possession)
  const isPercentage =
    stat.type.toLowerCase().includes("possession") ||
    stat.type.toLowerCase().includes("accuracy");

  const homeDisplay = isPercentage ? `${homeValue}%` : homeValue;
  const awayDisplay = isPercentage ? `${awayValue}%` : awayValue;

  // Highlight winner
  const homeWins = homeValue > awayValue;
  const awayWins = awayValue > homeValue;

  return (
    <div className="space-y-2">
      {/* Values and label */}
      <div className="flex justify-between items-center gap-2 text-xs sm:text-sm">
        <span
          className={`font-medium tabular-nums flex-shrink-0 ${homeWins ? "text-foreground" : "text-muted-foreground"}`}
        >
          {homeDisplay}
        </span>
        <span className="text-muted-foreground text-center truncate max-w-[100px] sm:max-w-none">{stat.type}</span>
        <span
          className={`font-medium tabular-nums flex-shrink-0 ${awayWins ? "text-foreground" : "text-muted-foreground"}`}
        >
          {awayDisplay}
        </span>
      </div>

      {/* Bar */}
      <div className="flex h-2 rounded-full overflow-hidden bg-muted">
        <div
          className={`transition-all ${homeWins ? "bg-primary" : "bg-muted-foreground/30"}`}
          style={{ width: `${homePercent}%` }}
        />
        <div
          className={`transition-all ${awayWins ? "bg-primary" : "bg-muted-foreground/30"}`}
          style={{ width: `${awayPercent}%` }}
        />
      </div>
    </div>
  );
}

function parseStatValue(value: number | string | null): number {
  if (value === null) return 0;
  if (typeof value === "number") return value;

  // Handle percentage strings like "55%"
  const parsed = parseFloat(value.replace("%", ""));
  return isNaN(parsed) ? 0 : parsed;
}
