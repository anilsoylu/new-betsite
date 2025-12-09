import type { Metadata } from "next"
import { format, addDays, subDays, isToday, parseISO } from "date-fns"
import { getFixturesByDate, getLiveFixtures } from "@/lib/api/football-api"
import { FixtureList } from "@/components/fixtures/fixture-list"
import { DateNavigation } from "@/components/matches/date-navigation"
import { SITE, DATE_FORMATS } from "@/lib/constants"

export const metadata: Metadata = {
  title: `All Matches | ${SITE.name}`,
  description: "Browse all football matches by date. Find live scores, upcoming fixtures and match results.",
}

interface MatchesPageProps {
  searchParams: Promise<{ date?: string }>
}

export default async function MatchesPage({ searchParams }: MatchesPageProps) {
  const { date } = await searchParams

  // Parse date from query or use today
  const selectedDate = date ? parseISO(date) : new Date()
  const dateString = format(selectedDate, DATE_FORMATS.apiDate)
  const isSelectedToday = isToday(selectedDate)

  // Generate date range for navigation (3 days before, today, 3 days after)
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(subDays(new Date(), 3), i)
    return {
      date: d,
      dateString: format(d, DATE_FORMATS.apiDate),
      label: format(d, "EEE"),
      dayNumber: format(d, "d"),
      isToday: isToday(d),
      isSelected: format(d, DATE_FORMATS.apiDate) === dateString,
    }
  })

  // Fetch fixtures for selected date
  const [fixtures, liveFixtures] = await Promise.all([
    getFixturesByDate(dateString).catch(() => []),
    isSelectedToday ? getLiveFixtures().catch(() => []) : Promise.resolve([]),
  ])

  // Filter out live fixtures from regular fixtures to avoid duplicates
  const liveIds = new Set(liveFixtures.map((f) => f.id))
  const nonLiveFixtures = fixtures.filter((f) => !liveIds.has(f.id))

  const formattedDate = format(selectedDate, "EEEE, d MMMM yyyy")

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Date Navigation */}
      <DateNavigation dates={dates} />

      {/* Page Title */}
      <div className="mt-6 mb-6">
        <h1 className="text-2xl font-bold">{formattedDate}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {fixtures.length + liveFixtures.length} matches
        </p>
      </div>

      {/* Live Matches (only on today) */}
      {isSelectedToday && liveFixtures.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <h2 className="text-xl font-semibold">Live Matches</h2>
            <span className="text-muted-foreground text-sm">
              ({liveFixtures.length})
            </span>
          </div>
          <FixtureList fixtures={liveFixtures} />
        </section>
      )}

      {/* All Matches */}
      <section>
        <FixtureList
          fixtures={nonLiveFixtures}
          title={isSelectedToday && liveFixtures.length > 0 ? "Scheduled Matches" : undefined}
          emptyMessage="No matches scheduled for this date"
        />
      </section>
    </main>
  )
}
