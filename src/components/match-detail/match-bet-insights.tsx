"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Star,
  Target,
  Activity,
} from "lucide-react";
import type {
  MatchInsights,
  BetRecommendation,
  FormMetrics,
  KeyPlayerMissing,
  Sidelined,
} from "@/types/football";
import { getTeamUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface MatchBetInsightsProps {
  insights: MatchInsights;
  homeTeam: { id: number; name: string };
  awayTeam: { id: number; name: string };
}

export function MatchBetInsights({
  insights,
  homeTeam,
  awayTeam,
}: MatchBetInsightsProps) {
  const [marketsOpen, setMarketsOpen] = useState(false);

  const {
    homeFormMetrics,
    awayFormMetrics,
    h2hMetrics,
    sidelined,
    keyPlayersMissing,
    recommendations,
    topPicks,
  } = insights;

  const hasInjuryData =
    sidelined.home.length > 0 ||
    sidelined.away.length > 0 ||
    keyPlayersMissing.length > 0;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="h-5 w-5" />
          Match Analysis & Betting Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Top Picks Section */}
        {topPicks.length > 0 && (
          <TopPicksSection picks={topPicks} />
        )}

        {/* Form Analysis */}
        {(homeFormMetrics.played > 0 || awayFormMetrics.played > 0) && (
          <FormAnalysisSection
            homeMetrics={homeFormMetrics}
            awayMetrics={awayFormMetrics}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
          />
        )}

        {/* H2H Analysis */}
        {h2hMetrics.totalMatches > 0 && (
          <H2HAnalysisSection
            metrics={h2hMetrics}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
          />
        )}

        {/* Injuries & Suspensions */}
        {hasInjuryData && (
          <InjuriesSection
            sidelined={sidelined}
            keyPlayersMissing={keyPlayersMissing}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
          />
        )}

        {/* All Markets - Collapsible */}
        {recommendations.length > 0 && (
          <Collapsible open={marketsOpen} onOpenChange={setMarketsOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between"
                size="sm"
              >
                <span className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  All Market Analysis ({recommendations.length} markets)
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    marketsOpen && "rotate-180"
                  )}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <AllMarketsSection recommendations={recommendations} />
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* No Data Fallback */}
        {topPicks.length === 0 &&
          homeFormMetrics.played === 0 &&
          awayFormMetrics.played === 0 &&
          h2hMetrics.totalMatches === 0 && (
            <p className="text-muted-foreground text-sm text-center py-4">
              Insufficient data available for detailed betting analysis.
            </p>
          )}
      </CardContent>
    </Card>
  );
}

// ==========================================
// Top Picks Section
// ==========================================

