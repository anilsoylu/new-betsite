"use client";

import { useState, useEffect } from "react";

/**
 * Hook to safely handle client-only operations that would cause hydration mismatch.
 * Returns false during SSR/initial hydration, true after mount.
 *
 * Common use cases:
 * - localStorage access (favorites store)
 * - Timezone-dependent date formatting
 * - Browser-only APIs (window, navigator)
 * - Any value that differs between server and client
 *
 * @example
 * const hasMounted = useSafeHydration();
 * const isFavorite = hasMounted && favoritesStore.isFavorite("teams", teamId);
 *
 * @example
 * const hasMounted = useSafeHydration();
 * const formattedTime = hasMounted ? format(date, "HH:mm") : "--:--";
 */
export function useSafeHydration(): boolean {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}

/**
 * Helper hook to safely access a value only after hydration.
 * Returns fallback during SSR, actual value after mount.
 *
 * @example
 * const formattedTime = useSafeValue(() => format(date, "HH:mm"), "--:--");
 *
 * @example
 * const isHomeFavorite = useSafeValue(
 *   () => isFavorite("teams", homeTeam.id),
 *   false
 * );
 */
export function useSafeValue<T>(getValue: () => T, fallback: T): T {
  const hasMounted = useSafeHydration();
  return hasMounted ? getValue() : fallback;
}
