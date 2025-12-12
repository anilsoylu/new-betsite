import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormStrip } from "@/components/teams/form-strip";
import {
  Target,
  Shield,
  TrendingUp,
  Home,
  Plane,
  BarChart3,
} from "lucide-react";
import type { Fixture, Standing } from "@/types/football";

interface TeamStatsContentProps {
  fixtures: Fixture[];
  teamId: number;
  standings: Standing[];
}

// Calculate team stats from fixtures
function calculateTeamStats(fixtures: Fixture[], teamId: number) {
  const finishedMatches = fixtures.filter(
    (f) => f.status === "finished" && f.score,
  );

  let wins = 0,
    draws = 0,
    losses = 0;
  let goalsScored = 0,
    goalsConceded = 0;
  let homeWins = 0,
    homeDraws = 0,
    homeLosses = 0;
  let awayWins = 0,
    awayDraws = 0,
    awayLosses = 0;
  let cleanSheets = 0;

  for (const match of finishedMatches) {
    const isHome = match.homeTeam.id === teamId;
    const teamScore = isHome ? match.score!.home : match.score!.away;
    const opponentScore = isHome ? match.score!.away : match.score!.home;

    goalsScored += teamScore;
    goalsConceded += opponentScore;

    if (opponentScore === 0) cleanSheets++;

    if (teamScore > opponentScore) {
      wins++;
      if (isHome) homeWins++;
      else awayWins++;
    } else if (teamScore < opponentScore) {
      losses++;
      if (isHome) homeLosses++;
      else awayLosses++;
    } else {
      draws++;
      if (isHome) homeDraws++;
      else awayDraws++;
    }
  }

  const played = finishedMatches.length;
  const homePlayed = finishedMatches.filter(
    (f) => f.homeTeam.id === teamId,
  ).length;
  const awayPlayed = played - homePlayed;

  return {
    played,
    wins,
    draws,
    losses,
    goalsScored,
    goalsConceded,
    goalDifference: goalsScored - goalsConceded,
    cleanSheets,
    winRate: played > 0 ? ((wins / played) * 100).toFixed(1) : "0",
    avgGoalsScored: played > 0 ? (goalsScored / played).toFixed(2) : "0",
    avgGoalsConceded: played > 0 ? (goalsConceded / played).toFixed(2) : "0",
    home: {
      played: homePlayed,
      wins: homeWins,
      draws: homeDraws,
      losses: homeLosses,
    },
    away: {
      played: awayPlayed,
      wins: awayWins,
      draws: awayDraws,
      losses: awayLosses,
    },
  };
}

// Get form from fixtures
function getFormFromFixtures(
  fixtures: Fixture[],
  teamId: number,
): Array<"W" | "D" | "L"> {
  return fixtures
    .filter((f) => f.status === "finished" && f.score)
    .slice(0, 10)
    .map((f) => {
      const isHome = f.homeTeam.id === teamId;
      const teamScore = isHome ? f.score!.home : f.score!.away;
      const opponentScore = isHome ? f.score!.away : f.score!.home;

      if (teamScore > opponentScore) return "W";
      if (teamScore < opponentScore) return "L";
      return "D";
    });
}

export function TeamStatsContent({
  fixtures,
  teamId,
  standings,
}: TeamStatsContentProps) {
  const stats = calculateTeamStats(fixtures, teamId);
  const form = getFormFromFixtures(fixtures, teamId);
  const teamStanding = standings.find((s) => s.teamId === teamId);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Statistics</h2>

      {/* Overview Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.played}</p>
                <p className="text-sm text-muted-foreground">Matches Played</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.winRate}%</p>
                <p className="text-sm text-muted-foreground">Win Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.goalsScored}</p>
                <p className="text-sm text-muted-foreground">Goals Scored</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Shield className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.cleanSheets}</p>
                <p className="text-sm text-muted-foreground">Clean Sheets</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Form (Last 10 Matches)</CardTitle>
        </CardHeader>
        <CardContent>
          {form.length > 0 ? (
            <div className="space-y-4">
              <FormStrip form={form} size="lg" />
              <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t">
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {form.filter((r) => r === "W").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Wins</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {form.filter((r) => r === "D").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Draws</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {form.filter((r) => r === "L").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Losses</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No recent matches</p>
          )}
        </CardContent>
      </Card>

      {/* Home vs Away */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home Record
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Played</span>
                <span className="font-medium">{stats.home.played}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wins</span>
                <span className="font-medium text-green-600">
                  {stats.home.wins}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Draws</span>
                <span className="font-medium text-yellow-600">
                  {stats.home.draws}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Losses</span>
                <span className="font-medium text-red-600">
                  {stats.home.losses}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Plane className="h-4 w-4" />
              Away Record
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Played</span>
                <span className="font-medium">{stats.away.played}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wins</span>
                <span className="font-medium text-green-600">
                  {stats.away.wins}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Draws</span>
                <span className="font-medium text-yellow-600">
                  {stats.away.draws}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Losses</span>
                <span className="font-medium text-red-600">
                  {stats.away.losses}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{stats.goalsScored}</p>
              <p className="text-sm text-muted-foreground">Scored</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.goalsConceded}</p>
              <p className="text-sm text-muted-foreground">Conceded</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {stats.goalDifference > 0 ? "+" : ""}
                {stats.goalDifference}
              </p>
              <p className="text-sm text-muted-foreground">Goal Difference</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.avgGoalsScored}</p>
              <p className="text-sm text-muted-foreground">Avg per Match</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* League Standing Context */}
      {teamStanding && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">League Standing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">
                  {teamStanding.position}
                </p>
                <p className="text-sm text-muted-foreground">Position</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{teamStanding.points}</p>
                <p className="text-sm text-muted-foreground">Points</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{teamStanding.played}</p>
                <p className="text-sm text-muted-foreground">Played</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {teamStanding.goalDifference > 0 ? "+" : ""}
                  {teamStanding.goalDifference}
                </p>
                <p className="text-sm text-muted-foreground">GD</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {teamStanding.won}-{teamStanding.drawn}-{teamStanding.lost}
                </p>
                <p className="text-sm text-muted-foreground">W-D-L</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
