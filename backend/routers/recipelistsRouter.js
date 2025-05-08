import { Router } from 'express';

import prisma from '../database/prismaClient.js';

const router = Router();

router.get('/api/recipelists', async (req, res) => {
  try {
    const recipeLists = await prisma.recipeList.findMany({
      include: {
        recipes: true,
        user: true,
      },
    });
    res.status(200).json(recipeLists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/api/recipelists/:listId", async (req, res) => {
  const { listId } = req.params;

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
        category: true,
        recipeLists: true, // use recipeLists, not recipeList
      },
    });
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: error.message });
  }
});

// Get all recipe lists for a specific user
router.get('/api/recipelists/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const recipeLists = await prisma.recipeList.findMany({
      where: { userId: userId },
      include: {
        recipes: {
          include: {
            category: true,
            ingredientsList: true
          },
        },
      },
    });
    res.status(200).json(recipeLists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/api/recipelists', async (req, res) => {
  console.log('Received request to add recipe list:', req.body);
  const { name, userId } = req.body;
  console.log('Name:', name);
  console.log('User ID:', userId);
  if (!name || !userId) {
    return res.status(400).send({ message: 'All fields are required' });
  }
  try {
    const recipeList = await prisma.recipeList.create({
      data: {
        name: name,
        userId: userId,
      },
      include: {
        recipes: true
      }
    });

    res.status(201).send({ status: 201, data: recipeList });
  } catch (error) {
    console.error('Error adding recipe list:', error);
    res.status(500).send({ message: error.message });
  }
});

router.delete('/api/recipelists/:listId', async (req, res) => {
  const { listId } = req.params;
  if (!listId) {
    return res.status(400).send({ errorMessage: 'List ID is required' });
  }
  try {
    await prisma.recipe.deleteMany({
      where: {
        recipeLists: {
          some: { id: listId }
        }
      }
    });

    const deletedRecipeList = await prisma.recipeList.delete({
      where: { id: listId },
    });
    res.status(200).send({ status: 200, data: deletedRecipeList });
  } catch (error) {
    console.error('Error deleting recipe list:', error);
    res.status(500).send({ message: error.message });
  }
});

export default router;