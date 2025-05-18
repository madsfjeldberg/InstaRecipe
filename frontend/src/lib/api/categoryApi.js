const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/categories` : '/api/categories';
import { makeOption } from "./util";

const getCategories = async () => {
  const option = makeOption('GET');
  const response = await fetch(`${BASE_URL}`, option);

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  const data = await response.json();
  return data;
}

const categoryApi = {
  getCategories,
};

export default categoryApi;