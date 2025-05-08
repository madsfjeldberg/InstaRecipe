import { Router } from "express";
import prisma from "../database/prismaClient.js";
import macroService from "../service/macroService.js";

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
  if (!id) {
    return res.status(400).send({ errorMessage: "Recipe id missing in request" })
  }

  try {
    const recipe = await prisma.recipe.findUnique({
      where: {
        id
      },
      include: {
        category: true,
        ingredientsList: true
      }
    })
    res.send({ data: recipe });

  } catch (error) {
    console.error(error)
    res.status(500).send({ errorMessage: "Something went wrong fetching the recipe" })
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
  const { name, description, ingredients, instructions, category, recipeListId } = req.body;

  if (!name || !description || !ingredients || !instructions || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }
  console.log(ingredients);

  const ingredientsWithMacros = await macroService.getMacros(ingredients);
  if(!ingredientsWithMacros.items) {
    ingredientsWithMacros.items = [];
  } 
 
  try {
    const result = await prisma.$transaction( async (transaction) => {
      
      const newRecipe = await transaction.recipe.create({
        data: {
          name,
          description,
          instructions,
          category: { connect: { name: category } },
          recipeLists: { connect: { id: recipeListId } },
        },
        include: {category: true}
      });
  
      const createdIngredients = await Promise.all(
        
        ingredientsWithMacros.items.map( async (ingredient) => {
          return await transaction.ingredient.create({
            data: {
              name: ingredient.name,
              servingSize: ingredient.serving_size_g,
              calories: ingredient.calories,
              protein: ingredient.protein_g,
              fat: ingredient.fat_total_g,
              carbs: ingredient.carbohydrates_total_g,
              recipeId: newRecipe.id
            }
          })
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

      return {recipe: newRecipe, ingredients: createdIngredients};

    })

    res.status(201).json({ status: 201, data: {recipe: result.recipe, ingredients: result.ingredients } });
  } catch (error) {
    console.error(error.message)
    console.error(error)
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
