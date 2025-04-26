import EventCard from "../components/EventCard";
import { useState, useEffect } from "react";
import { searchEvents, getPopularEvents } from "../services/api";
import "../css/Home.css";

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPopularEvents = async () => {
      try {
        const popularEvents = await getPopularEvents();
        setEvents(popularEvents);
      } catch (error) {
        console.log(error);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    loadPopularEvents();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const results = await searchEvents(searchQuery);
      setEvents(results);
    } catch (error) {
      console.error(error);
      setError("Failed to search events");
    } finally {
      setLoading(false);
      setSearchQuery("");
    }
  };

  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for Event.."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      <div className="events-grid">
        {events.map((event) => (
          <EventCard event={event} key={event.id} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
