// src/services/api.js

const BASE_URL = "http://localhost:5000/api";

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
    const response = await fetch(`${BASE_URL}/events`);
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
