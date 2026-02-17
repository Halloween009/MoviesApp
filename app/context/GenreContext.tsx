"use client";
import { Genre, GenreContextType } from "@/types";
import { createContext, ReactNode, useEffect, useState } from "react";

const GenreContext = createContext({} as GenreContextType);

export const GenreProvider = ({ children }: { children: ReactNode }) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/genres`)
      .then((res) => res.json())
      .then((data) => setGenres(data.genres || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <GenreContext.Provider value={{ genres, loading }}>
      {children}
    </GenreContext.Provider>
  );
};
export default GenreContext;
