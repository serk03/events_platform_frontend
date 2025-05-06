import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doc, deleteDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../css/EventCard.css";

function EventCard({ event, onFavouriteToggle, hideBookButton = false }) {
  const [isFavourite, setIsFavourite] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const isStaff = user?.role === "staff";
  const navigate = useNavigate();

  const toggleFavourite = async () => {
    if (!user) {
      alert("Please log in to use favourites.");
      navigate("/login");
      return;
    }

    const favRef = doc(db, "users", user.uid, "favourites", event.id);

    try {
      const favSnap = await getDoc(favRef);

      if (favSnap.exists()) {
        await deleteDoc(favRef);
        setIsFavourite(false);
        if (onFavouriteToggle) onFavouriteToggle(event.id);
      } else {
        await setDoc(favRef, {
          eventId: event.id,
          timestamp: new Date().toISOString(),
        });
        setIsFavourite(true);
        if (onFavouriteToggle) onFavouriteToggle(event.id);
      }
    } catch (err) {
      console.error("Failed to toggle favourite:", err);
      alert("❌ Failed to update favourite.");
    }
  };

  const handleEditEvent = () => navigate(`/edit-event/${event.id}`);

  const handleDeleteEvent = async () => {
    if (!isStaff) {
      alert("You are not authorized to delete events.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "events", event.id));
      alert("✅ Event deleted successfully.");
      window.location.reload();
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("❌ Failed to delete event.");
    }
  };

  useEffect(() => {
    if (!user || !user.uid) return;

    const checkFavourite = async () => {
      try {
        const favRef = doc(db, "users", user.uid, "favourites", event.id);
        const favSnap = await getDoc(favRef);
        setIsFavourite(favSnap.exists());
      } catch (err) {
        console.error("Error checking favourite:", err);
      }
    };

    checkFavourite();
  }, [event.id, user]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="event-card">
      <div className="event-poster">
        <img
          src={event.url || "/images/Event-US-Default.png"}
          alt={event.title}
          onError={(e) => {
            e.currentTarget.src = "/images/Event-US-Default.png";
          }}
        />
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
        <p>{formatDate(event.date)}</p>

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
            {!hideBookButton && (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventCard;
