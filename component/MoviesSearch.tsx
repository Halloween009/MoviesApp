"use client";
import { SearchInput } from "./SearchInput";
import { useContext } from "react";
import { Movie } from "@/types";
import MovieTable from "./MovieTable";
import { Alert, Pagination, Spin } from "antd";
import GenreContext from "@/app/context/GenreContext";
import { useMoviesApi } from "@/hooks/useMoviesApi";

const MoviesSearch = ({ movies: popularMovies }: { movies: Movie[] }) => {
  const { genres } = useContext(GenreContext);
  const {
    movies,
    loading,
    error,
    totalCount,
    setActiveTab,
    activeTab,
    page,
    query,
    handleInputChange,
    setPage,
  } = useMoviesApi(popularMovies);
  const pageSize = 20;

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
      <div className="flex flex-col p-4 gap-4 max-w-[1200px] mx-auto ">
        {activeTab === "search" && (
          <SearchInput value={query} onChange={handleInputChange} />
        )}
        {activeTab === "rated" && !loading && movies.length === 0 ? (
          <div className="text-center text-gray-400 text-lg py-10">
            Нет фильмов
          </div>
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
