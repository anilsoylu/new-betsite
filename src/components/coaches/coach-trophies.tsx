"use client";

import { useState } from "react";
import Image from "next/image";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CoachTrophy } from "@/types/football";

interface CoachTrophiesProps {
  trophies: Array<CoachTrophy>;
}

export function CoachTrophies({ trophies }: CoachTrophiesProps) {
  const [showOthers, setShowOthers] = useState(false);

  if (trophies.length === 0) {
    return null;
  }

  // Sort by season (newest first)
  const sortedTrophies = [...trophies].sort((a, b) => b.seasonId - a.seasonId);

  // Separate winners from others
  const winners = sortedTrophies.filter((t) => t.position === 1);
  const others = sortedTrophies.filter((t) => t.position !== 1);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            Honours
          </CardTitle>
          {winners.length > 0 && (
            <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30 hover:bg-yellow-500/20">
              {winners.length} {winners.length === 1 ? "title" : "titles"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-1">
            {/* Winners - Prominent Display */}
            {winners.map((trophy) => (
              <div
                key={trophy.id}
                className="relative flex items-center gap-3 p-2 rounded-lg hover:bg-yellow-500/5 transition-colors group"
              >
                {/* Timeline dot with competition logo */}
                <div className="relative z-10 w-10 h-10 rounded-full border-2 border-yellow-500 bg-background flex items-center justify-center shrink-0">
                  {trophy.leagueLogo ? (
                    <Image
                      src={trophy.leagueLogo}
                      alt={trophy.leagueName}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  ) : (
                    <Trophy className="h-4 w-4 text-yellow-500" />
                  )}
                </div>

                {/* Trophy Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium truncate group-hover:text-yellow-600 transition-colors">
                      {trophy.leagueName}
                    </span>
                    <Badge className="h-4 text-[10px] px-1 bg-yellow-500 text-yellow-950 hover:bg-yellow-500">
                      Winner
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {trophy.seasonName}
                  </p>
                </div>
              </div>
            ))}

            {/* Others - Collapsible */}
            {others.length > 0 && (
              <>
                <button
                  onClick={() => setShowOthers(!showOthers)}
                  className="relative flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors w-full text-left"
                >
                  {/* Timeline dot */}
                  <div className="relative z-10 w-10 h-10 rounded-full border-2 border-muted bg-background flex items-center justify-center shrink-0">
                    <span className="text-xs font-medium text-muted-foreground">
                      +{others.length}
                    </span>
                  </div>

                  {/* Label */}
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Runner-up & Other
                    </span>
                    {showOthers ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Expanded Others */}
                {showOthers && (
                  <div className="space-y-1 ml-6 border-l border-dashed border-muted pl-4">
                    {others.map((trophy) => (
                      <div
                        key={trophy.id}
                        className="flex items-center gap-2 p-1.5 rounded hover:bg-muted/30 transition-colors"
                      >
                        {trophy.leagueLogo ? (
                          <Image
                            src={trophy.leagueLogo}
                            alt={trophy.leagueName}
                            width={16}
                            height={16}
                            className="object-contain opacity-60"
                          />
                        ) : (
                          <div className="w-4 h-4 rounded bg-muted/50" />
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-muted-foreground truncate block">
                            {trophy.leagueName}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className="h-4 text-[9px] px-1 text-muted-foreground"
                        >
                          {trophy.position === 2
                            ? "2nd"
                            : trophy.position === 3
                              ? "3rd"
                              : `${trophy.position}th`}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {trophy.seasonName}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
