import type { Metadata } from "next"
import { getHomePageData } from "@/lib/queries"
import { FixtureList } from "@/components/fixtures/fixture-list"
import { PAGES, SEO } from "@/lib/constants"

export const metadata: Metadata = {
  title: SEO.home.title,
  description: SEO.home.description,
}

export default async function HomePage() {
  const { liveFixtures, todayFixtures } = await getHomePageData()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{PAGES.home.title}</h1>

      {/* Live Matches */}
      {liveFixtures.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <h2 className="text-xl font-semibold">{PAGES.home.liveSection}</h2>
            <span className="text-muted-foreground text-sm">
              ({liveFixtures.length})
            </span>
          </div>
          <FixtureList fixtures={liveFixtures} />
        </section>
      )}

      {/* Today's Matches */}
      <section>
        <FixtureList
          fixtures={todayFixtures}
          title={PAGES.home.todaySection}
          emptyMessage={PAGES.home.emptyMessage}
        />
      </section>
    </main>
  )
}
