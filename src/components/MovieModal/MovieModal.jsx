import React, {useState, useEffect} from 'react'
import { Modal } from 'semantic-ui-react'

export default function MovieModal (props) {
    const {movieId} = props
    const [movie, setMovie] = useState()

    useEffect(() => {
        fetch(`/movies/${movieId}`)
            .then((res) => res.json())
            .then((data) => {
                setMovie(data.content[0]);
            });
    }, [movieId]);
    
    return (
        <Modal
            open={true}
        >
            <Modal.Header>{movie ? movie.title : "LOADING"}</Modal.Header>
            <Modal.Content>
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
                    <a href={movie ? movie.wiki : "LOADING"}>Learn More by visiting the Wikipedia Page</a>

                </div>
            </Modal.Content>
        </Modal>
    )
}