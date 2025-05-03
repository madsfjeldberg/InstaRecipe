import { Router } from "express";

import prisma from "../database/prismaClient.js";

const router = Router();

router.get("/api/recipes", async (req, res) => {
  try {
    const recipes = await prisma.recipe.findMany();
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: error.message });
  }
});

router.get("/api/recipes/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/api/recipes/:listId", async (req, res) => {
  const { listId } = req.params;
  console.log("List ID:", listId);

  if (!listId) {
    return res.status(400).json({ message: "List ID is required" });
  }

  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        recipeLists: {
          some: { id: listId }
        }
      },
      include: {
        categories: true,
        recipeLists: true, // use recipeLists, not recipeList
      },
    });
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: error.message });
  }
});

router.post("/api/recipes", async (req, res) => {
  const { name, description, ingredients, instructions, category, calories, recipeListId } = req.body;

  if (!name || !description || !ingredients || !instructions || !category || !calories) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newRecipe = await prisma.recipe.create({
      data: {
        name,
        description,
        ingredients,
        instructions,
        categories,
        calories,
        recipeListId,
      },
    });
    console.log("New recipe added:", newRecipe);
    res.status(201).json({ status: 201, data: newRecipe });
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: error.message });
  }
});

router.delete("/api/recipes/:id", async (req, res) => {
  const { id } = req.params;
  console.log("ID:", id);

  if (!id) {
    return res.status(400).json({ message: "Recipe ID is required" });
  }
  try {
    await prisma.recipe.delete({
      where: { id: id },
    });
    res.status(200).json({ status: 200, message: "Recipe deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
 });

export default router;
