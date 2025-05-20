import { Router } from 'express';

import recipeListRepository from '../repository/recipeListRepository.js';

import prisma from '../database/prismaClient.js';

const router = Router();

// Get all recipe lists for a specific user
router.get("/api/recipelists/user/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
      const recipeLists = await prisma.recipeList.findMany({
        where: { userId: userId },
        include: {
          recipes: {
            include: {
              category: true,
              ingredientsList: true,
              tags: true,
            },
          },
        },
      });
      res.send({ data: recipeLists });

    } catch (error) {
      console.error(error)
      res.status(500).send({ errorMessage: "Could not get all recipe list for user" });
    }
  }
);

router.post("/api/recipelists", async (req, res) => {
  const { name, userId } = req.body;
  if (!name || !userId) {
    return res.status(400).send({ errorMessage: "All fields are required" });
  }

  try {
    const recipeList = await prisma.recipeList.create({
      data: {
        name: name,
        userId: userId,
      },
      include: {
        recipes: true,
      },
    });

    res.send({ data: recipeList });
  } catch (error) {
    console.error("Error adding recipe list:", error);
    res.status(500).send({ errorMessage: "Server error. Error creating recipe list." });
  }
});

router.post("/api/recipelists/:listId/recipe/:recipeId", async (req, res) => {
  try {
    const updatedList = await recipeListRepository.addRecipeToFavoritesList(req.params.listId, req.params.recipeId);
    res.send({ data: updatedList });

  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: "Server Error. Error adding recipe to stared list" });
  }  
});

router.put("/api/recipelists/:listId", async (req, res) => {
  const { listId } = req.params;
  const { name, isPrivate } = req.body;

  if (!listId || !name || isPrivate === undefined) {
    return res.status(400).send({ errorMessage: "List ID, name, and visibility are required" });
  }

  try {
    const updatedRecipeList = await prisma.recipeList.update({
      where: { id: listId },
      data: { name, isPrivate },
      include: {
        recipes: true
      }
    });

    res.send({ data: updatedRecipeList });
  } catch (error) {
    console.error("Error updating recipe list:", error);
    res.status(500).send({ errorMessage: "Could not update name/privacy settings on recipe list with id: " + listId });
  }
});

router.delete("/api/recipelists/:listId/recipe/:recipeId", async (req, res) => {
  try {
    const updatedList = await recipeListRepository.removeRecipeFromStaredList(req.params.listId, req.params.recipeId);
    res.send({ data: updatedList });

  } catch (error) {
    console.error(error);
    res.status(500).send({errorMessage: "Server Error. Error removing recipe from favorites list" });
  }
});

router.delete("/api/recipelists/:listId", async (req, res) => {
  const { listId } = req.params;
  if (!listId) {
    return res.status(400).send({ errorMessage: "List ID is required" });
  }

  try {
    await prisma.recipe.deleteMany({
      where: {
        recipeLists: {
          some: { id: listId },
        },
      },
    });

    const deletedRecipeList = await prisma.recipeList.delete({
      where: { id: listId },
    });

    res.send({ data: deletedRecipeList });
    
  } catch (error) {
    console.error("Error deleting recipe list:", error);
    res.status(500).send({ errorMessage: "Could not delete recipe list along with the recipes" });
  }
});

export default router;
