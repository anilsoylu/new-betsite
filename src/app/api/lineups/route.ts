import { type NextRequest, NextResponse } from "next/server";
import { saveLineup } from "@/lib/lineup-db/queries";
import type { BuildXILineup } from "@/types/build-xi";

/**
 * POST /api/lineups
 * Save a lineup and return the short ID
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const lineup = body.lineup as BuildXILineup;

    // Validate required fields
    if (!lineup?.formationId || !lineup?.players) {
      return NextResponse.json(
        { error: "Invalid lineup data" },
        { status: 400 }
      );
    }

    // Save to database
    const id = saveLineup(lineup);

    // Build the share URL
    const shareUrl = `/build-xi?s=${id}`;

    return NextResponse.json({
      id,
      url: shareUrl,
    });
  } catch (error) {
    console.error("Failed to save lineup:", error);
    return NextResponse.json(
      { error: "Failed to save lineup" },
      { status: 500 }
    );
  }
}
