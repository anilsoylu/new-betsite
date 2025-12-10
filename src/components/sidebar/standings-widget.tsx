"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn, getTeamUrl, getLeagueUrl } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { Standing, StandingRuleType } from "@/types/football";

interface LeagueStandings {
  leagueId: number;
  leagueName: string;
  leagueLogo: string;
  standings: Standing[];
}

interface StandingsWidgetProps {
  leagueStandings: LeagueStandings[];
  className?: string;
}

// Get position indicator color based on rule type from API
function getPositionColor(ruleTypeId: StandingRuleType): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  switch (ruleTypeId) {
    case 180: // UCL qualification
      return {
        bg: "bg-green-500/20",
        text: "text-green-600 dark:text-green-400",
        border: "border-l-green-500",
        label: "UCL",
      };
    case 181: // UEL/UECL qualification
      return {
        bg: "bg-blue-500/20",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-l-blue-500",
        label: "UEL",
      };
    case 182: // Relegation
      return {
        bg: "bg-red-500/20",
        text: "text-red-600 dark:text-red-400",
        border: "border-l-red-500",
        label: "REL",
      };
    case 183: // Promotion playoff
    case 184: // Championship playoff
      return {
        bg: "bg-amber-500/20",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-l-amber-500",
        label: "PO",
      };
    default:
      return {
        bg: "",
        text: "text-muted-foreground",
        border: "border-l-transparent",
        label: "",
      };
  }
}

