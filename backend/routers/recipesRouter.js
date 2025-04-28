import { Router } from "express";
import { addRecipe, getCategories } from "../database/recipes/recipes.js";

const router = Router();

router.get("/recipes/categories", async (req, res) => {
  try {
    const categories = await getCategories();
    res.status(200).json(categories);
  } catch (error) {
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
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: error.message });
  }
});

export default router;