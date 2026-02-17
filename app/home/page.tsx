import MoviesSearch from "@/component/MoviesSearch";
import { getPopularMoviesWithRating } from "./data";

async function MainPage() {
  const data = await getPopularMoviesWithRating();
  return <MoviesSearch movies={data.results} />;
}

export default MainPage;
