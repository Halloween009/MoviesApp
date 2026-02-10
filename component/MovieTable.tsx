"use client";
import { Genre, Movie, MovieTableProps } from "@/types";
import Image from "next/image";
import { Card, Row, Col, Tag } from "antd";
import { format } from "date-fns";
import { truncate } from "../app/util/Truncate";

export default function MovieTable({ movies, genres }: MovieTableProps) {
  const genreMap = Object.fromEntries(genres.map((g: Genre) => [g.id, g.name]));

  return (
    <div className="mx-20 bg-gray-50">
      <h1 className="text-5xl mb-8">Popular movies</h1>
      <Row gutter={[24, 24]}>
        {movies.map((movie: Movie) => (
          <Col xs={24} sm={12} key={movie.id}>
            <Card hoverable styles={{ body: { padding: 0 } }}>
              <div className="flex flex-row w-112.85 h-69.75">
                <Image
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  width={183}
                  height={281}
                />
                <div className="p-5">
                  <h2>{movie.title}</h2>
                  <p>
                    {movie.release_date
                      ? format(new Date(movie.release_date), "MMMM d, yyyy")
                      : null}
                  </p>
                  <div>
                    {movie.genre_ids.map((id) =>
                      genreMap[id] ? <Tag key={id}>{genreMap[id]}</Tag> : null,
                    )}
                  </div>
                  <p>{truncate(movie.overview, 200)}</p>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
