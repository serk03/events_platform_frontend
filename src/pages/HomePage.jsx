import EventCard from "../components/EventCard";

function HomePage() {
  const events = [
    { id: 1, title: "Trent Park Trail", date: "25-05-2025" },
    { id: 2, title: "Montagu Park Trail", date: "26-05-2025" },
    { id: 3, title: "Regents Park Trail", date: "27-05-2025" },
  ];

  return (
    <div className="home">
      <div className="events-grid">
        {events.map((event) => (
          <EventCard event={event} key={event.id} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
