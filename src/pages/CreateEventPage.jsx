import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
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
      const newEvent = {
        ...formData,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "events"), newEvent);

      setMessage("✅ Event created successfully!");
      setFormData({
        title: "",
        date: "",
        location: "",
        description: "",
        url: "",
      });

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error creating event:", err);
      setMessage(`❌ Failed to create event.`);
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
