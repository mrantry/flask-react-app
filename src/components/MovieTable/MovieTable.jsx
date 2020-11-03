import React, {useEffect, useState} from 'react'
import {Table} from 'semantic-ui-react'

export default function MovieTable () {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
      fetch("/movies")
        .then((res) => res.json())
        .then((data) => {
          setMovies(data.content);
        });
    }, []);

    const moviecard = (movie) => {
        return (
            <Table.Row>
                <Table.Cell>{movie.title}</Table.Cell>
                <Table.Cell>{movie.genre}</Table.Cell>
                <Table.Cell>{movie.release_year}</Table.Cell>
                <Table.Cell>{movie.director}</Table.Cell>
                <Table.Cell>{movie.origin}</Table.Cell>
            </Table.Row>
        )
    }

    return (
        <Table celled>
            <Table.Header>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Genre</Table.HeaderCell>
                <Table.HeaderCell>Release Year</Table.HeaderCell>
                <Table.HeaderCell>Director</Table.HeaderCell>
                <Table.HeaderCell>Origin</Table.HeaderCell>
            </Table.Header>
            <Table.Body>
                {movies.map(m => moviecard(m))}
            </Table.Body>
        </Table>
    )
}