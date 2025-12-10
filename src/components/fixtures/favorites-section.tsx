"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useFavoritesStore } from "@/stores/favorites-store";
import { cn } from "@/lib/utils";

interface FavoritesSectionProps {
  className?: string;
}

export function FavoritesSection({ className }: FavoritesSectionProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const { matches } = useFavoritesStore();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Don't render until mounted (to avoid hydration mismatch) or if no favorite matches
  if (!hasMounted || matches.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardContent className="py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium text-sm">Your Favorites</span>
          </div>
          <Link
            href="/favorites"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {matches.length} match{matches.length !== 1 && "es"} saved
          </Link>
        </div>

        <div className="text-sm text-muted-foreground text-center py-4 rounded-lg bg-muted/50">
          <Link
            href="/favorites"
            className="hover:text-foreground transition-colors"
          >
            View your {matches.length} favorite match
            {matches.length !== 1 && "es"} →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
