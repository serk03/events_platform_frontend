import { useState, useEffect, useRef } from "react";
import "../css/EventCard.css";

function EventCard({ event }) {
  const [showSignup, setShowSignup] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isFavourite, setIsFavourite] = useState(false);

  const signupFormRef = useRef(null);
  const eventCardRef = useRef(null);
  const confirmationModalRef = useRef(null);

  function toggleFavourite() {
    const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
    let updatedFavourites;

    if (favourites.includes(event.id)) {
      updatedFavourites = favourites.filter((id) => id !== event.id);
    } else {
      updatedFavourites = [...favourites, event.id];
    }

    localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
    setIsFavourite(!isFavourite);
  }

  const handleSignUpClick = () => {
    setShowConfirmation(true);
  };

  const confirmSignUp = () => {
    setShowConfirmation(false);
    setShowSignup(true);
  };

  const cancelSignUp = () => {
    setShowConfirmation(false);
    setShowCancelConfirmation(true);
  };

  const confirmCancel = () => {
    setShowCancelConfirmation(false);
    setShowSignup(false);
    setName("");
    setEmail("");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      return;
    }

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

      setShowSignup(false);
      setSignupSuccess(true);
      setName("");
      setEmail("");
      setTimeout(() => setSignupSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        signupFormRef.current &&
        !signupFormRef.current.contains(event.target) &&
        eventCardRef.current &&
        !eventCardRef.current.contains(event.target) &&
        (!confirmationModalRef.current ||
          !confirmationModalRef.current.contains(event.target))
      ) {
        if (showSignup) {
          setShowCancelConfirmation(true);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSignup]);

  useEffect(() => {
    const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
    setIsFavourite(favourites.includes(event.id));
  }, [event.id]);

  return (
    <div className="event-card" ref={eventCardRef}>
      <div className="event-poster">
        <img src={event.url} alt={event.title} />
        <div className="event-overlay">
          <button className="favourite-btn" onClick={toggleFavourite}>
            {isFavourite ? "❤️" : "🤍"}
          </button>
        </div>
      </div>

      <div className="event-info">
        <h3>{event.title}</h3>
        <p>{event.date}</p>
        {!showSignup ? (
          <button className="signup-btn" onClick={handleSignUpClick}>
            Sign Up
          </button>
        ) : (
          <form
            onSubmit={handleSignUp}
            className="signup-form"
            ref={signupFormRef}
          >
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
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
              <button type="submit" className="submit-btn">
                Submit
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowCancelConfirmation(true)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {signupSuccess && (
          <p className="simple-toast">✅ Successfully signed up!</p>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="confirmation-modal" ref={confirmationModalRef}>
          <p>Are you sure you want to sign up for this event?</p>
          <button onClick={confirmSignUp}>Yes</button>
          <button onClick={cancelSignUp}>Cancel</button>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirmation && (
        <div className="confirmation-modal">
          <p>Are you sure you want to cancel?</p>
          <button onClick={confirmCancel}>Yes, Cancel</button>
          <button onClick={() => setShowCancelConfirmation(false)}>
            Go Back
          </button>
        </div>
      )}
    </div>
  );
}

export default EventCard;
