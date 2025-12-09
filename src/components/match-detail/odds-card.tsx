import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MatchOdds, Team } from "@/types/football";

interface OddsCardProps {
  odds: MatchOdds;
  homeTeam: Team;
  awayTeam: Team;
}

export function OddsCard({ odds, homeTeam, awayTeam }: OddsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Match Odds</CardTitle>
          {odds.bookmaker && (
            <span className="text-xs text-muted-foreground">{odds.bookmaker}</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {/* Home win */}
          <OddButton
            label="1"
            teamName={homeTeam.name}
            value={odds.home?.value}
            probability={odds.home?.probability}
          />

          {/* Draw */}
          <OddButton
            label="X"
            teamName="Draw"
            value={odds.draw?.value}
            probability={odds.draw?.probability}
          />

          {/* Away win */}
          <OddButton
            label="2"
            teamName={awayTeam.name}
            value={odds.away?.value}
            probability={odds.away?.probability}
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface OddButtonProps {
  label: string;
  teamName: string;
  value?: number;
  probability?: number | null;
}

function OddButton({ label, teamName, value, probability }: OddButtonProps) {
  if (!value) {
    return (
      <div className="text-center p-3 rounded-lg bg-muted/50">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-lg font-bold text-muted-foreground">-</p>
      </div>
    );
  }

  return (
    <div className="text-center p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer">
      <p className="text-xs text-muted-foreground mb-1 truncate" title={teamName}>
        {label}
      </p>
      <p className="text-lg font-bold tabular-nums">{value.toFixed(2)}</p>
      {probability && (
        <p className="text-xs text-muted-foreground mt-1">
          {(probability * 100).toFixed(0)}%
        </p>
      )}
    </div>
  );
}
