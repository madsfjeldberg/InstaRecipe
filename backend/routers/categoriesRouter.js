import { Router } from 'express';

import prisma from '../database/prismaClient.js';

const router = Router();

router.get("/api/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      cacheStrategy: {
        ttl: 3600,
      }
    });
    res.send( {data: categories});
  } catch (error) {
    res.status(500).send({ errorMessage: "Could not retrieve the categories from database." });
  }
});

export default router;
