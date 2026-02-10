import { NextResponse } from "next/server";

const apiToken = process.env.TMDB_API_TOKEN;
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "ru-RU";
  const url = `https://api.themoviedb.org/3/search/movie?query=return&language=${lang}&page=1`;
  const moviesRes = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
  });
  const moviesData = await moviesRes.json();
  if (lang !== "en") {
    // Проверяем, есть ли overview
    for (const movie of moviesData.results) {
      if (!movie.overview) {
        // Делаем второй запрос только для этого фильма
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
  }

  const genreRes = await fetch(
    "https://api.themoviedb.org/3/genre/movie/list?language=en",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
    },
  );
  const genreData = await genreRes.json();

  return NextResponse.json({ ...moviesData, genres: genreData.genres });
}
