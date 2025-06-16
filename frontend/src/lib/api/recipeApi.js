import { makeOption, fetchWithAuth, handleResponse } from '../utils/api.js';

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/recipes` : '/api/recipes';

const getAllRecipes = async () => {
  try {
    const response = await fetch(BASE_URL);

    return await handleResponse(response);

  }catch(error) {
    throw error;
  }
}

const getRecipeById = async (id) => {
  try {
    const response = await fetch(BASE_URL + "/" + id);

    return await handleResponse(response);

  }catch(error) {
    console.error(error);
    throw error;
  }
}

const getRecipesByPartialName = async (query) => {
  try{
    const response = await fetch(`${BASE_URL}/?partialName=${query}`);

    return await handleResponse(response);

  }catch(error) {
    throw error;
  }
}

const addRecipe = async (name, description, ingredients, ingredientsInGrams, instructions, servings, category, tags, image, recipeListId) => {
  const recipeToCreate = { name, description, ingredients, ingredientsInGrams, instructions, servings, category, tags, image, recipeListId };

  try {
    const option = makeOption("POST", recipeToCreate)
    const response = await fetchWithAuth(BASE_URL, option);

    return await handleResponse(response);

  }catch(error) {
    throw error;
  }
}

const deleteRecipe = async (recipeId) => {
  try{
    const option = makeOption("DELETE");
    const response = await fetchWithAuth(`${BASE_URL}/${recipeId}`, option);

    return await handleResponse(response);

  }catch(error) {
    throw error;
  }
}

const recipeApi = {
  getAllRecipes,
  getRecipeById,
  getRecipesByPartialName,
  addRecipe,
  deleteRecipe
};

export default recipeApi;
