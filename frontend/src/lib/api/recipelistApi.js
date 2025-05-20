import { makeOption, fetchWithAuth } from "../utils/util.js";

// const BASE_URL = import.meta.env.VITE_BASE_URL + '/recipelists' || '/recipelists';
const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/recipelists` : '/api/recipelists';

const getRecipeListsByUserId = async (userId) => {
  try {
    const option = makeOption("GET");
    const response = await fetchWithAuth(`${BASE_URL}/user/${userId}`, option);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.errorMessage);
    }
  
    return result.data;
  
  }catch(error) {
    throw error;
  }
}

const addRecipeList = async (name, userId) => {
  try{
    const option = makeOption("POST", { name, userId });
    const response = await fetchWithAuth(BASE_URL, option);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.errorMessage);
    }
    
    return result.data;

  }catch(error) {
    throw error;
  }
}

const addRecipeToFavoritesRecipeList = async (favoritesListId, recipeId) => {
  try {
    const option = makeOption("POST");
    const response = await fetchWithAuth(BASE_URL + "/" + favoritesListId + "/recipe/" + recipeId, option);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.errorMessage);
    }
    
    return result.data;
    
  }catch(error) {
    throw error;
  }
}

const updateRecipeList = async (listId, name, isPrivate) => {
  try{
    const option = makeOption("PUT", { name, isPrivate });
    const response = await fetchWithAuth(`${BASE_URL}/${listId}`, option);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.errorMessage);
    }
    
    return result.data;

  }catch(error) {
    throw error;
  }
}

const removeRecipeFromFavoritesList = async (favoritesListId, recipeId) => {
  try{
    const option = makeOption("DELETE");
    const response = await fetchWithAuth(BASE_URL + "/" + favoritesListId + "/recipe/" + recipeId, option);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.errorMessage);
    }
    
    return result.data;

  }catch(error) {
    throw error;
  }
}


const deleteRecipeList = async (listId) => {
  try {
    const option = makeOption("DELETE");
    const response = await fetchWithAuth(`${BASE_URL}/${listId}`, option);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.errorMessage);
    }
    
    return result.data;

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
