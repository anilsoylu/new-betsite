"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, Star, Users, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites-store";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/matches", label: "Matches", icon: Trophy },
  { href: "/favorites", label: "Favorites", icon: Star },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/players", label: "Players", icon: Search },
];

export function BottomNav() {
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);
  const { getTotalCount } = useFavoritesStore();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const favoriteCount = hasMounted ? getTotalCount() : 0;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isFavorites = item.href === "/favorites";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors relative",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <div className="relative">
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-transform",
                    isActive && "scale-110",
                    isFavorites &&
                      isActive &&
                      "fill-yellow-500 text-yellow-500",
                  )}
                />
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
      </div>
    </nav>
  );
}
