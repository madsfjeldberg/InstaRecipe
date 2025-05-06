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



router.get("/api/recipes/:id", async (req, res) => {
  const id = req.params.id;
  if(!id) {
    return res.status(400).send({ errorMessage: "Recipe id missing in request"})
  }

  try{
    const recipe = await prisma.recipe.findUnique({
      where: {
        id
      }
    })
    res.send({ data: recipe});

  }catch(error) {
    res.status(500).send({errorMessage: "Something went wrong fetching the recipe"})
  }
})



router.get("/api/recipes/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
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
        category: { connect: { name: category } },
        calories,
        recipeLists: { connect: { id: recipeListId } },
      },
    });
    // add recipe to the recipe list
    await prisma.recipeList.update({
      where: { id: recipeListId },
      data: {
        recipes: {
          connect: { id: newRecipe.id },
        },
      },
    });
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
