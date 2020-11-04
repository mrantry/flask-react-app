import React, { useEffect, useState } from "react";
import {
  Header,
  Table,
  Visibility,
  Button,
  Search,
  Card,
} from "semantic-ui-react";
import MovieModal from "../MovieModal/MovieModal";

// TODO: Break out parts that aren't actually the table...

export default function MovieTable() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState();
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);

  const [newMovie, setNewMovie] = useState(false);

  useEffect(() => {
    fetch("/movies?page=1")
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.content);
      });
  }, []);

  const handleInfiniteScroll = () => {
    fetch(`/movies?page=${parseInt(page) + 1}`)
      .then((res) => res.json())
      .then((data) => {
        setMovies([...movies, ...data.content]);
        setPage(data.page);
      });
  };

  const handleMovieSelection = (movie) => {
    setSelectedMovie(movie);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedMovie(undefined);
    setNewMovie(false);
  };

  const moviecard = (movie, index) => {
    return (
      <Table.Row
        key={`movie_${index}`}
        onClick={() => handleMovieSelection(movie)}
      >
        <Table.Cell>{movie.title}</Table.Cell>
        <Table.Cell>{movie.genre}</Table.Cell>
        <Table.Cell>{movie.release_year}</Table.Cell>
        <Table.Cell>{movie.director}</Table.Cell>
        <Table.Cell>{movie.origin}</Table.Cell>
      </Table.Row>
    );
  };

  const handleAddMovie = () => {
    setNewMovie(true);
    setModalOpen(true);
  };

  const handleMovieDelete = (movie_id) => {
    const filtered = movies.filter((m) => m.id !== movie_id);
    setMovies(filtered);
  };

  return (
    <div>
      <MovieModal
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
        movieId={
          selectedMovie
            ? selectedMovie.id
            : "313f4ada-1e23-11eb-936b-3af9d3dd7046"
        }
        newMovie={newMovie}
        handleMovieDelete={handleMovieDelete}
      />
      <h1
        style={{
          display: "flex",
          justifyContent: "flex-start",
          margin: "20px",
        }}
      >
        Movie Database
      </h1>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "20px",
        }}
      >
        <Button onClick={handleAddMovie} positive>
          Add Movie
        </Button>
        <Search placeholder="search by title..." />
      </Header>
      <Visibility onBottomVisible={handleInfiniteScroll} once={false}>
        <Card style={{ margin: "0 20px 100px 20px", width: "99%" }}>
          <Table celled>
            <Table.Header>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Genre</Table.HeaderCell>
              <Table.HeaderCell>Release Year</Table.HeaderCell>
              <Table.HeaderCell>Director</Table.HeaderCell>
              <Table.HeaderCell>Origin</Table.HeaderCell>
            </Table.Header>
            <Table.Body>{movies.map((m, i) => moviecard(m, i))}</Table.Body>
          </Table>
        </Card>
      </Visibility>
    </div>
  );
}
