const API_KEY = "GAUTZQFKNNK7SX7DGP";
const BASE_URL = "https://www.eventbriteapi.com/v3/";

export const getPopularEvents = async () => {
  const response = await fetch(`${BASE_URL}/events/popular?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
};

export const searchEvents = async (query) => {
  const response = await fetch(
    `${BASE_URL}/search/event?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}`
  );
  const data = await response.json();
  return data.results;
};
