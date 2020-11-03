import time
from flask import Flask
import sqlite3
import uuid



app = Flask(__name__)

@app.route('/importMovieData')
def import_csv():
    importMovieData.importMovie()

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/initdb')
def init_db():
    conn = sqlite3.connect('movies.db')
    print("Opened database successfully");

    conn.execute('CREATE TABLE movies (name TEXT, addr TEXT, city TEXT, pin TEXT)')
    print("Table created successfully");
    conn.close()

@app.route('/populatedb')
def populatedb():
    pass

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


