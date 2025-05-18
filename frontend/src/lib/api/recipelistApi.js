import { makeOption, fetchWithAuth } from "./util.js";

// const BASE_URL = import.meta.env.VITE_BASE_URL + '/recipelists' || '/recipelists';
const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/recipelists` : '/api/recipelists';

const addRecipeList = async (name, userId) => {
  const option = makeOption("POST", { name, userId });
  const response = await fetchWithAuth(`${BASE_URL}`, option);

  if (!response.ok) {
    throw new Error('Failed to add recipe list');
  }

  const data = await response.json();
  return data;
}

const addRecipeToFavoritesRecipeList = async (favoritesListId, recipeId) => {

  const option = makeOption("POST");
  const response = await fetchWithAuth(BASE_URL + "/" + favoritesListId + "/recipe/" + recipeId, option);

  if (!response.ok) {
    throw new Error('Failed to add recipe to stared list');
  }

  const data = await response.json();
  return data;
}

const removeRecipeFromFavoritesList = async (favoritesListId, recipeId) => {
  const option = makeOption("DELETE");
  const response = await fetchWithAuth(BASE_URL + "/" + favoritesListId + "/recipe/" + recipeId, option);

  if (!response.ok) {
    throw new Error('Failed to remove recipe from stared list');
  }

  const data = await response.json();
  return data;
}

const getRecipeListsByUserId = async (userId) => {
  const option = makeOption("GET");
  const response = await fetchWithAuth(`${BASE_URL}/user/${userId}`, option);

  if (!response.ok) {
    throw new Error('Failed to fetch recipe lists');
  }

  const data = await response.json();
  return data;
}

const deleteRecipeList = async (listId) => {
  const option = makeOption("DELETE");
  const response = await fetchWithAuth(`${BASE_URL}/${listId}`, option);

  if (!response.ok) {
    throw new Error('Failed to delete recipe list');
  }

  const data = await response.json();
  return data;
}

const updateRecipeList = async (listId, name, isPrivate) => {
  const option = makeOption("PUT", { name, isPrivate });
  const response = await fetchWithAuth(`${BASE_URL}/${listId}`, option);

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
  deleteRecipeList,
  removeRecipeFromFavoritesList,
  updateRecipeList,
};
export default recipeListApi;

