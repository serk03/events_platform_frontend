import { useState } from "react";
import FavouritesPage from "./pages/FavouritesPage";
import HomePage from "./pages/HomePage";
import "./css/App.css";

function App() {
  return (
    <main className="main-content">
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/favourites" element={<FavouritesPage />}></Route>
      </Routes>
    </main>
  );
}
export default App;
