import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.TMDB_API_KEY;
export async function POST(request: NextRequest) {
  const { movieId, rating } = await request.json();
  const guestSessionId = request.cookies.get("guest_session_id")?.value;
  if (!guestSessionId) {
    return NextResponse.json({ error: "No guest session found" });
  }
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${apiKey}&guest_session_id=${guestSessionId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: rating }),
    },
  );
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
