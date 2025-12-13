import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CoachAboutSection,
  CoachAttributes,
  CoachCareer,
  CoachHeader,
  CoachTrophies,
} from "@/components/coaches";
import { JsonLdScript } from "@/components/seo";
import { StandingsWidget } from "@/components/sidebar";
import { getCoachById, getPlayerById } from "@/lib/api/cached-football-api";
import { SEO, SITE } from "@/lib/constants";
import { getTopLeaguesStandings } from "@/lib/queries";
import {
  generateBreadcrumbSchema,
  generateCoachFAQSchema,
  generateCoachSchema,
} from "@/lib/seo/json-ld";
import { extractCoachId } from "@/lib/utils";
import { safeValidateSlugParams } from "@/lib/validation/schemas";

// Revalidate every 6 hours for coach profile
export const revalidate = 21600;

interface CoachDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CoachDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  // Validate slug format first
  const validation = safeValidateSlugParams({ slug });
  if (!validation.success) {
    return { title: "Coach Not Found" };
  }

  const coachId = extractCoachId(slug);
  if (!coachId) {
    return { title: "Coach Not Found" };
  }

  try {
    const coach = await getCoachById(coachId);

    const title = SEO.coachDetail.titleTemplate(coach.displayName);
    const description = SEO.coachDetail.descriptionTemplate(
      coach.displayName,
      coach.currentTeam?.teamName || null,
    );

    return {
      title,
      description,
      alternates: {
        canonical: `${SITE.url}/coaches/${slug}`,
      },
      openGraph: {
        title,
        description,
        url: `${SITE.url}/coaches/${slug}`,
        siteName: SITE.name,
        images: coach.image ? [{ url: coach.image }] : undefined,
        type: "profile",
      },
      twitter: {
        card: "summary",
        title,
        description,
        images: coach.image ? [coach.image] : undefined,
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

  // Validate slug format first
  const validation = safeValidateSlugParams({ slug });
  if (!validation.success) {
    notFound();
  }

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

  // Fetch player career data if coach was a former player
  let playerCareer = null;
  if (coach.formerPlayerId) {
    playerCareer = await getPlayerById(coach.formerPlayerId).catch(() => null);
  }

  // Generate structured data using centralized schema generators
  const personSchema = generateCoachSchema(coach);
  const faqSchema = generateCoachFAQSchema(coach);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE.url },
    { name: "Coaches", url: `${SITE.url}/coaches` },
    { name: coach.displayName, url: `${SITE.url}/coaches/${slug}` },
  ]);

  return (
    <main className="flex-1 overflow-auto">
      <JsonLdScript id="person-schema" schema={personSchema} />
      <JsonLdScript id="faq-schema" schema={faqSchema} />
      <JsonLdScript id="breadcrumb-schema" schema={breadcrumbSchema} />

      <div className="container mx-auto px-4 py-4">
        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main Content */}
          <div className="min-w-0 space-y-6">
            {/* Coach Header */}
            <CoachHeader coach={coach} />

            {/* Mobile only: Attributes, Career & Trophies */}
            <div className="lg:hidden space-y-4">
              <CoachAttributes coach={coach} />
              <CoachCareer teams={coach.teams} />
              <CoachTrophies trophies={coach.trophies} />
            </div>

            {/* About Section - SEO Content with playing career */}
            <CoachAboutSection coach={coach} playerCareer={playerCareer} />
          </div>

          {/* Right Sidebar - Desktop only */}
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
