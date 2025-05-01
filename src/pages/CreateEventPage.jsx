import { useState } from "react";
import "../css/CreateEventPage.css";

function CreateEventPage() {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    url: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const token = `Bearer ${localStorage.getItem("staffToken")}`;
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create event");
      }

      setMessage("✅ Event created successfully!");
      setFormData({
        title: "",
        date: "",
        location: "",
        description: "",
        url: "",
      });

      // Auto-clear message
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-page">
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit} className="create-event-form">
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="url"
          placeholder="Image URL"
          value={formData.url}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Event Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>

      {message && <p className="event-message">{message}</p>}
    </div>
  );
}

export default CreateEventPage;