function TopPicksSection({ picks }: { picks: BetRecommendation[] }) {
  return (
    <div>
      <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
        <Star className="h-4 w-4 text-yellow-500" />
        Top Betting Picks
      </h3>
      <div className="grid gap-3">
        {picks.map((pick, idx) => (
          <div
            key={`${pick.marketId}-${idx}`}
            className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
          >
            <ConfidenceBadge confidence={pick.confidence} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold">{pick.pick}</span>
                <span className="text-xs text-muted-foreground">
                  ({pick.marketName})
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {pick.reasoning}
              </p>
              {pick.odds && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-medium">
                    Odds: {pick.odds.toFixed(2)}
                  </span>
                  {pick.impliedProbability && (
                    <span className="text-xs text-muted-foreground">
                      (Implied: {(pick.impliedProbability * 100).toFixed(0)}%)
                    </span>
                  )}
                  {pick.hasValue && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Value
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// Form Analysis Section
// ==========================================

function FormAnalysisSection({
  homeMetrics,
  awayMetrics,
  homeTeam,
  awayTeam,
}: {
  homeMetrics: FormMetrics;
  awayMetrics: FormMetrics;
  homeTeam: { id: number; name: string };
  awayTeam: { id: number; name: string };
}) {
  return (
    <div>
      <h3 className="font-semibold text-base mb-3">Recent Form Analysis</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {homeMetrics.played > 0 && (
          <FormCard team={homeTeam} metrics={homeMetrics} isHome />
        )}
        {awayMetrics.played > 0 && (
          <FormCard team={awayTeam} metrics={awayMetrics} isHome={false} />
        )}
      </div>
    </div>
  );
}

function FormCard({
  team,
  metrics,
  isHome,
}: {
  team: { id: number; name: string };
  metrics: FormMetrics;
  isHome: boolean;
}) {
  const ppgRating = metrics.ppg >= 2 ? "excellent" : metrics.ppg >= 1.5 ? "good" : metrics.ppg >= 1 ? "average" : "poor";
  const ppgColor = {
    excellent: "text-green-600 dark:text-green-400",
    good: "text-blue-600 dark:text-blue-400",
    average: "text-yellow-600 dark:text-yellow-400",
    poor: "text-red-600 dark:text-red-400",
  }[ppgRating];

  return (
    <div className="p-3 border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <Link
          href={getTeamUrl(team.name, team.id)}
          className="font-semibold hover:underline text-sm"
        >
          {team.name}
        </Link>
        <Badge variant="outline" className="text-xs">
          {isHome ? "Home" : "Away"}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">PPG:</span>{" "}
          <span className={cn("font-semibold", ppgColor)}>
            {metrics.ppg.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Win Rate:</span>{" "}
          <span className="font-semibold">
            {(metrics.winRate * 100).toFixed(0)}%
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Clean Sheets:</span>{" "}
          <span className="font-semibold">
            {(metrics.cleanSheetRate * 100).toFixed(0)}%
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">BTTS:</span>{" "}
          <span className="font-semibold">
            {(metrics.bttsRate * 100).toFixed(0)}%
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">O2.5:</span>{" "}
          <span className="font-semibold">
            {(metrics.over25Rate * 100).toFixed(0)}%
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Record:</span>{" "}
          <span className="font-semibold">
            {metrics.wins}W-{metrics.draws}D-{metrics.losses}L
          </span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// H2H Analysis Section
// ==========================================

function H2HAnalysisSection({
  metrics,
  homeTeam,
  awayTeam,
}: {
  metrics: MatchInsights["h2hMetrics"];
  homeTeam: { id: number; name: string };
  awayTeam: { id: number; name: string };
}) {
  const dominantTeam =
    metrics.homeWins > metrics.awayWins
      ? homeTeam
      : metrics.awayWins > metrics.homeWins
        ? awayTeam
        : null;

  // Calculate home win rate from available data
  const homeWinRate = metrics.totalMatches > 0
    ? metrics.homeWins / metrics.totalMatches
    : 0;

  return (
    <div>
      <h3 className="font-semibold text-base mb-3">Head-to-Head Analysis</h3>
      <div className="p-3 border rounded-lg space-y-3">
        {/* Overall H2H */}
        <div className="flex items-center justify-between text-sm">
          <span>
            Last <strong>{metrics.totalMatches}</strong> meetings:
          </span>
          <span className="font-semibold">
            {metrics.homeWins}W - {metrics.draws}D - {metrics.awayWins}W
          </span>
        </div>

        {/* Goal Stats */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Avg Goals/Game:</span>{" "}
            <span className="font-semibold">{metrics.avgGoals.toFixed(1)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">BTTS Rate:</span>{" "}
            <span className="font-semibold">
              {(metrics.bttsRate * 100).toFixed(0)}%
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Over 2.5:</span>{" "}
            <span className="font-semibold">
              {(metrics.over25Rate * 100).toFixed(0)}%
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Home Win Rate:</span>{" "}
            <span className="font-semibold">
              {(homeWinRate * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Dominance indicator */}
        {dominantTeam && (
          <div className="flex items-center gap-2 text-sm pt-2 border-t">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span>
              <Link
                href={getTeamUrl(dominantTeam.name, dominantTeam.id)}
                className="font-semibold hover:underline"
              >
                {dominantTeam.name}
              </Link>{" "}
              has the edge in recent history
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// Injuries Section
// ==========================================

function InjuriesSection({
  sidelined,
  keyPlayersMissing,
  homeTeam,
  awayTeam,
}: {
  sidelined: { home: Sidelined[]; away: Sidelined[] };
  keyPlayersMissing: KeyPlayerMissing[];
  homeTeam: { id: number; name: string };
  awayTeam: { id: number; name: string };
}) {
  const homeKeyMissing = keyPlayersMissing.filter(
    (p) => p.player.teamId === homeTeam.id
  );
  const awayKeyMissing = keyPlayersMissing.filter(
    (p) => p.player.teamId === awayTeam.id
  );

  const hasKeyMissing = keyPlayersMissing.length > 0;

  // Get display label for key type
  const getKeyTypeLabel = (keyType: KeyPlayerMissing["keyType"]) => {
    switch (keyType) {
      case "topScorer":
        return "Top Scorer";
      case "topAssist":
        return "Assists Leader";
      case "topRated":
        return "Top Rated";
    }
  };

  return (
    <div>
      <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-orange-500" />
        Injuries & Suspensions
      </h3>

      {/* Key Players Missing Alert */}
      {hasKeyMissing && (
        <div className="mb-3 p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
          <p className="text-sm font-semibold text-orange-800 dark:text-orange-200 mb-2">
            Key Players Missing:
          </p>
          <div className="flex flex-wrap gap-2">
            {keyPlayersMissing.map((kpm) => (
              <Badge
                key={kpm.player.playerId}
                variant="outline"
                className="text-xs border-orange-300 dark:border-orange-700"
              >
                <Star className="h-3 w-3 mr-1 text-yellow-500" />
                {kpm.player.playerName} ({kpm.player.teamId === homeTeam.id ? homeTeam.name : awayTeam.name})
                {" - "}{getKeyTypeLabel(kpm.keyType)}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {/* Home Team */}
        <div className="text-sm">
          <p className="font-semibold mb-2">{homeTeam.name}:</p>
          {sidelined.home.length > 0 ? (
            <ul className="space-y-1">
              {sidelined.home.slice(0, 5).map((s) => (
                <li key={s.id} className="flex items-center gap-2 text-muted-foreground">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      s.category === "injury" ? "bg-red-500" : "bg-yellow-500"
                    )}
                  />
                  <span className={homeKeyMissing.some(k => k.player.playerId === s.playerId) ? "font-semibold text-foreground" : ""}>
                    {s.playerName}
                  </span>
                  <span className="text-xs">({s.category})</span>
                </li>
              ))}
              {sidelined.home.length > 5 && (
                <li className="text-xs text-muted-foreground">
                  +{sidelined.home.length - 5} more
                </li>
              )}
            </ul>
          ) : (
            <p className="text-muted-foreground">No reported absences</p>
          )}
        </div>

        {/* Away Team */}
        <div className="text-sm">
          <p className="font-semibold mb-2">{awayTeam.name}:</p>
          {sidelined.away.length > 0 ? (
            <ul className="space-y-1">
              {sidelined.away.slice(0, 5).map((s) => (
                <li key={s.id} className="flex items-center gap-2 text-muted-foreground">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      s.category === "injury" ? "bg-red-500" : "bg-yellow-500"
                    )}
                  />
                  <span className={awayKeyMissing.some(k => k.player.playerId === s.playerId) ? "font-semibold text-foreground" : ""}>
                    {s.playerName}
                  </span>
                  <span className="text-xs">({s.category})</span>
                </li>
              ))}
              {sidelined.away.length > 5 && (
                <li className="text-xs text-muted-foreground">
                  +{sidelined.away.length - 5} more
                </li>
              )}
            </ul>
          ) : (
            <p className="text-muted-foreground">No reported absences</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// All Markets Section
// ==========================================

function AllMarketsSection({
  recommendations,
}: {
  recommendations: BetRecommendation[];
}) {
  // Group by market type
  const grouped = recommendations.reduce(
    (acc, rec) => {
      const key = rec.marketName;
      if (!acc[key]) acc[key] = [];
      acc[key].push(rec);
      return acc;
    },
    {} as Record<string, BetRecommendation[]>
  );

  return (
    <div className="space-y-3">
      {Object.entries(grouped).map(([marketName, recs]) => (
        <div key={marketName} className="p-3 border rounded-lg">
          <h4 className="font-semibold text-sm mb-2">{marketName}</h4>
          <div className="space-y-2">
            {recs.map((rec, idx) => (
              <div
                key={`${rec.marketId}-${idx}`}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <ConfidenceBadge confidence={rec.confidence} small />
                  <span>{rec.pick}</span>
                </div>
                <div className="flex items-center gap-2">
                  {rec.odds && (
                    <span className="text-muted-foreground">
                      @{rec.odds.toFixed(2)}
                    </span>
                  )}
                  {rec.hasValue && (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
          {recs[0]?.reasoning && (
            <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
              {recs[0].reasoning}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

// ==========================================
// Helper Components
// ==========================================

function ConfidenceBadge({
  confidence,
  small = false,
}: {
  confidence: number;
  small?: boolean;
}) {
  const level =
    confidence >= 70 ? "high" : confidence >= 50 ? "medium" : "low";
  const colors = {
    high: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    low: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  };

  return (
    <Badge
      variant="secondary"
      className={cn(
        colors[level],
        small ? "text-xs px-1.5 py-0" : "text-xs"
      )}
    >
      {confidence}%
    </Badge>
  );
}
