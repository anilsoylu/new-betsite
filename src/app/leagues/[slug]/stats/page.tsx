import { notFound } from "next/navigation";
import { getLeagueStatsData } from "@/lib/api/football-api";
import { extractLeagueId } from "@/lib/utils";
import {
  StatLeaderCard,
  StatsDashboard,
  LeagueAboutSection,
} from "@/components/leagues";

interface StatsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function StatsPage({ params }: StatsPageProps) {
  const { slug } = await params;
  const leagueId = extractLeagueId(slug);

  if (!leagueId) {
    notFound();
  }

  let data;
  try {
    data = await getLeagueStatsData(leagueId);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Season Leaders Dashboard */}
      <StatsDashboard
        league={data.league}
        stats={{
          goals: data.goals,
          assists: data.assists,
          yellowCards: data.yellowCards,
          cleanSheets: data.cleanSheets,
          ratings: data.ratings,
        }}
      />

      {/* Goals & Assists */}
      <div className="grid md:grid-cols-2 gap-6">
        <StatLeaderCard type="goals" players={data.goals} />
        <StatLeaderCard type="assists" players={data.assists} />
      </div>

      {/* Cards & Defense */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatLeaderCard type="yellowCards" players={data.yellowCards} />
        <StatLeaderCard type="redCards" players={data.redCards} />
        <StatLeaderCard type="cleanSheets" players={data.cleanSheets} />
      </div>

      {/* Top Rated Players */}
      <StatLeaderCard type="rating" players={data.ratings} limit={10} />

      {/* League About Section */}
      <LeagueAboutSection
        league={data.league}
        standings={data.standings}
        topScorers={data.goals}
        recentFixtures={data.recentFixtures}
      />
    </div>
  );
}
