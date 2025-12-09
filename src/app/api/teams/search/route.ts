import { NextRequest, NextResponse } from "next/server"
import { searchTeams } from "@/lib/api/football-api"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query || query.length < 2) {
    return NextResponse.json({ teams: [] })
  }

  try {
    const teams = await searchTeams(query)
    return NextResponse.json({ teams })
  } catch (error) {
    console.error("Team search error:", error)
    return NextResponse.json({ teams: [], error: "Search failed" }, { status: 500 })
  }
}
