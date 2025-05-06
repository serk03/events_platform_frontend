import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../css/CreateEventPage.css"; // Reuse the create event styles

function EditEventPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    url: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchEvent() {
      try {
        const eventRef = doc(db, "events", id);
        const eventSnap = await getDoc(eventRef);

        if (eventSnap.exists()) {
          setFormData(eventSnap.data());
        } else {
          setMessage("❌ Event not found.");
        }
      } catch (err) {
        console.error("Error loading event:", err);
        setMessage("❌ Failed to load event.");
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
    setLoading(true);

    try {
      const eventRef = doc(db, "events", id);
      await updateDoc(eventRef, formData);
      setMessage("✅ Event updated successfully!");
    } catch (err) {
      console.error("Error updating event:", err);
      setMessage("❌ Failed to update event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-page">
      <h2>Edit Event</h2>
      {loading ? (
        <p>Loading event...</p>
      ) : (
        <form onSubmit={handleSubmit} className="create-event-form">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Event Title"
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
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Event Description"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}

      {message && <p className="event-message">{message}</p>}
    </div>
  );
}

export default EditEventPage;
