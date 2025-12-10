"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Loader2, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generatePlayerSlug } from "@/lib/utils";
import { useSearch } from "@/hooks";
import type { PlayerSearchResult } from "@/types/football";

export function PlayerSearch() {
  const router = useRouter();

  const { query, setQuery, results, isLoading, hasSearched } = useSearch<
    PlayerSearchResult[]
  >({
    fetcher: async (q) => {
      const response = await fetch(
        `/api/players/search?q=${encodeURIComponent(q)}`,
      );
      if (!response.ok) return [];
      const data = await response.json();
      return data.players || [];
    },
    initialResults: [],
  });

  const handlePlayerClick = (player: PlayerSearchResult) => {
    const slug = generatePlayerSlug(
      player.displayName || player.name,
      player.id,
    );
    router.push(`/players/${slug}`);
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search players..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Searching...</span>
        </div>
      )}

      {/* Results */}
      {!isLoading && results.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((player) => (
            <Card
              key={player.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handlePlayerClick(player)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="relative h-12 w-12 shrink-0">
                  {player.image ? (
                    <Image
                      src={player.image}
                      alt={player.displayName || player.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                      <User className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">
                    {player.displayName || player.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {player.position && (
                      <Badge variant="secondary" className="text-xs">
                        {player.position}
                      </Badge>
                    )}
                    {player.country && (
                      <span className="text-sm text-muted-foreground truncate">
                        {player.country.name}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading &&
        hasSearched &&
        results.length === 0 &&
        query.length >= 2 && (
          <p className="text-muted-foreground">
            No players found for "{query}"
          </p>
        )}

      {/* Initial State */}
      {!hasSearched && !isLoading && (
        <div className="text-center py-12 text-muted-foreground">
          <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Enter a player name to search</p>
        </div>
      )}
    </div>
  );
}
