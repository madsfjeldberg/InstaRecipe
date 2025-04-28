import { testConnection } from "../db.js";
import dotenv from 'dotenv';
import Recipe from "../models/Recipe.js";
import { recipeCategories } from "../../util/constants.js";
dotenv.config();

const getRecipes = async () => {
  testConnection();
  try {
    const recipes = await Recipe.find().lean();
    return recipes;
  } catch (e) {
    throw new Error(`Failed to get recipes: ${e.message}`);
  }
}

const getRecipesByListId = async (listId) => {
  testConnection();
  try {
    const recipes = await Recipe.find({ recipeLists: listId }).lean(); // checks if the listId exists in the recipeLists array for each recipe
    if (!recipes) {
      throw new Error(`No recipes found for list id ${listId}`);
    }
    return recipes;
  } catch (e) {
    throw new Error(`Failed to get recipes by list id: ${e.message}`);
  }
}

const getRecipe = async (id) => {
  testConnection();
  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      throw new Error(`Recipe with id ${id} not found.`);
    }
    return recipe;
  }
  catch (e) {
    throw new Error(`Failed to get recipe: ${e.message}`);
  }
}

const addRecipe = async (name, description, ingredients, instructions, category, calories, recipeListId) => {
  testConnection();
  try {
    const recipe = await Recipe.create({
      name: name,
      description: description,
      ingredients: ingredients,
      instructions: instructions,
      category: category,
      calories: calories,
      recipeLists: [recipeListId]
    });
    return recipe;
  } catch (e) {
    throw new Error(`Failed to add recipe: ${e.message}`);
  }
}

const getCategories = async () => {
  testConnection();
  try {
    const categories = recipeCategories;
    return categories;
  } catch (e) {
    throw new Error(`Failed to get categories: ${e.message}`);
  }
}

export { getRecipes, getRecipe, addRecipe, getCategories };