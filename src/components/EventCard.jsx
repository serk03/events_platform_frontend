import "../css/EventCard.css";

function EventCard({ event }) {
  function onFavouriteClick() {
    alert("clicked");
  }

  return (
    <div className="event-card">
      <div className="event-poster">
        <img src={event.url} alt={event.title} />
        <div className="event-overlay">
          <button className="favourite-btn" onClick={onFavouriteClick}>
            🤍
          </button>
        </div>
      </div>
      <div className="event-info">
        <h3>{event.title}</h3>
        <p>{event.date}</p>
      </div>
    </div>
  );
}

export default EventCard;
