"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MatchEvent, Team } from "@/types/football";

interface EventsTabProps {
  events: Array<MatchEvent>;
  homeTeam: Team;
  awayTeam: Team;
}

// Event type configuration for icons and colors
const EVENT_CONFIG = {
  goal: {
    icon: "⚽",
    bgClass: "bg-green-500/10",
    borderClass: "border-green-500/30",
    textClass: "text-green-600 dark:text-green-400",
  },
  ownGoal: {
    icon: "⚽",
    bgClass: "bg-red-500/10",
    borderClass: "border-red-500/30",
    textClass: "text-red-600 dark:text-red-400",
  },
  penalty: {
    icon: "⚽",
    bgClass: "bg-green-500/10",
    borderClass: "border-green-500/30",
    textClass: "text-green-600 dark:text-green-400",
  },
  missedPenalty: {
    icon: "❌",
    bgClass: "bg-gray-500/10",
    borderClass: "border-gray-500/30",
    textClass: "text-muted-foreground",
  },
  yellowCard: {
    icon: "🟨",
    bgClass: "bg-yellow-500/10",
    borderClass: "border-yellow-500/30",
    textClass: "text-yellow-600 dark:text-yellow-500",
  },
  redCard: {
    icon: "🟥",
    bgClass: "bg-red-500/10",
    borderClass: "border-red-500/30",
    textClass: "text-red-600 dark:text-red-400",
  },
  yellowRed: {
    icon: "🟨🟥",
    bgClass: "bg-red-500/10",
    borderClass: "border-red-500/30",
    textClass: "text-red-600 dark:text-red-400",
  },
  substitution: {
    icon: "🔄",
    bgClass: "bg-blue-500/10",
    borderClass: "border-blue-500/30",
    textClass: "text-blue-600 dark:text-blue-400",
  },
  var: {
    icon: "📺",
    bgClass: "bg-purple-500/10",
    borderClass: "border-purple-500/30",
    textClass: "text-purple-600 dark:text-purple-400",
  },
  other: {
    icon: "📌",
    bgClass: "bg-muted",
    borderClass: "border-border",
    textClass: "text-muted-foreground",
  },
} as const;

type EventConfigKey = keyof typeof EVENT_CONFIG;

function getEventConfig(
  event: MatchEvent,
): (typeof EVENT_CONFIG)[EventConfigKey] {
  if (event.type === "goal") {
    // Use subType for specific goal types
    if (event.subType === "ownGoal") return EVENT_CONFIG.ownGoal;
    if (event.subType === "missedPenalty") return EVENT_CONFIG.missedPenalty;
    if (event.subType === "penalty") return EVENT_CONFIG.penalty;
    return EVENT_CONFIG.goal;
  }

  if (event.type === "card") {
    // Use subType for card color
    if (event.subType === "yellowred") return EVENT_CONFIG.yellowRed;
    if (event.subType === "red") return EVENT_CONFIG.redCard;
    return EVENT_CONFIG.yellowCard;
  }

  if (event.type === "substitution") return EVENT_CONFIG.substitution;
  if (event.type === "var") return EVENT_CONFIG.var;

  return EVENT_CONFIG.other;
}

function getEventLabel(event: MatchEvent): string {
  if (event.type === "goal") {
    if (event.subType === "ownGoal") return "Own Goal";
    if (event.subType === "missedPenalty") return "Penalty Missed";
    if (event.subType === "penalty") return "Penalty";
    return "Goal";
  }

  if (event.type === "card") {
    if (event.subType === "yellowred") return "Second Yellow";
    if (event.subType === "red") return "Red Card";
    return "Yellow Card";
  }

  if (event.type === "substitution") return "Substitution";
  if (event.type === "var") return "VAR Decision";

  return "Event";
}

function formatMinute(minute: number, extraMinute: number | null): string {
  if (extraMinute && extraMinute > 0) {
    return `${minute}+${extraMinute}'`;
  }
  return `${minute}'`;
}

interface EventGroup {
  name: string;
  events: MatchEvent[];
}

function groupEventsByHalf(events: MatchEvent[]): EventGroup[] {
  const firstHalf: MatchEvent[] = [];
  const secondHalf: MatchEvent[] = [];
  const extraTime: MatchEvent[] = [];

  for (const event of events) {
    if (event.minute <= 45 || (event.minute === 45 && event.extraMinute)) {
      firstHalf.push(event);
    } else if (
      event.minute <= 90 ||
      (event.minute === 90 && event.extraMinute)
    ) {
      secondHalf.push(event);
    } else {
      extraTime.push(event);
    }
  }

  const groups: EventGroup[] = [];
  if (firstHalf.length > 0)
    groups.push({ name: "1st Half", events: firstHalf });
  if (secondHalf.length > 0)
    groups.push({ name: "2nd Half", events: secondHalf });
  if (extraTime.length > 0)
    groups.push({ name: "Extra Time", events: extraTime });

  return groups;
}

