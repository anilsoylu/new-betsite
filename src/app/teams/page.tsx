import type { Metadata } from "next"
import { Search, Trophy, Star, Shield, TrendingUp } from "lucide-react"
import { SITE, POPULAR_LEAGUES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: `Teams | ${SITE.name}`,
  description: "Discover and browse football teams. Find team information, squad, fixtures and statistics.",
}

// Placeholder popular teams data
const POPULAR_TEAMS = [
  { id: 1, name: "Manchester City", league: "Premier League", shortCode: "MCI" },
  { id: 2, name: "Real Madrid", league: "La Liga", shortCode: "RMA" },
  { id: 3, name: "Bayern Munich", league: "Bundesliga", shortCode: "BAY" },
  { id: 4, name: "Arsenal", league: "Premier League", shortCode: "ARS" },
  { id: 5, name: "Barcelona", league: "La Liga", shortCode: "BAR" },
  { id: 6, name: "Liverpool", league: "Premier League", shortCode: "LIV" },
  { id: 7, name: "Inter Milan", league: "Serie A", shortCode: "INT" },
  { id: 8, name: "Paris Saint-Germain", league: "Ligue 1", shortCode: "PSG" },
]

export default function TeamsPage() {
  return (
    <main className="flex-1 overflow-auto">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Discover Teams</h1>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Explore football clubs from leagues around the world. View squads,
              fixtures, standings and add favorites to track.
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <div className="pl-10 pr-4 py-2.5 rounded-lg border bg-muted/50 text-muted-foreground text-sm w-64 text-left">
                  Use search in header...
                </div>
              </div>
              <span className="text-xs text-muted-foreground">or press</span>
              <kbd className="inline-flex h-6 items-center gap-1 rounded border bg-muted px-2 font-mono text-xs font-medium">
                <span>⌘</span>K
              </kbd>
            </div>
          </div>

          {/* League Filter Chips */}
          <div className="mb-8">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">Browse by League</h2>
            <div className="flex flex-wrap gap-2">
              {POPULAR_LEAGUES.map((league) => (
                <Badge
                  key={league.id}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent transition-colors px-3 py-1.5"
                >
                  <span className="mr-1.5 text-xs font-bold text-muted-foreground">
                    {league.shortCode}
                  </span>
                  {league.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Popular Teams */}
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                Popular Teams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {POPULAR_TEAMS.map((team) => (
                  <div
                    key={team.id}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group"
                  >
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                      <Shield className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium truncate max-w-full">{team.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{team.league}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* League Cards */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {POPULAR_LEAGUES.slice(0, 4).map((league) => (
              <Card key={league.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground">
                      {league.shortCode.slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{league.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {league.shortCode === "ENG" && "20 teams"}
                        {league.shortCode === "ESP" && "20 teams"}
                        {league.shortCode === "GER" && "18 teams"}
                        {league.shortCode === "ITA" && "20 teams"}
                        {league.shortCode === "FRA" && "18 teams"}
                        {league.shortCode === "UEFA" && "32 teams"}
                      </p>
                    </div>
                    <Trophy className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Follow Your Teams</h3>
                    <p className="text-sm text-muted-foreground">
                      Star your favorite teams to track their matches and results.
                      Access them quickly from the sidebar.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Global Coverage</h3>
                    <p className="text-sm text-muted-foreground">
                      Browse teams from 1,000+ leagues and competitions across
                      the world. Complete squad and fixture data.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
  )
}
