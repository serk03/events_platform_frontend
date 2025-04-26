const BASE_URL = "https://www.eventbriteapi.com/v3";
const API_TOKEN = "XMVZJIUFYHF5THBWTPJF"; //

export async function fetchEvents() {
  try {
    const response = await fetch(`${BASE_URL}/events/search/`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.events;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
}

export const searchEvents = async (query) => {
  const response = await fetch(
    `${BASE_URL}/search/event?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}`
  );
  const data = await response.json();
  return data.results;
};
