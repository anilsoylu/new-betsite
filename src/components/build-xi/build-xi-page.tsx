"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useBuildXIStore } from "@/stores/build-xi-store";
import { getLineupFromUrl, hasLineupInUrl } from "@/lib/build-xi/url-encoding";
import { BuildXIHeader } from "./build-xi-header";
import { PitchBuilder } from "./pitch-builder";
import { TeamPrefillPanel } from "./team-prefill-panel";
import { SidePanel } from "./side-panel";
import { PlayerSearchDialog } from "./player-search-dialog";
import type { BuildXILineup } from "@/types/build-xi";

export function BuildXIPage() {
  const searchParams = useSearchParams();
  const [hasMounted, setHasMounted] = useState(false);
  const [sharedLineupLoaded, setSharedLineupLoaded] = useState(false);
  const [isLoadingShared, setIsLoadingShared] = useState(false);

  const selectedSlotId = useBuildXIStore((state) => state.selectedSlotId);
  const setPlayer = useBuildXIStore((state) => state.setPlayer);
  const selectSlot = useBuildXIStore((state) => state.selectSlot);

  // Handle hydration
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Load shared lineup from URL on mount
  useEffect(() => {
    if (!hasMounted || sharedLineupLoaded) return;

    const loadSharedLineup = async () => {
      // Check for new short ID format (?s=abc12345)
      const shortId = searchParams.get("s");
      if (shortId) {
        setIsLoadingShared(true);
        try {
          const response = await fetch(`/api/lineups/${shortId}`);
          if (response.ok) {
            const data = await response.json();
            const lineup = data.lineup as BuildXILineup;
            applyLineupToStore(lineup);
          }
        } catch (error) {
          console.error("Failed to load shared lineup:", error);
        } finally {
          setIsLoadingShared(false);
          setSharedLineupLoaded(true);
        }
        return;
      }

      // Fallback: Check for legacy Base64 format (?l=...)
      if (hasLineupInUrl(searchParams)) {
        const lineup = getLineupFromUrl(searchParams);
        if (lineup) {
          applyLineupToStore(lineup);
        }
        setSharedLineupLoaded(true);
      }
    };

    loadSharedLineup();
  }, [hasMounted, searchParams, sharedLineupLoaded]);

  // Helper to apply lineup to store
  const applyLineupToStore = (lineup: BuildXILineup) => {
    const store = useBuildXIStore.getState();
    store.setFormation(lineup.formationId);
    store.setMode(lineup.mode);
    if (lineup.name) {
      store.setLineupName(lineup.name);
    }

    // Set each player
    Object.entries(lineup.players).forEach(([slotId, player]) => {
      if (player) {
        store.setPlayer(slotId, player);
      }
    });
  };

  // Handle player selection from dialog
  const handlePlayerSelect = (player: {
    playerId: number;
    name: string;
    displayName: string;
    image: string | null;
    position: string | null;
    country: { name: string; flag: string | null } | null;
  }) => {
    if (selectedSlotId) {
      setPlayer(selectedSlotId, player);
    }
  };

  // Prevent flash during hydration or while loading shared lineup
  if (!hasMounted || isLoadingShared) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          {isLoadingShared ? "Loading shared lineup..." : "Loading..."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <BuildXIHeader />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr_280px]">
          {/* Left Panel - Team Pre-fill (hidden on mobile) */}
          <aside className="hidden lg:block">
            <TeamPrefillPanel />
          </aside>

          {/* Center - Pitch Builder */}
          <main>
            <PitchBuilder />

            {/* Mobile: Team Pre-fill below pitch */}
            <div className="mt-6 lg:hidden">
              <TeamPrefillPanel />
            </div>
          </main>

          {/* Right Panel - Side Panel */}
          <aside className="hidden lg:block">
            <SidePanel />
          </aside>
        </div>

        {/* Mobile: Side Panel */}
        <div className="mt-6 lg:hidden">
          <SidePanel />
        </div>
      </div>

      {/* Player Search Dialog */}
      <PlayerSearchDialog
        open={selectedSlotId !== null}
        onOpenChange={(open) => {
          if (!open) selectSlot(null);
        }}
        onSelect={handlePlayerSelect}
        slotId={selectedSlotId}
      />
    </div>
  );
}
