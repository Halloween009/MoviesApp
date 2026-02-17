import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.TMDB_API_KEY;
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const guestSessionId = request.cookies.get("guest_session_id")?.value;
  const page = searchParams.get("page") || "1";
  const res = await fetch(
    `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=${apiKey}&page=${page}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const data = await res.json();

  return NextResponse.json({ success: true, data });
}
