import type { Metadata } from "next"
import { Suspense } from "react"
import { SITE } from "@/lib/constants"
import { PlayerSearch } from "@/components/players/player-search"

export const metadata: Metadata = {
  title: `Players | ${SITE.name}`,
  description: "Search and browse football players. Find player information, statistics and career history.",
}

export default function PlayersPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Players</h1>
      <p className="text-muted-foreground mb-8">
        Search for any football player to view their profile, statistics and career history.
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <PlayerSearch />
      </Suspense>
    </main>
  )
}
