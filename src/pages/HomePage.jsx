import EventCard from "../components/EventCard";
import { useState, useEffect } from "react";
import { searchEvents, getPopularEvents } from "../services/api";
import "../css/Home.css";

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    loadPopularEvents();
  }, []);

  const loadPopularEvents = async () => {
    try {
      setLoading(true);
      const popularEvents = await getPopularEvents();
      setEvents(popularEvents);
    } catch (error) {
      console.error(error);
      setError("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim() && !searchLocation.trim()) return;

    try {
      setLoading(true);
      const results = await searchEvents(searchQuery);
      const filtered = results.filter((event) =>
        searchLocation
          ? event.location.toLowerCase().includes(searchLocation.toLowerCase())
          : true
      );
      setEvents(filtered);
      setError(filtered.length === 0 ? "No events match your search." : "");
    } catch (err) {
      console.error(err);
      setError("Failed to search events.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSearch = async () => {
    try {
      setLoading(true);
      await loadPopularEvents();
      setSearchQuery("");
      setSearchLocation("");
      setError("");
    } catch {
      setError("Failed to reset search.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSelectedLocation("");
    setSelectedDate("");
    setSortOrder("newest");
  };

  const sortEvents = (events) => {
    return [...events].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();

      switch (sortOrder) {
        case "newest":
          return dateB - dateA;
        case "oldest":
          return dateA - dateB;
        case "title-asc":
          return titleA.localeCompare(titleB);
        case "title-desc":
          return titleB.localeCompare(titleA);
        default:
          return 0;
      }
    });
  };

  const filteredEvents = sortEvents(
    events
      .filter((event) =>
        selectedLocation
          ? event.location.toLowerCase() === selectedLocation.toLowerCase()
          : true
      )
      .filter((event) => (selectedDate ? event.date === selectedDate : true))
  );

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
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title-asc">Title A-Z</option>
          <option value="title-desc">Title Z-A</option>
        </select>
      </div>

      <div className="action-buttons">
        <button className="clear-filters" onClick={handleClearFilters}>
          Clear Filters
        </button>
        <button className="clear-filters" onClick={handleResetSearch}>
          Reset Search
        </button>
      </div>

      {error && <div className="toast-message error-toast">{error}</div>}

      <div className="events-grid">
        {filteredEvents.map((event) => (
          <EventCard event={event} key={event.id} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
