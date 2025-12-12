import Image from "next/image";
import Link from "next/link";
import { format, parseISO, isValid } from "date-fns";
import {
  Calendar,
  MapPin,
  Ruler,
  Weight,
  Briefcase,
  Trophy,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTeamUrl, getPlayerUrl } from "@/lib/utils";
import type { CoachDetail } from "@/types/football";

interface CoachAttributesProps {
  coach: CoachDetail;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  const date = parseISO(dateStr);
  return isValid(date) ? format(date, "d MMM yyyy") : "-";
}

export function CoachAttributes({ coach }: CoachAttributesProps) {
  const {
    dateOfBirth,
    age,
    height,
    weight,
    country,
    nationality,
    currentTeam,
    teams,
    trophies,
    formerPlayerId,
  } = coach;

  // Count stats
  const teamsCount = teams.filter((t) => t.position === "Head Coach").length;
  const titlesCount = trophies.filter((t) => t.position === 1).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Team */}
        {currentTeam && (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Current Team</p>
              <Link
                href={getTeamUrl(currentTeam.teamName, currentTeam.teamId)}
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1.5"
              >
                {currentTeam.teamLogo && (
                  <Image
                    src={currentTeam.teamLogo}
                    alt={currentTeam.teamName}
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                )}
                {currentTeam.teamName}
              </Link>
            </div>
          </div>
        )}

        {/* Date of Birth */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-muted">
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Date of Birth</p>
            <p className="text-sm font-medium">
              {formatDate(dateOfBirth)}
              {age && ` (${age} years)`}
            </p>
          </div>
        </div>

        {/* Nationality */}
        {nationality && (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Nationality</p>
              <div className="flex items-center gap-1.5">
                {nationality.flag && (
                  <Image
                    src={nationality.flag}
                    alt={nationality.name}
                    width={16}
                    height={12}
                    className="object-contain rounded-sm"
                  />
                )}
                <p className="text-sm font-medium">{nationality.name}</p>
              </div>
            </div>
          </div>
        )}

        {/* Height */}
        {height && (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Ruler className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Height</p>
              <p className="text-sm font-medium">{height} cm</p>
            </div>
          </div>
        )}

        {/* Weight */}
        {weight && (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Weight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Weight</p>
              <p className="text-sm font-medium">{weight} kg</p>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <div className="pt-2 border-t space-y-3">
          {/* Teams Managed */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Teams Managed</p>
              <p className="text-sm font-medium">
                {teamsCount || teams.length}
              </p>
            </div>
          </div>

          {/* Titles */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <Trophy className="h-4 w-4 text-yellow-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Titles Won</p>
              <p className="text-sm font-medium text-yellow-600">
                {titlesCount}
              </p>
            </div>
          </div>

          {/* Former Player Link */}
          {formerPlayerId && (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Playing Career</p>
                <Link
                  href={getPlayerUrl(coach.displayName, formerPlayerId)}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View as Player
                </Link>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
