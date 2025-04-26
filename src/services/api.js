// services/api.js

const BASE_URL = "https://www.eventbriteapi.com/v3";
const API_TOKEN = "XMVZJIUFYHF5THBWTPJF"; // your Private Token

async function apiRequest(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
}

export async function getPopularEvents() {
  const data = await apiRequest("/events/search/?sort_by=date");
  return data.events || [];
}

export async function searchEvents(query) {
  const data = await apiRequest(
    `/events/search/?q=${encodeURIComponent(query)}`
  );
  return data.events || [];
}
