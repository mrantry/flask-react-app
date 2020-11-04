import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "semantic-ui-react";

export default function MovieModal(props) {
  const {
    movieId,
    modalOpen,
    handleModalClose,
    newMovie,
    handleMovieDelete,
    setNewMovie,
  } = props;

  const [editing, setEditing] = useState(false);

  const [plot, setPlot] = useState("");
  const [director, setDirector] = useState("");
  const [genre, setGenre] = useState("");
  const [cast, setCast] = useState("");
  const [origin, setOrigin] = useState("");
  const [wikiUrl, setWikiUrl] = useState("");
  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState("");

  useEffect(() => {
    if (!newMovie && movieId) {
      fetch(`/movies/${movieId}`)
        .then((res) => res.json())
        .then((data) => {
          const movie_data = data.content[0];
          setTitle(movie_data.title);
          setPlot(movie_data.plot);
          setDirector(movie_data.director);
          setGenre(movie_data.genre);
          setCast(movie_data.cast);
          setOrigin(movie_data.origin);
          setReleaseYear(movie_data.release_year);
          setWikiUrl(movie_data.wiki);
        });
    } else {
      setTitle("");
      setReleaseYear("");
      setPlot("");
      setDirector("");
      setGenre("");
      setCast("");
      setOrigin("");
      setWikiUrl("");
      setEditing(true);
    }

    return () => {
      setEditing(false);
    };
  }, [newMovie, movieId, modalOpen]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const handlePlotChange = (e) => {
    setPlot(e.target.value);
  };
  const handleDirectorChange = (e) => {
    setDirector(e.target.value);
  };
  const handleGenreChange = (e) => {
    setGenre(e.target.value);
  };
  const handleCastChange = (e) => {
    setCast(e.target.value);
  };
  const handleOriginChange = (e) => {
    setOrigin(e.target.value);
  };
  const handleReleaseYearChange = (e) => {
    setReleaseYear(e.target.value);
  };
  const handleWikiUrlChange = (e) => {
    setWikiUrl(e.target.value);
  };

  const handleSave = () => {
    const movieDataToBeSent = {
      title,
      plot,
      genre,
      director,
      origin,
      cast,
      wiki: wikiUrl,
      releaseYear,
    };
    if (newMovie) {
      fetch(`/movies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movieDataToBeSent),
      })
        .then((res) => res.json())
        .then((data) => {
          const movie_data = data.content[0];
          setTitle(movie_data.title);
          setPlot(movie_data.plot);
          setDirector(movie_data.director);
          setGenre(movie_data.genre);
          setCast(movie_data.cast);
          setOrigin(movie_data.origin);
          setWikiUrl(movie_data.wiki);
          setNewMovie(false);
        });
    } else {
      fetch(`/movies/${movieId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movieDataToBeSent),
      })
        .then((res) => res.json())
        .then((data) => {
          const movie_data = data.content[0];
          setTitle(movie_data.title);
          setPlot(movie_data.plot);
          setDirector(movie_data.director);
          setGenre(movie_data.genre);
          setCast(movie_data.cast);
          setOrigin(movie_data.origin);
          setWikiUrl(movie_data.wiki);
          setReleaseYear(movie_data.release_year);
        });
    }
    setEditing(false);
    // send service call here
  };

  const handleCancel = () => {
    if (newMovie) {
      handleModalClose();
    } else {
      setEditing(false);
    }
  };

  const handleDelete = () => {
    fetch(`/movies/${movieId}`, { method: "DELETE" }).then((data) => {
      setTitle("");
      setPlot("");
      setDirector("");
      setGenre("");
      setCast("");
      setOrigin("");
      setWikiUrl("");
      setReleaseYear("");
      handleMovieDelete(movieId);
      handleModalClose();
    });
  };

  const display = () => {
    return (
      <div>
        <strong>Release Year</strong>
        <p>{releaseYear ? releaseYear : "NO DATA"}</p>
        <strong>Plot</strong>
        <p>{plot ? plot : "NO DATA"}</p>
        <strong>Director</strong>
        <p>{director ? director : "NO DATA"}</p>
        <strong>Genre</strong>
        <p>{genre ? genre : "NO DATA"}</p>
        <strong>Cast</strong>
        <p>{cast ? cast : "NO DATA"}</p>
        <strong>Origin</strong>
        <p>{origin ? origin : "NO DATA"}</p>
        <a href={wikiUrl ? wikiUrl : "NO DATA"}>
          Learn More by visiting the Wikipedia Page
        </a>
      </div>
    );
  };

  const edit = () => {
    return (
      <div>
        <Form>
          <Form.Input
            value={title}
            onChange={handleTitleChange}
            label="Title"
          />
          <Form.Input
            value={releaseYear}
            onChange={handleReleaseYearChange}
            label="Release Year"
          />
          <Form.TextArea
            value={plot}
            onChange={handlePlotChange}
            label="Plot"
          />
          <Form.Input
            value={director}
            onChange={handleDirectorChange}
            label="Director"
          />
          <Form.Input
            value={genre}
            onChange={handleGenreChange}
            label="Genre"
          />
          <Form.Input value={cast} onChange={handleCastChange} label="Cast" />
          <Form.Input
            value={origin}
            onChange={handleOriginChange}
            label="Origin"
          />
          <Form.Input
            value={wikiUrl}
            onChange={handleWikiUrlChange}
            label="Wiki URL"
          />
        </Form>
        {!newMovie && (
          <Button
            onClick={handleDelete}
            color="red"
            style={{ marginTop: "24px" }}
          >
            Delete Entry
          </Button>
        )}
      </div>
    );
  };

  const getModalTitle = () => {
    if (editing) {
      return "Add/Edit Movie Entry";
    } else if (title) {
      return title;
    } else {
      return "Modal Title";
    }
  };

  return (
    <Modal open={modalOpen} onClose={handleModalClose}>
      <Modal.Header>{getModalTitle()}</Modal.Header>
      <Modal.Content>{!editing ? display() : edit()}</Modal.Content>
      <Modal.Actions>
        {!editing ? (
          <div>
            <Button onClick={() => setEditing(true)}>Edit</Button>
            <Button primary onClick={() => handleModalClose()}>
              Done
            </Button>
          </div>
        ) : (
          <div>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button positive onClick={handleSave}>
              Save
            </Button>
          </div>
        )}
      </Modal.Actions>
    </Modal>
  );
}
