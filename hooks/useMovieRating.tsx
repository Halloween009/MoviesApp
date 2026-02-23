import { useState, useEffect } from "react";
import { Movie } from "@/types";
import { getGuestSessionId } from "@/app/util/getGuessSessionId";

export const useMovieRating = (
  movies: Movie[],
) => {
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertStatus, setAlertStatus] = useState<
    "success" | "error" | undefined
  >(undefined);

  useEffect(() => {
    const tmdbRatings: { [key: string]: number } = {};
    movies.forEach((movie: Movie) => {
      if (typeof movie.rating === "number" && !isNaN(movie.rating)) {
        tmdbRatings[movie.id] = movie.rating;
      }
    });
  }, [movies]);

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
  function getMovieRating(movieId: string | number, fallbackRating?: number) {
    if (ratings[movieId] !== undefined) {
      return ratings[movieId];
    }
    if (typeof window !== "undefined") {
      const guestSessionId = getGuestSessionId();
      const local = localStorage.getItem(`rating_${guestSessionId}_${movieId}`);
      if (local !== null) {
        return Number(local);
      }
    }
    if (typeof fallbackRating === "number") {
      return fallbackRating;
    }
    return undefined;
  }
  return {
    ratings,
    setMovieRating,
    getMovieRating,
    alertMessage,
    alertStatus,
    setAlertMessage,
  };
};
