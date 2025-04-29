import { Router } from "express";
import { getRecipes, addRecipe, getCategories, getRecipesByListId, deleteRecipe } from "../database/recipes/recipes.js";

const router = Router();

router.get("/recipes", async (req, res) => {
  try {
    const recipes = await getRecipes();
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: error.message });
  }
});

router.get("/recipes/categories", async (req, res) => {
  try {
    const categories = await getCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/recipes/:listId", async (req, res) => {
  const { listId } = req.params;

  if (!listId) {
    return res.status(400).json({ message: "List ID is required" });
  }

  try {
    const recipes = await getRecipesByListId(listId);
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: error.message });
  }
});

router.post("/recipes", async (req, res) => {
  const { name, description, ingredients, instructions, category, calories, recipeListId } = req.body;

  if (!name || !description || !ingredients || !instructions || !category || !calories) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Assuming you have a function to add a recipe
    console.log("Adding recipe:", {
      name,
      description,
      ingredients,
      instructions,
      category,
      calories,
      recipeListId,
    });
    const newRecipe = await addRecipe(name, description, ingredients, instructions, category, calories, recipeListId);
    console.log("New recipe added:", newRecipe);
    res.status(201).json({ status: 201, data: newRecipe });
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: error.message });
  }
});

router.post("/recipes/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Recipe ID is required" });
  }
  try {
    await deleteRecipe(id);
    res.status(200).json({ status: 200, message: "Recipe deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
 });

export default router;