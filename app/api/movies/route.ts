import { NextResponse } from "next/server";

const apiToken = process.env.TMDB_API_TOKEN;
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const popular = searchParams.get("popular");
  const page = searchParams.get("page") || "1";
  let url = "";
  if (popular === "true") {
    url = `https://api.themoviedb.org/3/movie/popular?page=${page}`;
  } else if (query) {
    url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&page=${page}`;
  } else {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 },
    );
  }

  const moviesRes = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
  });
  const moviesData = await moviesRes.json();
  for (const movie of moviesData.results) {
    if (!movie.overview) {
      const enRes = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}?language=en`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiToken}`,
          },
        },
      );
      const enData = await enRes.json();
      movie.overview = enData.overview || "";
    }
  }
  return NextResponse.json({ ...moviesData });
}
