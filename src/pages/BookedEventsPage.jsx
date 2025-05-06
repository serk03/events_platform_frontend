import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import EventCard from "../components/EventCard";
import "../css/Favourites.css";

function BookedEventsPage() {
  const [bookedEvents, setBookedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, "bookings"),
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(q);

        const eventsWithBookingId = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const bookingId = docSnap.id;
            const eventId = docSnap.data().eventId;
            const eventSnap = await getDoc(doc(db, "events", eventId));
            if (eventSnap.exists()) {
              return {
                id: eventSnap.id,
                ...eventSnap.data(),
                bookingId: bookingId, // ensure correct binding
              };
            }
            return null;
          })
        );

        console.log("Fetched bookings with IDs:", eventsWithBookingId);
        setBookedEvents(eventsWithBookingId.filter(Boolean));
      } catch (err) {
        console.error("Failed to fetch booked events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleUnbook = async (bookingId) => {
    const user = auth.currentUser;
    if (!user || !bookingId) return;

    console.log("Attempting to delete booking:", bookingId);

    try {
      await deleteDoc(doc(db, "bookings", bookingId));
      setBookedEvents((prev) =>
        prev.filter((event) => event.bookingId !== bookingId)
      );
      alert("Event unbooked successfully ✅");
    } catch (err) {
      console.error("Failed to unbook event:", err);
      alert("❌ Failed to unbook event.");
    }
  };

  return (
    <div className="favourites-page">
      <h2>Your Booked Events</h2>
      {loading ? (
        <div className="favourites-loading">Loading...</div>
      ) : bookedEvents.length === 0 ? (
        <div className="favourites-empty">
          <h2>No bookings yet</h2>
          <p>Book an event and it will show here.</p>
        </div>
      ) : (
        <div className="events-grid">
          {bookedEvents.map((event) => (
            <div key={event.id} style={{ position: "relative" }}>
              <EventCard event={event} hideBookButton />
              <button
                onClick={() => handleUnbook(event.bookingId)}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  padding: "0.4rem 0.8rem",
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Cancel Booking
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookedEventsPage;
