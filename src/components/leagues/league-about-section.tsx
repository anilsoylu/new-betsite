"use client"

import type { League, Standing, TopScorer, Fixture } from "@/types/football"

interface LeagueAboutSectionProps {
  league: League
  standings: Standing[]
  topScorers: TopScorer[]
  recentFixtures: Fixture[]
}

// League-specific data that can't be derived from API
const LEAGUE_METADATA: Record<number, {
  foundedYear?: number
  description?: string
  format?: string
  recordHolder?: string
  recordTitles?: number
  currentHolder?: string
  avgGoals?: number
  startMonth?: string
  endMonth?: string
}> = {
  // UEFA Champions League
  2: {
    foundedYear: 1955,
    description: "Europe's premier club football competition",
    format: "The competition features a 36-team league table where each team plays 8 matches against different opponents, with 4 games at home and 4 away. The top 8 teams advance directly to the Round of 16, while teams ranked 9th to 24th enter a play-off round.",
    recordHolder: "Real Madrid",
    recordTitles: 15,
    currentHolder: "Real Madrid",
    startMonth: "September",
    endMonth: "June",
  },
  // UEFA Europa League
  5: {
    foundedYear: 1971,
    description: "UEFA's second-tier European club competition",
    format: "The competition follows a similar format to the Champions League with a league phase followed by knockout rounds.",
    recordHolder: "Sevilla",
    recordTitles: 7,
    currentHolder: "Atalanta",
    startMonth: "September",
    endMonth: "May",
  },
  // Premier League
  8: {
    foundedYear: 1992,
    description: "The top tier of English football and one of the most watched leagues in the world",
    format: "20 teams compete in a double round-robin format, playing 38 matches each. The bottom 3 teams are relegated to the Championship.",
    recordHolder: "Manchester United",
    recordTitles: 20,
    currentHolder: "Manchester City",
    startMonth: "August",
    endMonth: "May",
  },
  // La Liga
  564: {
    foundedYear: 1929,
    description: "Spain's top professional football division",
    format: "20 teams compete in a double round-robin format, playing 38 matches each. The bottom 3 teams are relegated to Segunda Division.",
    recordHolder: "Real Madrid",
    recordTitles: 36,
    currentHolder: "Real Madrid",
    startMonth: "August",
    endMonth: "May",
  },
  // Bundesliga
  82: {
    foundedYear: 1963,
    description: "Germany's top professional football league",
    format: "18 teams compete in a double round-robin format, playing 34 matches each. The bottom 2 teams are relegated, with the 16th-placed team entering a playoff.",
    recordHolder: "Bayern Munich",
    recordTitles: 33,
    currentHolder: "Bayer Leverkusen",
    startMonth: "August",
    endMonth: "May",
  },
  // Serie A
  384: {
    foundedYear: 1898,
    description: "Italy's top professional football league",
    format: "20 teams compete in a double round-robin format, playing 38 matches each. The bottom 3 teams are relegated to Serie B.",
    recordHolder: "Juventus",
    recordTitles: 36,
    currentHolder: "Inter Milan",
    startMonth: "August",
    endMonth: "May",
  },
  // Ligue 1
  301: {
    foundedYear: 1932,
    description: "France's top professional football league",
    format: "18 teams compete in a double round-robin format, playing 34 matches each. The bottom 2 teams are relegated to Ligue 2.",
    recordHolder: "Paris Saint-Germain",
    recordTitles: 12,
    currentHolder: "Paris Saint-Germain",
    startMonth: "August",
    endMonth: "May",
  },
  // Süper Lig
  203: {
    foundedYear: 1959,
    description: "Turkey's top professional football league",
    format: "19 teams compete in a double round-robin format, playing 38 matches each. The bottom teams are relegated to TFF First League.",
    recordHolder: "Galatasaray",
    recordTitles: 24,
    currentHolder: "Galatasaray",
    startMonth: "August",
    endMonth: "May",
  },
  // Eredivisie
  72: {
    foundedYear: 1956,
    description: "The Netherlands' top professional football league",
    format: "18 teams compete in a double round-robin format, playing 34 matches each. The bottom team is relegated, with playoffs for the 16th and 17th places.",
    recordHolder: "Ajax",
    recordTitles: 36,
    currentHolder: "PSV",
    startMonth: "August",
    endMonth: "May",
  },
  // Primeira Liga (Portugal)
  462: {
    foundedYear: 1934,
    description: "Portugal's top professional football league",
    format: "18 teams compete in a double round-robin format, playing 34 matches each.",
    recordHolder: "Benfica",
    recordTitles: 38,
    currentHolder: "Sporting CP",
    startMonth: "August",
    endMonth: "May",
  },
}

