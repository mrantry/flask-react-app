from flask import Flask, request
import sqlite3
import uuid
from werkzeug.exceptions import HTTPException
import json
import csv

app = Flask(__name__)

@app.route('/initdb')
def init_db():
    conn = sqlite3.connect('movies.db')
    print("Opened database successfully");

    # clear out db if table already exists...
    conn.execute(
        'DROP TABLE IF EXISTS movies'
    )

    conn.execute(
        'CREATE TABLE movies (' +
            'id TEXT NOT NULL PRIMARY KEY, ' +
            'release_year TEXT, ' +
            'title TEXT, ' +
            'origin TEXT, ' +
            'director TEXT,' +
            'cast TEXT,' +
            'genre TEXT,' +
            'wiki_page TEXT,' +
            'plot TEXT' +
        ')'
    )


    conn.close()
    return 'database initialized', 200

# TODO: Allow specification of file location
@app.route('/populatedb')
def populate_db():
    try:
        con = sqlite3.connect("movies.db")
        cur = con.cursor()

        filename="movie_plots.csv"

        movie_plots = open(filename)
        rows = csv.reader(movie_plots)

        movies_with_ids = [[str(uuid.uuid1())] + row for row in rows]

        print(movies_with_ids[0])
    
        cur.executemany("INSERT INTO movies VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", movies_with_ids[1:len(movies_with_ids)])

        con.commit()
        con.close()

        return "db has been populated from csv", 200

    except Exception as e:
        return f'an exception has occured in populating the database: {e}', 500
    
# TODO: DRY...
@app.route('/movies', defaults={'movie_id': None}, methods=['GET'])
@app.route('/movies/<movie_id>')
def get_movie_by_id(movie_id):
    if movie_id != None:

        con = sqlite3.connect('movies.db')
        cur = con.cursor()

        cur.execute(f'SELECT * FROM movies where ID=\'{movie_id}\'')
        data = cur.fetchall()
        
        con.close()

        formatted = []
        for item in data:
            formatted.append(
                {
                    "id": item[0],
                    "release_year": item[1],
                    "title": item[2],
                    "origin": item[3],
                    "director": item[4],
                    "cast": item[5],
                    "genre": item[6],
                    "wiki": item[7],
                    "plot": item[8],

               }
            )

        return {'content': formatted}


    else:
        con = sqlite3.connect('movies.db')
        cur = con.cursor()
        

        pagenumber = request.args.get('page')

        if pagenumber != None:
            cur.execute(f'SELECT id, release_year, title, origin, director, genre FROM movies ORDER BY id LIMIT 50 OFFSET {str((int(pagenumber)-1)*50)};')
        else:
            cur.execute(f'SELECT id, release_year, title, origin, director, genre FROM movies ORDER BY id;')
            

        data = cur.fetchall()
        
        con.close()

        formatted = []
        for item in data:
            formatted.append(
                {
                    "id": item[0],
                    "release_year": item[1],
                    "title": item[2],
                    "origin": item[3],
                    "director": item[4],
                    "genre": item[5]

               }
            )

        return {'content': formatted, "page": pagenumber}
        
@app.route('/movies', methods=['POST'])
def create_movie():

    body = request.get_json()

    try:
        con = sqlite3.connect("movies.db")
        cur = con.cursor()

        movie_id = str(uuid.uuid1())

        new_movie = [
            movie_id, 
            body["releaseYear"],
            body["title"],
            body["origin"],
            body["director"],
            body["cast"],
            body["genre"],
            body["wiki"],
            body["plot"]
        ]
        cur.execute("INSERT INTO movies VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", new_movie)
        cur.execute(f'SELECT * FROM movies where ID=\'{movie_id}\'')
        data = cur.fetchall()
        
        con.commit()
        con.close()

        formatted = []
        for item in data:
            formatted.append(
                {
                    "id": item[0],
                    "release_year": item[1],
                    "title": item[2],
                    "origin": item[3],
                    "director": item[4],
                    "cast": item[5],
                    "genre": item[6],
                    "wiki": item[7],
                    "plot": item[8],

               }
            )

        print(formatted)

        return {'content': formatted}, 200
    except Exception as e:
        return f'error creating movie: {e}', 500



@app.route('/movies/<movie_id>', methods=['PUT'])
def update_movie(movie_id):
    body = request.get_json()

    try:
        con = sqlite3.connect("movies.db")
        cur = con.cursor()


        new_movie = [
            body["releaseYear"],
            body["title"],
            body["origin"],
            body["director"],
            body["cast"],
            body["genre"],
            body["wiki"],
            body["plot"],
            movie_id
        ]

        sql = """
        UPDATE movies
        SET release_year = ? ,
            title = ? ,
            origin = ? ,
            director = ? ,
            cast = ? ,
            genre = ? ,
            wiki_page = ? ,
            plot = ?
        WHERE id = ?"""

        cur.execute(sql, new_movie)
        cur.execute(f'SELECT * FROM movies where ID=\'{movie_id}\'')
        data = cur.fetchall()
        
        con.commit()
        con.close()

        formatted = []
        for item in data:
            formatted.append(
                {
                    "id": item[0],
                    "release_year": item[1],
                    "title": item[2],
                    "origin": item[3],
                    "director": item[4],
                    "cast": item[5],
                    "genre": item[6],
                    "wiki": item[7],
                    "plot": item[8],

               }
            )

        return {'content': formatted}, 200

    except Exception as e:
        return f'error creating movie: {e}'


@app.route('/movies/<movie_id>', methods=['DELETE'])
def delete_movie(movie_id):

    body = request.get_json()

    try:
        con = sqlite3.connect("movies.db")
        cur = con.cursor()

        cur.execute(f'DELETE FROM movies where ID=\'{movie_id}\'')
        
        con.commit()
        con.close()

        return f'deleted movie with id: {movie_id}', 200

    except Exception as e:
        return f'error creating movie: {e}'
    return f'Deleteing movie with id: {movie_id}'


@app.route('/search/<search_string>', methods=['GET'])
def search(search_string):
    try:
        con = sqlite3.connect("movies.db")
        cur = con.cursor()

        pagenumber = request.args.get('page')

        cur.execute(f'SELECT id, release_year, title, origin, director, genre FROM movies WHERE title LIKE \'{search_string}%\' ORDER BY title LIMIT 50 OFFSET {str((int(pagenumber)-1)*50)};')

        data = cur.fetchall()

        con.commit()
        con.close()
        formatted = []
        for item in data:
            formatted.append(
                {
                    "id": item[0],
                    "release_year": item[1],
                    "title": item[2],
                    "origin": item[3],
                    "director": item[4],
                    "genre": item[5]

               }
            )

        return {'content': formatted}


    except Exception as e:
        return f'error searching for movie: {e}'

@app.errorhandler(HTTPException)
def handle_bad_request(e):
    response = e.get_response()
    # replace the body with JSON
    response.data = json.dumps({
        "code": e.code,
        "name": e.name,
        "description": e.description,
    })
    response.content_type = "application/json"
    return response
