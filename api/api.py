import time
from flask import Flask
import sqlite3
import uuid
from werkzeug.exceptions import HTTPException
import json

app = Flask(__name__)

@app.route('/initdb')
def init_db():
    conn = sqlite3.connect('movies.db')
    print("Opened database successfully");

    conn.execute(
        'CREATE TABLE movies (' +
            'release_year TEXT, ' +
            'title TEXT, ' +
            'origin TEXT, ' +
            'director TEXT' +
            'cast TEXT' +
            'genre TEXT' +
            'wiki_page TEXT' +
            'plot TEXT' +
        ')'
    )
    print("Table created successfully");
    conn.close()
    return {}

@app.route('/populatedb')
def populate_db():
    try:
        pass
    except Exception as e:
        return 
    return "db has been populated"

@app.route('/movies', defaults={'movie_id': None}, methods=['GET'])
@app.route('/movies/<movie_id>')
def get_movie_by_id(movie_id):
    if movie_id != None:
        return "getting data for movie with id: " + str(movie_id)
    else:
        return "getting data for all movies"
        
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