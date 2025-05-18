import { Router } from "express";
import prisma from "../database/prismaClient.js";
import macroService from "../service/macroService.js";
import authMiddleware from "../middleware/authMiddleware.js";
import b2 from "../service/b2FileUploadService.js";

const router = Router();

router.get("/api/recipes", authMiddleware.authenticateToken, async (req, res) => {
  const { partialName } = req.query;

  if (partialName) {
    try {
      const recipes = await prisma.recipe.findMany({
        where: {
          name: {
            contains: partialName,
            mode: "insensitive",
          },
          recipeLists: {
            some: {
              isPrivate: false,
            },
          },
        },
      });
      return res.status(200).json(recipes);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
  } else {
    try {
      const recipes = await prisma.recipe.findMany({
        where: {
          recipeLists: {
            some: {
              isPrivate: false,
            },
          },
        },
        include: {
          category: true,
          tags: true,
          ingredientsList: true,
          recipeLists: true,
        },
        orderBy: {
          likes: "desc",
        },
      });
      res.status(200).json(recipes);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
  }
});

router.get("/api/recipes/:id", authMiddleware.authenticateToken, async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res
      .status(400)
      .send({ errorMessage: "Recipe id missing in request" });
  }

  try {
    const recipe = await prisma.recipe.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        tags: true,
        ingredientsList: true,
        comments: {
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    res.send({ data: recipe });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ errorMessage: "Something went wrong fetching the recipe" });
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
    return res.status(400).json({ message: "All fields are required" });
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

    res
      .status(201)
      .json({
        status: 201,
        data: { recipe: result.recipe, ingredients: result.ingredients },
      });
  } catch (error) {
    console.error(error.message);
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/api/recipes/:id", authMiddleware.authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Recipe ID is required" });
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
    res
      .status(200)
      .json({ status: 200, message: "Recipe deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

export default router;
