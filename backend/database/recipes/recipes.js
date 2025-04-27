import { testConnection } from "../db";
import dotenv from 'dotenv';
import Recipe from "../models/Recipe.js";
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

const getRecipesByList = async (list) => {
  testConnection();
  try {
    const recipes = await Recipe.find({ _id: { $in: list } }).lean();
    return recipes;
  } catch (e) {
    throw new Error(`Failed to get recipes by list: ${e.message}`);
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

const addRecipe = async (name, description, ingredients, instructions, category, calories) => {
  testConnection();
  try {
    const recipe = await Recipe.create({
      name: name,
      description: description,
      ingredients: ingredients,
      instructions: instructions,
      category: category,
      calories: calories
    });
    return recipe;
  } catch (e) {
    throw new Error(`Failed to add recipe: ${e.message}`);
  }
}

export { getRecipes, getRecipe, addRecipe };