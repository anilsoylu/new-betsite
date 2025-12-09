import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Helper to create URL-friendly slug
function createSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

// Top leagues configuration
export const TOP_LEAGUES = [
  { id: 8, name: "Premier League", shortName: "EPL", country: "England", logo: "https://media.api-sports.io/football/leagues/39.png" },
  { id: 564, name: "La Liga", shortName: "La Liga", country: "Spain", logo: "https://media.api-sports.io/football/leagues/140.png" },
  { id: 82, name: "Bundesliga", shortName: "Bundesliga", country: "Germany", logo: "https://media.api-sports.io/football/leagues/78.png" },
  { id: 384, name: "Serie A", shortName: "Serie A", country: "Italy", logo: "https://media.api-sports.io/football/leagues/135.png" },
  { id: 301, name: "Ligue 1", shortName: "Ligue 1", country: "France", logo: "https://media.api-sports.io/football/leagues/61.png" },
  { id: 203, name: "Süper Lig", shortName: "Süper Lig", country: "Turkey", logo: "https://media.api-sports.io/football/leagues/203.png" },
  { id: 72, name: "Eredivisie", shortName: "Eredivisie", country: "Netherlands", logo: "https://media.api-sports.io/football/leagues/88.png" },
  { id: 462, name: "Liga Portugal", shortName: "Liga Portugal", country: "Portugal", logo: "https://media.api-sports.io/football/leagues/94.png" },
  { id: 1, name: "World Cup", shortName: "World Cup", country: "International", logo: "https://media.api-sports.io/football/leagues/1.png" },
  { id: 2, name: "Champions League", shortName: "UCL", country: "Europe", logo: "https://media.api-sports.io/football/leagues/2.png" },
  { id: 5, name: "Europa League", shortName: "UEL", country: "Europe", logo: "https://media.api-sports.io/football/leagues/3.png" },
]

interface TopLeaguesProps {
  className?: string
}

export function TopLeagues({ className }: TopLeaguesProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-sm">Top Leagues</h3>
      </div>
      <div className="divide-y divide-border/50">
        {TOP_LEAGUES.map((league) => (
          <Link
            key={league.id}
            href={`/leagues/${createSlug(league.name)}-${league.id}`}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 transition-colors",
              "hover:bg-muted/50"
            )}
          >
            <Image
              src={league.logo}
              alt={league.name}
              width={20}
              height={20}
              className="object-contain"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">{league.name}</span>
              <span className="text-[10px] text-muted-foreground">{league.country}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
