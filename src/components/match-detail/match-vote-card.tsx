"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { Team, MatchStatus } from "@/types/football";
import type { VoteTotals, VoteChoice, UserVoteResponse } from "@/lib/vote-db/types";
import { getFingerprint } from "@/lib/vote-fingerprint";

interface MatchVoteCardProps {
  fixtureId: number;
  homeTeam: Team;
  awayTeam: Team;
  kickoffTime: string;
  status: MatchStatus;
}

// LocalStorage key
const STORAGE_KEY = "mv_votes";

interface StoredVotes {
  [fixtureId: string]: {
    choice: VoteChoice;
    updatedAt: number;
  };
}

function getStoredVote(fixtureId: number): VoteChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const votes: StoredVotes = JSON.parse(stored);
    return votes[fixtureId]?.choice ?? null;
  } catch {
    return null;
  }
}

function setStoredVote(fixtureId: number, choice: VoteChoice): void {
  if (typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const votes: StoredVotes = stored ? JSON.parse(stored) : {};
    votes[fixtureId] = { choice, updatedAt: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
  } catch {
    // Ignore storage errors
  }
}

export function MatchVoteCard({
  fixtureId,
  homeTeam,
  awayTeam,
  kickoffTime,
  status,
}: MatchVoteCardProps) {
  const [totals, setTotals] = useState<VoteTotals | null>(null);
  const [userChoice, setUserChoice] = useState<VoteChoice | null>(null);
  const [changeCount, setChangeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldownEndsAt, setCooldownEndsAt] = useState<number | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Check if voting is closed
  const isVotingClosed =
    new Date(kickoffTime) <= new Date() || status !== "scheduled";
  const canChange = changeCount < 3 && !isVotingClosed && cooldownSeconds === 0;

  // Cooldown timer effect
  useEffect(() => {
    if (!cooldownEndsAt) {
      setCooldownSeconds(0);
      return;
    }

    const updateCooldown = () => {
      const remaining = Math.max(0, Math.ceil((cooldownEndsAt - Date.now()) / 1000));
      setCooldownSeconds(remaining);
      if (remaining === 0) {
        setCooldownEndsAt(null);
      }
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 1000);
    return () => clearInterval(interval);
  }, [cooldownEndsAt]);

  // Fetch initial data
  useEffect(() => {
    // First, load from localStorage for instant UI
    const storedChoice = getStoredVote(fixtureId);
    if (storedChoice) {
      setUserChoice(storedChoice);
    }

    // Then fetch from API
    const fetchData = async () => {
      try {
        const [totalsRes, meRes] = await Promise.all([
          fetch(`/api/fixtures/${fixtureId}/votes`),
          fetch(`/api/fixtures/${fixtureId}/votes/me`),
        ]);

        if (totalsRes.ok) {
          const totalsData = await totalsRes.json();
          setTotals(totalsData.totals);
        }

        if (meRes.ok) {
          const meData: UserVoteResponse = await meRes.json();
          setUserChoice(meData.choice);
          setChangeCount(meData.changeCount);
          // Sync localStorage if different
          if (meData.choice && meData.choice !== storedChoice) {
            setStoredVote(fixtureId, meData.choice);
          }
        }
      } catch (error) {
        console.error("Failed to fetch vote data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fixtureId]);

  // Handle vote submission
  const handleVote = useCallback(
    async (choice: VoteChoice) => {
      if (isVotingClosed || isSubmitting || choice === userChoice || cooldownSeconds > 0) {
        return;
      }

      if (userChoice && changeCount >= 3) {
        toast.error("Maximum vote changes reached");
        return;
      }

      // Optimistic update
      const previousChoice = userChoice;
      setUserChoice(choice);
      setStoredVote(fixtureId, choice);
      setIsSubmitting(true);

      try {
        // Include fingerprint for rate limiting
        const fingerprint = getFingerprint();

        const res = await fetch(`/api/fixtures/${fixtureId}/votes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Vote-FP": fingerprint,
          },
          body: JSON.stringify({ choice }),
        });

        const data = await res.json();

        if (!res.ok) {
          // Rollback optimistic update
          setUserChoice(previousChoice);
          if (previousChoice) {
            setStoredVote(fixtureId, previousChoice);
          }

          if (data.code === "COOLDOWN" && data.details?.cooldownEndsAt) {
            setCooldownEndsAt(data.details.cooldownEndsAt);
            toast.error(`Please wait ${data.details.retryAfter} seconds`);
          } else {
            toast.error(data.error || "Failed to vote");
          }
          return;
        }

        // Update state with server response
        setUserChoice(data.choice);
        setChangeCount(data.changeCount);
        setTotals(data.totals);

        if (data.cooldownEndsAt) {
          setCooldownEndsAt(data.cooldownEndsAt);
        }

        toast.success(previousChoice ? "Vote changed!" : "Vote submitted!");
      } catch (error) {
        // Rollback optimistic update
        setUserChoice(previousChoice);
        if (previousChoice) {
          setStoredVote(fixtureId, previousChoice);
        }
        toast.error("Something went wrong");
      } finally {
        setIsSubmitting(false);
      }
    },
    [fixtureId, isVotingClosed, isSubmitting, userChoice, changeCount, cooldownSeconds],
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Your Prediction</CardTitle>
          {isVotingClosed ? (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
              Voting closed
            </span>
          ) : cooldownSeconds > 0 ? (
            <span className="text-xs text-amber-600 dark:text-amber-400">
              {cooldownSeconds}s remaining...
            </span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          <VoteButton
            label="1"
            teamName={homeTeam.name}
            percentage={totals?.home.percentage}
            isSelected={userChoice === "home"}
            isDisabled={!canChange || isSubmitting}
            isLoading={isLoading}
            onClick={() => handleVote("home")}
          />
          <VoteButton
            label="X"
            teamName="Draw"
            percentage={totals?.draw.percentage}
            isSelected={userChoice === "draw"}
            isDisabled={!canChange || isSubmitting}
            isLoading={isLoading}
            onClick={() => handleVote("draw")}
          />
          <VoteButton
            label="2"
            teamName={awayTeam.name}
            percentage={totals?.away.percentage}
            isSelected={userChoice === "away"}
            isDisabled={!canChange || isSubmitting}
            isLoading={isLoading}
            onClick={() => handleVote("away")}
          />
        </div>

        {/* Vote count and change info */}
        <div className="mt-3 text-xs text-muted-foreground text-center space-x-2">
          {totals && totals.total > 0 && (
            <span>{totals.total.toLocaleString()} votes</span>
          )}
          {userChoice && !isVotingClosed && changeCount < 3 && (
            <span className="text-amber-600 dark:text-amber-400">
              ({3 - changeCount} {3 - changeCount === 1 ? "change" : "changes"} left)
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface VoteButtonProps {
  label: string;
  teamName: string;
  percentage?: number;
  isSelected: boolean;
  isDisabled: boolean;
  isLoading: boolean;
  onClick: () => void;
}

function VoteButton({
  label,
  teamName,
  percentage,
  isSelected,
  isDisabled,
  isLoading,
  onClick,
}: VoteButtonProps) {
  const baseClasses =
    "text-center p-3 rounded-lg transition-all duration-200 cursor-pointer";
  const selectedClasses = isSelected
    ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background"
    : "bg-muted hover:bg-muted/80";
  const disabledClasses =
    isDisabled && !isSelected ? "opacity-60 cursor-not-allowed" : "";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseClasses} ${selectedClasses} ${disabledClasses}`}
    >
      <p
        className={`text-xs mb-1 truncate ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}
        title={teamName}
      >
        {label}
      </p>
      <p
        className={`text-lg font-bold tabular-nums ${isSelected ? "text-primary-foreground" : ""}`}
      >
        {isLoading ? (
          <span className="inline-block w-8 h-6 bg-muted-foreground/20 rounded animate-pulse" />
        ) : percentage !== undefined ? (
          `${percentage}%`
        ) : (
          "-"
        )}
      </p>
      <p
        className={`text-[10px] mt-0.5 truncate ${isSelected ? "text-primary-foreground/70" : "text-muted-foreground/70"}`}
        title={teamName}
      >
        {teamName}
      </p>
    </button>
  );
}
