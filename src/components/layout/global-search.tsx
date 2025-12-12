"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Loader2, User, Users, Star, X, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, getPlayerUrl, getTeamUrl, getCoachUrl } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites-store";
import type { PlayerSearchResult, TeamSearchResult, CoachSearchResult } from "@/types/football";

interface SearchResults {
  players: PlayerSearchResult[];
  teams: TeamSearchResult[];
  coaches: CoachSearchResult[];
}

export function GlobalSearch() {
  const router = useRouter();

  // Use selectors for proper reactivity
  const favoritePlayers = useFavoritesStore((state) => state.players);
  const favoriteTeams = useFavoritesStore((state) => state.teams);
  const favoriteCoaches = useFavoritesStore((state) => state.coaches);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({
    players: [],
    teams: [],
    coaches: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const hasResults = results.players.length > 0 || results.teams.length > 0 || results.coaches.length > 0;

  // Helper to check favorites only after mount - using selector values for reactivity
  const checkIsFavorite = (type: "players" | "teams" | "coaches", id: number) => {
    if (!hasMounted) return false;
    if (type === "players") return favoritePlayers.includes(id);
    if (type === "teams") return favoriteTeams.includes(id);
    return favoriteCoaches.includes(id);
  };

  const searchAll = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults({ players: [], teams: [], coaches: [] });
      return;
    }

    setIsLoading(true);

    try {
      const [playersRes, teamsRes, coachesRes] = await Promise.all([
        fetch(`/api/players/search?q=${encodeURIComponent(searchQuery)}`),
        fetch(`/api/teams/search?q=${encodeURIComponent(searchQuery)}`),
        fetch(`/api/coaches/search?q=${encodeURIComponent(searchQuery)}`),
      ]);

      const playersData = playersRes.ok
        ? await playersRes.json()
        : { players: [] };
      const teamsData = teamsRes.ok ? await teamsRes.json() : { teams: [] };
      const coachesData = coachesRes.ok
        ? await coachesRes.json()
        : { coaches: [] };

      setResults({
        players: (playersData.players || []).slice(0, 5),
        teams: (teamsData.teams || []).slice(0, 5),
        coaches: (coachesData.coaches || []).slice(0, 5),
      });
    } catch (error) {
      console.error("Search error:", error);
      setResults({ players: [], teams: [], coaches: [] });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchAll(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchAll]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (event.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handlePlayerClick = (player: PlayerSearchResult) => {
    router.push(getPlayerUrl(player.displayName || player.name, player.id));
    setIsOpen(false);
    setQuery("");
  };

  const handleTeamClick = (team: TeamSearchResult) => {
    router.push(getTeamUrl(team.name, team.id));
    setIsOpen(false);
    setQuery("");
  };

  const handleCoachClick = (coach: CoachSearchResult) => {
    router.push(getCoachUrl(coach.displayName || coach.name, coach.id));
    setIsOpen(false);
    setQuery("");
  };

  const handleFavoriteClick = (
    e: React.MouseEvent,
    type: "players" | "teams" | "coaches",
    id: number,
  ) => {
    e.stopPropagation();
    toggleFavorite(type, id);
  };

  const clearSearch = () => {
    setQuery("");
    setResults({ players: [], teams: [], coaches: [] });
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            setIsOpen(true);
          }}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "pl-9 pr-16 h-9 transition-all duration-200",
            "w-40 focus:w-64 md:w-48 md:focus:w-80",
          )}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={clearSearch}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          {!isFocused && (
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          )}
        </div>
      </div>

      {/* Results Dropdown */}
      {isOpen && (query.length >= 2 || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 w-80 md:w-96 bg-popover border rounded-lg shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Searching...</span>
            </div>
          ) : hasResults ? (
            <div className="max-h-[400px] overflow-y-auto">
              {/* Players Section */}
              {results.players.length > 0 && (
                <div>
                  <div className="sticky top-0 bg-muted/80 backdrop-blur-sm px-3 py-2 border-b">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      Players
                    </div>
                  </div>
                  <div className="py-1">
                    {results.players.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-accent cursor-pointer group"
                        onClick={() => handlePlayerClick(player)}
                      >
                        <div className="relative h-8 w-8 shrink-0">
                          {player.image ? (
                            <Image
                              src={player.image}
                              alt={player.displayName || player.name}
                              fill
                              className="object-cover rounded-full"
                            />
                          ) : (
                            <div className="h-full w-full bg-muted rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {player.displayName || player.name}
                          </p>
                          <div className="flex items-center gap-1.5">
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) =>
                            handleFavoriteClick(e, "players", player.id)
                          }
                        >
                          <Star
                            className={cn(
                              "h-4 w-4",
                              checkIsFavorite("players", player.id)
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-muted-foreground",
                            )}
                          />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Teams Section */}
              {results.teams.length > 0 && (
                <div>
                  <div className="sticky top-0 bg-muted/80 backdrop-blur-sm px-3 py-2 border-b">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      Teams
                    </div>
                  </div>
                  <div className="py-1">
                    {results.teams.map((team) => (
                      <div
                        key={team.id}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-accent cursor-pointer group"
                        onClick={() => handleTeamClick(team)}
                      >
                        <div className="relative h-8 w-8 shrink-0">
                          {team.logo ? (
                            <Image
                              src={team.logo}
                              alt={team.name}
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div className="h-full w-full bg-muted rounded-full flex items-center justify-center text-sm font-medium">
                              {team.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {team.name}
                          </p>
                          {team.country && (
                            <span className="text-xs text-muted-foreground truncate">
                              {team.country.name}
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) =>
                            handleFavoriteClick(e, "teams", team.id)
                          }
                        >
                          <Star
                            className={cn(
                              "h-4 w-4",
                              checkIsFavorite("teams", team.id)
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-muted-foreground",
                            )}
                          />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Coaches Section */}
              {results.coaches.length > 0 && (
                <div>
                  <div className="sticky top-0 bg-muted/80 backdrop-blur-sm px-3 py-2 border-b">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <Briefcase className="h-3.5 w-3.5" />
                      Coaches
                    </div>
                  </div>
                  <div className="py-1">
                    {results.coaches.map((coach) => (
                      <div
                        key={coach.id}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-accent cursor-pointer group"
                        onClick={() => handleCoachClick(coach)}
                      >
                        <div className="relative h-8 w-8 shrink-0">
                          {coach.image ? (
                            <Image
                              src={coach.image}
                              alt={coach.displayName || coach.name}
                              fill
                              className="object-cover rounded-full"
                            />
                          ) : (
                            <div className="h-full w-full bg-muted rounded-full flex items-center justify-center">
                              <Briefcase className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {coach.displayName || coach.name}
                          </p>
                          <div className="flex items-center gap-1.5">
                            {coach.currentTeamName && (
                              <span className="text-xs text-muted-foreground truncate">
                                {coach.currentTeamName}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) =>
                            handleFavoriteClick(e, "coaches", coach.id)
                          }
                        >
                          <Star
                            className={cn(
                              "h-4 w-4",
                              checkIsFavorite("coaches", coach.id)
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-muted-foreground",
                            )}
                          />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : query.length >= 2 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No results found for "{query}"</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
