# Generic React + Flask + SQLite Application

This is an example react + flask + sqlite application. It was bootstrapped in 24 hours and is **not** supported in any way.
Feel free to clone this project to play around with the code.
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Quickstart Guide

To start the app quickly and effectively, you will need the following:

`yarn` & `python3`

Begin by cloning the project and installing the required dependencies for python and react

```bash
cd react-flask-app
yarn

cd api
pip3 install -r requirements.txt
```

Navigate to the root directory and start the service

```bash
yarn start-api
```

If this is the first time starting the application, you may want to initialize and popuate the database by calling the endpoints `/initdb` and `/populatedb`. You can do this with any http client. If you're not interested in that, feel free to skip this step. If I've uploaded the sqlite file correctly, this should not be a problem.

You are then ready to run the app

```bash
yarn start
```

This will start the UI at `localhost:3000`

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn start-api`

This will start a flask api at [http://localhost:5000](http://localhost:5000)

### `yarn test`

Launches the test runner in the interactive watch mode.\
There are no relevant tests for this application. This is regretable.

## Wishlist

- Use something like SQLAlchemy, not the basic sqlite engine in python
  - open to SQL injection
  - not as nice to work with :(
- Modularize the UI a bit more
  - Almost everything is in one mega file
  - Consider a full page for the movie
- Styles
  - better indicators for things that are clickable
- Allow people to pass in a file via an api call rather than just ingesting the csv as a part of the project
- Structure `api.py` a little better
  - everything dealing with `movies` could be in one route with modularized function calls
  - break things into seperate files
- Pagination with infinite scroll?
- Automated tests :(
