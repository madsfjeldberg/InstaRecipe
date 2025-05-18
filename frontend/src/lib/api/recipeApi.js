import { makeOption, fetchWithAuth } from "./util";

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/recipes` : '/api/recipes';

const getAllRecipes = async () => {
  const option = makeOption("GET");
  const response = await fetchWithAuth(BASE_URL, option);
  const result = await response.json();
  return result;
}

const getRecipeById = async (id) => {
  try {
    const option = makeOption("GET");
    const response = await fetchWithAuth(BASE_URL + "/" + id, option);
    const result = await response.json();
    return result.data;

  }catch(error) {
    console.error(error);
    throw new Error('Failed to add recipe: ', error.message);
  }
}

const getRecipesByPartialName = async (query) => {
  const option = makeOption("GET");
  const response = await fetchWithAuth(`${BASE_URL}/?partialName=${query}`, option);
  const result = await response.json();
  return result;
}

const addRecipe = async (
  name,
  description,
  ingredients,
  ingredientsInGrams,
  instructions,
  category,
  tags,
  image,
  recipeListId,
) => {

  const recipeToCreate = { name, description, ingredients, ingredientsInGrams, instructions, category, tags, image, recipeListId };

  const option = makeOption("POST", recipeToCreate)
  const response = await fetch(BASE_URL, option);

  if (!response.ok) {
    throw new Error('Failed to add recipe: ', response.message);
  }

  const data = await response.json();
  return data;
}

const deleteRecipe = async (recipeId) => {
  const option = makeOption("DELETE");
  const response = await fetchWithAuth(`${BASE_URL}/${recipeId}`, option);

  if (!response.ok) {
    throw new Error('Failed to delete recipe: ', response.message);
  }

  const data = await response.json();
  return data;
}

const recipeApi = {
  getAllRecipes,
  getRecipeById,
  getRecipesByPartialName,
  addRecipe,
  deleteRecipe
};

export default recipeApi;