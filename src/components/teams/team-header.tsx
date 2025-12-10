import Image from "next/image";
import { MapPin, Calendar, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TeamDetail } from "@/types/football";

interface TeamHeaderProps {
  team: TeamDetail;
}

export function TeamHeader({ team }: TeamHeaderProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Team Logo */}
          <div className="relative h-24 w-24 sm:h-32 sm:w-32 shrink-0">
            {team.logo ? (
              <Image
                src={team.logo}
                alt={team.name}
                fill
                className="object-contain w-auto h-auto"
                priority
              />
            ) : (
              <div className="h-full w-full bg-muted rounded-lg flex items-center justify-center text-4xl font-bold text-muted-foreground">
                {team.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Team Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold">{team.name}</h1>
              {team.shortCode && (
                <Badge variant="outline" className="self-center sm:self-auto">
                  {team.shortCode}
                </Badge>
              )}
            </div>

            {/* Meta Info */}
            <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-muted-foreground">
              {team.country && (
                <div className="flex items-center gap-1.5">
                  {team.country.flag && (
                    <Image
                      src={team.country.flag}
                      alt={team.country.name}
                      width={20}
                      height={14}
                      className="object-contain w-auto h-auto"
                    />
                  )}
                  <span>{team.country.name}</span>
                </div>
              )}

              {team.venue && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{team.venue.name}</span>
                  {team.venue.capacity && (
                    <span className="text-xs">
                      ({team.venue.capacity.toLocaleString()})
                    </span>
                  )}
                </div>
              )}

              {team.founded && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Founded {team.founded}</span>
                </div>
              )}
            </div>

            {/* Coach */}
            {team.coach && (
              <div className="mt-4 flex items-center justify-center sm:justify-start gap-2">
                <span className="text-sm text-muted-foreground">Manager:</span>
                <span className="font-medium">{team.coach.displayName}</span>
              </div>
            )}

            {/* Active Competitions */}
            {team.activeSeasons.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Competitions
                  </span>
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  {team.activeSeasons.slice(0, 5).map((season) => (
                    <Badge
                      key={season.id}
                      variant="secondary"
                      className="text-xs"
                    >
                      {season.league?.name || season.name}
                    </Badge>
                  ))}
                  {team.activeSeasons.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{team.activeSeasons.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
