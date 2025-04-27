import { useState } from "react";
import "../css/EventCard.css";

function EventCard({ event }) {
  const [showSignup, setShowSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function onFavouriteClick() {
    alert("clicked");
  }
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/events/${event.id}/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to sign up");
      }

      alert("Successfully signed up!");
      setShowSignup(false);
      setName("");
      setEmail("");
    } catch (error) {
      console.error(error);
      alert("There was a problem signing up.");
    }
  };

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

        {!showSignup ? (
          <button className="signup-btn" onClick={() => setShowSignup(true)}>
            Sign Up
          </button>
        ) : (
          <form onSubmit={handleSignUp} className="signup-form">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Submit</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default EventCard;
