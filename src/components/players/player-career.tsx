import Image from "next/image";
import Link from "next/link";
import { format, parseISO, isValid } from "date-fns";
import { Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTeamUrl } from "@/lib/utils";
import type { PlayerTeam, PlayerSeasonStats } from "@/types/football";

interface PlayerCareerProps {
  teams: Array<PlayerTeam>;
  seasonStats?: Array<PlayerSeasonStats>;
  currentTeamId?: number | null;
}

function formatTeamDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = parseISO(dateStr);
  return isValid(date) ? format(date, "yyyy") : "";
}

// Enrich derived teams with additional info from API teams data
function enrichTeamsWithDetails(
  derivedTeams: Array<PlayerTeam>,
  apiTeams: Array<PlayerTeam>,
): Array<PlayerTeam> {
  return derivedTeams.map((team) => {
    const apiTeam = apiTeams.find((t) => t.teamId === team.teamId);
    if (apiTeam) {
      return {
        ...team,
        jerseyNumber: apiTeam.jerseyNumber,
        isCaptain: apiTeam.isCaptain,
        startDate: apiTeam.startDate || team.startDate,
        endDate: apiTeam.endDate,
        teamType: apiTeam.teamType || team.teamType,
      };
    }
    return team;
  });
}

// Derive teams from season stats when teams data is missing
function deriveTeamsFromStats(
  seasonStats: Array<PlayerSeasonStats>,
  currentTeamId: number | null,
): Array<PlayerTeam> {
  // Group stats by team to get unique teams
  const teamMap = new Map<
    number,
    {
      teamId: number;
      teamName: string;
      teamLogo: string;
      seasons: Array<{ seasonId: number; seasonName: string }>;
    }
  >();

  for (const stat of seasonStats) {
    if (!stat.teamId || !stat.teamName) continue;

    const existing = teamMap.get(stat.teamId);
    if (existing) {
      existing.seasons.push({
        seasonId: stat.seasonId,
        seasonName: stat.seasonName,
      });
    } else {
      teamMap.set(stat.teamId, {
        teamId: stat.teamId,
        teamName: stat.teamName,
        teamLogo: stat.teamLogo,
        seasons: [{ seasonId: stat.seasonId, seasonName: stat.seasonName }],
      });
    }
  }

  // Convert to PlayerTeam format
  return Array.from(teamMap.values()).map((team, index) => {
    // Get earliest and latest seasons for this team
    const sortedSeasons = team.seasons.sort((a, b) => a.seasonId - b.seasonId);
    const firstSeason = sortedSeasons[0];
    const lastSeason = sortedSeasons[sortedSeasons.length - 1];

    // Extract year from season name (e.g., "2023/2024" -> "2023")
    const startYear = firstSeason?.seasonName?.match(/\d{4}/)?.[0];
    const endYear =
      lastSeason?.seasonName?.match(/\d{4}/)?.[1] ||
      lastSeason?.seasonName?.match(/\d{4}/)?.[0];

    const isCurrent = team.teamId === currentTeamId;

    return {
      id: index + 1,
      teamId: team.teamId,
      teamName: team.teamName,
      teamLogo: team.teamLogo,
      teamType: "club" as string,
      jerseyNumber: null,
      isCaptain: false,
      startDate: startYear ? `${startYear}-01-01` : null,
      endDate: isCurrent ? null : endYear ? `${endYear}-12-31` : null,
      isCurrent,
    };
  });
}

export function PlayerCareer({
  teams,
  seasonStats,
  currentTeamId,
}: PlayerCareerProps) {
  // Always derive from seasonStats (more reliable), enrich with teams data for extra info
  const derivedTeams = seasonStats?.length
    ? deriveTeamsFromStats(seasonStats, currentTeamId ?? null)
    : [];

  // Use derived teams if available, enrich with API teams data (jersey, captain, etc.)
  const teamsToShow =
    derivedTeams.length > 0
      ? enrichTeamsWithDetails(derivedTeams, teams)
      : teams;

  if (teamsToShow.length === 0) {
    return null;
  }

  // Sort teams: current first, then by start date (newest first)
  const sortedTeams = [...teamsToShow].sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1;
    if (!a.isCurrent && b.isCurrent) return 1;
    if (!a.startDate || !b.startDate) return 0;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  // Count clubs vs national teams
  const clubCount = teamsToShow.filter(
    (t) => t.teamType === "club" || t.teamType === "domestic",
  ).length;
  const nationalCount = teamsToShow.filter(
    (t) => t.teamType === "national",
  ).length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Career
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            {clubCount} clubs
            {nationalCount > 0 && `, ${nationalCount} national`}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-1">
            {sortedTeams.map((team, index) => (
              <Link
                key={team.id}
                href={getTeamUrl(team.teamName, team.teamId)}
                className="relative flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                {/* Timeline dot */}
                <div
                  className={`relative z-10 w-10 h-10 rounded-full border-2 bg-background flex items-center justify-center shrink-0 ${
                    team.isCurrent ? "border-primary" : "border-muted"
                  }`}
                >
                  {team.teamLogo ? (
                    <Image
                      src={team.teamLogo}
                      alt={team.teamName}
                      width={28}
                      height={28}
                      className="object-contain w-auto h-auto"
                    />
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground">
                      {team.teamName.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Team Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                      {team.teamName}
                    </span>
                    {team.isCurrent && (
                      <Badge variant="default" className="h-4 text-[10px] px-1">
                        Now
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {formatTeamDate(team.startDate)}
                      {team.startDate && " - "}
                      {team.endDate
                        ? formatTeamDate(team.endDate)
                        : team.startDate
                          ? "Present"
                          : ""}
                    </span>
                    {team.jerseyNumber && (
                      <>
                        <span className="text-muted-foreground/50">•</span>
                        <span>#{team.jerseyNumber}</span>
                      </>
                    )}
                    {team.isCaptain && (
                      <>
                        <span className="text-muted-foreground/50">•</span>
                        <span className="text-yellow-600">C</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Team Type Badge */}
                {team.teamType === "national" && (
                  <Badge variant="outline" className="h-5 text-[10px] shrink-0">
                    NT
                  </Badge>
                )}
              </Link>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
