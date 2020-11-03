import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import "semantic-ui-css/semantic.min.css";

import MovieTable from "./components/MovieTable/MovieTable";

function App() {
  return (
    <div className="App">
      <MovieTable />
    </div>
  );
}

export default App;
