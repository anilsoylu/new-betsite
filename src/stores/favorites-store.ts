import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

export type FavoriteType = "teams" | "leagues" | "players" | "matches";

const typeLabels: Record<
  FavoriteType,
  { singular: string; plural: string; icon: string }
> = {
  teams: { singular: "Team", plural: "teams", icon: "⚽" },
  leagues: { singular: "League", plural: "leagues", icon: "🏆" },
  players: { singular: "Player", plural: "players", icon: "👤" },
  matches: { singular: "Match", plural: "matches", icon: "📅" },
};

interface FavoritesState {
  teams: number[];
  leagues: number[];
  players: number[];
  matches: number[];
  addFavorite: (type: FavoriteType, id: number) => void;
  removeFavorite: (type: FavoriteType, id: number) => void;
  toggleFavorite: (type: FavoriteType, id: number) => void;
  isFavorite: (type: FavoriteType, id: number) => boolean;
  clearFavorites: (type?: FavoriteType) => void;
  getTotalCount: () => number;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      teams: [],
      leagues: [],
      players: [],
      matches: [],

      addFavorite: (type, id) =>
        set((state) => ({
          [type]: state[type].includes(id) ? state[type] : [...state[type], id],
        })),

      removeFavorite: (type, id) =>
        set((state) => ({
          [type]: state[type].filter((fid) => fid !== id),
        })),

      toggleFavorite: (type, id) => {
        const state = get();
        const label = typeLabels[type];

        if (state[type].includes(id)) {
          // Remove from favorites
          set({ [type]: state[type].filter((fid) => fid !== id) });
          toast(`${label.singular} unfollowed`, {
            description: `Removed from your ${label.plural}`,
            icon: "💔",
            action: {
              label: "Undo",
              onClick: () => get().addFavorite(type, id),
            },
          });
        } else {
          // Add to favorites
          set({ [type]: [...state[type], id] });
          toast.success(`Now following!`, {
            description: `Added to your ${label.plural} ${label.icon}`,
            icon: "⭐",
          });
        }
      },

      isFavorite: (type, id) => get()[type].includes(id),

      clearFavorites: (type) =>
        set(
          type
            ? { [type]: [] }
            : { teams: [], leagues: [], players: [], matches: [] },
        ),

      getTotalCount: () => {
        const state = get();
        return (
          state.teams.length +
          state.leagues.length +
          state.players.length +
          state.matches.length
        );
      },
    }),
    {
      name: "favorites-storage",
    },
  ),
);
