"use client"

import { useState, useEffect, useRef } from "react"
import type { MatchStatus } from "@/types/football"

interface UseLiveMinuteOptions {
  initialMinute: number | null
  status: MatchStatus
  isLive: boolean
  fixtureId: number
}

/**
 * Hook that simulates live match minute progression on the client side.
 *
 * - Only increments when status is exactly "live"
 * - Returns API value directly for halftime, finished, etc.
 * - Resets when API minute changes
 */
export function useLiveMinute({
  initialMinute,
  status,
  isLive,
  fixtureId
}: UseLiveMinuteOptions): number | null {
  const [displayMinute, setDisplayMinute] = useState<number | null>(initialMinute)
  const lastFixtureIdRef = useRef(fixtureId)
  const lastInitialMinuteRef = useRef(initialMinute)

  // Reset when fixture changes or API minute updates
  useEffect(() => {
    if (
      fixtureId !== lastFixtureIdRef.current ||
      initialMinute !== lastInitialMinuteRef.current
    ) {
      setDisplayMinute(initialMinute)
      lastFixtureIdRef.current = fixtureId
      lastInitialMinuteRef.current = initialMinute
    }
  }, [fixtureId, initialMinute])

  // Increment minute every 60 seconds ONLY when status is "live"
  useEffect(() => {
    // Only increment when actively playing (status === "live")
    if (status !== "live" || !isLive || displayMinute === null) {
      return
    }

    const interval = setInterval(() => {
      setDisplayMinute((prev) => {
        if (prev === null) return null
        if (prev >= 120) return prev
        return prev + 1
      })
    }, 60000)

    return () => clearInterval(interval)
  }, [isLive, status, displayMinute])

  // If not actively playing, always return API value
  if (status !== "live") {
    return initialMinute
  }

  return displayMinute
}
