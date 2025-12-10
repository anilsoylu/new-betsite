"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generatePlayerSlug } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites-store";
import type { PlayerSearchResult } from "@/types/football";

interface PlayerCardProps {
  player: PlayerSearchResult;
  variant?: "default" | "compact";
  showFavorite?: boolean;
}

export function PlayerCard({
  player,
  variant = "default",
  showFavorite = true,
}: PlayerCardProps) {
  // Use selectors for proper reactivity
  const favoritePlayers = useFavoritesStore((state) => state.players);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const slug = generatePlayerSlug(player.displayName || player.name, player.id);
  const isPlayerFavorite = hasMounted && favoritePlayers.includes(player.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite("players", player.id);
  };

  if (variant === "compact") {
    return (
      <Link href={`/players/${slug}`} className="block">
        <Card className="hover:bg-muted/50 transition-colors group">
          <CardContent className="flex items-center gap-3 p-3">
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
              <p className="text-sm font-medium truncate">
                {player.displayName || player.name}
              </p>
              {player.position && (
                <Badge
                  variant="secondary"
                  className="text-[10px] h-4 px-1 mt-0.5"
                >
                  {player.position}
                </Badge>
              )}
            </div>
            {showFavorite && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                onClick={handleFavoriteClick}
              >
                <Star
                  className={cn(
                    "h-4 w-4",
                    isPlayerFavorite
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-muted-foreground",
                  )}
                />
              </Button>
            )}
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/players/${slug}`} className="block">
      <Card className="hover:bg-muted/50 transition-colors group overflow-hidden">
        <CardContent className="p-0">
          {/* Player Image */}
          <div className="relative aspect-square bg-gradient-to-b from-muted/50 to-muted">
            {player.image ? (
              <Image
                src={player.image}
                alt={player.displayName || player.name}
                fill
                className="object-cover object-top"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <User className="h-16 w-16 text-muted-foreground/50" />
              </div>
            )}
            {/* Favorite Button */}
            {showFavorite && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute top-2 right-2 h-8 w-8 bg-background/80 backdrop-blur-sm",
                  "opacity-0 group-hover:opacity-100 transition-opacity",
                  isPlayerFavorite && "opacity-100",
                )}
                onClick={handleFavoriteClick}
              >
                <Star
                  className={cn(
                    "h-4 w-4",
                    isPlayerFavorite
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-foreground",
                  )}
                />
              </Button>
            )}
          </div>

          {/* Player Info */}
          <div className="p-3 space-y-1.5">
            <p className="font-medium truncate">
              {player.displayName || player.name}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {player.position && (
                <Badge variant="secondary" className="text-xs">
                  {player.position}
                </Badge>
              )}
              {player.country && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {player.country.flag && (
                    <Image
                      src={player.country.flag}
                      alt={player.country.name}
                      width={14}
                      height={10}
                      className="object-contain"
                    />
                  )}
                  <span className="truncate">{player.country.name}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
