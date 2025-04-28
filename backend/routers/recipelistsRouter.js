import { Router } from 'express';
import { getRecipeLists, getRecipeListsByUserId, getRecipeList, addRecipeList } from '../database/recipelists/recipelists.js';

const router = Router();

router.get('/recipelists', async (req, res) => {
  try {
    const recipeLists = await getRecipeLists();
    res.status(200).json(recipeLists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/recipelists/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const recipeLists = await getRecipeListsByUserId(userId);
    res.status(200).json(recipeLists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/recipelists', async (req, res) => {
  console.log('Received request to add recipe list:', req.body);
  const { name, userId } = req.body;
  if (!name || !userId) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const recipeList = await addRecipeList(name, userId);
    res.status(201).json({ status: 201, data: recipeList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;