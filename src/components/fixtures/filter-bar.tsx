"use client";

import { Calendar, Radio, Star, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FilterType = "all" | "today" | "tomorrow" | "live" | "favorites";

interface FilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  className?: string;
  liveCount?: number;
  favoritesCount?: number;
}

const filters: Array<{
  id: FilterType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: "today", label: "Today", icon: Calendar },
  { id: "tomorrow", label: "Tomorrow", icon: CalendarDays },
  { id: "live", label: "Live", icon: Radio },
  { id: "favorites", label: "Favorites", icon: Star },
];

export function FilterBar({
  activeFilter,
  onFilterChange,
  className,
  liveCount,
  favoritesCount,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 p-1 rounded-lg bg-muted/50 overflow-x-auto",
        className,
      )}
    >
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        const count =
          filter.id === "live"
            ? liveCount
            : filter.id === "favorites"
              ? favoritesCount
              : undefined;

        return (
          <Button
            key={filter.id}
            variant={isActive ? "secondary" : "ghost"}
            size="sm"
            className={cn(
              "h-8 gap-1.5 shrink-0",
              isActive && "bg-background shadow-sm",
            )}
            onClick={() => onFilterChange(filter.id)}
          >
            <filter.icon
              className={cn(
                "h-3.5 w-3.5",
                filter.id === "live" && isActive && "text-red-500",
                filter.id === "favorites" &&
                  isActive &&
                  "text-yellow-500 fill-yellow-500",
              )}
            />
            <span className="text-xs">{filter.label}</span>
            {count !== undefined && count > 0 && (
              <span
                className={cn(
                  "text-[10px] rounded-full px-1.5 py-0.5 min-w-[18px] text-center",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {count}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
