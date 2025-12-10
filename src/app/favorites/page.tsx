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
  MapPin,
  Shirt,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavoritesStore } from "@/stores/favorites-store";
import { slugify } from "@/lib/utils";
import {
  generateTeamSlug,
  generatePlayerSlug,
  getFixtureUrl,
} from "@/lib/utils";
import { format } from "date-fns";

// Enhanced interfaces with more data
interface TeamData {
  id: number;
  name: string;
  shortCode?: string;
  logo?: string;
  country?: { name: string; flag?: string };
  venue?: { name: string };
  founded?: number;
}

interface PlayerData {
  id: number;
  name: string;
  displayName?: string;
  image?: string;
  position?: string;
  detailedPosition?: string;
  nationality?: { name: string; flag?: string };
  currentTeam?: {
    teamId: number;
    teamName: string;
    teamLogo?: string;
    jerseyNumber?: number;
  };
}

interface LeagueData {
  id: number;
  name: string;
  logo?: string;
  country?: { name: string; flag?: string };
  type?: string;
}

interface MatchData {
  id: number;
  homeTeam: { id: number; name: string; logo?: string };
  awayTeam: { id: number; name: string; logo?: string };
  startTime: string;
  status: string;
  score?: { home: number; away: number };
  league?: { id: number; name: string; logo?: string };
}

// Skeleton components for loading state
function PlayerCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </CardContent>
    </Card>
  );
}

function TeamCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

function MatchCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <Skeleton className="h-3 w-24 mb-3" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-6 w-12" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function FavoritesPage() {
  // Use selectors to properly subscribe to state changes
  const teams = useFavoritesStore((state) => state.teams);
  const leagues = useFavoritesStore((state) => state.leagues);
  const players = useFavoritesStore((state) => state.players);
  const matches = useFavoritesStore((state) => state.matches);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites);

  const [teamData, setTeamData] = useState<Array<TeamData>>([]);
  const [playerData, setPlayerData] = useState<Array<PlayerData>>([]);
  const [leagueData, setLeagueData] = useState<Array<LeagueData>>([]);
  const [matchData, setMatchData] = useState<Array<MatchData>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const totalFavorites = hasMounted
    ? teams.length + leagues.length + players.length + matches.length
    : 0;

  // Fetch detailed data for favorites
  useEffect(() => {
    if (!hasMounted) return;

    async function fetchFavoriteData() {
      setIsLoading(true);

      try {
        // Fetch all data in parallel
        const [teamsResult, playersResult, leaguesResult, matchesResult] =
          await Promise.all([
            // Teams
            teams.length > 0
              ? Promise.all(
                  teams.map(async (id) => {
                    try {
                      const res = await fetch(`/api/teams/${id}`);
                      if (res.ok) {
                        const data = await res.json();
                        return data.team as TeamData;
                      }
                    } catch {}
                    return { id, name: `Team ${id}` } as TeamData;
                  })
                )
              : Promise.resolve([]),

            // Players
            players.length > 0
              ? Promise.all(
                  players.map(async (id) => {
                    try {
                      const res = await fetch(`/api/players/${id}`);
                      if (res.ok) {
                        const data = await res.json();
                        return data.player as PlayerData;
                      }
                    } catch {}
                    return { id, name: `Player ${id}` } as PlayerData;
                  })
                )
              : Promise.resolve([]),

            // Leagues
            leagues.length > 0
              ? Promise.all(
                  leagues.map(async (id) => {
                    try {
                      const res = await fetch(`/api/leagues/${id}`);
                      if (res.ok) {
                        const data = await res.json();
                        return data.league as LeagueData;
                      }
                    } catch {}
                    return { id, name: `League ${id}` } as LeagueData;
                  })
                )
              : Promise.resolve([]),

            // Matches
            matches.length > 0
              ? Promise.all(
                  matches.map(async (id) => {
                    try {
                      const res = await fetch(`/api/fixtures/${id}`);
                      if (res.ok) {
                        const data = await res.json();
                        const f = data.fixture;
                        return {
                          id: f.id,
                          homeTeam: f.homeTeam,
                          awayTeam: f.awayTeam,
                          startTime: f.startTime,
                          status: f.status,
                          score:
                            f.homeScore !== undefined && f.awayScore !== undefined
                              ? { home: f.homeScore, away: f.awayScore }
                              : undefined,
                          league: f.league,
                        } as MatchData;
                      }
                    } catch {}
                    return null;
                  })
                ).then((results) => results.filter(Boolean) as Array<MatchData>)
              : Promise.resolve([]),
          ]);

        setTeamData(teamsResult.filter(Boolean));
        setPlayerData(playersResult.filter(Boolean));
        setLeagueData(leaguesResult.filter(Boolean));
        setMatchData(matchesResult);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFavoriteData();
  }, [hasMounted, teams, players, leagues, matches]);

  return (
    <main className="flex-1 overflow-auto">
      <div className="container mx-auto px-4 max-w-4xl py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
              <Star className="h-6 w-6 text-white fill-white" />
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
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => clearFavorites()}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Empty State */}
        {totalFavorites === 0 && !isLoading && (
          <Card className="border-dashed border-2">
            <CardContent className="py-16">
              <div className="flex flex-col items-center justify-center text-center gap-4">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 flex items-center justify-center">
                  <Star className="h-10 w-10 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl">No favorites yet</h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    Start following teams, players, and leagues to quickly
                    access them here. Look for the{" "}
                    <Star className="inline h-4 w-4 text-yellow-500" /> button
                    on any page.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                  <Button asChild>
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
                  <Button asChild variant="outline">
                    <Link href="/leagues">
                      <Trophy className="h-4 w-4 mr-2" />
                      Browse Leagues
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Favorites Tabs */}
        {totalFavorites > 0 && (
          <Tabs defaultValue="teams" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-12">
              <TabsTrigger value="teams" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Teams</span>
                {hasMounted && teams.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {teams.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="players" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Players</span>
                {hasMounted && players.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {players.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="matches" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Matches</span>
                {hasMounted && matches.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {matches.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="leagues" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Leagues</span>
                {hasMounted && leagues.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {leagues.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Teams Tab */}
            <TabsContent value="teams" className="mt-4">
              {isLoading ? (
                <div className="grid gap-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <TeamCardSkeleton key={i} />
                  ))}
                </div>
              ) : teams.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No favorite teams yet</p>
                    <p className="text-sm mt-1">Follow teams to see them here</p>
                    <Button asChild variant="link" className="mt-3">
                      <Link href="/teams">Browse Teams</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3">
                  {teamData.map((team) => (
                    <Card
                      key={team.id}
                      className="group hover:shadow-md transition-shadow"
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <Link
                          href={`/teams/${generateTeamSlug(team.name, team.id)}`}
                          className="flex items-center gap-4 flex-1 min-w-0"
                        >
                          <div className="relative h-14 w-14 shrink-0 rounded-xl bg-white shadow-sm flex items-center justify-center p-2">
                            {team.logo ? (
                              <Image
                                src={team.logo}
                                alt={team.name}
                                width={44}
                                height={44}
                                className="object-contain"
                              />
                            ) : (
                              <Shield className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold truncate text-base">
                                {team.name}
                              </p>
                              {team.shortCode && (
                                <Badge variant="outline" className="text-[10px] shrink-0">
                                  {team.shortCode}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                              {team.country && (
                                <span className="flex items-center gap-1">
                                  {team.country.flag && (
                                    <Image
                                      src={team.country.flag}
                                      alt={team.country.name}
                                      width={16}
                                      height={12}
                                      className="object-contain rounded-sm"
                                    />
                                  )}
                                  {team.country.name}
                                </span>
                              )}
                              {team.venue && (
                                <span className="flex items-center gap-1 truncate">
                                  <MapPin className="h-3 w-3 shrink-0" />
                                  {team.venue.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
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
              {isLoading ? (
                <div className="grid gap-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <PlayerCardSkeleton key={i} />
                  ))}
                </div>
              ) : players.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No favorite players yet</p>
                    <p className="text-sm mt-1">Follow players to see them here</p>
                    <Button asChild variant="link" className="mt-3">
                      <Link href="/players">Browse Players</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3">
                  {playerData.map((player) => (
                    <Card
                      key={player.id}
                      className="group hover:shadow-md transition-shadow"
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <Link
                          href={`/players/${generatePlayerSlug(player.displayName || player.name, player.id)}`}
                          className="flex items-center gap-4 flex-1 min-w-0"
                        >
                          <div className="relative h-14 w-14 shrink-0">
                            {player.image ? (
                              <Image
                                src={player.image}
                                alt={player.displayName || player.name}
                                fill
                                className="object-cover rounded-full ring-2 ring-border"
                              />
                            ) : (
                              <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center ring-2 ring-border">
                                <User className="h-7 w-7 text-muted-foreground" />
                              </div>
                            )}
                            {/* Jersey number badge */}
                            {player.currentTeam?.jerseyNumber && (
                              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center ring-2 ring-background">
                                {player.currentTeam.jerseyNumber}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold truncate text-base">
                                {player.displayName || player.name}
                              </p>
                              {player.nationality?.flag && (
                                <Image
                                  src={player.nationality.flag}
                                  alt={player.nationality.name}
                                  width={18}
                                  height={14}
                                  className="object-contain rounded-sm shrink-0"
                                />
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {(player.detailedPosition || player.position) && (
                                <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                                  {player.detailedPosition || player.position}
                                </Badge>
                              )}
                              {player.currentTeam && (
                                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                  {player.currentTeam.teamLogo && (
                                    <Image
                                      src={player.currentTeam.teamLogo}
                                      alt={player.currentTeam.teamName}
                                      width={16}
                                      height={16}
                                      className="object-contain"
                                    />
                                  )}
                                  <span className="truncate">
                                    {player.currentTeam.teamName}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
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

            {/* Matches Tab */}
            <TabsContent value="matches" className="mt-4">
              {isLoading ? (
                <div className="grid gap-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <MatchCardSkeleton key={i} />
                  ))}
                </div>
              ) : matches.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No favorite matches yet</p>
                    <p className="text-sm mt-1">Follow matches to see them here</p>
                    <Button asChild variant="link" className="mt-3">
                      <Link href="/">Browse Matches</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3">
                  {matchData.map((match) => (
                    <Card
                      key={match.id}
                      className="group hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <Link
                          href={getFixtureUrl({
                            id: match.id,
                            homeTeam: match.homeTeam,
                            awayTeam: match.awayTeam,
                          } as any)}
                          className="block"
                        >
                          {/* League info */}
                          {match.league && (
                            <div className="flex items-center gap-2 mb-3">
                              {match.league.logo && (
                                <Image
                                  src={match.league.logo}
                                  alt={match.league.name}
                                  width={16}
                                  height={16}
                                  className="object-contain"
                                />
                              )}
                              <span className="text-xs text-muted-foreground">
                                {match.league.name}
                              </span>
                              <span className="text-xs text-muted-foreground ml-auto">
                                {format(new Date(match.startTime), "dd MMM yyyy")}
                              </span>
                            </div>
                          )}

                          {/* Match content */}
                          <div className="flex items-center justify-between">
                            {/* Home team */}
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="h-10 w-10 shrink-0 rounded-lg bg-white shadow-sm flex items-center justify-center p-1.5">
                                {match.homeTeam.logo ? (
                                  <Image
                                    src={match.homeTeam.logo}
                                    alt={match.homeTeam.name}
                                    width={28}
                                    height={28}
                                    className="object-contain"
                                  />
                                ) : (
                                  <Shield className="h-5 w-5 text-muted-foreground" />
                                )}
                              </div>
                              <span className="font-medium truncate">
                                {match.homeTeam.name}
                              </span>
                            </div>

                            {/* Score / Time */}
                            <div className="px-4 shrink-0">
                              {match.score ? (
                                <div className="flex items-center gap-2 text-xl font-bold tabular-nums">
                                  <span>{match.score.home}</span>
                                  <span className="text-muted-foreground">-</span>
                                  <span>{match.score.away}</span>
                                </div>
                              ) : (
                                <Badge variant="outline" className="text-sm">
                                  {format(new Date(match.startTime), "HH:mm")}
                                </Badge>
                              )}
                            </div>

                            {/* Away team */}
                            <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
                              <span className="font-medium truncate text-right">
                                {match.awayTeam.name}
                              </span>
                              <div className="h-10 w-10 shrink-0 rounded-lg bg-white shadow-sm flex items-center justify-center p-1.5">
                                {match.awayTeam.logo ? (
                                  <Image
                                    src={match.awayTeam.logo}
                                    alt={match.awayTeam.name}
                                    width={28}
                                    height={28}
                                    className="object-contain"
                                  />
                                ) : (
                                  <Shield className="h-5 w-5 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>

                        {/* Remove button */}
                        <div className="flex justify-end mt-3 pt-3 border-t">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeFavorite("matches", match.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Leagues Tab */}
            <TabsContent value="leagues" className="mt-4">
              {isLoading ? (
                <div className="grid gap-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <TeamCardSkeleton key={i} />
                  ))}
                </div>
              ) : leagues.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No favorite leagues yet</p>
                    <p className="text-sm mt-1">Follow leagues to see them here</p>
                    <Button asChild variant="link" className="mt-3">
                      <Link href="/leagues">Browse Leagues</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3">
                  {leagueData.map((league) => (
                    <Card
                      key={league.id}
                      className="group hover:shadow-md transition-shadow"
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <Link
                          href={`/leagues/${slugify(league.name)}-${league.id}`}
                          className="flex items-center gap-4 flex-1 min-w-0"
                        >
                          <div className="relative h-14 w-14 shrink-0 rounded-xl bg-white shadow-sm flex items-center justify-center p-2">
                            {league.logo ? (
                              <Image
                                src={league.logo}
                                alt={league.name}
                                width={44}
                                height={44}
                                className="object-contain"
                              />
                            ) : (
                              <Trophy className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate text-base">
                              {league.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {league.country && (
                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                  {league.country.flag && (
                                    <Image
                                      src={league.country.flag}
                                      alt={league.country.name}
                                      width={16}
                                      height={12}
                                      className="object-contain rounded-sm"
                                    />
                                  )}
                                  {league.country.name}
                                </span>
                              )}
                              {league.type && (
                                <Badge variant="outline" className="text-[10px]">
                                  {league.type === "league" ? "League" : league.type}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
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
