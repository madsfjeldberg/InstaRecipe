import { makeOption, fetchWithAuth, handleResponse } from '../utils/api.js';

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/recipelists` : '/api/recipelists';

const getRecipeListsByUserId = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/user/${userId}`);
    
    return await handleResponse(response);
  
  }catch(error) {
    throw error;
  }
}

const addRecipeList = async (name, userId) => {
  try{
    const option = makeOption("POST", { name, userId });
    const response = await fetchWithAuth(BASE_URL, option);
    
    return await handleResponse(response);

  }catch(error) {
    throw error;
  }
}

const addRecipeToFavoritesRecipeList = async (favoritesListId, recipeId) => {
  try {
    const option = makeOption("PATCH", {recipeId});
    const response = await fetchWithAuth(BASE_URL + "/" + favoritesListId, option);
    
    return await handleResponse(response);
    
  }catch(error) {
    throw error;
  }
}

const updateRecipeList = async (listId, name, isPrivate) => {
  try{
    const option = makeOption("PUT", { name, isPrivate });
    const response = await fetchWithAuth(`${BASE_URL}/${listId}`, option);
    
    return await handleResponse(response);

  }catch(error) {
    throw error;
  }
}

const removeRecipeFromFavoritesList = async (favoritesListId, recipeId) => {
  try{
    const option = makeOption("DELETE");
    const response = await fetchWithAuth(BASE_URL + "/" + favoritesListId + "/recipe/" + recipeId, option);
    
    return await handleResponse(response);

  }catch(error) {
    throw error;
  }
}


const deleteRecipeList = async (listId) => {
  try {
    const option = makeOption("DELETE");
    const response = await fetchWithAuth(`${BASE_URL}/${listId}`, option);
    
    return await handleResponse(response);

  }catch(error) {
    throw error;
  }
}


const recipeListApi = {
  getRecipeListsByUserId,
  addRecipeList,
  addRecipeToFavoritesRecipeList,
  updateRecipeList,
  removeRecipeFromFavoritesList,
  deleteRecipeList,
};

export default recipeListApi;
