"use client";

import { useState } from "react";
import { useBuildXIStore } from "@/stores/build-xi-store";
import { getFormationById } from "@/lib/build-xi/formations";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { POPULAR_TEAMS, getTeamLogoUrl } from "@/config/popular-teams";
import type { LineupSlotPlayer, PositionType } from "@/types/build-xi";

interface TeamSearchResult {
  id: number;
  name: string;
  shortCode: string | null;
  logo: string | null;
  country: {
    name: string;
  } | null;
}

interface SquadPlayer {
  id: number;
  playerId: number;
  name: string;
  displayName: string;
  image: string | null;
  position: string | null;
  positionGroup: string | null;
  jerseyNumber: number | null;
}

interface LastLineupResponse {
  formation: string | null;
  players: Array<{
    playerId: number;
    name: string;
    displayName: string;
    image: string | null;
    position: string | null;
    jerseyNumber: number | null;
  }>;
  match: {
    id: number;
    homeTeam: string;
    awayTeam: string;
    date: number;
  };
}

export function TeamPrefillPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TeamSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingTeam, setIsLoadingTeam] = useState<number | null>(null);

  const setFormation = useBuildXIStore((state) => state.setFormation);
  const setPlayer = useBuildXIStore((state) => state.setPlayer);
  const clearAllPlayers = useBuildXIStore((state) => state.clearAllPlayers);

  const handleSearch = async () => {
    if (searchQuery.length < 2) return;

    setIsSearching(true);
    try {
      const res = await fetch(
        `/api/teams/search?q=${encodeURIComponent(searchQuery)}`,
      );
      const data = await res.json();
      setSearchResults(data.teams || []);
    } catch (error) {
      console.error("Search failed:", error);
      toast.error("Search failed");
    } finally {
      setIsSearching(false);
    }
  };

  const handleTeamSelect = async (teamId: number, teamName: string) => {
    setIsLoadingTeam(teamId);

    try {
      // First try to get the real lineup from the last match
      const lineupRes = await fetch(`/api/teams/${teamId}/last-lineup`);

      if (lineupRes.ok) {
        const lineupData: LastLineupResponse = await lineupRes.json();

        // Use the real formation from the last match
        const apiFormation = lineupData.formation || "4-3-3";

        // Check if formation is supported, otherwise find closest match
        let activeFormation = getFormationById(apiFormation);
        let formationId = apiFormation;

        if (!activeFormation) {
          // Map unsupported formations to closest supported one
          const formationMap: Record<string, string> = {
            "4-4-1-1": "4-4-2",
            "4-5-1": "4-2-3-1",
            "4-1-3-2": "4-3-3",
            "5-4-1": "5-3-2",
            "3-4-1-2": "3-4-2-1",
            "4-3-1-2": "4-3-3",
            "3-3-4": "3-4-3",
            "4-1-2-3": "4-3-3",
          };
          formationId = formationMap[apiFormation] || "4-3-3";
          activeFormation = getFormationById(formationId)!;
        }

        setFormation(formationId);
        // Note: setFormation already creates a fresh players record

        // Sort players by their formation position (row:col format)
        // e.g., "1:1" = GK, "2:1" = LB, "2:2" = CB1, "3:1" = DM, etc.
        const sortedPlayers = [...lineupData.players].sort((a, b) => {
          const parsePosition = (pos: string | null) => {
            if (!pos) return { row: 99, col: 99 };
            const parts = pos.split(":");
            return {
              row: parseInt(parts[0], 10) || 99,
              col: parseInt(parts[1], 10) || 99,
            };
          };
          const posA = parsePosition(a.position);
          const posB = parsePosition(b.position);
          // Sort by row first, then by column
          if (posA.row !== posB.row) return posA.row - posB.row;
          return posA.col - posB.col;
        });

        // Map sorted players to formation slots
        activeFormation.positions.forEach((slot, index) => {
          if (index < sortedPlayers.length) {
            const player = sortedPlayers[index];
            setPlayer(slot.id, {
              playerId: player.playerId,
              name: player.name,
              displayName: player.displayName || player.name,
              image: player.image,
              position: player.position,
              country: null,
            });
          }
        });

        toast.success(`Filled ${teamName}'s last lineup (${formationId})`, {
          description: `${sortedPlayers.length} players loaded`,
        });
        return;
      }

      // Fallback: Use squad-based approach if no lineup data
      const res = await fetch(`/api/teams/${teamId}`);
      if (!res.ok) throw new Error("Failed to fetch team");

      const data = await res.json();
      const squad: SquadPlayer[] = data.team?.squad || [];

      if (squad.length === 0) {
        toast.error("No squad data available for this team");
        return;
      }

      // Group squad by position type
      const grouped = groupSquadByPosition(squad);

      // Auto-detect best formation based on squad composition
      const detectedFormationId = detectBestFormation(grouped);
      setFormation(detectedFormationId);

      // Get the formation config for the detected formation
      const formation = getFormationById(detectedFormationId);
      if (!formation) return;

      // Clear existing players
      clearAllPlayers();

      // Create a fresh copy of grouped players for assignment
      const groupedCopy = {
        goalkeeper: [...grouped.goalkeeper],
        defender: [...grouped.defender],
        midfielder: [...grouped.midfielder],
        attacker: [...grouped.attacker],
      };

      // Assign players to formation slots
      for (const slot of formation.positions) {
        const candidates = groupedCopy[slot.positionType];
        if (candidates && candidates.length > 0) {
          const player = candidates.shift()!;
          setPlayer(slot.id, {
            playerId: player.playerId,
            name: player.name,
            displayName: player.displayName || player.name,
            image: player.image,
            position: player.position,
            country: null,
          });
        }
      }

      toast.success(`Filled ${teamName} with ${formation.name} formation`);
    } catch (error) {
      console.error("Failed to load team:", error);
      toast.error("Failed to load team squad");
    } finally {
      setIsLoadingTeam(null);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <h2 className="text-base font-semibold">Pre-fill from Team</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Popular Teams */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Popular Teams
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {POPULAR_TEAMS.map((team) => (
              <button
                key={team.id}
                type="button"
                onClick={() => handleTeamSelect(team.id, team.name)}
                disabled={isLoadingTeam === team.id}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors text-left text-sm disabled:opacity-50"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={getTeamLogoUrl(team.id)} alt={team.name} />
                  <AvatarFallback className="text-[10px]">
                    {team.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate flex-1">{team.name}</span>
                {isLoadingTeam === team.id && (
                  <Loader2 className="h-3 w-3 animate-spin" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card px-2 text-muted-foreground">
              or search
            </span>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1"
          />
          <Button
            size="icon"
            variant="outline"
            onClick={handleSearch}
            disabled={isSearching || searchQuery.length < 2}
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 ? (
          <ScrollArea className="h-[300px]">
            <div className="space-y-1">
              {searchResults.map((team) => (
                <TeamButton
                  key={team.id}
                  team={{
                    id: team.id,
                    name: team.name,
                    logo: team.logo || "",
                    country: team.country?.name || "",
                  }}
                  isLoading={isLoadingTeam === team.id}
                  onClick={() => handleTeamSelect(team.id, team.name)}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">
              Search for a team to auto-fill your lineup
            </p>
            <p className="text-xs mt-1">
              e.g., "Real Madrid", "Barcelona", "Manchester"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Team button component
function TeamButton({
  team,
  isLoading,
  onClick,
}: {
  team: { id: number; name: string; logo: string; country: string };
  isLoading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left disabled:opacity-50"
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={team.logo} alt={team.name} />
        <AvatarFallback className="text-xs">
          {team.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{team.name}</p>
        {team.country && (
          <p className="text-xs text-muted-foreground">{team.country}</p>
        )}
      </div>
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
    </button>
  );
}

// Helper to group squad by position type
function groupSquadByPosition(
  squad: SquadPlayer[],
): Record<PositionType, SquadPlayer[]> {
  const grouped: Record<PositionType, SquadPlayer[]> = {
    goalkeeper: [],
    defender: [],
    midfielder: [],
    attacker: [],
  };

  for (const player of squad) {
    const group = player.positionGroup?.toLowerCase() || "";
    const position = player.position?.toLowerCase() || "";

    if (group === "goalkeeper" || position.includes("goalkeeper")) {
      grouped.goalkeeper.push(player);
    } else if (
      group === "defender" ||
      position.includes("back") ||
      position.includes("defender")
    ) {
      grouped.defender.push(player);
    } else if (
      group === "midfielder" ||
      position.includes("mid") ||
      position.includes("wing")
    ) {
      grouped.midfielder.push(player);
    } else if (
      group === "attacker" ||
      position.includes("forward") ||
      position.includes("striker")
    ) {
      grouped.attacker.push(player);
    } else {
      // Default to midfielder if unknown
      grouped.midfielder.push(player);
    }
  }

  return grouped;
}

// Formation templates with position requirements
const FORMATION_TEMPLATES = [
  { id: "4-3-3", def: 4, mid: 3, att: 3 },
  { id: "4-4-2", def: 4, mid: 4, att: 2 },
  { id: "4-2-3-1", def: 4, mid: 5, att: 1 },
  { id: "3-4-3", def: 3, mid: 4, att: 3 },
  { id: "3-5-2", def: 3, mid: 5, att: 2 },
  { id: "5-3-2", def: 5, mid: 3, att: 2 },
  { id: "4-1-4-1", def: 4, mid: 5, att: 1 },
  { id: "3-4-2-1", def: 3, mid: 4, att: 3 },
];

/**
 * Detect the best formation based on squad composition
 * Scores each formation by how well it matches available players
 */
function detectBestFormation(
  grouped: Record<PositionType, SquadPlayer[]>,
): string {
  const d = grouped.defender.length;
  const m = grouped.midfielder.length;
  const a = grouped.attacker.length;

  let bestFormation = "4-3-3";
  let bestScore = 0;

  for (const f of FORMATION_TEMPLATES) {
    // Score = how many positions can be filled with available players
    const score = Math.min(d, f.def) + Math.min(m, f.mid) + Math.min(a, f.att);

    // Prefer formations that use more of the available players
    // Add small bonus for exact matches
    const exactMatchBonus =
      (d === f.def ? 0.1 : 0) +
      (m === f.mid ? 0.1 : 0) +
      (a === f.att ? 0.1 : 0);

    const totalScore = score + exactMatchBonus;

    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestFormation = f.id;
    }
  }

  return bestFormation;
}
