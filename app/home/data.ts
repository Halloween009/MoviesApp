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
// export async function fetchPopularMoviesPages(page: number) {
//   const res = await fetch(
//     `https://api.themoviedb.org/3/movie/popular?page=${page}`,
//     {
//       headers: {
//         Authorization: `Bearer ${apiToken}`,
//         "Content-Type": "application/json",
//       },
//     },
//   );
//   if (!res.ok) throw new Error("Error fetching popular movies");
//   const data = await res.json();
//   return {
//     results: data.results,
//     total_pages: data.total_pages,
//     total_results: data.total_results,
//   };
// }

async function fetchMovies(apiToken: string, query: string, page: number) {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=ru-RU&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    },
  );
  if (!res.ok) throw new Error("Error fetching movies");
  return res.json();
}

export async function getPopularMoviesWithRating() {
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
