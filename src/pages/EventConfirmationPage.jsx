import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../css/EventsConfirmationPage.css";

const API_URL = import.meta.env.VITE_API_URL;

function EventConfirmationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/events`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((e) => e.id === parseInt(id));
        if (!found) throw new Error("Event not found");
        setEvent(found);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="error-message">❌ {error}</p>;
  if (!event) return <p>Loading...</p>;

  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    event.title
  )}&dates=${event.date.replace(/-/g, "")}/${event.date.replace(
    /-/g,
    ""
  )}&details=${encodeURIComponent(
    event.description
  )}&location=${encodeURIComponent(event.location)}`;

  return (
    <div className="confirmation-page">
      <h2>You’ve booked: {event.title}</h2>

      <div className="event-summary">
        <h3>Event Summary</h3>
        <p>
          <strong>Date:</strong> {event.date}
        </p>
        <p>
          <strong>Location:</strong> {event.location}
        </p>
        <p>
          <strong>Description:</strong> {event.description}
        </p>
      </div>

      <a
        href={calendarUrl}
        target="_blank"
        rel="noreferrer"
        className="calendar-btn"
      >
        ➕ Add to Google Calendar
      </a>

      <br />
      <button className="back-home-btn" onClick={() => navigate("/")}>
        ← Back to Home
      </button>
    </div>
  );
}

export default EventConfirmationPage;
