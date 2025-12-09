import type { Metadata } from "next"
import { Search, TrendingUp, Star, Users } from "lucide-react"
import { SITE } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: `Players | ${SITE.name}`,
  description: "Discover and browse football players. Find player information, statistics and career history.",
}

// Placeholder trending players data
const TRENDING_PLAYERS = [
  { id: 1, name: "Erling Haaland", position: "ST", team: "Manchester City" },
  { id: 2, name: "Kylian Mbappé", position: "LW", team: "Real Madrid" },
  { id: 3, name: "Jude Bellingham", position: "CM", team: "Real Madrid" },
  { id: 4, name: "Vinicius Jr", position: "LW", team: "Real Madrid" },
  { id: 5, name: "Bukayo Saka", position: "RW", team: "Arsenal" },
  { id: 6, name: "Rodri", position: "DM", team: "Manchester City" },
]

const PLAYER_CATEGORIES = [
  { label: "Goalkeepers", icon: "🧤", count: "2,500+" },
  { label: "Defenders", icon: "🛡️", count: "8,000+" },
  { label: "Midfielders", icon: "⚽", count: "10,000+" },
  { label: "Forwards", icon: "🎯", count: "6,000+" },
]

export default function PlayersPage() {
  return (
    <main className="flex-1 overflow-auto">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Discover Players</h1>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Search through thousands of football players worldwide. Find statistics,
              career history, and add your favorites to track.
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

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {PLAYER_CATEGORIES.map((category) => (
              <Card key={category.label} className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-4 text-center">
                  <span className="text-2xl mb-2 block">{category.icon}</span>
                  <p className="font-medium text-sm">{category.label}</p>
                  <p className="text-xs text-muted-foreground">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trending Players */}
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                Trending Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {TRENDING_PLAYERS.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group"
                  >
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                      {player.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{player.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {player.position} · {player.team}
                      </p>
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

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Track Your Favorites</h3>
                    <p className="text-sm text-muted-foreground">
                      Star players to add them to your favorites. View all your favorite
                      players and teams in the sidebar.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Comprehensive Database</h3>
                    <p className="text-sm text-muted-foreground">
                      Access detailed profiles for 25,000+ players from leagues around
                      the world. Statistics, transfers, and more.
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
