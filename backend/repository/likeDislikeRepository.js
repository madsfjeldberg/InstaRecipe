import prisma from "../database/prismaClient.js"

const like = async (userId, recipeId) => {
  let recipe = await prisma.recipe.findUnique({
    where: {
      id: recipeId,
    },
  });
  recipe.likes.push(userId);
  if (recipe.dislikes.includes(userId)) {
    recipe.dislikes = recipe.dislikes.filter((id) => id !== userId);
  }
  await prisma.recipe.update({
    where: {
      id: recipeId,
    },
    data: {
      likes: recipe.likes,
      dislikes: recipe.dislikes,
    },
  });
  return recipe;
}

const dislike = async (userId, recipeId) => {
  let recipe = await prisma.recipe.findUnique({
    where: {
      id: recipeId,
    },
  });
  recipe.dislikes.push(userId);
  if (recipe.likes.includes(userId)) {
    recipe.likes = recipe.likes.filter((id) => id !== userId);
  }
  await prisma.recipe.update({
    where: {
      id: recipeId,
    },
    data: {
      likes: recipe.likes,
      dislikes: recipe.dislikes,
    },
  });
  return recipe;
}

const removeLike = async (userId, recipeId) => {
  let recipe = await prisma.recipe.findUnique({
    where: {
      id: recipeId,
    },
  });
  recipe.likes = recipe.likes.filter((id) => id !== userId);
  await prisma.recipe.update({
    where: {
      id: recipeId,
    },
    data: {
      likes: recipe.likes,
    },
  });
  return recipe;
}

const removeDislike = async (userId, recipeId) => {
  let recipe = await prisma.recipe.findUnique({
    where: {
      id: recipeId,
    },
  });
  recipe.dislikes = recipe.dislikes.filter((id) => id !== userId);
  await prisma.recipe.update({
    where: {
      id: recipeId,
    },
    data: {
      dislikes: recipe.dislikes,
    },
  });
  return recipe;
}

export default {
  like,
  dislike,
  removeLike,
  removeDislike
};