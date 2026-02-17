"use client";
import { SearchInput } from "./SearchInput";
import { useState, useMemo, useEffect, useContext } from "react";
import { Movie } from "@/types";
import debounce from "lodash/debounce";
import MovieTable from "./MovieTable";
import { Alert, Pagination, Spin } from "antd";
import GenreContext from "@/app/context/GenreContext";

const MoviesSearch = ({ movies: popularMovies }: { movies: Movie[] }) => {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState<Movie[]>(popularMovies);
  const { genres } = useContext(GenreContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"search" | "rated">("search");
  const pageSize = 20;

  // переходы, реакции на действия useEffect
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
  }, [page, query, activeTab]);

  useEffect(() => {
    const debounced = debounce((val: string) => setSearch(val), 1000);
    debounced(query);
    return () => debounced.cancel();
  }, [query]);

  // Основа фетчи и поиски
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
  function getCookie(name: string) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)"),
    );
    return match ? match[2] : null;
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

  return (
    <Spin spinning={loading}>
      {error && <Alert type="error" title={error} />}
      <div className="flex justify-center  mt-10">
        <button onClick={() => setActiveTab("search")}>
          <span
            className={
              activeTab === "search"
                ? "text-blue-400 border-b-2 border-blue-400 font-bold pb-2 pl-2"
                : " text-gray-400 border-b-2 border-gray-400 pb-2 pl-2"
            }
          >
            Search
          </span>
        </button>
        <button onClick={() => setActiveTab("rated")}>
          <span
            className={
              activeTab === "rated"
                ? "text-blue-400 border-b-2 border-blue-400 p-2 w-16"
                : " text-gray-400 border-b-2 border-gray-400 p-2 w-16"
            }
          >
            Rated
          </span>
        </button>
      </div>
      <div className="flex flex-col p-4 gap-4 mx-[10%]">
        {activeTab === "search" && (
          <SearchInput value={query} onChange={handleInputChange} />
        )}
        {activeTab === "rated" && !loading && movies.length === 0 ? (
          <div className="text-center text-gray-400 text-lg py-10">Нет фильмов</div>
        ) : (
          <MovieTable movies={movies} genres={genres} activeTab={activeTab} />
        )}
      </div>
      <div className=" flex justify-center pb-5">
        <Pagination
          current={page}
          total={totalCount}
          pageSize={pageSize}
          onChange={setPage}
          showSizeChanger={false}
        />
      </div>
    </Spin>
  );
};

export default MoviesSearch;
