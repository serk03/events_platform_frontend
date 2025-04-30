import { useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import "../css/Favourites.css";

const API_URL = import.meta.env.VITE_API_URL;

function FavouritesPage() {
  const [favouriteEvents, setFavouriteEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetchFavourites();
  }, []);

  const fetchFavourites = async () => {
    setLoading(true);
    try {
      const favourites = JSON.parse(localStorage.getItem("favourites")) || [];

      if (favourites.length === 0) {
        setFavouriteEvents([]);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/events`);
      const allEvents = await response.json();

      const filtered = allEvents.filter((event) =>
        favourites.includes(event.id)
      );
      setFavouriteEvents(filtered);
    } catch (error) {
      console.error("Failed to load favourites", error);
      setFavouriteEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavourite = (eventId) => {
    const updatedEvents = favouriteEvents.filter((e) => e.id !== eventId);
    setFavouriteEvents(updatedEvents);

    const storedFavourites =
      JSON.parse(localStorage.getItem("favourites")) || [];
    const updatedFavourites = storedFavourites.filter((id) => id !== eventId);
    localStorage.setItem("favourites", JSON.stringify(updatedFavourites));

    showToast("Removed from favourites ✅");
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div className="favourites-page">
      <h2>Your Favourites</h2>

      {toastMessage && <p className="toast-message">{toastMessage}</p>}

      {loading ? (
        <div className="favourites-loading">Loading favourites...</div>
      ) : favouriteEvents.length === 0 ? (
        <div className="favourites-empty">
          <h2>No Favourite Events Yet</h2>
          <p>
            Start adding events to your favourites and they will appear here.
          </p>
        </div>
      ) : (
        <div className="events-grid">
          {favouriteEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onFavouriteToggle={() => handleRemoveFavourite(event.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavouritesPage;
