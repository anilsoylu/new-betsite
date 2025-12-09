import { NextRequest, NextResponse } from "next/server"
import { sportmonksRequest } from "@/lib/api/sportmonks-client"
import { mapEvent, mapStatistic } from "@/lib/api/sportmonks-mappers"
import type { SportmonksEventRaw, SportmonksStatisticRaw } from "@/types/sportmonks/raw"

// Disable Next.js route caching for live data
export const dynamic = "force-dynamic"

interface RouteParams {
  params: Promise<{ id: string }>
}

interface FixtureState {
  developer_name: string
}

interface FixturePeriod {
  ticking: boolean
  minutes: number
  seconds: number
  description: string
  time_added: number | null
  period_length: number
}

interface FixtureScore {
  description: string
  score: {
    participant: string
    goals: number
  }
}

interface RawLiveFixture {
  id: number
  state_id: number
  state?: FixtureState
  periods?: FixturePeriod[]
  scores?: FixtureScore[]
  events?: SportmonksEventRaw[]
  statistics?: SportmonksStatisticRaw[]
}

// Status mapping by state_id (from /football/states endpoint)
const STATE_ID_MAP: Record<number, { status: string; isLive: boolean }> = {
  1: { status: "scheduled", isLive: false },      // NS - Not Started
  2: { status: "live", isLive: true },            // INPLAY_1ST_HALF
  3: { status: "halftime", isLive: true },        // HT - Half Time
  4: { status: "halftime", isLive: true },        // BREAK
  5: { status: "finished", isLive: false },       // FT - Full Time
  6: { status: "live", isLive: true },            // INPLAY_ET
  7: { status: "finished", isLive: false },       // AET
  8: { status: "finished", isLive: false },       // FT_PEN
  9: { status: "live", isLive: true },            // INPLAY_PENALTIES
  10: { status: "postponed", isLive: false },     // POSTPONED
  11: { status: "suspended", isLive: false },     // SUSPENDED
  12: { status: "cancelled", isLive: false },     // CANCELLED
  13: { status: "scheduled", isLive: false },     // TBA
  14: { status: "finished", isLive: false },      // WO - Walk Over
  15: { status: "cancelled", isLive: false },     // ABANDONED
  16: { status: "suspended", isLive: false },     // DELAYED
  17: { status: "finished", isLive: false },      // AWARDED
  18: { status: "suspended", isLive: false },     // INTERRUPTED
  21: { status: "halftime", isLive: true },       // EXTRA_TIME_BREAK
  22: { status: "live", isLive: true },           // INPLAY_2ND_HALF
  23: { status: "live", isLive: true },           // INPLAY_ET_2ND_HALF
  25: { status: "halftime", isLive: true },       // PEN_BREAK
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const fixtureId = parseInt(id, 10)

  if (isNaN(fixtureId)) {
    return NextResponse.json(
      { error: "Invalid fixture ID" },
      { status: 400 }
    )
  }

  try {
    // Use livescores/inplay endpoint for accurate live data
    // 10 second cache to reduce API calls while keeping data fresh
    const response = await sportmonksRequest<RawLiveFixture[]>({
      endpoint: "/livescores/inplay",
      include: ["state", "scores", "periods", "events", "statistics", "statistics.type"],
      revalidate: 10
    })

    // Find our fixture in the live matches
    const fixture = response.data.find(f => f.id === fixtureId)

    if (!fixture) {
      // Fixture not in live matches - return default/unknown
      return NextResponse.json({
        status: "unknown",
        minute: null,
        homeScore: 0,
        awayScore: 0,
        isLive: false,
        events: [],
        statistics: []
      })
    }

    // Get status from state_id
    const stateInfo = STATE_ID_MAP[fixture.state_id] || { status: "unknown", isLive: false }

    // Get current minute from active period (ticking: true)
    let minute: number | null = null
    let timeAdded: number | null = null
    let periodLength = 45

    if (fixture.periods && fixture.periods.length > 0) {
      // Find the active period (ticking: true)
      const activePeriod = fixture.periods.find(p => p.ticking)

      if (activePeriod) {
        minute = activePeriod.minutes
        timeAdded = activePeriod.time_added
        periodLength = activePeriod.period_length || 45
      } else {
        // No active period - might be halftime, get last period's end minute
        const lastPeriod = fixture.periods[fixture.periods.length - 1]
        if (lastPeriod) {
          minute = lastPeriod.minutes
        }
      }
    }

    // Extract scores
    let homeScore = 0
    let awayScore = 0
    if (fixture.scores) {
      for (const score of fixture.scores) {
        if (score.description === "CURRENT") {
          if (score.score.participant === "home") {
            homeScore = score.score.goals
          } else if (score.score.participant === "away") {
            awayScore = score.score.goals
          }
        }
      }
    }

    // Map events and statistics
    const events = (fixture.events || []).map(mapEvent)
    const homeStats = (fixture.statistics || []).filter((s) => s.location === "home")
    const awayStats = (fixture.statistics || []).filter((s) => s.location === "away")
    const statistics = mapStatistic(homeStats, awayStats)

    return NextResponse.json({
      status: stateInfo.status,
      minute,
      timeAdded,
      periodLength,
      homeScore,
      awayScore,
      isLive: stateInfo.isLive,
      events,
      statistics
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    })
  } catch (error) {
    console.error("Error fetching live fixture:", error)
    return NextResponse.json(
      { error: "Failed to fetch fixture" },
      { status: 500 }
    )
  }
}
