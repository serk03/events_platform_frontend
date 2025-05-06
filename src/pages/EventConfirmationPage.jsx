import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import "../css/EventsConfirmationPage.css";

function EventConfirmationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [hasBooked, setHasBooked] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // Step 1: Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventRef = doc(db, "events", id);
        const eventSnap = await getDoc(eventRef);
        if (!eventSnap.exists()) throw new Error("Event not found.");
        setEvent({ id: eventSnap.id, ...eventSnap.data() });
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(err.message);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  useEffect(() => {
    const bookEvent = async () => {
      if (!user || !event || hasBooked) return;

      try {
        const bookingsRef = collection(db, "bookings");
        const q = query(
          bookingsRef,
          where("userId", "==", user.uid),
          where("eventId", "==", event.id)
        );
        const existingBookings = await getDocs(q);

        if (existingBookings.empty) {
          await addDoc(bookingsRef, {
            userId: user.uid,
            eventId: event.id,
            eventTitle: event.title,
            timestamp: new Date().toISOString(),
          });
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }

        setHasBooked(true);
      } catch (err) {
        console.error("Error booking event:", err);
        setError(err.message);
      }
    };

    bookEvent();
  }, [event, user, hasBooked]);

  if (error) return <p className="error-message">❌ {error}</p>;
  if (!event) return <p>Loading...</p>;

  const formattedDate = new Date(event.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const startDate = event.date.replace(/-/g, "") + "T090000Z";
  const endDate = event.date.replace(/-/g, "") + "T100000Z";
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    event.title
  )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
    event.description
  )}&location=${encodeURIComponent(event.location)}`;

  return (
    <div className="confirmation-page">
      <h2>You’ve booked: {event.title}</h2>

      <img
        src={event.url || "/images/Event-US-Default.png"}
        alt={event.title}
        className="event-image"
        onError={(e) => {
          e.currentTarget.src = "/images/Event-US-Default.png";
        }}
      />

      <p>
        <strong className="date">Date:</strong> {formattedDate}
      </p>
      <p>
        <strong className="location">Location:</strong> {event.location}
      </p>

      {showToast && (
        <p className="toast-message" aria-live="polite">
          ✅ Booking saved successfully!
        </p>
      )}

      <a
        href={calendarUrl}
        target="_blank"
        rel="noreferrer"
        className="calendar-btn"
      >
        ➕ Add to Google Calendar
      </a>

      <button className="back-home-btn" onClick={() => navigate("/")}>
        ← Back to Home
      </button>
    </div>
  );
}

export default EventConfirmationPage;