export function StandingsWidget({
  leagueStandings,
  className,
}: StandingsWidgetProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePrev = useCallback(() => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      setIsExpanded(false);
    }
  }, [activeIndex]);

  const handleNext = useCallback(() => {
    if (activeIndex < leagueStandings.length - 1) {
      setActiveIndex(activeIndex + 1);
      setIsExpanded(false);
    }
  }, [activeIndex, leagueStandings.length]);

  // Touch/Mouse handlers for swipe
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    // Limit drag distance
    const maxDrag = 100;
    setTranslateX(Math.max(-maxDrag, Math.min(maxDrag, diff)));
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 50;
    if (translateX > threshold) {
      handlePrev();
    } else if (translateX < -threshold) {
      handleNext();
    }
    setTranslateX(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("keydown", handleKeyDown);
      return () => container.removeEventListener("keydown", handleKeyDown);
    }
  }, [handlePrev, handleNext]);

  if (leagueStandings.length === 0) return null;

  const activeLeague = leagueStandings[activeIndex];
  const displayedTeams = isExpanded
    ? activeLeague.standings
    : activeLeague.standings.slice(0, 6);
  const hasMoreTeams = activeLeague.standings.length > 6;

  // Get unique position types for legend
  const positionTypes = new Set(
    activeLeague.standings.map((s) => s.ruleTypeId).filter(Boolean),
  );

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50",
        className,
      )}
    >
      {/* Header with Navigation */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border bg-gradient-to-r from-muted/50 to-muted/30">
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className={cn(
            "p-1.5 rounded-lg transition-all",
            activeIndex === 0
              ? "text-muted-foreground/30 cursor-not-allowed"
              : "text-muted-foreground hover:text-foreground hover:bg-muted",
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <h3 className="font-semibold text-sm">Standings</h3>

        <button
          onClick={handleNext}
          disabled={activeIndex === leagueStandings.length - 1}
          className={cn(
            "p-1.5 rounded-lg transition-all",
            activeIndex === leagueStandings.length - 1
              ? "text-muted-foreground/30 cursor-not-allowed"
              : "text-muted-foreground hover:text-foreground hover:bg-muted",
          )}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Swipeable League Card */}
      <div
        className="relative overflow-hidden touch-pan-y"
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        <div
          className={cn(
            "transition-transform duration-200",
            isDragging && "transition-none",
          )}
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {/* League Header */}
          <Link
            href={getLeagueUrl(activeLeague.leagueName, activeLeague.leagueId)}
            className="flex items-center gap-3 px-4 py-3 bg-muted/20 hover:bg-muted/40 transition-colors border-b border-border group"
            onClick={(e) => isDragging && e.preventDefault()}
          >
            <Image
              src={activeLeague.leagueLogo}
              alt={activeLeague.leagueName}
              width={36}
              height={36}
              className="object-contain w-9 h-9"
            />
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold group-hover:text-primary transition-colors block truncate">
                {activeLeague.leagueName}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {activeIndex + 1} / {leagueStandings.length}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
          </Link>

          {/* Dot Indicators */}
          <div className="flex items-center justify-center gap-1 py-2 bg-muted/10">
            {leagueStandings.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveIndex(idx);
                  setIsExpanded(false);
                }}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  idx === activeIndex
                    ? "bg-primary w-4"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50",
                )}
              />
            ))}
          </div>

          {/* Standings Table */}
          <div className="px-1">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted-foreground border-b border-border">
                  <th className="text-left font-medium py-2 pl-2 w-6">#</th>
                  <th className="text-left font-medium py-2">Team</th>
                  <th className="text-center font-medium py-2 w-6">P</th>
                  <th className="text-center font-medium py-2 w-8">GD</th>
                  <th className="text-center font-medium py-2 pr-2 w-8">Pts</th>
                </tr>
              </thead>
              <tbody>
                {displayedTeams.map((team, idx) => {
                  const positionColor = getPositionColor(team.ruleTypeId);
                  return (
                    <tr
                      key={team.teamId}
                      className={cn(
                        "transition-colors border-l-2",
                        positionColor.border,
                        "hover:bg-muted/40",
                        idx % 2 === 1 && "bg-muted/10",
                        "border-b border-border/30 last:border-b-0",
                      )}
                    >
                      {/* Position */}
                      <td className="py-2 pl-2">
                        <div
                          className={cn(
                            "w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold",
                            positionColor.bg,
                            positionColor.text,
                          )}
                        >
                          {team.position}
                        </div>
                      </td>

                      {/* Team */}
                      <td className="py-2">
                        <Link
                          href={getTeamUrl(team.teamName, team.teamId)}
                          className="flex items-center gap-2 hover:text-primary transition-colors group/team"
                        >
                          <Image
                            src={team.teamLogo}
                            alt={team.teamName}
                            width={18}
                            height={18}
                            className="object-contain flex-shrink-0 w-[18px] h-[18px]"
                          />
                          <span className="font-medium truncate max-w-[100px] text-[11px] group-hover/team:text-primary">
                            {team.teamName}
                          </span>
                        </Link>
                      </td>

                      {/* Played */}
                      <td className="py-2 text-center text-muted-foreground text-[11px]">
                        {team.played}
                      </td>

                      {/* Goal Difference */}
                      <td
                        className={cn(
                          "py-2 text-center text-[11px] font-medium",
                          team.goalDifference > 0 &&
                            "text-green-600 dark:text-green-400",
                          team.goalDifference < 0 &&
                            "text-red-600 dark:text-red-400",
                          team.goalDifference === 0 && "text-muted-foreground",
                        )}
                      >
                        {team.goalDifference > 0
                          ? `+${team.goalDifference}`
                          : team.goalDifference}
                      </td>

                      {/* Points */}
                      <td className="py-2 pr-2 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-5 rounded bg-muted/50 font-bold text-[11px]">
                          {team.points}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Expand/Collapse Button */}
          {hasMoreTeams && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors border-t border-border"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show All ({activeLeague.standings.length})
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Legend based on actual position types in this league */}
      {positionTypes.size > 0 && (
        <div className="px-3 py-2 border-t border-border bg-muted/10">
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-muted-foreground">
            {positionTypes.has(180) && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-sm bg-green-500" />
                <span>Champions League</span>
              </div>
            )}
            {positionTypes.has(181) && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-sm bg-blue-500" />
                <span>Europa League</span>
              </div>
            )}
            {(positionTypes.has(183) || positionTypes.has(184)) && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-sm bg-amber-500" />
                <span>Playoff</span>
              </div>
            )}
            {positionTypes.has(182) && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-sm bg-red-500" />
                <span>Relegation</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
