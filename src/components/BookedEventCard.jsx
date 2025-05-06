// BookedEventCard.jsx
import "../css/EventCard.css";

function BookedEventCard({ event, onCancelBooking }) {
  return (
    <div className="event-card booked">
      <img
        src={event.image || "/images/Event-US-default.png"}
        alt={event.title}
        className="event-image"
        onError={(e) => {
          e.currentTarget.src = "/images/Event-US-default.png";
        }}
      />
      <div className="event-details">
        <h3>{event.title}</h3>
        <p>{event.date}</p>
        <p>{event.location}</p>
        <button onClick={onCancelBooking} className="cancel-button">
          Cancel Booking
        </button>
      </div>
    </div>
  );
}

export default BookedEventCard;
