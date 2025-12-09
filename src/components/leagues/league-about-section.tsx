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
    <article className="rounded-xl border border-border bg-card p-5 space-y-5">
      {/* Main Title - H2 for SEO */}
      <h2 className="text-xl font-bold">About {leagueName}</h2>

      {/* Main Description */}
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-3">
        <p>
          <strong>{leagueName}</strong>
          {metadata?.description ? `, ${metadata.description.toLowerCase()}` : ""}, is a professional
          football {league.type === "league" ? "league" : "competition"} in <strong>{countryName}</strong>.
          {metadata?.foundedYear && (
            <> Founded in <strong>{metadata.foundedYear}</strong>, it has grown to become one of the
            most prestigious competitions in world football.</>
          )}
        </p>

        {teamCount > 0 && (
          <p>
            There are overall <strong>{teamCount} teams</strong> that compete for the title every year,
            battling it out across the season for glory and European qualification spots.
          </p>
        )}

        {metadata?.currentHolder && metadata?.recordHolder && (
          <p>
            The current holder of the title is <strong>{metadata.currentHolder}</strong>.
            The team with the most titles in {leagueName} history is{" "}
            <strong>{metadata.recordHolder}</strong>
            {metadata.recordTitles ? <> with an impressive <strong>{metadata.recordTitles} titles</strong></> : ""}.
          </p>
        )}
      </div>

      {/* Competition Format */}
      {metadata?.format && (
        <section className="space-y-2">
          <h3 className="text-base font-semibold">Competition Format</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {metadata.format}
          </p>
        </section>
      )}

      {/* Current Standings Overview */}
      {leagueLeader && (
        <section className="space-y-2">
          <h3 className="text-base font-semibold">Current Standings</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong>{leagueLeader.teamName}</strong> is currently leading the {leagueName} table with{" "}
            <strong>{leagueLeader.points} points</strong> from {leagueLeader.played} matches.
            They have recorded <strong>{leagueLeader.won} wins</strong>, {leagueLeader.drawn} draws,
            and {leagueLeader.lost} losses this season.
          </p>
        </section>
      )}

      {/* Top Scorers Section */}
      {topScorerNames.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-base font-semibold">Top Scorers</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The leading scorers in {leagueName} this season are{" "}
            <strong>{topScorerNames.join(" and ")}</strong>.
            {topScorerGoals > 0 && (
              <> The Golden Boot race is heating up with the top scorer on <strong>{topScorerGoals} goals</strong>.</>
            )}
          </p>
        </section>
      )}

      {/* Season Statistics */}
      {avgGoals && (
        <section className="space-y-2">
          <h3 className="text-base font-semibold">Season Statistics</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The average number of goals per match in {leagueName} this season is{" "}
            <strong>{avgGoals}</strong>, making it an exciting league for fans who love
            goal-filled encounters.
          </p>
        </section>
      )}

      {/* Key Facts List */}
      <section className="space-y-2">
        <h3 className="text-base font-semibold">Key Facts</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
          {metadata?.foundedYear && (
            <li>
              <strong>Founded:</strong> {metadata.foundedYear}
            </li>
          )}
          {teamCount > 0 && (
            <li>
              <strong>Number of Teams:</strong> {teamCount}
            </li>
          )}
          {metadata?.currentHolder && (
            <li>
              <strong>Current Champion:</strong> {metadata.currentHolder}
            </li>
          )}
          {metadata?.recordHolder && metadata?.recordTitles && (
            <li>
              <strong>Most Titles:</strong> {metadata.recordHolder} ({metadata.recordTitles})
            </li>
          )}
          {metadata?.startMonth && metadata?.endMonth && (
            <li>
              <strong>Season:</strong> {metadata.startMonth} - {metadata.endMonth}
            </li>
          )}
          {avgGoals && (
            <li>
              <strong>Avg. Goals/Match:</strong> {avgGoals}
            </li>
          )}
        </ul>
      </section>

      {/* FAQ Section with proper schema markup */}
      <section className="space-y-3 pt-4 border-t border-border">
        <h3 className="text-base font-semibold">Frequently Asked Questions</h3>

        <div className="space-y-4">
          {metadata?.recordHolder && (
            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h4 itemProp="name" className="text-sm font-medium">
                Which team in {leagueName} has the most titles?
              </h4>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text" className="text-sm text-muted-foreground mt-1">
                  <strong>{metadata.recordHolder}</strong> holds the record for most {leagueName} titles
                  {metadata.recordTitles ? ` with ${metadata.recordTitles} championships` : ""}.
                </p>
              </div>
            </div>
          )}

          {metadata?.currentHolder && (
            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h4 itemProp="name" className="text-sm font-medium">
                Who is the current champion of {leagueName}?
              </h4>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text" className="text-sm text-muted-foreground mt-1">
                  <strong>{metadata.currentHolder}</strong> is the reigning champion of {leagueName}.
                </p>
              </div>
            </div>
          )}

          {metadata?.startMonth && metadata?.endMonth && (
            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h4 itemProp="name" className="text-sm font-medium">
                When does the {leagueName} season start and end?
              </h4>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text" className="text-sm text-muted-foreground mt-1">
                  The {leagueName} season typically runs from <strong>{metadata.startMonth}</strong> to{" "}
                  <strong>{metadata.endMonth}</strong>.
                </p>
              </div>
            </div>
          )}

          {leagueLeader && (
            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h4 itemProp="name" className="text-sm font-medium">
                Who is leading {leagueName} right now?
              </h4>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text" className="text-sm text-muted-foreground mt-1">
                  <strong>{leagueLeader.teamName}</strong> is currently at the top of the table with{" "}
                  <strong>{leagueLeader.points} points</strong> from {leagueLeader.played} matches
                  ({leagueLeader.won}W-{leagueLeader.drawn}D-{leagueLeader.lost}L).
                </p>
              </div>
            </div>
          )}

          {teamCount > 0 && (
            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h4 itemProp="name" className="text-sm font-medium">
                How many teams play in {leagueName}?
              </h4>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text" className="text-sm text-muted-foreground mt-1">
                  <strong>{teamCount} teams</strong> compete in {leagueName} each season.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </article>
  )
}
