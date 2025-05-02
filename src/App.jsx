import React from "react";
import { Routes, Route } from "react-router-dom";
import FavouritesPage from "./pages/FavouritesPage";
import RegisterPage from "./pages/UserRegisterPage";
import LoginPage from "./pages/LoginPage";
import StaffRegisterPage from "./pages/StaffRegisterPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import NavBar from "./components/NavBar";
import CreateEventPage from "./pages/CreateEventPage";
import EditEventPage from "./pages/EditEventPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import "./css/App.css";

function App() {
  return (
    <div>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register-staff" element={<StaffRegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/favourites" element={<FavouritesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create-event" element={<CreateEventPage />} />
          <Route path="/edit-event/:id" element={<EditEventPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
