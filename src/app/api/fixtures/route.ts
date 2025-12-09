import { NextRequest, NextResponse } from "next/server"
import { getFixturesByDate } from "@/lib/api/football-api"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const date = searchParams.get("date")

  if (!date) {
    return NextResponse.json(
      { error: "Date parameter is required" },
      { status: 400 }
    )
  }

  // Validate date format (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "Invalid date format. Use YYYY-MM-DD" },
      { status: 400 }
    )
  }

  try {
    const fixtures = await getFixturesByDate(date)
    return NextResponse.json({ fixtures })
  } catch (error) {
    console.error("Error fetching fixtures:", error)
    return NextResponse.json(
      { error: "Failed to fetch fixtures" },
      { status: 500 }
    )
  }
}
