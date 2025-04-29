import React from "react";
import { Routes, Route } from "react-router-dom";
import FavouritesPage from "./pages/FavouritesPage";
import RegisterPage from "./pages/UserRegisterPage";
import LoginPage from "./pages/LoginPage";
import StaffRegisterPage from "./pages/StaffRegisterPage";
import HomePage from "./pages/HomePage";
import NavBar from "./components/NavBar";
import "./css/App.css";

function App() {
  return (
    <div>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/staff-register" element={<StaffRegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/favourites" element={<FavouritesPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
