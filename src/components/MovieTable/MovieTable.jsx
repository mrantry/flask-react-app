import React, { useEffect, useState } from "react";
import {
  Header,
  Table,
  Visibility,
  Button,
  Input,
  Loader,
} from "semantic-ui-react";
import MovieModal from "../MovieModal/MovieModal";

// TODO: Break out parts that aren't actually the table...

export default function MovieTable() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchPage, setSearchPage] = useState();
  const [searchTerm, setSearchTerm] = useState();

  const [newMovie, setNewMovie] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = () => {
    fetch("/movies?page=1")
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.content);
      });
  };

  const handleInfiniteScroll = () => {
    if (!searching) {
      fetch(`/movies?page=${parseInt(page) + 1}`)
        .then((res) => res.json())
        .then((data) => {
          setMovies([...movies, ...data.content]);
          setPage(data.page);
        });
    }
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
    setSelectedMovie(undefined);
    const filtered = movies.filter((m) => m.id !== movie_id);
    setMovies(filtered);
  };

  const handleSearchChange = (e) => {
    setLoading(true);
    setSearchPage(1);
    setSearchTerm(e.target.value);
    if (e.target.value !== "") {
      setSearching(true);
    }
    if (e.target.value === "") {
      fetch("/movies?page=1")
        .then((res) => res.json())
        .then((data) => {
          setMovies(data.content);
          setLoading(false);
        });
    } else {
      fetch(`/search/${e.target.value}?page=1`)
        .then((res) => res.json())
        .then((data) => {
          setMovies(data.content);
          setLoading(false);
        });
    }
  };

  const showMoreSearchResults = () => {
    setSearchPage(searchPage + 1);
    fetch(`/search/${searchTerm}?page=${searchPage + 1}`)
      .then((res) => res.json())
      .then((data) => {
        setMovies([...movies, ...data.content]);
        setLoading(false);
      });
  };

  return (
    <div>
      <MovieModal
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
        movieId={selectedMovie ? selectedMovie.id : undefined}
        newMovie={newMovie}
        handleMovieDelete={handleMovieDelete}
        setNewMovie={setNewMovie}
        fetchMovies={fetchMovies}
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
        <Loader active={loading} inline />
        <Input placeholder="search by title..." onChange={handleSearchChange} />
      </Header>
      <Visibility onBottomVisible={handleInfiniteScroll} once={false}>
        <Table style={{ margin: "0 20px 50px 20px", width: "98.5%" }} celled>
          <Table.Header>
            <Table.HeaderCell>Title</Table.HeaderCell>
            <Table.HeaderCell>Genre</Table.HeaderCell>
            <Table.HeaderCell>Release Year</Table.HeaderCell>
            <Table.HeaderCell>Director</Table.HeaderCell>
            <Table.HeaderCell>Origin</Table.HeaderCell>
          </Table.Header>
          <Table.Body>{movies.map((m, i) => moviecard(m, i))}</Table.Body>
        </Table>
      </Visibility>
      {searching && (
        <Button onClick={showMoreSearchResults}>Show more...</Button>
      )}
    </div>
  );
}