export function LeagueAboutSection({
  league,
  standings,
  topScorers,
  recentFixtures
}: LeagueAboutSectionProps) {
  const metadata = LEAGUE_METADATA[league.id]
  const teamCount = standings.length
  const leagueName = league.name
  const countryName = league.country?.name || "International"

  // Calculate average goals from recent fixtures
  const avgGoals = recentFixtures.length > 0
    ? (recentFixtures.reduce((sum, f) => {
        const homeGoals = f.score?.home ?? 0
        const awayGoals = f.score?.away ?? 0
        return sum + homeGoals + awayGoals
      }, 0) / recentFixtures.length).toFixed(2)
    : null

  // Get top scorer names
  const topScorerNames = topScorers.slice(0, 2).map(s => s.playerName)
  const topScorerGoals = topScorers[0]?.goals || 0

  // Get league leader
  const leagueLeader = standings[0]

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-5">
      <h3 className="text-lg font-semibold">About {leagueName}</h3>

      {/* Main Description */}
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        <p>
          {leagueName}{metadata?.description ? `, ${metadata.description.toLowerCase()}` : ''}, is a professional football {league.type === "league" ? "league" : "competition"} in {countryName}.
        </p>

        {teamCount > 0 && (
          <p>
            There are overall <span className="text-foreground font-medium">{teamCount} teams</span> that compete for the title every year.
          </p>
        )}

        {metadata?.currentHolder && metadata?.recordHolder && (
          <p>
            The current holder of the title is <span className="text-foreground font-medium">{metadata.currentHolder}</span> and the team that holds the most titles is <span className="text-foreground font-medium">{metadata.recordHolder}</span>{metadata.recordTitles ? ` with ${metadata.recordTitles} titles` : ''}.
          </p>
        )}
      </div>

      {/* Competition Format */}
      {metadata?.format && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Competition Format</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {metadata.format}
          </p>
        </div>
      )}

      {/* Top Scorers Section */}
      {topScorerNames.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Top Scorers</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The leading scorers in {leagueName} this season are <span className="text-foreground font-medium">{topScorerNames.join(", ")}</span>.
            {topScorerGoals > 0 && ` The top scorer has ${topScorerGoals} goals so far.`}
          </p>
        </div>
      )}

      {/* Current Leader */}
      {leagueLeader && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Current Leader</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="text-foreground font-medium">{leagueLeader.teamName}</span> is currently leading the table with <span className="text-foreground font-medium">{leagueLeader.points} points</span> after {leagueLeader.played} matches played.
          </p>
        </div>
      )}

      {/* Stats */}
      {avgGoals && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Season Statistics</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The average number of goals per match in {leagueName} this season is <span className="text-foreground font-medium">{avgGoals}</span>.
          </p>
        </div>
      )}

      {/* FAQ Section */}
      <div className="space-y-3 pt-2 border-t border-border">
        <h4 className="text-sm font-semibold text-foreground">Frequently Asked Questions</h4>

        <div className="space-y-3">
          {metadata?.recordHolder && (
            <div>
              <p className="text-sm font-medium text-foreground">
                Which team in {leagueName} has the most titles?
              </p>
              <p className="text-sm text-muted-foreground">
                The team with the most titles in {leagueName} is {metadata.recordHolder}{metadata.recordTitles ? ` with ${metadata.recordTitles} titles` : ''}.
              </p>
            </div>
          )}

          {metadata?.currentHolder && (
            <div>
              <p className="text-sm font-medium text-foreground">
                Who is the current champion of {leagueName}?
              </p>
              <p className="text-sm text-muted-foreground">
                The current titleholder in {leagueName} is {metadata.currentHolder}.
              </p>
            </div>
          )}

          {metadata?.startMonth && metadata?.endMonth && (
            <div>
              <p className="text-sm font-medium text-foreground">
                When does the {leagueName} season start and end?
              </p>
              <p className="text-sm text-muted-foreground">
                The {leagueName} usually starts in {metadata.startMonth} and ends in {metadata.endMonth}.
              </p>
            </div>
          )}

          {leagueLeader && (
            <div>
              <p className="text-sm font-medium text-foreground">
                Who is leading {leagueName} right now?
              </p>
              <p className="text-sm text-muted-foreground">
                {leagueLeader.teamName} is currently at the top of the table with {leagueLeader.points} points from {leagueLeader.played} matches ({leagueLeader.won}W-{leagueLeader.drawn}D-{leagueLeader.lost}L).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
