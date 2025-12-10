import { notFound } from "next/navigation";
import { getTeamById } from "@/lib/api/football-api";
import { extractTeamId, getPlayerUrl } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import type { SquadPlayer } from "@/types/football";

interface TeamSquadPageProps {
  params: Promise<{ slug: string }>;
}

// Position group order
const POSITION_ORDER = ["Goalkeeper", "Defender", "Midfielder", "Attacker"];

export default async function TeamSquadPage({ params }: TeamSquadPageProps) {
  const { slug } = await params;
  const teamId = extractTeamId(slug);

  if (!teamId) {
    notFound();
  }

  let team;
  try {
    team = await getTeamById(teamId);
  } catch {
    notFound();
  }

  // Group players by position
  const squadByPosition = team.squad.reduce(
    (acc, player) => {
      const group = player.positionGroup || "Unknown";
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(player);
      return acc;
    },
    {} as Record<string, SquadPlayer[]>,
  );

  // Sort groups by position order
  const sortedGroups = Object.entries(squadByPosition).sort(([a], [b]) => {
    const indexA = POSITION_ORDER.indexOf(a);
    const indexB = POSITION_ORDER.indexOf(b);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Squad</h2>
        <p className="text-sm text-muted-foreground">
          {team.squad.length} players
        </p>
      </div>

      {/* Manager Card */}
      {team.coach && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-full overflow-hidden bg-muted">
                {team.coach.image ? (
                  <Image
                    src={team.coach.image}
                    alt={team.coach.displayName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold">{team.coach.displayName}</p>
                {team.coach.dateOfBirth && (
                  <p className="text-sm text-muted-foreground">
                    Born{" "}
                    {new Date(team.coach.dateOfBirth).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Players by Position */}
      {sortedGroups.map(([position, players]) => (
        <Card key={position}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{position}s</CardTitle>
              <Badge variant="secondary">{players.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {players
                .sort((a, b) => (a.jerseyNumber || 99) - (b.jerseyNumber || 99))
                .map((player) => (
                  <PlayerRow key={player.id} player={player} />
                ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {team.squad.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No squad information available
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface PlayerRowProps {
  player: SquadPlayer;
}

function PlayerRow({ player }: PlayerRowProps) {
  const age = player.dateOfBirth
    ? Math.floor(
        (Date.now() - new Date(player.dateOfBirth).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000),
      )
    : null;

  return (
    <Link
      href={getPlayerUrl(player.displayName, player.playerId)}
      className="flex items-center gap-4 px-4 py-3 hover:bg-muted/50 transition-colors"
    >
      {/* Jersey Number */}
      <div className="w-8 text-center shrink-0">
        <span className="text-lg font-bold text-muted-foreground">
          {player.jerseyNumber || "-"}
        </span>
      </div>

      {/* Player Photo */}
      <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted shrink-0">
        {player.image ? (
          <Image
            src={player.image}
            alt={player.displayName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <User className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Player Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{player.displayName}</span>
          {player.isCaptain && (
            <Badge variant="outline" className="text-xs shrink-0">
              C
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {player.position || player.positionGroup}
        </p>
      </div>

      {/* Age */}
      {age && (
        <div className="text-right shrink-0">
          <p className="text-sm text-muted-foreground">{age} yrs</p>
        </div>
      )}
    </Link>
  );
}
