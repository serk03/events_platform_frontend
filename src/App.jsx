import React from "react";
import { Routes, Route } from "react-router-dom";
import FavouritesPage from "./pages/FavouritesPage";
import HomePage from "./pages/HomePage";
import "./css/App.css";

function App() {
  return (
    <main className="main-content">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/favourites" element={<FavouritesPage />} />
      </Routes>
    </main>
  );
}

export default App;
