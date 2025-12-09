import { FixtureCard } from "./fixture-card";
import type { Fixture } from "@/types/football";

interface FixtureListProps {
  fixtures: Array<Fixture>;
  title?: string;
  emptyMessage?: string;
}

export function FixtureList({
  fixtures,
  title,
  emptyMessage = "No matches found",
}: FixtureListProps) {
  if (fixtures.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  // Group fixtures by league
  const fixturesByLeague = fixtures.reduce(
    (acc, fixture) => {
      const leagueId = fixture.league?.id ?? 0;
      const leagueName = fixture.league?.name ?? "Other";

      if (!acc[leagueId]) {
        acc[leagueId] = {
          name: leagueName,
          logo: fixture.league?.logo,
          country: fixture.league?.country?.name,
          fixtures: [],
        };
      }
      acc[leagueId].fixtures.push(fixture);
      return acc;
    },
    {} as Record<
      number,
      {
        name: string;
        logo: string | undefined;
        country: string | undefined;
        fixtures: Array<Fixture>;
      }
    >
  );

  return (
    <div className="space-y-6">
      {title && <h2 className="text-xl font-semibold">{title}</h2>}

      {Object.entries(fixturesByLeague).map(([leagueId, league]) => (
        <div key={leagueId} className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            {league.country && <span>{league.country}</span>}
            {league.country && <span>•</span>}
            <span>{league.name}</span>
          </div>

          <div className="grid gap-3">
            {league.fixtures.map((fixture) => (
              <FixtureCard key={fixture.id} fixture={fixture} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
