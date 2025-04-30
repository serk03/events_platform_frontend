const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export async function getPopularEvents() {
  try {
    const response = await fetch(`${BASE_URL}/events`);
    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
}

export async function searchEvents(query) {
  try {
    const response = await fetch(
      `${BASE_URL}/events?search=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error("Failed to search events");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
}
