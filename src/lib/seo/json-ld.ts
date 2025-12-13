import { format } from "date-fns";
import { SITE } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import type {
  FixtureDetail,
  TeamDetail,
  PlayerDetail,
  CoachDetail,
  League,
  Standing,
  MatchOdds,
} from "@/types/football";

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
export function generateSportsEventSchema(fixture: FixtureDetail, slug: string) {
  const eventStatus = getEventStatus(fixture.status);

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "@id": `${SITE.url}/matches/${slug}#event`, // ID for referencing from other schemas
    name: `${fixture.homeTeam.name} vs ${fixture.awayTeam.name}`,
    startDate: fixture.startTime,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    sport: "Football",
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
    // Competitor array for better Google compatibility
    competitor: [
      {
        "@type": "SportsTeam",
        name: fixture.homeTeam.name,
        image: fixture.homeTeam.logo,
      },
      {
        "@type": "SportsTeam",
        name: fixture.awayTeam.name,
        image: fixture.awayTeam.logo,
      },
    ],
  };

  // Only set eventStatus if defined (not for live/finished)
  if (eventStatus) {
    schema.eventStatus = eventStatus;
  }

  // Add endDate for finished matches (startTime + ~2 hours)
  if (fixture.status === "finished") {
    const endDate = new Date(fixture.startTime);
    endDate.setHours(endDate.getHours() + 2);
    schema.endDate = endDate.toISOString();
  }

  // Add image from league or home team logo
  schema.image = fixture.league?.logo || fixture.homeTeam.logo;

  // Location is required - use venue if available, otherwise use league country or generic
  if (fixture.venue) {
    const locationSchema: Record<string, unknown> = {
      "@type": "StadiumOrArena",
      name: fixture.venue.name,
    };

    // Rich address data
    if (fixture.venue.city || fixture.venue.address) {
      locationSchema.address = {
        "@type": "PostalAddress",
        streetAddress: fixture.venue.address || undefined,
        addressLocality: fixture.venue.city || undefined,
      };
    }

    // GeoCoordinates for maps
    if (fixture.venue.latitude && fixture.venue.longitude) {
      locationSchema.geo = {
        "@type": "GeoCoordinates",
        latitude: fixture.venue.latitude,
        longitude: fixture.venue.longitude,
      };
    }

    // Stadium capacity
    if (fixture.venue.capacity) {
      locationSchema.maximumAttendeeCapacity = fixture.venue.capacity;
    }

    schema.location = locationSchema;
  } else {
    // Fallback location when venue is not available
    schema.location = {
      "@type": "Place",
      name: fixture.league?.country?.name || "TBD",
    };
  }

  if (fixture.league) {
    // Only use organizer - superEvent requires Event type, not Organization
    // SportsOrganization is valid for organizer but NOT for superEvent
    schema.organizer = {
      "@type": "SportsOrganization",
      name: fixture.league.name,
      url: `${SITE.url}/leagues/${slugify(fixture.league.name)}-${fixture.league.id}`,
    };
  }

  // Add description for better SEO
  schema.description = `${fixture.homeTeam.name} vs ${fixture.awayTeam.name}${fixture.league ? ` - ${fixture.league.name}` : ""} football match.`;

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

// Article schema for match preview content
export function generateMatchArticleSchema(
  fixture: FixtureDetail,
  slug: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${fixture.homeTeam.name} vs ${fixture.awayTeam.name} - Match Preview`,
    description: `Complete match preview for ${fixture.homeTeam.name} vs ${fixture.awayTeam.name}. Form analysis, head-to-head record, league standings, and match prediction.`,
    image: fixture.league?.logo || fixture.homeTeam.logo,
    datePublished: fixture.startTime,
    dateModified: fixture.startTime,
    url: `${SITE.url}/matches/${slug}`,
    author: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE.url}/matches/${slug}`,
    },
    about: {
      "@type": "SportsEvent",
      "@id": `${SITE.url}/matches/${slug}#event`, // Reference to main SportsEvent schema
    },
  };
}

// FAQPage schema for match detail pages
export function generateMatchFAQSchema(fixture: FixtureDetail) {
  const faqItems: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: { "@type": "Answer"; text: string };
  }> = [];

  // Question 1: When is the match?
  faqItems.push({
    "@type": "Question",
    name: `When does ${fixture.homeTeam.name} vs ${fixture.awayTeam.name} kick off?`,
    acceptedAnswer: {
      "@type": "Answer",
      text: `The match kicks off on ${format(new Date(fixture.startTime), "EEEE, MMMM d, yyyy")} at ${format(new Date(fixture.startTime), "HH:mm")} UTC.`,
    },
  });

  // Question 2: Where is the match?
  if (fixture.venue) {
    faqItems.push({
      "@type": "Question",
      name: `Where is ${fixture.homeTeam.name} vs ${fixture.awayTeam.name} being played?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `The match is being played at ${fixture.venue.name}${fixture.venue.city ? ` in ${fixture.venue.city}` : ""}.`,
      },
    });
  }

  // Question 3: What competition?
  if (fixture.league) {
    faqItems.push({
      "@type": "Question",
      name: `What competition is ${fixture.homeTeam.name} vs ${fixture.awayTeam.name}?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `This is a ${fixture.league.name} fixture.`,
      },
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems,
  };
}

// AggregateOffer schema for betting odds
export function generateOddsSchema(odds: MatchOdds, fixture: FixtureDetail) {
  const offers: Array<{
    "@type": "Offer";
    name: string;
    price: number;
    priceCurrency: string;
    availability: string;
  }> = [];

  if (odds.home) {
    offers.push({
      "@type": "Offer",
      name: `${fixture.homeTeam.name} Win`,
      price: odds.home.value,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    });
  }

  if (odds.draw) {
    offers.push({
      "@type": "Offer",
      name: "Draw",
      price: odds.draw.value,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    });
  }

  if (odds.away) {
    offers.push({
      "@type": "Offer",
      name: `${fixture.awayTeam.name} Win`,
      price: odds.away.value,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    });
  }

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "AggregateOffer",
    priceCurrency: "EUR",
    offerCount: offers.length,
    offers: offers,
  };

  if (odds.bookmaker) {
    schema.seller = {
      "@type": "Organization",
      name: odds.bookmaker,
    };
  }

  return schema;
}

// Helper to get event status - returns undefined for live/finished (use endDate instead)
function getEventStatus(status: string): string | undefined {
  switch (status) {
    case "scheduled":
    case "not_started":
      return "https://schema.org/EventScheduled";
    case "cancelled":
      return "https://schema.org/EventCancelled";
    case "postponed":
      return "https://schema.org/EventPostponed";
    // Live and finished matches don't have a specific status - use endDate instead
    default:
      return undefined;
  }
}
