import React from "react";
import { Route, Routes } from "react-router-dom";
import Detail from "./routes/Detail";
import Home from "./routes/Home";

const App = () => {
  return (
    <Routes>
      <Route path='/' exact element={<Home />}></Route>
      <Route path='/:id' element={<Detail />}></Route>
    </Routes>
  );
};

export default App;
