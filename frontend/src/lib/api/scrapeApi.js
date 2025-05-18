import { makeOption, fetchWithAuth } from "./util";

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/scrape` : '/api/scrape';

const scrapeLink = async (link) => {
  try {
    const option = makeOption("POST", { url: link });

    const response = await fetchWithAuth(BASE_URL, option);
    const result = await response.json();
    console.log("frontend Scrape result:", result);
    return result;

  } catch (error) {
    console.error(error);
    throw new Error('Failed to scrape link: ', error.message);
  }
}

const scrapeApi = {
  scrapeLink,
};

export default scrapeApi;