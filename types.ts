export interface Movie {
  id: string;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  genre_ids: number[];
  rating: number;
}

export interface Genre {
  id: number;
  name: string;
}

export type MovieProps = {
  movies: Movie[];
  genres: Genre[];
};
export interface CustomInputProps {
  name: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
}

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export type GenreContextType = {
  genres: Genre[];
  loading: boolean;
};
