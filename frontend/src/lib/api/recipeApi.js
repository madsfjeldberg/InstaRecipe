import { makeOption, fetchWithAuth, ifResponseOk } from '../utils/util';

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/recipes` : '/api/recipes';

const getAllRecipes = async () => {
  try {
    const option = makeOption("GET");
    const response = await fetchWithAuth(BASE_URL, option);

    return await ifResponseOk(response);

  }catch(error) {
    throw error;
  }
}

const getRecipeById = async (id) => {
  try {
    const option = makeOption("GET");
    const response = await fetchWithAuth(BASE_URL + "/" + id, option);

    return await ifResponseOk(response);

  }catch(error) {
    console.error(error);
    throw error;
  }
}

const getRecipesByPartialName = async (query) => {
  try{
    const option = makeOption("GET");
    const response = await fetchWithAuth(`${BASE_URL}/?partialName=${query}`, option);

    return await ifResponseOk(response);

  }catch(error) {
    throw error;
  }
}

const addRecipe = async (name, description, ingredients, ingredientsInGrams, instructions, category, tags, image, recipeListId) => {
  const recipeToCreate = { name, description, ingredients, ingredientsInGrams, instructions, category, tags, image, recipeListId };

  try {
    const option = makeOption("POST", recipeToCreate)
    const response = await fetch(BASE_URL, option);

    return await ifResponseOk(response);

  }catch(error) {
    throw error;
  }
}

const deleteRecipe = async (recipeId) => {
  try{
    const option = makeOption("DELETE");
    const response = await fetchWithAuth(`${BASE_URL}/${recipeId}`, option);

    return await ifResponseOk(response);

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
