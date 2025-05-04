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

router.get('/api/recipelists/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const recipeLists = await prisma.recipeList.findMany({
      cacheStrategy: {
        ttl: 30,
        swr: 60
      },
      where: { userId: userId },
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

router.post('/api/recipelists', async (req, res) => {
  console.log('Received request to add recipe list:', req.body);
  const { name, userId } = req.body;
  console.log('Name:', name);
  console.log('User ID:', userId);
  if (!name || !userId) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const recipeList = await prisma.recipeList.create({
      data: {
        name: name,
        userId: userId,
      },
    });
    res.status(201).json({ status: 201, data: recipeList });
  } catch (error) {
    console.error('Error adding recipe list:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;