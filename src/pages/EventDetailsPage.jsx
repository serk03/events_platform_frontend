import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  deleteDoc,
  query,
  where,
  collection,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import "../css/EventDetailsPage.css";

function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [bookingId, setBookingId] = useState("");

  useEffect(() => {
    async function fetchEvent() {
      try {
        const docRef = doc(db, "events", id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          throw new Error("Event not found.");
        }
        setEvent({ id: docSnap.id, ...docSnap.data() });

        const user = auth.currentUser;
        if (user) {
          const bookingsRef = collection(db, "bookings");
          const q = query(
            bookingsRef,
            where("userId", "==", user.uid),
            where("eventId", "==", docSnap.id)
          );
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            setIsBooked(true);
            setBookingId(snapshot.docs[0].id);
          }
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(err.message);
      }
    }

    fetchEvent();
  }, [id]);

  const handleUnbook = async () => {
    try {
      await deleteDoc(doc(db, "bookings", bookingId));
      setIsBooked(false);
      alert("Booking cancelled ✅");
    } catch (err) {
      console.error("Error unbooking:", err);
      alert("❌ Failed to cancel booking");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (error) return <p className="error-message">{error}</p>;
  if (!event) return <p>Loading event...</p>;

  return (
    <div className="event-details">
      <h2>{event.title}</h2>
      <img
        src={event.url || "/images/Event-US-Default.png"}
        alt={event.title}
        className="event-image"
        onError={(e) => {
          e.currentTarget.src = "/images/Event-US-Default.png";
        }}
      />
      <p>
        <strong className="date">Date:</strong> {formatDate(event.date)}
      </p>
      <p>
        <strong className="location">Location:</strong> {event.location}
      </p>
      <p className="description">{event.description}</p>

      <div className="button-group">
        {isBooked ? (
          <button className="unbook-btn" onClick={handleUnbook}>
            Cancel Booking
          </button>
        ) : (
          <button
            className="book-btn"
            onClick={() => navigate(`/book-event/${event.id}`)}
          >
            Book Now
          </button>
        )}
        <button className="cancel-btn" onClick={() => navigate("/")}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EventDetailsPage;
