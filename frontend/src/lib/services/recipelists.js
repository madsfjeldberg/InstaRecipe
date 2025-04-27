const BASE_URL = import.meta.env.VITE_API_URL + '/recipelists' || '/recipelists';

const addRecipeList = async (name, userId) => {
  const response = await fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ name, userId }),
  });

  if (!response.ok) {
    throw new Error('Failed to add recipe list');
  }

  const data = await response.json();
  return data;
}

const getRecipeListsByUserId = async (userId) => {
  const response = await fetch(`${BASE_URL}/user/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch recipe lists');
  }

  const data = await response.json();
  return data;
}

export {
  addRecipeList,
  getRecipeListsByUserId
};

