import { cookies } from "next/headers";
import { Movie } from "@/types";
const apiToken = process.env.TMDB_API_TOKEN!;
export async function fetchPopularMovies() {
  const res = await fetch(`https://api.themoviedb.org/3/movie/popular`, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return { results: data.results, total_pages: data.total_pages };
}

export async function getPopularMoviesWithRating() {
  await new Promise((r) => setTimeout(r, 3000));
  const guestSessionIdObj = (await cookies()).get("guest_session_id");
  const guestSessionId = guestSessionIdObj?.value;
  const apiKey = process.env.TMDB_API_KEY;
  const data = await fetchPopularMovies();
  const ratedRes = await fetch(
    `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=${apiKey}`,
  );
  const ratedData = await ratedRes.json();
  const ratingsMap = new Map();
  if (ratedData.results) {
    for (const ratedMovie of ratedData.results) {
      ratingsMap.set(ratedMovie.id, ratedMovie.rating);
    }
  }
  data.results = data.results.map((movie: Movie) => ({
    ...movie,
    rating: ratingsMap.get(movie.id) || null,
  }));
  return data;
}
