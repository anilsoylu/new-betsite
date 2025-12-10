"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateTeamSlug } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites-store";
import { FormStrip } from "@/components/teams/form-strip";
import type { TeamSearchResult } from "@/types/football";

type FormResult = "W" | "D" | "L";

interface TeamCardProps {
  team: TeamSearchResult;
  variant?: "default" | "compact";
  showFavorite?: boolean;
  form?: FormResult[];
}

export function TeamCard({
  team,
  variant = "default",
  showFavorite = true,
  form,
}: TeamCardProps) {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const slug = generateTeamSlug(team.name, team.id);
  const isTeamFavorite = hasMounted && isFavorite("teams", team.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite("teams", team.id);
  };

  if (variant === "compact") {
    return (
      <Link href={`/teams/${slug}`} className="block">
        <Card className="hover:bg-muted/50 transition-colors group">
          <CardContent className="flex items-center gap-3 p-3">
            <div className="relative h-10 w-10 shrink-0">
              {team.logo ? (
                <Image
                  src={team.logo}
                  alt={team.name}
                  fill
                  className="object-contain w-auto h-auto"
                />
              ) : (
                <div className="h-full w-full bg-muted rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{team.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {team.country && (
                  <span className="text-xs text-muted-foreground truncate">
                    {team.country.name}
                  </span>
                )}
                {form && form.length > 0 && <FormStrip form={form} size="sm" />}
              </div>
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
                    isTeamFavorite
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
    <Link href={`/teams/${slug}`} className="block">
      <Card className="hover:bg-muted/50 transition-colors group overflow-hidden">
        <CardContent className="p-0">
          {/* Team Logo Area */}
          <div className="relative aspect-[4/3] bg-gradient-to-b from-muted/30 to-muted/60 flex items-center justify-center">
            {team.logo ? (
              <div className="relative w-20 h-20">
                <Image
                  src={team.logo}
                  alt={team.name}
                  fill
                  className="object-contain w-auto h-auto"
                />
              </div>
            ) : (
              <Shield className="h-16 w-16 text-muted-foreground/50" />
            )}
            {/* Favorite Button */}
            {showFavorite && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute top-2 right-2 h-8 w-8 bg-background/80 backdrop-blur-sm",
                  "opacity-0 group-hover:opacity-100 transition-opacity",
                  isTeamFavorite && "opacity-100",
                )}
                onClick={handleFavoriteClick}
              >
                <Star
                  className={cn(
                    "h-4 w-4",
                    isTeamFavorite
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-foreground",
                  )}
                />
              </Button>
            )}
          </div>

          {/* Team Info */}
          <div className="p-3 space-y-2">
            <p className="font-medium truncate">{team.name}</p>
            <div className="flex items-center justify-between gap-2">
              {team.country && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {team.country.flag && (
                    <Image
                      src={team.country.flag}
                      alt={team.country.name}
                      width={14}
                      height={10}
                      className="object-contain w-auto h-auto"
                    />
                  )}
                  <span className="truncate">{team.country.name}</span>
                </div>
              )}
              {form && form.length > 0 && <FormStrip form={form} size="md" />}
            </div>
            {team.shortCode && (
              <Badge variant="outline" className="text-xs">
                {team.shortCode}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
