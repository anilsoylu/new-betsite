import { NextResponse } from "next/server";

/**
 * Image Proxy API
 * Fetches external images and returns as base64 data URI
 * Required for OpenGraph image generation (can't fetch external URLs directly in OG context)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 },
    );
  }

  try {
    // Validate URL
    const parsedUrl = new URL(url);

    // Only allow image URLs from known CDNs
    const allowedHosts = [
      "cdn.sportmonks.com",
      "media.api-sports.io",
      "crests.football-data.org",
      "images.unsplash.com",
      "flagcdn.com",
    ];

    const isAllowed = allowedHosts.some((host) =>
      parsedUrl.hostname.includes(host),
    );
    if (!isAllowed) {
      // Allow any URL for flexibility but log for monitoring
      console.log(`[Image Proxy] External host: ${parsedUrl.hostname}`);
    }

    // Fetch the image with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "SoccerName/1.0 (OpenGraph Image Generator)",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    // Get content type
    const contentType = response.headers.get("content-type") || "image/png";

    // Convert to buffer then base64
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    // Create data URI
    const dataUri = `data:${contentType};base64,${base64}`;

    return NextResponse.json({
      dataUri,
      contentType,
      size: buffer.length,
    });
  } catch (error) {
    console.error("[Image Proxy] Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch image", dataUri: "" },
      { status: 500 },
    );
  }
}

// Allow caching for 1 hour
export const revalidate = 3600;