export function EventsTab({ events, homeTeam, awayTeam }: EventsTabProps) {
  // Sort events by minute and group by half
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      if (a.minute !== b.minute) return a.minute - b.minute;
      return (a.extraMinute || 0) - (b.extraMinute || 0);
    });
  }, [events]);

  const eventGroups = useMemo(
    () => groupEventsByHalf(sortedEvents),
    [sortedEvents],
  );

  // Calculate goal scorers for summary
  const goalScorers = useMemo(() => {
    const homeScorers: string[] = [];
    const awayScorers: string[] = [];

    for (const event of sortedEvents) {
      if (event.type === "goal") {
        // Skip missed penalties
        if (event.subType === "missedPenalty") continue;

        const isOwnGoal = event.subType === "ownGoal";
        const isPenalty = event.subType === "penalty";
        const scorer = `${event.playerName} ${formatMinute(event.minute, event.extraMinute)}${isPenalty ? " (P)" : ""}`;

        if (event.teamId === homeTeam.id) {
          if (isOwnGoal) {
            awayScorers.push(`${scorer} (OG)`);
          } else {
            homeScorers.push(scorer);
          }
        } else {
          if (isOwnGoal) {
            homeScorers.push(`${scorer} (OG)`);
          } else {
            awayScorers.push(scorer);
          }
        }
      }
    }

    return { home: homeScorers, away: awayScorers };
  }, [sortedEvents, homeTeam.id]);

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <p>No events yet</p>
          <p className="text-sm mt-1">
            Events will appear as the match progresses
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Goal Scorers Summary - FotMob Style */}
      {(goalScorers.home.length > 0 || goalScorers.away.length > 0) && (
        <Card className="overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-green-500/10 via-green-500/5 to-green-500/10 px-4 py-2 border-b">
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">⚽</span>
              <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                Goal Scorers
              </span>
            </div>
          </div>

          <CardContent className="p-4">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-4">
              {/* Home scorers */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  {homeTeam.logo && (
                    <Image
                      src={homeTeam.logo}
                      alt={homeTeam.name}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  )}
                  <span className="text-sm font-semibold truncate">
                    {homeTeam.name}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {goalScorers.home.length > 0 ? (
                    goalScorers.home.map((scorer, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm group"
                      >
                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs">⚽</span>
                        </div>
                        <span className="text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                          {scorer}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No goals
                    </p>
                  )}
                </div>
              </div>

              {/* Center divider with VS */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-px h-full bg-gradient-to-b from-transparent via-border to-transparent" />
              </div>

              {/* Away scorers */}
              <div className="space-y-2">
                <div className="flex items-center justify-end gap-2 pb-2 border-b border-border/50">
                  <span className="text-sm font-semibold truncate">
                    {awayTeam.name}
                  </span>
                  {awayTeam.logo && (
                    <Image
                      src={awayTeam.logo}
                      alt={awayTeam.name}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  )}
                </div>
                <div className="space-y-1.5">
                  {goalScorers.away.length > 0 ? (
                    goalScorers.away.map((scorer, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-end gap-2 text-sm group"
                      >
                        <span className="text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                          {scorer}
                        </span>
                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs">⚽</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic text-right">
                      No goals
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Timeline */}
      <Card>
        <CardContent className="p-0">
          {eventGroups.map((group, groupIndex) => (
            <div key={group.name}>
              {/* Half header */}
              <div className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm px-4 py-2 border-b">
                <Badge variant="secondary" className="text-xs">
                  {group.name}
                </Badge>
              </div>

              {/* Events in this half */}
              <div className="divide-y">
                {group.events.map((event) => (
                  <EventRow
                    key={event.id}
                    event={event}
                    homeTeamId={homeTeam.id}
                  />
                ))}
              </div>

              {groupIndex < eventGroups.length - 1 && (
                <div className="h-px bg-border" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

interface EventRowProps {
  event: MatchEvent;
  homeTeamId: number;
}

function EventRow({ event, homeTeamId }: EventRowProps) {
  const config = getEventConfig(event);
  const label = getEventLabel(event);
  const isHomeTeam = event.teamId === homeTeamId;

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30",
        isHomeTeam ? "flex-row" : "flex-row-reverse",
      )}
    >
      {/* Event content */}
      <div
        className={cn(
          "flex-1 flex items-center gap-3",
          isHomeTeam ? "flex-row" : "flex-row-reverse",
        )}
      >
        {/* Event icon */}
        <div
          className={cn(
            "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center border",
            config.bgClass,
            config.borderClass,
          )}
        >
          <span className="text-base">{config.icon}</span>
        </div>

        {/* Event details */}
        <div className={cn("min-w-0", isHomeTeam ? "text-left" : "text-right")}>
          <p className={cn("font-medium text-sm", config.textClass)}>
            {event.playerName}
          </p>
          {event.type === "substitution" && event.relatedPlayerName && (
            <p className="text-xs text-muted-foreground">
              {isHomeTeam ? "↔ " : ""}
              {event.relatedPlayerName}
              {!isHomeTeam ? " ↔" : ""}
            </p>
          )}
          {event.type === "goal" && event.relatedPlayerName && (
            <p className="text-xs text-muted-foreground">
              Assist: {event.relatedPlayerName}
            </p>
          )}
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>

      {/* Minute badge - always in center */}
      <div className="flex-shrink-0 w-14 text-center">
        <Badge variant="outline" className="text-xs font-mono tabular-nums">
          {formatMinute(event.minute, event.extraMinute)}
        </Badge>
      </div>

      {/* Spacer to balance the layout */}
      <div className="flex-1" />
    </div>
  );
}
