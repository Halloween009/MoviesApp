import { useState, useEffect } from "react";
import { Movie, Genre } from "@/types";
import { useDebounce } from "./useDebounce";
import { getCookie } from "@/app/util/getCookie";

export const useMoviesApi = (popularMovies: Movie[]) => {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState<Movie[]>(popularMovies);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"search" | "rated">("search");
  const debounceQuery = useDebounce(query, 1000);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "search" && search) {
      searchMovies(search, page);
    }
  }, [search, page, activeTab]);
  useEffect(() => {
    setError(null);
    if (activeTab === "search" && !query) {
      fetchPopularMovies(page);
    } else if (activeTab === "rated") {
      fetchRatedMovies(page);
    }
  }, [page, search, activeTab]);

  useEffect(() => {
    setSearch(debounceQuery);
  }, [debounceQuery, setSearch]);

  const handleInputChange = (value: string) => {
    setQuery(value);
  };

  async function searchMovies(query: string, page: number) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/movies?query=${encodeURIComponent(query)}&page=${page}`,
      );
      const data = await res.json();
      setMovies(data.results || []);
      setTotalCount(data.total_results || 0);
    } catch (error) {
      setError("Search error");
    } finally {
      setLoading(false);
    }
  }

  async function fetchPopularMovies(page: number) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/movies/?popular=true&page=${page}`);
      const data = await res.json();
      setMovies(data.results || []);
      setTotalCount(data.total_results || 0);
    } catch (error) {
      setError("Search error");
    } finally {
      setLoading(false);
    }
  }
  const fetchRatedMovies = async (page: number) => {
    setLoading(true);
    setError(null);
    const guestSessionId = getCookie("guest_session_id");
    if (!guestSessionId) {
      setError("Guest session not found. Please reload the page.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/rated-movies?page=${page}`, {
        credentials: "include",
      });
      const data = await res.json();
      console.log("Rated movies response:", data);
      setMovies(data.data.results || []);
      setTotalCount(data.data.total_results || 0);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };
  return {
    movies,
    loading,
    error,
    totalCount,
    setActiveTab,
    setPage,
    activeTab,
    page,
    query,
    handleInputChange,
  };
};
