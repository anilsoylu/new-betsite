"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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

  // Use selector to subscribe to state changes
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
      <SheetContent
        side="right"
        className="w-[300px] sm:w-[340px] p-0 border-l-0 bg-white/80 dark:bg-gray-950/90 backdrop-blur-xl [&>button]:hidden"
      >
        {/* Custom close button */}
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-10 p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
        >
          <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="sr-only">Close</span>
        </button>

        {/* Header with gradient */}
        <SheetHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-lg font-bold text-white">⚽</span>
            </div>
            <div>
              <SheetTitle className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                {SITE.name}
              </SheetTitle>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Navigation Menu
              </p>
            </div>
          </div>
        </SheetHeader>

        {/* Divider */}
        <div className="mx-6 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

        {/* Navigation */}
        <nav className="px-4 py-6 flex flex-col gap-2">
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
                  "group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300",
                  isActive
                    ? "bg-primary/10 dark:bg-primary/20 shadow-sm"
                    : "hover:bg-gray-100/80 dark:hover:bg-white/5",
                )}
              >
                {/* Icon container */}
                <div
                  className={cn(
                    "relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300",
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-white/15",
                    isLiveItem &&
                      !isActive &&
                      "bg-red-50 dark:bg-red-500/10 text-red-500",
                  )}
                >
                  {item.icon && (
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                        isFavorites && isActive && "fill-current",
                      )}
                    />
                  )}
                  {/* Live indicator */}
                  {isLiveItem && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white dark:border-gray-950" />
                    </span>
                  )}
                </div>

                {/* Label and description */}
                <div className="flex-1 min-w-0">
                  <span
                    className={cn(
                      "block font-semibold text-[15px] transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-gray-800 dark:text-gray-200",
                      isLiveItem && !isActive && "text-red-500",
                    )}
                  >
                    {item.label}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {item.href === "/players" && "Search & explore players"}
                    {item.href === "/coaches" && "Managers & coaches"}
                    {item.href === "/leagues" && "All competitions"}
                    {item.href === "/live" && "Watch live matches"}
                    {item.href === "/favorites" &&
                      `${displayCount} saved items`}
                    {item.href === "/build-xi" && "Create your dream team"}
                    {item.href === "/contact" && "Get in touch with us"}
                  </span>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2">
                  {/* Favorite count badge */}
                  {isFavorites && displayCount > 0 && (
                    <span className="min-w-[24px] h-6 px-2 text-xs font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-950 rounded-full flex items-center justify-center shadow-sm">
                      {displayCount > 99 ? "99+" : displayCount}
                    </span>
                  )}

                  {/* Arrow indicator */}
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-all duration-300",
                      isActive
                        ? "text-primary translate-x-0 opacity-100"
                        : "text-gray-400 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                    )}
                  />
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto px-6 pb-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-white/5 dark:to-white/10 border border-gray-200/50 dark:border-white/10">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              © 2024 {SITE.name}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
