import { Router } from 'express';

import authMiddleware from '../middleware/authMiddleware.js';

import macroService from '../service/macroService.js';
import b2 from '../service/b2FileUploadService.js';

import prisma from '../database/prismaClient.js';
import recipeRepository from '../repository/recipeRepository.js';

const router = Router();

router.get("/api/recipes", async (req, res) => {
  const { partialName } = req.query;

  try {
    let foundRecipes;

    if (partialName) {
      foundRecipes = await recipeRepository.getRecipesByPartialSearch(partialName);

    } else {
      foundRecipes = await recipeRepository.getAllRecipes();
    }

    res.send({ data: foundRecipes });
    
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ errorMessage: "Something went wrong getting recipes." });
  }
});

router.get("/api/recipes/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).send({ errorMessage: "Recipe id missing in request" });
  }

  try {
    const foundRecipe = await recipeRepository.getRecipeById(id);

    if (!foundRecipe) {
      return res.status(404).send({ errorMessage: "No recipe found with that id." });
    }

    res.send({ data: foundRecipe });

  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: "Something went wrong fetching the recipe" });
  }
});

router.get("/api/recipes/users/:id", authMiddleware.authenticateToken, (req, res) => {
  if (!req.params.id) {
    return res.status(404).send({ errorMessage: "No liked recipes found" });
  }
})

router.post("/api/recipes", authMiddleware.authenticateToken, async (req, res) => {
  const {
    name,
    description,
    ingredients,
    ingredientsInGrams,
    instructions,
    category,
    tags,
    image,
    recipeListId,
  } = req.body;
  if (
    !name ||
    !description ||
    !ingredients ||
    !instructions ||
    !category ||
    !tags
  ) {
    return res.status(400).send({ errorMessage: "All fields are required" });
  }

  const ingredientsWithMacros =
    await macroService.getMacros(ingredientsInGrams);

  try {
    const result = await prisma.$transaction(async (transaction) => {
      const newRecipe = await transaction.recipe.create({
        data: {
          name,
          description,
          ingredients,
          instructions,
          category: { connect: { name: category } },
          tags: { connect: tags.map((tag) => ({ name: tag })) },
          recipeLists: { connect: { id: recipeListId } },
          image,
        },
        include: {
          category: true,
          tags: true,
          comments: true,
        },
      });

      const createdIngredients = await Promise.all(
        ingredientsWithMacros.map(async (ingredient) => {
          return await transaction.ingredient.create({
            data: {
              name: ingredient.name,
              servingSize: ingredient.servingSize,
              calories: ingredient.calories,
              protein: ingredient.protein,
              fat: ingredient.fat,
              carbs: ingredient.carbs,
              recipeId: newRecipe.id,
            },
          });
        })
      );

      await transaction.recipeList.update({
        where: { id: recipeListId },
        data: {
          recipes: {
            connect: { id: newRecipe.id },
          },
        },
      });

      return { recipe: newRecipe, ingredients: createdIngredients };
    });

    res.send({ data: { recipe: result.recipe, ingredients: result.ingredients } });

  } catch (error) {
    console.error(error.message);
    console.error(error);
    res.status(500).send({ errorMessage: "Could not save the recipe in database" });
  }
});

router.delete("/api/recipes/:id", authMiddleware.authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({ errorMessage: "Recipe ID is required" });
  }

  try {
    await prisma.ingredient.deleteMany({
      where: {
        recipeId: id,
      },
    });

    await prisma.comment.deleteMany({
      where: {
        recipeId: id,
      },
    });

    let recipe = await prisma.recipe.delete({
      where: { id: id },
    });

    let imageurl = recipe.image;
    if (imageurl) {
      const fileName = imageurl.split("/").pop();
      await b2.deleteFile(fileName);
    }
    res.send({ data: {} });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ errorMessage: "Could not delete recipe, server error" });
  }
});

export default router;
