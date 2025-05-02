import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/EventDetailsPage.css";

const API_URL = import.meta.env.VITE_API_URL;

function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await fetch(`${API_URL}/api/events`);
        const data = await response.json();
        const found = data.find((e) => e.id === parseInt(id));
        if (!found) throw new Error("Event not found.");
        setEvent(found);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchEvent();
  }, [id]);

  if (error) return <p className="error-message">{error}</p>;
  if (!event) return <p>Loading event...</p>;

  return (
    <div className="event-details">
      <h2>{event.title}</h2>
      <img src={event.url} alt={event.title} className="event-image" />
      <p>
        <strong>Date:</strong> {event.date}
      </p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>{event.description}</p>
      <button className="book-btn">Book Now</button>
    </div>
  );
}

export default EventDetailsPage;
