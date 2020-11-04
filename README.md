# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
There are no relevant tests for this application

# NOTES FOR BALTO

## Things I would improve

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
