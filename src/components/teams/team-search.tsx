"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { generateTeamSlug } from "@/lib/utils"
import type { TeamSearchResult } from "@/types/football"

export function TeamSearch() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<TeamSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const searchTeams = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([])
      setHasSearched(false)
      return
    }

    setIsLoading(true)
    setHasSearched(true)

    try {
      const response = await fetch(`/api/teams/search?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data.teams || [])
      }
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchTeams(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, searchTeams])

  const handleTeamClick = (team: TeamSearchResult) => {
    const slug = generateTeamSlug(team.name, team.id)
    router.push(`/teams/${slug}`)
  }

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search teams..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Searching...</span>
        </div>
      )}

      {/* Results */}
      {!isLoading && results.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((team) => (
            <Card
              key={team.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleTeamClick(team)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="relative h-12 w-12 shrink-0">
                  {team.logo ? (
                    <Image
                      src={team.logo}
                      alt={team.name}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                      {team.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{team.name}</p>
                  {team.country && (
                    <p className="text-sm text-muted-foreground truncate">
                      {team.country.name}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && hasSearched && results.length === 0 && query.length >= 2 && (
        <p className="text-muted-foreground">No teams found for "{query}"</p>
      )}

      {/* Initial State */}
      {!hasSearched && !isLoading && (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Enter a team name to search</p>
        </div>
      )}
    </div>
  )
}
