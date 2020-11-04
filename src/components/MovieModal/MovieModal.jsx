import React, {useState, useEffect} from 'react'
import { Modal } from 'semantic-ui-react'

export default function MovieModal (props) {
    const {movieId} = props
    const [movie, setMovie] = useState()

    useEffect(() => {
        fetch(`/movies/${movieId}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data.content)
                setMovie(data.content[0]);
            });
    }, []);
    
    return (
        <Modal
            open={true}
        >
            <Modal.Header>{movie ? movie.title : "TITLE GOES HERE"}</Modal.Header>
            <Modal.Content>
                <div>
                    <strong>Plot</strong>
                    <p>{movie ? movie.plot : "DATA GOES HERE"}</p>
                    <strong>Director</strong>
                    <p>{movie ? movie.director : "DATA GOES HERE"}</p>
                    <strong>Genre</strong>
                    <p>{movie ? movie.genre : "DATA GOES HERE"}</p>
                    <strong>Cast</strong>
                    <p>{movie ? movie.cast : "DATA GOES HERE"}</p>
                    <strong>Origin</strong>
                    <p>{movie ? movie.origin : "DATA GOES HERE"}</p>
                    <a href={movie ? movie.wiki : "DATA GOES HERE"}>Learn More by visiting the Wikipedia Page</a>

                </div>
            </Modal.Content>
        </Modal>
    )
}