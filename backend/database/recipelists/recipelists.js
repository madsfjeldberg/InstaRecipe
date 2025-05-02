import { testConnection } from '../db.js';
import 'dotenv/config';
import RecipeList from "../models/RecipeList.js";

const getRecipeLists = async () => {
  testConnection();
  try {
    const recipeLists = await RecipeList.find().lean();
    return recipeLists;
  } catch (e) {
    throw new Error(`Failed to get recipe lists: ${e.message}`);
  }
}

const getRecipeListsByUserId = async (userId) => {
  testConnection();
  try {
    const recipeLists = await RecipeList.find({ userId: userId }).lean();
    return recipeLists;
  } catch (e) {
    throw new Error(`Failed to get recipe lists by user: ${e.message}`);
  }
}

const getRecipeList = async (id) => {
  testConnection();
  try {
    const recipeList = await RecipeList.findById(id).lean();
    if (!recipeList) {
      throw new Error(`Recipe list with id ${id} not found.`);
    }
    return recipeList;
  }
  catch (e) {
    throw new Error(`Failed to get recipe list: ${e.message}`);
  }
}

const addRecipeList = async (name, userId) => {
  testConnection();
  try {
    const recipeList = await RecipeList.create({
      name: name,
      userId: userId,
      recipes: []
    });
    return recipeList;
  } catch (e) {
    throw new Error(`Failed to add recipe list: ${e.message}`);
  }
}

export { getRecipeLists, getRecipeListsByUserId, getRecipeList, addRecipeList };