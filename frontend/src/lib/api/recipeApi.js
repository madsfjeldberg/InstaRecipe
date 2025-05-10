import { makeOption } from "./util";

// const BASE_URL = import.meta.env.VITE_BASE_URL + '/recipes' || '/recipes';
const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/recipes` : '/api/recipes';


const getRecipeById = async (id) => {
  try {
    const getOption = makeOption("GET");
    const response = await fetch(BASE_URL + "/" + id, getOption);
    const result = await response.json();
    return result.data;

  }catch(error) {
    console.error(error);
    throw new Error('Failed to add recipe: ', error.message);
  }
}


//TODO before adding calling the post retrieve the macros first and then add these to the body of the post request.
const addRecipe = async (
  name,
  description,
  ingredients,
  instructions,
  category,
  tags,
  image,
  recipeListId,
) => {

  const recipeToCreate = { name, description, ingredients, instructions, category, tags, image, recipeListId };

  const postOption = makeOption("POST", recipeToCreate)
  const response = await fetch(BASE_URL, postOption);

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
  console.log("Categories:", data);
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
  getRecipeById,
  addRecipe,
  getCategories,
  deleteRecipe
};