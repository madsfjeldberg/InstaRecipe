import prisma from '../database/prismaClient.js';

const getRecipeById = async (recipeId) => {
    try {
        const foundRecipe = await prisma.recipe.findUnique({
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
        return foundRecipe;

    } catch (error) {
        console.error(error);
        throw new Error("Could not get recipe with id:", recipeId);
    }
}



const getAllLikedRecipesByUserId = async (userId) => {
    try {
        const likedRecipes = await prisma.recipe.findMany({
            where: {
                likes: {
                    has: {
                        userId
                    }
                }
            }
        });
        return likedRecipes;

    } catch (error) {
        throw error;
    }
}



const getAllDislikedRecipesByUserId = async (userId) => {
    try {
        const likedRecipes = await prisma.recipe.findMany({
            where: {
                dislikes: {
                    has: {
                        userId
                    }
                }
            }
        });
        return likedRecipes;

    } catch (error) {
        throw error;
    }
}



const incrementTotalViews = async (recipeId) => {
    try {
        const updatedRecipe = prisma.recipe.update({
            where: {
                id: recipeId
            },
            data: {
                totalViews: {
                    increment: 1
                }
            }
        });
        return updatedRecipe;

    } catch (error) {
        console.error(error);
        throw new Error("Could not increment total views for recipe with id:", recipeId);
    }
}



export default {
    getRecipeById,
    getAllLikedRecipesByUserId,
    getAllDislikedRecipesByUserId,
    incrementTotalViews
}
