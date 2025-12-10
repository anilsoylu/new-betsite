"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseSearchOptions<T> {
  /** Fetch function that takes query string and returns results */
  fetcher: (query: string) => Promise<T>;
  /** Minimum query length before searching (default: 2) */
  minLength?: number;
  /** Debounce delay in ms (default: 300) */
  debounceMs?: number;
  /** Initial results value */
  initialResults?: T;
}

interface UseSearchResult<T> {
  /** Current search query */
  query: string;
  /** Update search query */
  setQuery: (query: string) => void;
  /** Search results */
  results: T;
  /** Whether a search is in progress */
  isLoading: boolean;
  /** Whether at least one search has been performed */
  hasSearched: boolean;
  /** Error from last search attempt */
  error: Error | null;
  /** Clear search query and results */
  clearSearch: () => void;
}

/**
 * Generic search hook with debouncing, loading states, and request cancellation.
 * Consolidates search logic used across GlobalSearch, PlayerSearch, and TeamSearch.
 *
 * @example
 * const { query, setQuery, results, isLoading } = useSearch({
 *   fetcher: async (q) => {
 *     const res = await fetch(`/api/players/search?q=${encodeURIComponent(q)}`);
 *     const data = await res.json();
 *     return data.players || [];
 *   },
 *   initialResults: [],
 * });
 */
export function useSearch<T>({
  fetcher,
  minLength = 2,
  debounceMs = 300,
  initialResults,
}: UseSearchOptions<T>): UseSearchResult<T> {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T>(initialResults as T);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Track current request to handle race conditions
  const requestIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const search = useCallback(
    async (searchQuery: string) => {
      // Reset if query too short
      if (searchQuery.length < minLength) {
        setResults(initialResults as T);
        setHasSearched(false);
        setError(null);
        return;
      }

      // Cancel previous request
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      // Track this request
      const currentRequestId = ++requestIdRef.current;

      setIsLoading(true);
      setHasSearched(true);
      setError(null);

      try {
        const data = await fetcher(searchQuery);

        // Only update if this is still the latest request
        if (currentRequestId === requestIdRef.current) {
          setResults(data);
        }
      } catch (err) {
        // Ignore abort errors
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        // Only update error if this is still the latest request
        if (currentRequestId === requestIdRef.current) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setResults(initialResults as T);
        }
      } finally {
        // Only clear loading if this is still the latest request
        if (currentRequestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [fetcher, minLength, initialResults],
  );

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      search(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, search, debounceMs]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults(initialResults as T);
    setHasSearched(false);
    setError(null);
    requestIdRef.current++;
  }, [initialResults]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    hasSearched,
    error,
    clearSearch,
  };
}
