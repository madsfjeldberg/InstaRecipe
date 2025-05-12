import { Router } from 'express';

import prisma from '../database/prismaClient.js';

const router = Router();

router.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      cacheStrategy: {
        ttl: 3600,
      }
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;