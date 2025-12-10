import Image from "next/image";
import { FixtureCard } from "./fixture-card";
import { cn } from "@/lib/utils";
import type { Fixture } from "@/types/football";

interface FixtureListProps {
  fixtures: Array<Fixture>;
  title?: string;
  emptyMessage?: string;
  showStickyHeaders?: boolean;
}

export function FixtureList({
  fixtures,
  title,
  emptyMessage = "No matches found",
  showStickyHeaders = false,
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
    >,
  );

  return (
    <div className="space-y-6">
      {title && <h2 className="text-xl font-semibold">{title}</h2>}

      {Object.entries(fixturesByLeague).map(([leagueId, league]) => (
        <div key={leagueId} className="space-y-2">
          <div
            className={cn(
              "flex items-center gap-2 py-2 text-sm font-medium",
              showStickyHeaders &&
                "sticky top-14 z-10 bg-background/95 backdrop-blur-sm -mx-1 px-1",
            )}
          >
            {league.logo && (
              <Image
                src={league.logo}
                alt={league.name}
                width={18}
                height={18}
                className="object-contain"
              />
            )}
            <div className="flex items-center gap-1.5 text-muted-foreground">
              {league.country && (
                <span className="text-xs">{league.country}</span>
              )}
              {league.country && <span className="text-xs">·</span>}
              <span className="font-medium text-foreground">{league.name}</span>
            </div>
          </div>

          <div className="grid gap-2">
            {league.fixtures.map((fixture) => (
              <FixtureCard key={fixture.id} fixture={fixture} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
