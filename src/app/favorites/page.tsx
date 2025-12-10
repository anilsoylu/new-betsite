"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Users,
  Trophy,
  UserCircle,
  Trash2,
  Shield,
  User,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFavoritesStore } from "@/stores/favorites-store";
import {
  generateTeamSlug,
  generatePlayerSlug,
  getFixtureUrl,
} from "@/lib/utils";
import { format } from "date-fns";

interface TeamData {
  id: number;
  name: string;
  logo?: string;
  country?: { name: string; flag?: string };
}

interface PlayerData {
  id: number;
  name: string;
  displayName?: string;
  image?: string;
  position?: string;
  country?: { name: string; flag?: string };
}

interface LeagueData {
  id: number;
  name: string;
  logo?: string;
  country?: { name: string; flag?: string };
}

interface MatchData {
  id: number;
  homeTeam: { id: number; name: string; logo?: string };
  awayTeam: { id: number; name: string; logo?: string };
  startTime: string;
  status: string;
  score?: { home: number; away: number };
  league?: { name: string };
}

export default function FavoritesPage() {
  const {
    teams,
    leagues,
    players,
    matches,
    removeFavorite,
    clearFavorites,
    getTotalCount,
  } = useFavoritesStore();
  const [teamData, setTeamData] = useState<TeamData[]>([]);
  const [playerData, setPlayerData] = useState<PlayerData[]>([]);
  const [leagueData, setLeagueData] = useState<LeagueData[]>([]);
  const [matchData, setMatchData] = useState<MatchData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const totalFavorites = getTotalCount();

  // Fetch detailed data for favorites
  useEffect(() => {
    async function fetchFavoriteData() {
      setIsLoading(true);

      try {
        // Fetch team data
        if (teams.length > 0) {
          const teamPromises = teams.map(async (id) => {
            try {
              const res = await fetch(`/api/teams/${id}`);
              if (res.ok) {
                const data = await res.json();
                return data.team as TeamData;
              }
            } catch {
              // Return minimal data on error
            }
            return { id, name: `Team ${id}` } as TeamData;
          });
          const teamsResult = await Promise.all(teamPromises);
          setTeamData(teamsResult.filter(Boolean));
        } else {
          setTeamData([]);
        }

        // Fetch player data
        if (players.length > 0) {
          const playerPromises = players.map(async (id) => {
            try {
              const res = await fetch(`/api/players/${id}`);
              if (res.ok) {
                const data = await res.json();
                return data.player as PlayerData;
              }
            } catch {
              // Return minimal data on error
            }
            return { id, name: `Player ${id}` } as PlayerData;
          });
          const playersResult = await Promise.all(playerPromises);
          setPlayerData(playersResult.filter(Boolean));
        } else {
          setPlayerData([]);
        }

        // Fetch league data
        if (leagues.length > 0) {
          const leaguePromises = leagues.map(async (id) => {
            try {
              const res = await fetch(`/api/leagues/${id}`);
              if (res.ok) {
                const data = await res.json();
                return data.league as LeagueData;
              }
            } catch {
              // Return minimal data on error
            }
            return { id, name: `League ${id}` } as LeagueData;
          });
          const leaguesResult = await Promise.all(leaguePromises);
          setLeagueData(leaguesResult.filter(Boolean));
        } else {
          setLeagueData([]);
        }

        // Fetch match data
        if (matches.length > 0) {
          const matchPromises = matches.map(async (id) => {
            try {
              const res = await fetch(`/api/matches/${id}`);
              if (res.ok) {
                const data = await res.json();
                return data.fixture as MatchData;
              }
            } catch {
              // Return minimal data on error
            }
            return null;
          });
          const matchesResult = await Promise.all(matchPromises);
          setMatchData(matchesResult.filter(Boolean) as MatchData[]);
        } else {
          setMatchData([]);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchFavoriteData();
  }, [teams, players, leagues, matches]);

  return (
    <main className="flex-1 overflow-auto">
      <div className="container mx-auto px-4 max-w-4xl py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Your Favorites</h1>
              <p className="text-sm text-muted-foreground">
                {totalFavorites} item{totalFavorites !== 1 && "s"} saved
              </p>
            </div>
          </div>
          {totalFavorites > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => clearFavorites()}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Empty State */}
        {totalFavorites === 0 && !isLoading && (
          <Card className="border-dashed">
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center gap-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <Star className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">No favorites yet</h3>
                  <p className="text-muted-foreground mt-1 max-w-md">
                    Start adding teams, players, and leagues to your favorites
                    to quickly access them here.
                  </p>
                </div>
                <div className="flex gap-3 mt-2">
                  <Button asChild variant="outline">
                    <Link href="/teams">
                      <Users className="h-4 w-4 mr-2" />
                      Browse Teams
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/players">
                      <UserCircle className="h-4 w-4 mr-2" />
                      Browse Players
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Favorites Tabs */}
        {totalFavorites > 0 && (
          <Tabs defaultValue="matches" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="matches" className="gap-2">
                <Calendar className="h-4 w-4" />
                Matches
                {matches.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {matches.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="teams" className="gap-2">
                <Users className="h-4 w-4" />
                Teams
                {teams.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {teams.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="players" className="gap-2">
                <UserCircle className="h-4 w-4" />
                Players
                {players.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {players.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="leagues" className="gap-2">
                <Trophy className="h-4 w-4" />
                Leagues
                {leagues.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {leagues.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Matches Tab */}
            <TabsContent value="matches" className="mt-4">
              {matches.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No favorite matches yet</p>
                    <Button asChild variant="link" className="mt-2">
                      <Link href="/">Browse Matches</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-2">
                  {matchData.map((match) => (
                    <Card key={match.id} className="group">
                      <CardContent className="flex items-center gap-3 p-3">
                        <Link
                          href={getFixtureUrl({
                            id: match.id,
                            homeTeam: match.homeTeam,
                            awayTeam: match.awayTeam,
                          } as any)}
                          className="flex items-center gap-3 flex-1 min-w-0"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {match.homeTeam.logo ? (
                              <Image
                                src={match.homeTeam.logo}
                                alt={match.homeTeam.name}
                                width={24}
                                height={24}
                                className="object-contain shrink-0"
                              />
                            ) : (
                              <div className="w-6 h-6 bg-muted rounded flex items-center justify-center text-[10px] font-medium shrink-0">
                                {match.homeTeam.name.charAt(0)}
                              </div>
                            )}
                            <span className="text-sm font-medium truncate">
                              {match.homeTeam.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              vs
                            </span>
                            <span className="text-sm font-medium truncate">
                              {match.awayTeam.name}
                            </span>
                            {match.awayTeam.logo ? (
                              <Image
                                src={match.awayTeam.logo}
                                alt={match.awayTeam.name}
                                width={24}
                                height={24}
                                className="object-contain shrink-0"
                              />
                            ) : (
                              <div className="w-6 h-6 bg-muted rounded flex items-center justify-center text-[10px] font-medium shrink-0">
                                {match.awayTeam.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            {match.score ? (
                              <span className="text-sm font-bold">
                                {match.score.home} - {match.score.away}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                {format(
                                  new Date(match.startTime),
                                  "dd MMM HH:mm",
                                )}
                              </span>
                            )}
                          </div>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                          onClick={() => removeFavorite("matches", match.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Teams Tab */}
            <TabsContent value="teams" className="mt-4">
              {teams.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No favorite teams yet</p>
                    <Button asChild variant="link" className="mt-2">
                      <Link href="/teams">Browse Teams</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-2">
                  {teamData.map((team) => (
                    <Card key={team.id} className="group">
                      <CardContent className="flex items-center gap-3 p-3">
                        <Link
                          href={`/teams/${generateTeamSlug(team.name, team.id)}`}
                          className="flex items-center gap-3 flex-1 min-w-0"
                        >
                          <div className="relative h-10 w-10 shrink-0">
                            {team.logo ? (
                              <Image
                                src={team.logo}
                                alt={team.name}
                                fill
                                className="object-contain"
                              />
                            ) : (
                              <div className="h-full w-full bg-muted rounded-lg flex items-center justify-center">
                                <Shield className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{team.name}</p>
                            {team.country && (
                              <p className="text-xs text-muted-foreground truncate">
                                {team.country.name}
                              </p>
                            )}
                          </div>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                          onClick={() => removeFavorite("teams", team.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Players Tab */}
            <TabsContent value="players" className="mt-4">
              {players.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <UserCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No favorite players yet</p>
                    <Button asChild variant="link" className="mt-2">
                      <Link href="/players">Browse Players</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-2">
                  {playerData.map((player) => (
                    <Card key={player.id} className="group">
                      <CardContent className="flex items-center gap-3 p-3">
                        <Link
                          href={`/players/${generatePlayerSlug(player.displayName || player.name, player.id)}`}
                          className="flex items-center gap-3 flex-1 min-w-0"
                        >
                          <div className="relative h-10 w-10 shrink-0">
                            {player.image ? (
                              <Image
                                src={player.image}
                                alt={player.displayName || player.name}
                                fill
                                className="object-cover rounded-full"
                              />
                            ) : (
                              <div className="h-full w-full bg-muted rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {player.displayName || player.name}
                            </p>
                            <div className="flex items-center gap-2">
                              {player.position && (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] h-4 px-1"
                                >
                                  {player.position}
                                </Badge>
                              )}
                              {player.country && (
                                <span className="text-xs text-muted-foreground truncate">
                                  {player.country.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                          onClick={() => removeFavorite("players", player.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Leagues Tab */}
            <TabsContent value="leagues" className="mt-4">
              {leagues.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No favorite leagues yet</p>
                    <Button asChild variant="link" className="mt-2">
                      <Link href="/">Browse Leagues</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-2">
                  {leagueData.map((league) => (
                    <Card key={league.id} className="group">
                      <CardContent className="flex items-center gap-3 p-3">
                        <Link
                          href={`/leagues/${league.id}`}
                          className="flex items-center gap-3 flex-1 min-w-0"
                        >
                          <div className="relative h-10 w-10 shrink-0">
                            {league.logo ? (
                              <Image
                                src={league.logo}
                                alt={league.name}
                                fill
                                className="object-contain"
                              />
                            ) : (
                              <div className="h-full w-full bg-muted rounded-lg flex items-center justify-center">
                                <Trophy className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {league.name}
                            </p>
                            {league.country && (
                              <p className="text-xs text-muted-foreground truncate">
                                {league.country.name}
                              </p>
                            )}
                          </div>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                          onClick={() => removeFavorite("leagues", league.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </main>
  );
}
