"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { cn, slugify } from "@/lib/utils";
import type { League } from "@/types/football";

interface CountryGroup {
  countryName: string;
  countryFlag: string;
  leagues: Array<League>;
}

interface OtherLeaguesClientProps {
  groupedLeagues: Array<CountryGroup>;
  totalCount: number;
  className?: string;
}

export function OtherLeaguesClient({
  groupedLeagues,
  totalCount,
  className,
}: OtherLeaguesClientProps) {
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);

  const toggleCountry = (countryName: string) => {
    setExpandedCountry(expandedCountry === countryName ? null : countryName);
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden",
        className,
      )}
    >
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Other Leagues</h3>
          <span className="text-xs text-muted-foreground">
            {groupedLeagues.length} countries
          </span>
        </div>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {groupedLeagues.map((group) => (
          <div key={group.countryName} className="border-b border-border/50 last:border-b-0">
            {/* Country Header - Clickable */}
            <button
              onClick={() => toggleCountry(group.countryName)}
              className={cn(
                "flex items-center gap-3 w-full px-4 py-2.5 transition-colors",
                "hover:bg-muted/50",
                expandedCountry === group.countryName && "bg-muted/30",
              )}
            >
              {group.countryFlag ? (
                <Image
                  src={group.countryFlag}
                  alt={group.countryName}
                  width={20}
                  height={14}
                  className="object-contain rounded-sm"
                />
              ) : (
                <div className="w-5 h-3.5 bg-muted rounded-sm" />
              )}
              <span className="text-sm font-medium flex-1 text-left">
                {group.countryName}
              </span>
              <span className="text-xs text-muted-foreground mr-1">
                {group.leagues.length}
              </span>
              <ChevronRight
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  expandedCountry === group.countryName && "rotate-90",
                )}
              />
            </button>

            {/* Leagues - Expandable */}
            {expandedCountry === group.countryName && (
              <div className="bg-muted/20">
                {group.leagues.map((league) => (
                  <Link
                    key={league.id}
                    href={`/leagues/${slugify(league.name)}-${league.id}`}
                    className={cn(
                      "flex items-center gap-3 px-4 pl-8 py-2 transition-colors",
                      "hover:bg-muted/50 border-t border-border/30",
                    )}
                  >
                    <Image
                      src={league.logo}
                      alt={league.name}
                      width={18}
                      height={18}
                      className="object-contain"
                    />
                    <span className="text-sm truncate">{league.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
