"use client";
import { Genre, Movie, MovieProps } from "@/types";
import Image from "next/image";
import { Card, Row, Col, Tag, Rate, Alert } from "antd";
import { format } from "date-fns";
import { truncate } from "../app/util/Truncate";
import { ru } from "date-fns/locale";
import { useEffect, useState } from "react";

type MovieTablePropsWithTab = MovieProps & { activeTab?: "search" | "rated" };
export default function MovieTable({
  movies,
  genres,
  activeTab,
}: MovieTablePropsWithTab) {
  const genreMap = Object.fromEntries(genres.map((g: Genre) => [g.id, g.name]));
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertStatus, setAlertStatus] = useState<
    "success" | "error" | undefined
  >(undefined);
  function getGuestSessionId() {
    if (typeof document === "undefined") return "";
    const match = document.cookie.match(/(?:^|; )guest_session_id=([^;]*)/);
    return match ? match[1] : "";
  }

  // useEffect
  useEffect(() => {
    const tmdbRatings: { [key: string]: number } = {};
    movies.forEach((movie: Movie) => {
      if (typeof movie.rating === "number" && !isNaN(movie.rating)) {
        tmdbRatings[movie.id] = movie.rating;
      }
    });
  }, [movies]);

  // Основа
  async function setMovieRating(movieId: string | number, rating: number) {
    const guestSessionId = getGuestSessionId();
    const res = await fetch("/api/movie-rating/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        movieId,
        rating,
      }),
      credentials: "include",
    });
    if (res.ok) {
      setAlertMessage("Success rating");
      setAlertStatus("success");
      setRatings((prev) => ({ ...prev, [movieId]: rating }));
      if (typeof window !== "undefined") {
        localStorage.setItem(
          `rating_${guestSessionId}_${movieId}`,
          String(rating),
        );
      }
    } else {
      setAlertMessage("Error rating");
      setAlertStatus("error");
    }
  }
  function getMovieRating(movie: Movie) {
    if (activeTab === "rated") {
      if (typeof movie.rating === "number") {
        return movie.rating;
      }
      return undefined;
    }
    if (ratings[movie.id] !== undefined) {
      return ratings[movie.id];
    }
    if (typeof window !== "undefined") {
      const guestSessionId = getGuestSessionId();
      const local = localStorage.getItem(
        `rating_${guestSessionId}_${movie.id}`,
      );
      if (local !== null) {
        return Number(local);
      }
    }
    if (typeof movie.rating === "number") {
      return movie.rating;
    }
    return undefined;
  }
  function getRatingColor(rating: number | undefined) {
    if (typeof rating !== "number" || isNaN(rating)) return;
    if (rating <= 3) return "#E90000";
    if (rating > 3 && rating <= 5) return "#E97E00";
    if (rating > 5 && rating <= 7) return "#E9D100";
    if (rating > 7) return "#66E900";
  }

  return (
    <div className="bg-gray-50 flex flex-col">
      {alertMessage && (
        <Alert
          message={alertMessage}
          type={alertStatus}
          showIcon
          closable
          onClose={() => setAlertMessage(null)}
        />
      )}
      <div className="flex">
        <Row gutter={{ xs: 24, sm: 12 }} justify="center">
          {movies.map((movie: Movie) => (
            <Col
              xs={24}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              xxl={12}
              style={{ minWidth: 500, minHeight: 310 }}
              key={movie.id}
            >
              <div className="flex min-w-[500px] min mx-10%">
                <Card hoverable styles={{ body: { padding: 0 } }}>
                  <div className="flex flex-row relative h-[281px]">
                    {movie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                        alt={movie.title}
                        width={183}
                        height={281}
                      />
                    ) : (
                      <div className="w-[183] h-[281] shrink-0 flex items-center justify-center bg-gray-200 text-gray-500">
                        No Image
                      </div>
                    )}
                    <div className="p-5 min-h-[281px] min-w-[400px]">
                      <h2>{movie.title}</h2>
                      <p>
                        {movie.release_date
                          ? format(
                              new Date(movie.release_date),
                              "d MMMM, yyyy",
                              {
                                locale: ru,
                              },
                            )
                          : null}
                      </p>
                      <div className="flex gap-2 pb-1.5 flex-wrap">
                        {movie.genre_ids.map((id) =>
                          genreMap[id] ? (
                            <Tag key={id} className="gap-4">
                              {genreMap[id]}
                            </Tag>
                          ) : null,
                        )}
                      </div>
                      {movie.overview ? (
                        <p>{truncate(movie.overview, 150)}</p>
                      ) : (
                        <p className=" flex grow min-w-[200px]">
                          No description
                        </p>
                      )}
                      <div>
                        <Rate
                          count={10}
                          allowHalf
                          value={getMovieRating(movie) ?? undefined}
                          onChange={(value) => setMovieRating(movie.id, value)}
                          style={{
                            color: getRatingColor(getMovieRating(movie)),
                          }}
                        />
                      </div>
                    </div>

                    {getMovieRating(movie)! > 0 && (
                      <div
                        className="absolute top-2 right-2 px-5 rounded-2xl z-10"
                        style={{
                          backgroundColor: getRatingColor(
                            getMovieRating(movie),
                          ),
                        }}
                      >
                        {getMovieRating(movie)}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
