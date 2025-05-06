import { useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import "../css/Favourites.css";

function FavouritesPage() {
  const [favouriteEvents, setFavouriteEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        fetchFavourites(firebaseUser.uid);
      } else {
        setFavouriteEvents([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchFavourites = async (uid) => {
    setLoading(true);
    try {
      const favSnapshot = await getDocs(
        collection(db, "users", uid, "favourites")
      );

      const favEventIds = favSnapshot.docs.map((doc) => doc.id);
      const eventPromises = favEventIds.map((eventId) =>
        getDoc(doc(db, "events", eventId))
      );

      const eventSnapshots = await Promise.all(eventPromises);

      const fetchedEvents = eventSnapshots
        .filter((snap) => snap.exists())
        .map((snap) => ({
          id: snap.id,
          ...snap.data(),
        }));

      setFavouriteEvents(fetchedEvents);
    } catch (error) {
      console.error("Failed to load favourites", error);
      setFavouriteEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavourite = async (eventId) => {
    const user = auth.currentUser;
    if (!user) return;

    setFavouriteEvents((prev) => prev.filter((e) => e.id !== eventId));

    try {
      await deleteDoc(doc(db, "users", user.uid, "favourites", eventId));
      showToast("Removed from favourites ✅");
    } catch (err) {
      console.error("Failed to remove favourite:", err);
      showToast("❌ Failed to remove favourite");
    }
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Sort before rendering
  const sortedEvents = [...favouriteEvents].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    switch (sortOrder) {
      case "newest":
        return dateB - dateA;
      case "oldest":
        return dateA - dateB;
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  return (
    <div className="favourites-page">
      <h2>Your Favourites</h2>

      {toastMessage && <p className="toast-message">{toastMessage}</p>}

      {loading ? (
        <div className="favourites-loading">
          <div className="spinner" />
          Loading favourites...
        </div>
      ) : favouriteEvents.length === 0 ? (
        <div className="favourites-empty">
          <h2>No Favourite Events Yet</h2>
          <p>
            Start adding events to your favourites and they will appear here.
          </p>
        </div>
      ) : (
        <>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <label
              className="sort-label"
              htmlFor="sort"
              style={{ marginRight: "0.5rem" }}
            >
              Sort by:
            </label>
            <select
              id="sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="sort-dropdown"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title-asc">Title A–Z</option>
              <option value="title-desc">Title Z–A</option>
            </select>
          </div>

          <p
            className="icon-advise"
            style={{
              textAlign: "center",
              marginTop: "0.5rem",
              marginBottom: "1rem",
              fontSize: "1rem",
            }}
          >
            Click the ❤️ icon to remove an event from your favourites.
          </p>

          <div className="events-grid">
            {sortedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onFavouriteToggle={() => handleRemoveFavourite(event.id)}
                showCancelBooking={false} // ← Ensure booking button is visible
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default FavouritesPage;
