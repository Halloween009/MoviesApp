export interface Movie {
  id: string;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  genre_ids: number[];
}

export interface Genre {
  id: number;
  name: string;
}

export type MovieTableProps = {
  movies: Movie[];
  genres: Genre[];
};
