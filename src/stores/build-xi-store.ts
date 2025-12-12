import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type {
  BuildXILineup,
  LineupMode,
  LineupSlotPlayer,
} from "@/types/build-xi";
import {
  getDefaultFormation,
  getFormationById,
  createEmptyPlayersRecord,
} from "@/lib/build-xi/formations";

/**
 * Create a new empty lineup with default values
 */
function createNewLineup(): BuildXILineup {
  const formation = getDefaultFormation();
  const now = Date.now();

  return {
    id: uuidv4(),
    name: "",
    formationId: formation.id,
    mode: "club",
    players: createEmptyPlayersRecord(formation),
    createdAt: now,
    updatedAt: now,
  };
}

interface BuildXIState {
  // Current lineup being edited
  currentLineup: BuildXILineup;

  // Saved lineups (persisted to localStorage)
  savedLineups: BuildXILineup[];

  // UI state
  selectedSlotId: string | null;

  // Formation actions
  setFormation: (formationId: string) => void;

  // Mode actions
  setMode: (mode: LineupMode) => void;

  // Player actions
  setPlayer: (slotId: string, player: LineupSlotPlayer | null) => void;
  clearSlot: (slotId: string) => void;
  clearAllPlayers: () => void;
  swapPlayers: (slotId1: string, slotId2: string) => void;

  // Lineup name
  setLineupName: (name: string) => void;

  // Slot selection
  selectSlot: (slotId: string | null) => void;

  // Saved lineups management
  saveCurrentLineup: () => string | null;
  loadLineup: (lineupId: string) => void;
  deleteLineup: (lineupId: string) => void;
  createNewLineup: () => void;

  // Utility
  getFilledSlotsCount: () => number;
  isLineupComplete: () => boolean;
}

export const useBuildXIStore = create<BuildXIState>()(
  persist(
    (set, get) => ({
      currentLineup: createNewLineup(),
      savedLineups: [],
      selectedSlotId: null,

      setFormation: (formationId) => {
        const formation = getFormationById(formationId);
        if (!formation) return;

        set((state) => {
          // Preserve players that exist in the new formation
          const newPlayers = createEmptyPlayersRecord(formation);
          const oldPlayers = state.currentLineup.players;

          // Try to keep players in matching slot IDs
          for (const pos of formation.positions) {
            if (oldPlayers[pos.id]) {
              newPlayers[pos.id] = oldPlayers[pos.id];
            }
          }

          return {
            currentLineup: {
              ...state.currentLineup,
              formationId,
              players: newPlayers,
              updatedAt: Date.now(),
            },
          };
        });
      },

      setMode: (mode) => {
        set((state) => ({
          currentLineup: {
            ...state.currentLineup,
            mode,
            updatedAt: Date.now(),
          },
        }));
      },

      setPlayer: (slotId, player) => {
        set((state) => ({
          currentLineup: {
            ...state.currentLineup,
            players: {
              ...state.currentLineup.players,
              [slotId]: player,
            },
            updatedAt: Date.now(),
          },
          selectedSlotId: null, // Close selection after setting player
        }));
      },

      clearSlot: (slotId) => {
        set((state) => ({
          currentLineup: {
            ...state.currentLineup,
            players: {
              ...state.currentLineup.players,
              [slotId]: null,
            },
            updatedAt: Date.now(),
          },
        }));
      },

      clearAllPlayers: () => {
        set((state) => {
          const formation = getFormationById(state.currentLineup.formationId);
          if (!formation) return state;

          return {
            currentLineup: {
              ...state.currentLineup,
              players: createEmptyPlayersRecord(formation),
              updatedAt: Date.now(),
            },
          };
        });
      },

      swapPlayers: (slotId1, slotId2) => {
        set((state) => {
          const player1 = state.currentLineup.players[slotId1];
          const player2 = state.currentLineup.players[slotId2];

          return {
            currentLineup: {
              ...state.currentLineup,
              players: {
                ...state.currentLineup.players,
                [slotId1]: player2,
                [slotId2]: player1,
              },
              updatedAt: Date.now(),
            },
          };
        });
      },

      setLineupName: (name) => {
        set((state) => ({
          currentLineup: {
            ...state.currentLineup,
            name,
            updatedAt: Date.now(),
          },
        }));
      },

      selectSlot: (slotId) => {
        set({ selectedSlotId: slotId });
      },

      saveCurrentLineup: () => {
        const state = get();
        const { currentLineup, savedLineups } = state;

        // Require at least one player to save
        const filledCount = Object.values(currentLineup.players).filter(
          Boolean,
        ).length;
        if (filledCount === 0) return null;

        // Generate name if empty
        const name = currentLineup.name || `Lineup ${savedLineups.length + 1}`;

        const lineupToSave: BuildXILineup = {
          ...currentLineup,
          id: uuidv4(), // Always create new ID for saved version
          name,
          updatedAt: Date.now(),
        };

        set({
          savedLineups: [...savedLineups, lineupToSave],
        });

        return lineupToSave.id;
      },

      loadLineup: (lineupId) => {
        const state = get();
        const lineup = state.savedLineups.find((l) => l.id === lineupId);
        if (!lineup) return;

        set({
          currentLineup: {
            ...lineup,
            id: uuidv4(), // New ID for the working copy
            updatedAt: Date.now(),
          },
          selectedSlotId: null,
        });
      },

      deleteLineup: (lineupId) => {
        set((state) => ({
          savedLineups: state.savedLineups.filter((l) => l.id !== lineupId),
        }));
      },

      createNewLineup: () => {
        set({
          currentLineup: createNewLineup(),
          selectedSlotId: null,
        });
      },

      getFilledSlotsCount: () => {
        const { currentLineup } = get();
        return Object.values(currentLineup.players).filter(Boolean).length;
      },

      isLineupComplete: () => {
        return get().getFilledSlotsCount() === 11;
      },
    }),
    {
      name: "build-xi-storage",
      partialize: (state) => ({
        // Only persist saved lineups, not current work-in-progress
        savedLineups: state.savedLineups,
      }),
    },
  ),
);
