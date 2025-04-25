import EventCard from "../components/EventCard";
import { useState } from "react";
import "../css/Home.css";

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const events = [
    { id: 1, title: "Trent Park Trail", date: "25-05-2025" },
    { id: 2, title: "Montagu Park Trail", date: "26-05-2025" },
    { id: 3, title: "Regents Park Trail", date: "27-05-2025" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    alert(searchQuery);
    setSearchQuery("");
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
