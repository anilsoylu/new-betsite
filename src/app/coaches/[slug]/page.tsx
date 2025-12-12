import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CoachAttributes,
  CoachCareer,
  CoachHeader,
  CoachTrophies,
} from "@/components/coaches";
import { JsonLdScript } from "@/components/seo";
import { StandingsWidget } from "@/components/sidebar";
import { getCoachById } from "@/lib/api/football-api";
import { SITE } from "@/lib/constants";
import { getTopLeaguesStandings } from "@/lib/queries";
import { generateBreadcrumbSchema } from "@/lib/seo/json-ld";
import { extractCoachId } from "@/lib/utils";

interface CoachDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CoachDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const coachId = extractCoachId(slug);

  if (!coachId) {
    return { title: "Coach Not Found" };
  }

  try {
    const coach = await getCoachById(coachId);

    const title = `${coach.displayName} | Career & Trophies`;
    const description = `${coach.displayName} profile, career history and achievements.${
      coach.currentTeam
        ? ` Currently managing ${coach.currentTeam.teamName}.`
        : ""
    }`;

    return {
      title,
      description,
      alternates: {
        canonical: `${SITE.url}/coaches/${slug}`,
      },
      openGraph: {
        title,
        description,
        images: coach.image ? [{ url: coach.image }] : undefined,
      },
    };
  } catch {
    return { title: "Coach Not Found" };
  }
}

export default async function CoachDetailPage({
  params,
}: CoachDetailPageProps) {
  const { slug } = await params;
  const coachId = extractCoachId(slug);

  if (!coachId) {
    notFound();
  }

  // Fetch coach and standings in parallel
  const [coach, leagueStandings] = await Promise.all([
    getCoachById(coachId).catch(() => null),
    getTopLeaguesStandings().catch(() => []),
  ]);

  if (!coach) {
    notFound();
  }

  // Generate structured data
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: coach.displayName,
    givenName: coach.firstName,
    familyName: coach.lastName,
    image: coach.image,
    url: `${SITE.url}/coaches/${slug}`,
    jobTitle: "Football Manager",
    birthDate: coach.dateOfBirth,
    nationality: coach.nationality?.name
      ? {
          "@type": "Country",
          name: coach.nationality.name,
        }
      : undefined,
    worksFor: coach.currentTeam
      ? {
          "@type": "SportsTeam",
          name: coach.currentTeam.teamName,
        }
      : undefined,
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE.url },
    { name: "Coaches", url: `${SITE.url}/coaches` },
    { name: coach.displayName, url: `${SITE.url}/coaches/${slug}` },
  ]);

  return (
    <main className="flex-1 overflow-auto">
      <JsonLdScript id="person-schema" schema={personSchema} />
      <JsonLdScript id="breadcrumb-schema" schema={breadcrumbSchema} />

      <div className="container mx-auto px-4 py-4">
        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main Content */}
          <div className="min-w-0 space-y-6">
            {/* Coach Header */}
            <CoachHeader coach={coach} />

            {/* About Section - SEO Content */}
            <CoachAboutSection coach={coach} />
          </div>

          {/* Right Sidebar */}
          <aside className="hidden lg:flex flex-col gap-4">
            {/* Attribute Overview */}
            <CoachAttributes coach={coach} />

            {/* Career History - All teams managed */}
            <CoachCareer teams={coach.teams} />

            {/* Trophies */}
            <CoachTrophies trophies={coach.trophies} />

            {/* Standings Widget */}
            <StandingsWidget leagueStandings={leagueStandings} />
          </aside>
        </div>
      </div>
    </main>
  );
}

// Simple About Section component for SEO content
function CoachAboutSection({
  coach,
}: {
  coach: Awaited<ReturnType<typeof getCoachById>>;
}) {
  const {
    displayName,
    currentTeam,
    teams,
    trophies,
    nationality,
    dateOfBirth,
  } = coach;

  const titlesCount = trophies.filter((t) => t.position === 1).length;
  const teamsCount = teams.filter((t) => t.position === "Head Coach").length;

  return (
    <section className="prose prose-slate dark:prose-invert max-w-none">
      <h2>About {displayName}</h2>
      <p>
        {displayName} is a professional football manager
        {nationality ? ` from ${nationality.name}` : ""}.
        {currentTeam
          ? ` Currently serving as ${currentTeam.position || "Head Coach"} at ${currentTeam.teamName}.`
          : ""}
      </p>

      {teamsCount > 0 && (
        <p>
          Throughout their managerial career, {displayName} has managed{" "}
          {teamsCount} {teamsCount === 1 ? "team" : "teams"}
          {titlesCount > 0
            ? ` and won ${titlesCount} ${titlesCount === 1 ? "title" : "titles"}`
            : ""}
          .
        </p>
      )}

      {/* Key Facts */}
      <h3>Key Facts</h3>
      <ul>
        {currentTeam && (
          <li>
            <strong>Current Team:</strong> {currentTeam.teamName}
          </li>
        )}
        {nationality && (
          <li>
            <strong>Nationality:</strong> {nationality.name}
          </li>
        )}
        {dateOfBirth && (
          <li>
            <strong>Date of Birth:</strong> {dateOfBirth}
          </li>
        )}
        <li>
          <strong>Teams Managed:</strong> {teamsCount || teams.length}
        </li>
        <li>
          <strong>Titles Won:</strong> {titlesCount}
        </li>
      </ul>

      {/* FAQ Section */}
      <h3>Frequently Asked Questions</h3>
      <details>
        <summary>What team does {displayName} currently manage?</summary>
        <p>
          {currentTeam
            ? `${displayName} is currently the ${currentTeam.position || "Head Coach"} of ${currentTeam.teamName}.`
            : `${displayName} is not currently managing any team.`}
        </p>
      </details>
      {titlesCount > 0 && (
        <details>
          <summary>How many titles has {displayName} won?</summary>
          <p>
            {displayName} has won {titlesCount}{" "}
            {titlesCount === 1 ? "title" : "titles"} throughout their managerial
            career.
          </p>
        </details>
      )}
    </section>
  );
}
