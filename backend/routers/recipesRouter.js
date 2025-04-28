import { Router } from "express";
import { getCategories } from "../database/recipes/recipes.js";

const router = Router();

router.get("/recipes/categories", async (req, res) => {
  try {
    const categories = await getCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;