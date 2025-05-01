// src/pages/EditEventPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/EditEventPage.css";

const API_URL = import.meta.env.VITE_API_URL;

function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    url: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await fetch(`${API_URL}/api/events`);
        const data = await response.json();

        const event = data.find((e) => e.id === parseInt(id));
        if (!event) throw new Error("Event not found");

        setFormData({
          title: event.title,
          date: event.date,
          location: event.location,
          description: event.description,
          url: event.url || "",
        });
      } catch (err) {
        setError(`❌ ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setTimeout(() => setMessage(""), 3000);

    try {
      const token = localStorage.getItem("staffToken");

      const response = await fetch(`${API_URL}/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          title: formData.title.trim(),
          location: formData.location.trim(),
          description: formData.description.trim(),
          url: formData.url.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to update event");

      setMessage("✅ Event updated successfully!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(`❌ ${err.message}`);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (loading) return <p className="event-message">Loading event data...</p>;
  if (error) return <p className="event-message error">{error}</p>;

  return (
    <div className="edit-event-page">
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit} className="edit-event-form">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
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
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          required
        />
        <input
          type="text"
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="Image URL"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Event Description"
          required
        />
        <div className="edit-buttons">
          <button type="submit">Save Changes</button>
          <button type="button" onClick={handleCancel} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
      {message && (
        <div
          className={`toast-message ${
            message.startsWith("✅") ? "success" : "error"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default EditEventPage;
