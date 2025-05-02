import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/EventCard.css";

const API_URL = import.meta.env.VITE_API_URL;

function EventCard({ event, onFavouriteToggle }) {
  const [isFavourite, setIsFavourite] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const isStaff = user?.role === "staff";
  const navigate = useNavigate();

  const toggleFavourite = () => {
    if (!user) {
      alert("Please log in to use favourites.");
      navigate("/login");
      return;
    }

    const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
    const updated = favourites.includes(event.id)
      ? favourites.filter((id) => id !== event.id)
      : [...favourites, event.id];

    localStorage.setItem("favourites", JSON.stringify(updated));
    setIsFavourite(updated.includes(event.id));
    if (onFavouriteToggle) onFavouriteToggle(event.id);
  };

  const handleEditEvent = () => navigate(`/edit-event/${event.id}`);

  const handleDeleteEvent = async () => {
    const token = localStorage.getItem("staffToken");
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(`${API_URL}/api/events/${event.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete event");
      alert("Event deleted successfully.");
      window.location.reload();
    } catch (err) {
      alert("Error deleting event.");
      console.error(err);
    }
  };

  useEffect(() => {
    const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
    setIsFavourite(favourites.includes(event.id));
  }, [event.id]);

  return (
    <div className="event-card">
      <div className="event-poster">
        <img src={event.url} alt={event.title} />
        <div className="event-overlay">
          {user && (
            <button className="favourite-btn" onClick={toggleFavourite}>
              {isFavourite ? "❤️" : "🤍"}
            </button>
          )}
        </div>
      </div>

      <div className="event-info">
        <h3>{event.title}</h3>
        <p>{event.date}</p>

        {isStaff ? (
          <div className="staff-controls">
            <button onClick={handleEditEvent} className="edit-btn">
              Edit
            </button>
            <button onClick={handleDeleteEvent} className="delete-btn">
              Delete
            </button>
          </div>
        ) : (
          <div className="user-actions">
            <Link to={`/events/${event.id}`} className="more-info-btn">
              More Info
            </Link>
            <button
              className="signup-btn"
              onClick={() => {
                if (!user) {
                  alert("Please log in to book this event.");
                  navigate("/login");
                } else {
                  navigate(`/book-event/${event.id}`);
                }
              }}
            >
              Book Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventCard;
