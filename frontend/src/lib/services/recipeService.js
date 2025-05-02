// const BASE_URL = import.meta.env.VITE_BASE_URL + '/recipes' || '/recipes';
const BASE_URL = '/recipes';

const getRecipesByListId = async (listId) => {
  const response = await fetch(`${BASE_URL}/${listId}`, {
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

const addRecipe = async (
  name,
  description,
  ingredients,
  instructions,
  category,
  calories,
  recipeListId,
) => {
  const response = await fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      name,
      description,
      ingredients,
      instructions,
      category,
      calories,
      recipeListId
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to add recipe: ', response.message);
  }

  const data = await response.json();
  return data;
}

const getCategories = async () => {
  const response = await fetch(`${BASE_URL}/categories`, {
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

const deleteRecipe = async (recipeId) => {
  const response = await fetch(`${BASE_URL}/${recipeId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to delete recipe: ', response.message);
  }

  const data = await response.json();
  return data;
}

export {
  getRecipesByListId,
  addRecipe,
  getCategories,
  deleteRecipe
};