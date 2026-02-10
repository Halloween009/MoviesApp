import MovieTable from "../../component/MovieTable";

async function MainPage() {
  const res = await fetch("http://localhost:3000/api/movies");
  const data = await res.json();
  return <MovieTable movies={data.results} genres={data.genres} />;
}

export default MainPage;
