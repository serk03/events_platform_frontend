import EventCard from "../components/EventCard";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "../css/Home.css";

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "events"));
        const eventsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsData);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // You could trigger a backend search here if using a search index.
  };

  const filteredEvents = events
    .filter((event) =>
      searchQuery
        ? event.title.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    )
    .filter((event) =>
      searchLocation
        ? event.location.toLowerCase().includes(searchLocation.toLowerCase())
        : true
    )
    .filter((event) =>
      selectedLocation
        ? event.location.toLowerCase() === selectedLocation.toLowerCase()
        : true
    )
    .filter((event) => (selectedDate ? event.date === selectedDate : true))
    .sort((a, b) => {
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
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for Event..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location (optional)"
          className="search-input"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      <div className="filter-bar">
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="">All Locations</option>
          {[...new Set(events.map((e) => e.location))].map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="title-asc">Title A–Z</option>
          <option value="title-desc">Title Z–A</option>
        </select>
      </div>

      <div className="action-buttons">
        <button
          className="clear-filters"
          onClick={() => {
            setSelectedLocation("");
            setSelectedDate("");
            setSearchQuery("");
            setSearchLocation("");
            setSortOrder("newest");
          }}
        >
          Reset All
        </button>
      </div>

      {loading ? (
        <p>Loading events...</p>
      ) : filteredEvents.length === 0 ? (
        <p className="no-results">No events found.</p>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
