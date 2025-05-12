const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/categories` : '/api/categories';

const getCategories = async () => {
  const response = await fetch(`${BASE_URL}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  const data = await response.json();
  return data;
}

export {
  getCategories,
};