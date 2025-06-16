import { makeOption, fetchWithAuth, handleResponse } from '../utils/api.js';

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/scrape` : '/api/scrape';

const scrapeLink = async (link) => {
  try {
    const option = makeOption("POST", { url: link });
    const response = await fetchWithAuth(BASE_URL, option);

    return await handleResponse(response);

  } catch (error) {
    throw error;
  }
}

const scrapeApi = {
  scrapeLink,
};

export default scrapeApi;
