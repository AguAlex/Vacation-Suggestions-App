import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Vacation from "./pages/Vacation";

import Clusters from "./pages/Clusters"; //  Adaugă asta sus
import POIMap from "./pages/POIMap";

import "./App.css";
import Hotels from "./pages/Hotels";
import MyLikes from "./pages/MyLikes";

import RecFav from "./components/RecFav";


import "./global.css";
import "./input.css";
import "./output.css";
import './fonts.css';

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  return (
    <Router>
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home user={user} setUser={setUser} />} />
        <Route path="/home" element={<Home user={user} setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/vacation" element={<Vacation />} />
        <Route path="/hotels/:id" element={<Hotels />} />

        <Route path="/clusters" element={<Clusters />} />
        <Route path="/map" element={<POIMap />} />
        <Route path="/my-likes" element={<MyLikes />} />
        <Route path="/rec_fav" element={<RecFav />} />
      </Routes>
    </Router>
  );
}

export default App;
