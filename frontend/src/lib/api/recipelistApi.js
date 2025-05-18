import { makeOption, fetchWithAuth } from "./util.js";

// const BASE_URL = import.meta.env.VITE_BASE_URL + '/recipelists' || '/recipelists';
const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/recipelists` : '/api/recipelists';

const addRecipeList = async (name, userId) => {
  const postOption = makeOption("POST", { name, userId });
  const response = await fetchWithAuth(`${BASE_URL}`, postOption);

  if (!response.ok) {
    throw new Error('Failed to add recipe list');
  }

  const data = await response.json();
  return data;
}

const addRecipeToFavoritesRecipeList = async (favoritesListId, recipeId) => {

  const postOption = makeOption("POST");
  const response = await fetchWithAuth(BASE_URL + "/" + favoritesListId + "/recipe/" + recipeId, postOption);

  if (!response.ok) {
    throw new Error('Failed to add recipe to stared list');
  }

  const data = await response.json();
  return data;
}

const removeRecipeFromFavoritesList = async (favoritesListId, recipeId) => {
  const deleteOption = makeOption("DELETE");
  const response = await fetchWithAuth(BASE_URL + "/" + favoritesListId + "/recipe/" + recipeId, deleteOption);

  if (!response.ok) {
    throw new Error('Failed to remove recipe from stared list');
  }

  const data = await response.json();
  return data;
}

const getRecipeListsByUserId = async (userId) => {
  const response = await fetchWithAuth(`${BASE_URL}/user/${userId}`, {
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

const deleteRecipeList = async (listId) => {
  const response = await fetchWithAuth(`${BASE_URL}/${listId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to delete recipe list');
  }

  const data = await response.json();
  return data;
}

const updateRecipeList = async (listId, name, isPrivate) => {
  const response = await fetchWithAuth(`${BASE_URL}/${listId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ name, isPrivate }),
  });

  if (!response.ok) {
    throw new Error('Failed to update recipe list');
  }

  const data = await response.json();
  return data;
}

const recipeListApi = {
  addRecipeList,
  addRecipeToFavoritesRecipeList,
  getRecipeListsByUserId,
  // getRecipelistByListId,
  deleteRecipeList,
  removeRecipeFromFavoritesList,
  updateRecipeList,
};
export default recipeListApi;

