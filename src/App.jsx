import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

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
import EventConfirmationPage from "./pages/EventConfirmationPage";
import BookedEventsPage from "./pages/BookedEventsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import StaffRoute from "./components/StaffRoute";

import "./css/App.css";

function App() {
  const location = useLocation();
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setFade(true);
    const timeout = setTimeout(() => setFade(false), 300);
    return () => clearTimeout(timeout);
  }, [location]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};

          const currentUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            fullName: firebaseUser.displayName || "",
            profilePicture: firebaseUser.photoURL || "",
            role: userData.role || "user",
          };

          localStorage.setItem("user", JSON.stringify(currentUser));
        } catch (err) {
          console.error("Failed to load user data:", err);
        }
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("favourites");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <NavBar />
      <main className={`main-content ${fade ? "fade-in" : ""}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register-staff" element={<StaffRegisterPage />} />

          <Route
            path="/favourites"
            element={
              <ProtectedRoute>
                <FavouritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booked"
            element={
              <ProtectedRoute>
                <BookedEventsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-event"
            element={
              <StaffRoute>
                <CreateEventPage />
              </StaffRoute>
            }
          />
          <Route
            path="/edit-event/:id"
            element={
              <ProtectedRoute>
                <EditEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-event/:id"
            element={
              <ProtectedRoute>
                <EventConfirmationPage />
              </ProtectedRoute>
            }
          />
          <Route path="/events/:id" element={<EventDetailsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
