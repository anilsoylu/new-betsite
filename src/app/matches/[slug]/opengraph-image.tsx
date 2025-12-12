import { ImageResponse } from "next/og";
import { getFixtureById } from "@/lib/api/football-api";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { SITE } from "@/lib/constants";
import { extractFixtureId } from "@/lib/utils";
import type { FixtureDetail } from "@/types/football";

// Revalidate every 60 seconds for live score updates
export const revalidate = 60;

export const alt = "Match Preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Helper to get the base URL for API calls
function getBaseUrl(): string {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  return "http://localhost:3000";
}

// Helper to fetch image as base64
async function getImageAsBase64(url: string): Promise<string> {
  try {
    const baseUrl = getBaseUrl();
    const proxyUrl = `${baseUrl}/api/image-proxy?url=${encodeURIComponent(url)}`;

    const response = await fetch(proxyUrl, {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Proxy failed: ${response.status}`);
    }

    const data = await response.json();
    return data.dataUri || "";
  } catch (error) {
    console.error("[OG Image] Failed to fetch logo:", error);
    return "";
  }
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fixtureId = extractFixtureId(slug);

  if (!fixtureId) {
    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f9fa",
          fontSize: 40,
          color: "#6b7280",
        }}
      >
        Invalid match ID
      </div>,
      { ...size },
    );
  }

  try {
    console.log(`[OG Image] Generating for fixture ${fixtureId}`);

    let fixture: FixtureDetail | null = null;

    // Fetch fixture data from our Sportmonks API
    try {
      fixture = (await Promise.race([
        getFixtureById(fixtureId),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 8000),
        ),
      ])) as FixtureDetail;
    } catch (apiError) {
      console.warn(`[OG Image] API failed:`, apiError);
    }

    if (!fixture) {
      throw new Error("Match not found");
    }

    console.log(
      `[OG Image] Successfully loaded data for ${fixture.homeTeam.name} vs ${fixture.awayTeam.name}`,
    );

    // Get team and league logos as base64
    const [homeLogoBase64, awayLogoBase64, leagueLogoBase64] =
      await Promise.all([
        getImageAsBase64(fixture.homeTeam.logo),
        getImageAsBase64(fixture.awayTeam.logo),
        fixture.league?.logo
          ? getImageAsBase64(fixture.league.logo)
          : Promise.resolve(""),
      ]);

    // Format match date
    const matchDate = new Date(fixture.startTime);
    const formattedDate = format(matchDate, "EEE, d MMM yyyy", {
      locale: enUS,
    });
    const formattedTime = format(matchDate, "HH:mm", { locale: enUS });

    // Check match status for score display
    const isFinished = fixture.status === "finished";
    const isLive = fixture.status === "live" || fixture.status === "halftime";

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Top Left - League Info */}
        <div
          style={{
            position: "absolute",
            top: "30px",
            left: "40px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {leagueLogoBase64 && (
            <img src={leagueLogoBase64} width="32" height="32" alt="" />
          )}
          <span
            style={{
              fontSize: "22px",
              color: "#1f2937",
              fontWeight: 500,
            }}
          >
            {fixture.league?.name || "Football Match"}
          </span>
        </div>

        {/* Top Right - Date */}
        <div
          style={{
            position: "absolute",
            top: "30px",
            right: "40px",
            fontSize: "20px",
            color: "#6b7280",
          }}
        >
          {formattedDate}
        </div>

        {/* Center - Teams + Time/Score */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "80px",
          }}
        >
          {/* Home Team */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {homeLogoBase64 ? (
              <img src={homeLogoBase64} width="140" height="140" alt="" />
            ) : (
              <div
                style={{
                  width: "140px",
                  height: "140px",
                  background: "#e5e7eb",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "48px",
                }}
              >
                {fixture.homeTeam.shortCode?.[0] || "H"}
              </div>
            )}
            <span
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "#111827",
                textAlign: "center",
                maxWidth: "280px",
              }}
            >
              {fixture.homeTeam.name}
            </span>
          </div>

          {/* Time or Score */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {isFinished && fixture.score ? (
              <span
                style={{
                  fontSize: "64px",
                  fontWeight: "800",
                  color: "#111827",
                }}
              >
                {fixture.score.home} - {fixture.score.away}
              </span>
            ) : isLive && fixture.score ? (
              <>
                <span
                  style={{
                    fontSize: "64px",
                    fontWeight: "800",
                    color: "#dc2626",
                  }}
                >
                  {fixture.score.home} - {fixture.score.away}
                </span>
                <span
                  style={{
                    fontSize: "18px",
                    color: "#dc2626",
                    fontWeight: 600,
                    marginTop: "8px",
                  }}
                >
                  LIVE {fixture.minute ? `${fixture.minute}'` : ""}
                </span>
              </>
            ) : (
              <>
                <span
                  style={{
                    fontSize: "64px",
                    fontWeight: "800",
                    color: "#111827",
                  }}
                >
                  {formattedTime}
                </span>
                <span
                  style={{
                    fontSize: "18px",
                    color: "#9ca3af",
                  }}
                >
                  GMT
                </span>
              </>
            )}
          </div>

          {/* Away Team */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {awayLogoBase64 ? (
              <img src={awayLogoBase64} width="140" height="140" alt="" />
            ) : (
              <div
                style={{
                  width: "140px",
                  height: "140px",
                  background: "#e5e7eb",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "48px",
                }}
              >
                {fixture.awayTeam.shortCode?.[0] || "A"}
              </div>
            )}
            <span
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "#111827",
                textAlign: "center",
                maxWidth: "280px",
              }}
            >
              {fixture.awayTeam.name}
            </span>
          </div>
        </div>

        {/* Bottom Left - Branding */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: "40px",
            fontSize: "20px",
            color: "#9ca3af",
            fontWeight: 500,
          }}
        >
          {SITE.name}
        </div>

        {/* Bottom Right - Match Status */}
        {isFinished && (
          <div
            style={{
              position: "absolute",
              bottom: "30px",
              right: "40px",
              fontSize: "16px",
              color: "#6b7280",
              fontWeight: 500,
            }}
          >
            Full Time
          </div>
        )}
      </div>,
      { ...size },
    );
  } catch (error) {
    console.error("[OG Image] Error:", error);

    // Fallback image on error
    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <span style={{ fontSize: "80px" }}>&#9917;</span>
        <h1 style={{ fontSize: "72px", color: "#111827", margin: "24px 0" }}>
          {SITE.name}
        </h1>
        <p style={{ fontSize: "36px", color: "#6b7280" }}>
          Live Football Scores
        </p>
      </div>,
      { ...size },
    );
  }
}
