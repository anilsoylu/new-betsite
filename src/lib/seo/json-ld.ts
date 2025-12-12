import { SITE } from "@/lib/constants";
import type {
  FixtureDetail,
  TeamDetail,
  PlayerDetail,
  CoachDetail,
  League,
  Standing,
} from "@/types/football";

// Helper to create URL-friendly slug
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// WebSite + SearchAction schema for home page
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/teams?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// BreadcrumbList schema
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// SportsEvent schema for matches
export function generateSportsEventSchema(fixture: FixtureDetail) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${fixture.homeTeam.name} vs ${fixture.awayTeam.name}`,
    startDate: fixture.startTime,
    eventStatus: getEventStatus(fixture.status),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    homeTeam: {
      "@type": "SportsTeam",
      name: fixture.homeTeam.name,
      logo: fixture.homeTeam.logo,
      url: `${SITE.url}/teams/${slugify(fixture.homeTeam.name)}-${fixture.homeTeam.id}`,
    },
    awayTeam: {
      "@type": "SportsTeam",
      name: fixture.awayTeam.name,
      logo: fixture.awayTeam.logo,
      url: `${SITE.url}/teams/${slugify(fixture.awayTeam.name)}-${fixture.awayTeam.id}`,
    },
  };

  if (fixture.venue) {
    schema.location = {
      "@type": "StadiumOrArena",
      name: fixture.venue.name,
      address: fixture.venue.city || "",
    };
  }

  if (fixture.league) {
    schema.superEvent = {
      "@type": "SportsEvent",
      name: fixture.league.name,
    };
  }

  return schema;
}

// SportsTeam schema
export function generateSportsTeamSchema(team: TeamDetail) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: team.name,
    logo: team.logo,
    url: `${SITE.url}/teams/${slugify(team.name)}-${team.id}`,
  };

  if (team.country?.name) {
    schema.location = {
      "@type": "Place",
      name: team.country.name,
    };
  }

  if (team.venue) {
    schema.homeLocation = {
      "@type": "StadiumOrArena",
      name: team.venue.name,
      address: team.venue.city || "",
    };
  }

  if (team.founded) {
    schema.foundingDate = team.founded.toString();
  }

  if (team.coach) {
    schema.coach = {
      "@type": "Person",
      name: team.coach.displayName,
    };
  }

  return schema;
}

// Person schema for players
export function generatePersonSchema(player: PlayerDetail) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: player.displayName,
    givenName: player.firstName,
    familyName: player.lastName,
    image: player.image,
    url: `${SITE.url}/players/${slugify(player.displayName)}-${player.id}`,
    jobTitle: player.position || "Football Player",
  };

  if (player.dateOfBirth) {
    schema.birthDate = player.dateOfBirth;
  }

  if (player.nationality?.name) {
    schema.nationality = {
      "@type": "Country",
      name: player.nationality.name,
    };
  }

  if (player.height) {
    schema.height = {
      "@type": "QuantitativeValue",
      value: player.height,
      unitCode: "CMT",
    };
  }

  if (player.weight) {
    schema.weight = {
      "@type": "QuantitativeValue",
      value: player.weight,
      unitCode: "KGM",
    };
  }

  if (player.currentTeam) {
    schema.affiliation = {
      "@type": "SportsTeam",
      name: player.currentTeam.teamName,
    };
  }

  return schema;
}

// Person schema for coaches
export function generateCoachSchema(coach: CoachDetail) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: coach.displayName,
    givenName: coach.firstName,
    familyName: coach.lastName,
    image: coach.image,
    url: `${SITE.url}/coaches/${slugify(coach.displayName)}-${coach.id}`,
    jobTitle: "Football Manager",
  };

  if (coach.dateOfBirth) {
    schema.birthDate = coach.dateOfBirth;
  }

  if (coach.nationality?.name) {
    schema.nationality = {
      "@type": "Country",
      name: coach.nationality.name,
    };
  }

  if (coach.height) {
    schema.height = {
      "@type": "QuantitativeValue",
      value: coach.height,
      unitCode: "CMT",
    };
  }

  if (coach.weight) {
    schema.weight = {
      "@type": "QuantitativeValue",
      value: coach.weight,
      unitCode: "KGM",
    };
  }

  if (coach.currentTeam) {
    schema.worksFor = {
      "@type": "SportsTeam",
      name: coach.currentTeam.teamName,
      url: `${SITE.url}/teams/${slugify(coach.currentTeam.teamName)}-${coach.currentTeam.teamId}`,
    };
  }

  // Add career highlights
  const titlesWon = coach.trophies.filter((t) => t.position === 1).length;
  if (titlesWon > 0) {
    schema.award = `${titlesWon} titles won as manager`;
  }

  return schema;
}

// FAQPage schema for coach detail pages
export function generateCoachFAQSchema(coach: CoachDetail) {
  const faqItems: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: { "@type": "Answer"; text: string };
  }> = [];

  // Current team question
  faqItems.push({
    "@type": "Question",
    name: `What team does ${coach.displayName} currently manage?`,
    acceptedAnswer: {
      "@type": "Answer",
      text: coach.currentTeam
        ? `${coach.displayName} is currently the ${coach.currentTeam.position || "Head Coach"} of ${coach.currentTeam.teamName}.`
        : `${coach.displayName} is not currently managing any team.`,
    },
  });

  // Titles won question (if applicable)
  const titlesCount = coach.trophies.filter((t) => t.position === 1).length;
  if (titlesCount > 0) {
    faqItems.push({
      "@type": "Question",
      name: `How many titles has ${coach.displayName} won?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${coach.displayName} has won ${titlesCount} ${titlesCount === 1 ? "title" : "titles"} throughout their managerial career.`,
      },
    });
  }

  // Nationality question (if available)
  if (coach.nationality?.name) {
    faqItems.push({
      "@type": "Question",
      name: `What nationality is ${coach.displayName}?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${coach.displayName} is from ${coach.nationality.name}.`,
      },
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems,
  };
}

// SportsOrganization schema for leagues
export function generateSportsLeagueSchema(
  league: League,
  _standings?: Standing[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: league.name,
    logo: league.logo,
    url: `${SITE.url}/leagues/${slugify(league.name)}-${league.id}`,
    sport: "Football",
    memberOf: {
      "@type": "SportsOrganization",
      name: league.country?.name || "International",
    },
  };
}

// Helper to get event status
function getEventStatus(status: string): string {
  switch (status) {
    case "scheduled":
    case "not_started":
      return "https://schema.org/EventScheduled";
    case "live":
    case "halftime":
    case "playing":
      return "https://schema.org/EventScheduled";
    case "finished":
    case "ft":
      return "https://schema.org/EventScheduled";
    case "cancelled":
    case "postponed":
      return "https://schema.org/EventCancelled";
    default:
      return "https://schema.org/EventScheduled";
  }
}
