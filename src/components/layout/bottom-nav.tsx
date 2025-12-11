"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites-store";
import { getMobileNavItems } from "@/config/navigation";
import { MobileMenuSheet } from "@/components/layout/mobile-menu-sheet";

export function BottomNav() {
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { getTotalCount } = useFavoritesStore();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const favoriteCount = hasMounted ? getTotalCount() : 0;
  const navItems = getMobileNavItems();

  return (
    <>
      <MobileMenuSheet open={sheetOpen} onOpenChange={setSheetOpen} />

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const isFavorites = item.showFavoritesCount;
            const isLiveItem = item.isLive;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors relative",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                  isLiveItem && !isActive && "text-red-500",
                )}
              >
                <div className="relative">
                  {item.icon && (
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-transform",
                        isActive && "scale-110",
                        isFavorites &&
                          isActive &&
                          "fill-yellow-500 text-yellow-500",
                      )}
                    />
                  )}
                  {/* Live indicator - pulsing red dot */}
                  {isLiveItem && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                    </span>
                  )}
                  {/* Favorite count badge */}
                  {isFavorites && favoriteCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 text-[10px] font-bold bg-yellow-500 text-yellow-950 rounded-full flex items-center justify-center">
                      {favoriteCount > 99 ? "99+" : favoriteCount}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium",
                    isActive && "font-semibold",
                  )}
                >
                  {item.label}
                </span>
                {/* Active indicator */}
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}

          {/* Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="flex flex-col items-center justify-center gap-1 w-full h-full transition-colors text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-medium">Menu</span>
          </button>
        </div>
      </nav>
    </>
  );
}
