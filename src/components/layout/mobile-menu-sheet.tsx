"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { getMobileSheetItems } from "@/config/navigation";
import { useFavoritesStore } from "@/stores/favorites-store";
import { SITE } from "@/lib/constants";

interface MobileMenuSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileMenuSheet({ open, onOpenChange }: MobileMenuSheetProps) {
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);
  const sheetItems = getMobileSheetItems();

  const favoriteCount = useFavoritesStore(
    (state) =>
      state.teams.length +
      state.leagues.length +
      state.players.length +
      state.matches.length,
  );

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const displayCount = hasMounted ? favoriteCount : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[280px] p-0">
        <SheetHeader className="px-4 py-4 border-b">
          <SheetTitle className="text-left text-base font-semibold">
            {SITE.name}
          </SheetTitle>
        </SheetHeader>

        <nav className="p-2">
          {sheetItems.map((item) => {
            const isActive = pathname === item.href;
            const isFavorites = item.showFavoritesCount;
            const isLiveItem = item.isLive;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted",
                  isLiveItem && !isActive && "text-red-500",
                )}
              >
                {/* Icon */}
                <div className="relative">
                  {item.icon && (
                    <item.icon
                      className={cn(
                        "h-5 w-5",
                        isFavorites && isActive && "fill-current",
                      )}
                    />
                  )}
                  {isLiveItem && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                    </span>
                  )}
                </div>

                {/* Label */}
                <span className="flex-1 text-sm font-medium">{item.label}</span>

                {/* Favorite count badge */}
                {isFavorites && displayCount > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 text-[10px] font-bold bg-yellow-500 text-yellow-950 rounded-full flex items-center justify-center">
                    {displayCount > 99 ? "99+" : displayCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
