"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { getMobileSheetItems } from "@/config/navigation";
import { useFavoritesStore } from "@/stores/favorites-store";

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
      state.matches.length
  );

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const displayCount = hasMounted ? favoriteCount : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[280px] sm:w-[320px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetHeader>

        <nav className="mt-8 flex flex-col gap-1">
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
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                  isLiveItem && !isActive && "text-red-500"
                )}
              >
                {/* Icon */}
                <div className="relative">
                  {item.icon && (
                    <item.icon
                      className={cn(
                        "h-5 w-5",
                        isFavorites && isActive && "fill-current"
                      )}
                    />
                  )}
                  {/* Live indicator */}
                  {isLiveItem && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                    </span>
                  )}
                </div>

                {/* Label */}
                <span className="flex-1 font-medium">{item.label}</span>

                {/* Favorite count badge */}
                {isFavorites && displayCount > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 text-xs font-bold bg-yellow-500 text-yellow-950 rounded-full flex items-center justify-center">
                    {displayCount > 99 ? "99+" : displayCount}
                  </span>
                )}

                {/* Active indicator */}
                {isActive && (
                  <div className="w-1 h-6 bg-primary-foreground rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
