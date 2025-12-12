"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useBuildXIStore } from "@/stores/build-xi-store";
import { getFormationById } from "@/lib/build-xi/formations";
import type { LineupSlotPlayer } from "@/types/build-xi";

interface PlayerSearchResult {
  id: number;
  name: string;
  displayName: string | null;
  commonName: string | null;
  image: string | null;
  position: string | null;
  country: {
    name: string;
    flag: string | null;
  } | null;
}

interface PlayerSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (player: LineupSlotPlayer) => void;
  slotId: string | null;
}

export function PlayerSearchDialog({
  open,
  onOpenChange,
  onSelect,
  slotId,
}: PlayerSearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlayerSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentLineup = useBuildXIStore((state) => state.currentLineup);

  // Get slot info for context
  const formation = getFormationById(currentLineup.formationId);
  const slot = formation?.positions.find((p) => p.id === slotId);

  // Debounced search
  const searchPlayers = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/players/search?q=${encodeURIComponent(searchQuery)}`,
      );
      const data = await res.json();
      setResults(data.players || []);
    } catch (error) {
      console.error("Player search failed:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      searchPlayers(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchPlayers]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  const handleSelect = (player: PlayerSearchResult) => {
    onSelect({
      playerId: player.id,
      name: player.name,
      displayName: player.displayName || player.commonName || player.name,
      image: player.image,
      position: player.position,
      country: player.country,
    });
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder={
          slot ? `Search player for ${slot.label}...` : "Search players..."
        }
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {isLoading && (
          <div className="py-6 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
          </div>
        )}

        {!isLoading && query.length >= 2 && results.length === 0 && (
          <CommandEmpty>No players found.</CommandEmpty>
        )}

        {!isLoading && query.length < 2 && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Type at least 2 characters to search
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <CommandGroup heading="Players">
            {results.map((player) => (
              <CommandItem
                key={player.id}
                value={`${player.name}-${player.id}`}
                onSelect={() => handleSelect(player)}
                className="flex items-center gap-3 py-2"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={player.image ?? undefined} />
                  <AvatarFallback className="text-xs">
                    {(player.displayName || player.name)
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {player.displayName || player.commonName || player.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {player.country && (
                      <span className="flex items-center gap-1">
                        {player.country.flag && (
                          <img
                            src={player.country.flag}
                            alt={player.country.name}
                            className="h-3 w-4 object-cover rounded-sm"
                          />
                        )}
                        {player.country.name}
                      </span>
                    )}
                  </div>
                </div>
                {player.position && (
                  <Badge variant="secondary" className="text-xs">
                    {player.position}
                  </Badge>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
