import time
from flask import Flask
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
    return 'database initialized'

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


        # ignore the header
        next(rows, None)
    
        cur.executemany("INSERT INTO movies VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", movies_with_ids[1:len(movies_with_ids)])

        con.commit()
        con.close()

        return "db has been populated from csv: "

    except Exception as e:
        return f'an exception has occured in populating the database: {e}', 500
    

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

        cur.execute("SELECT id, release_year, title, origin, director, genre FROM movies;")

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

        return {'content': formatted}
        
@app.route('/movies', methods=['POST'])
def create_movie():
    return "creating movie with id: " + str(uuid.uuid1())

@app.route('/movies/<movie_id>', methods=['PUT'])
def update_movie(movie_id):
    return "updating data for movie with id: " + str(movie_id)

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
