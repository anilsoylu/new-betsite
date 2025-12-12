import { notFound } from "next/navigation";
import { getTeamById } from "@/lib/api/cached-football-api";
import { extractTeamId } from "@/lib/utils";
import { TeamHeader } from "@/components/teams";

interface TeamLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function TeamLayout({
  children,
  params,
}: TeamLayoutProps) {
  const { slug } = await params;
  const teamId = extractTeamId(slug);

  if (!teamId) {
    notFound();
  }

  let team;

  try {
    team = await getTeamById(teamId);
  } catch {
    notFound();
  }

  return (
    <main className="flex-1 overflow-auto">
      <div className="container mx-auto px-4 py-6">
        {/* Team Header */}
        <div className="mb-6">
          <TeamHeader team={team} />
        </div>

        {/* Tab Content - tabs are now inside TeamTabs component */}
        {children}
      </div>
    </main>
  );
}
