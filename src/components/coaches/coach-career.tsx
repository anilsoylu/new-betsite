import Image from "next/image";
import Link from "next/link";
import { format, parseISO, isValid } from "date-fns";
import { Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTeamUrl } from "@/lib/utils";
import type { CoachTeam } from "@/types/football";

interface CoachCareerProps {
  teams: Array<CoachTeam>;
}

function formatTeamDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = parseISO(dateStr);
  return isValid(date) ? format(date, "yyyy") : "";
}

export function CoachCareer({ teams }: CoachCareerProps) {
  if (teams.length === 0) {
    return null;
  }

  // Sort teams: current first, then by start date (newest first)
  const sortedTeams = [...teams].sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1;
    if (!a.isCurrent && b.isCurrent) return 1;
    if (!a.startDate || !b.startDate) return 0;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  // Count head coach vs assistant positions
  const headCoachCount = teams.filter(
    (t) => t.position === "Head Coach" || t.position === "Coach",
  ).length;
  const assistantCount = teams.filter(
    (t) => t.position !== "Head Coach" && t.position !== "Coach",
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
            {headCoachCount} teams
            {assistantCount > 0 && ` (${assistantCount} assistant)`}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-1">
            {sortedTeams.map((team) => (
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
                      className="object-contain"
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
                    {team.isTemporary && (
                      <Badge variant="outline" className="h-4 text-[10px] px-1">
                        Interim
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
                    {team.position && team.position !== "Head Coach" && (
                      <>
                        <span className="text-muted-foreground/50">|</span>
                        <span>{team.position}</span>
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
