import { NextResponse } from "next/server";

const apiToken = process.env.TMDB_API_TOKEN;
export async function GET() {
  const res = await fetch("https://api.themoviedb.org/3/genre/movie/list", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
  });
  const data = await res.json();

  return NextResponse.json({ success: true, genres: data.genres });
}
