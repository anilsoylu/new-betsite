import type { Metadata } from "next"
import { Suspense } from "react"
import { SITE } from "@/lib/constants"
import { TeamSearch } from "@/components/teams/team-search"

export const metadata: Metadata = {
  title: `Teams | ${SITE.name}`,
  description: "Search and browse football teams. Find team information, squad, fixtures and statistics.",
}

export default function TeamsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Teams</h1>
      <p className="text-muted-foreground mb-8">
        Search for any football team to view their squad, fixtures and statistics.
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <TeamSearch />
      </Suspense>
    </main>
  )
}
