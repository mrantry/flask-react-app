import React, { useState, useEffect } from "react";
import { Button, Form, Label, Modal } from "semantic-ui-react";

export default function MovieModal(props) {
  const { movieId, modalOpen, handleModalClose, newMovie } = props;
  const [movie, setMovie] = useState();

  const [editing, setEditing] = useState(false);

  const [plot, setPlot] = useState("");
  const [director, setDirector] = useState("");
  const [genre, setGenre] = useState("");
  const [cast, setCast] = useState("");
  const [origin, setOrigin] = useState("");
  const [wikiUrl, setWikiUrl] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!newMovie) {
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
          setWikiUrl(movie_data.wiki);
          setMovie(movie_data);
        });
    }
  }, [movieId]);

  const handleTileChange = (e) => {
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
  const handleWikiUrlChange = (e) => {
    setWikiUrl(e.target.value);
  };

  const handleSave = () => {
    setEditing(false);
    // send service call here
  };

  const display = () => {
    return (
      <div>
        <strong>Plot</strong>
        <p>{movie ? movie.plot : "LOADING"}</p>
        <strong>Director</strong>
        <p>{movie ? movie.director : "LOADING"}</p>
        <strong>Genre</strong>
        <p>{movie ? movie.genre : "LOADING"}</p>
        <strong>Cast</strong>
        <p>{movie ? movie.cast : "LOADING"}</p>
        <strong>Origin</strong>
        <p>{movie ? movie.origin : "LOADING"}</p>
        <a href={movie ? movie.wiki : "LOADING"}>
          Learn More by visiting the Wikipedia Page
        </a>
      </div>
    );
  };

  const edit = () => {
    return (
      <div>
        <Form>
          <Form.Input value={title} label="Title" />
          <Form.TextArea value={plot} label="Plot" />
          <Form.Input value={director} label="Director" />
          <Form.Input value={genre} label="Genre" />
          <Form.Input value={cast} label="Cast" />
          <Form.Input value={origin} label="Origin" />
          <Form.Input value={wikiUrl} label="Wiki URL" />
        </Form>
        {/* <p>{movie ? movie.plot : "LOADING"}</p>
        <strong>Director</strong>
        <p>{movie ? movie.director : "LOADING"}</p>
        <strong>Genre</strong>
        <p>{movie ? movie.genre : "LOADING"}</p>
        <strong>Cast</strong>
        <p>{movie ? movie.cast : "LOADING"}</p>
        <strong>Origin</strong>
        <p>{movie ? movie.origin : "LOADING"}</p>
        <a href={movie ? movie.wiki : "LOADING"}>
          Learn More by visiting the Wikipedia Page
        </a> */}
      </div>
    );
  };

  const getModalTitle = () => {
    if (editing && newMovie) {
      return "Create New Movie Entry";
    } else if (editing) {
      return "Editing Movie Details";
    } else if (movie) {
      return movie.title;
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
          </div>
        ) : (
          <div>
            <Button onClick={() => setEditing(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        )}
      </Modal.Actions>
    </Modal>
  );
}
