"use client";
import { Genre, Movie, MovieProps } from "@/types";
import Image from "next/image";
import { Card, Row, Col, Tag, Rate, Alert } from "antd";
import { format } from "date-fns";
import { truncate } from "../app/util/truncate";
import { getRatingColor } from "@/app/util/getRatingColor";
import { useMovieRating } from "@/hooks/useMovieRating";

type MovieTablePropsWithTab = MovieProps & { activeTab?: "search" | "rated" };
export default function MovieTable({
  movies,
  genres,
  activeTab,
}: MovieTablePropsWithTab) {
  const genreMap = Object.fromEntries(genres.map((g: Genre) => [g.id, g.name]));
  const {
    ratings,
    setMovieRating,
    getMovieRating,
    alertMessage,
    alertStatus,
    setAlertMessage,
  } = useMovieRating(movies);

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
              <div className="flex max-w-full mx-10%">
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
                    <div className="p-5 min-h-[281px] w-full">
                      <h2>{movie.title}</h2>
                      <p>
                        {movie.release_date
                          ? format(new Date(movie.release_date), "d MMMM, yyyy")
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
                          value={
                            getMovieRating(movie.id, movie.rating) ?? undefined
                          }
                          onChange={(value) => setMovieRating(movie.id, value)}
                          style={{
                            color: getRatingColor(
                              getMovieRating(movie.id, movie.rating),
                            ),
                          }}
                        />
                      </div>
                    </div>

                    {getMovieRating(movie.id, movie.rating)! > 0 && (
                      <div
                        className="absolute top-2 right-2 px-5 rounded-2xl z-10"
                        style={{
                          backgroundColor: getRatingColor(
                            getMovieRating(movie.id, movie.rating),
                          ),
                        }}
                      >
                        {getMovieRating(movie.id, movie.rating)}
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
