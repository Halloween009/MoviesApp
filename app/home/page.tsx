import MovieTable from "../../component/MovieTable";

async function MainPage() {
  const apiToken = process.env.TMDB_API_TOKEN;
  const lang: string = "ru-RU";
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=return&language=ru-RU&page=1`,
    {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    },
  );
  const data = await res.json();
  if (lang !== "en") {
    for (const movie of data.results) {
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
  }
  return (
    <MovieTable movies={data?.results || []} genres={data?.genres || []} />
  );
}

export default MainPage;
