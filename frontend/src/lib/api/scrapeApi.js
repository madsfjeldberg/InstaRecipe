import { makeOption } from "./util";

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/scrape` : '/api/scrape';

const scrapeLink = async (link) => {
  try {
    const getOption = makeOption("POST", { url: link });

    const response = await fetch(BASE_URL, getOption);
    const result = await response.json();
    return result;

  } catch (error) {
    console.error(error);
    throw new Error('Failed to scrape link: ', error.message);
  }
}

export {
  scrapeLink,
};