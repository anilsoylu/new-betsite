import { NextResponse } from "next/server"
import { searchPlayers } from "@/lib/api/football-api"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query || query.length < 2) {
    return NextResponse.json({ players: [] })
  }

  try {
    const players = await searchPlayers(query)
    return NextResponse.json({ players })
  } catch (error) {
    console.error("Player search error:", error)
    return NextResponse.json({ players: [], error: "Search failed" }, { status: 500 })
  }
}
