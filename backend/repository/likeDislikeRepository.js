import prisma from '../database/prismaClient.js';



const toggleLike = async (userId, recipeId) => {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    select: { likes: true, dislikes: true },
  });

  if (!recipe) throw new Error("Recipe not found");
  const likesSet = new Set(recipe.likes);
  const dislikesSet = new Set(recipe.dislikes);

  if (likesSet.has(userId)) {
    likesSet.delete(userId);

  } else {
    likesSet.add(userId);
    dislikesSet.delete(userId);
  }

  const updatedRecipeLike = await prisma.recipe.update({
    where: { id: recipeId },
    data: {
      likes: Array.from(likesSet),
      dislikes: Array.from(dislikesSet),
    },
  });
  return updatedRecipeLike;
};



const toggleDislike = async (userId, recipeId) => {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    select: { likes: true, dislikes: true },
  });

  if (!recipe) throw new Error("Recipe not found");
  const likesSet = new Set(recipe.likes);
  const dislikesSet = new Set(recipe.dislikes);

  if (dislikesSet.has(userId)) {
    dislikesSet.delete(userId);

  } else {
    dislikesSet.add(userId);
    likesSet.delete(userId);
  }

  const updatedDislikeRecipe = await prisma.recipe.update({
    where: { id: recipeId },
    data: {
      likes: Array.from(likesSet),
      dislikes: Array.from(dislikesSet),
    },
  });
  return updatedDislikeRecipe;
};



export default { toggleLike, toggleDislike };
