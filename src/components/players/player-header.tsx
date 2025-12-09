import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Ruler, Weight, MapPin, User } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getTeamUrl } from "@/lib/utils"
import type { PlayerDetail } from "@/types/football"

interface PlayerHeaderProps {
  player: PlayerDetail
}

export function PlayerHeader({ player }: PlayerHeaderProps) {
  const {
    displayName,
    image,
    position,
    detailedPosition,
    dateOfBirth,
    age,
    height,
    weight,
    nationality,
    currentTeam,
  } = player

  return (
    <div className="space-y-4">
      {/* Back button */}
      <Link
        href="/players"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to players</span>
      </Link>

      {/* Player Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Player Photo */}
            <div className="shrink-0">
              <div className="relative h-32 w-32 mx-auto sm:mx-0">
                {image ? (
                  <Image
                    src={image}
                    alt={displayName}
                    fill
                    className="object-cover rounded-full"
                  />
                ) : (
                  <div className="h-full w-full bg-muted rounded-full flex items-center justify-center">
                    <User className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            {/* Player Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold">{displayName}</h1>

              {/* Position */}
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                {position && (
                  <Badge variant="secondary">{position}</Badge>
                )}
                {detailedPosition && detailedPosition !== position && (
                  <Badge variant="outline">{detailedPosition}</Badge>
                )}
              </div>

              {/* Current Team */}
              {currentTeam && (
                <Link
                  href={getTeamUrl(currentTeam.teamName, currentTeam.teamId)}
                  className="inline-flex items-center gap-2 mt-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {currentTeam.teamLogo && (
                    <Image
                      src={currentTeam.teamLogo}
                      alt={currentTeam.teamName}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  )}
                  <span className="font-medium">{currentTeam.teamName}</span>
                  {currentTeam.jerseyNumber && (
                    <Badge variant="outline" className="ml-1">
                      #{currentTeam.jerseyNumber}
                    </Badge>
                  )}
                </Link>
              )}

              {/* Stats Row */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 text-sm text-muted-foreground">
                {dateOfBirth && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(dateOfBirth), "dd MMM yyyy")}
                      {age && ` (${age} years)`}
                    </span>
                  </div>
                )}
                {height && (
                  <div className="flex items-center gap-1.5">
                    <Ruler className="h-4 w-4" />
                    <span>{height} cm</span>
                  </div>
                )}
                {weight && (
                  <div className="flex items-center gap-1.5">
                    <Weight className="h-4 w-4" />
                    <span>{weight} kg</span>
                  </div>
                )}
                {nationality && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{nationality.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
