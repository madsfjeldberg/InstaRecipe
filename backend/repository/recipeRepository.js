import prisma from '../database/prismaClient.js';



const getAllRecipes = async () => {
    try {
        const foundRecipes = await prisma.recipe.findMany({
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
        return foundRecipes;

    } catch (error) {
        throw error;
    }
}



const getRecipesByPartialSearch = async (partialName) => {
    try {
        const foundRecipes = await prisma.recipe.findMany({
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
        return foundRecipes;

    } catch (error) {
        throw error;
    }
}



const getRecipeById = async (recipeId) => {
    try {
        const foundRecipe = await prisma.recipe.findUnique({
            where: {
                id: recipeId
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



const getLikedDislikedRecipesHistoryOnUserId = async (userId) => {
    try {
        const likedDislikedRecipesHistory = await prisma.recipe.findMany({
            where: {
                OR: [
                    {
                        likes: {
                            has: userId
                        }
                    },
                    {
                        dislikes: {
                            has: userId
                        }
                    }
                ]
            }
        });
        return likedDislikedRecipesHistory;

    } catch (error) {
        console.error("Error fetching liked/disliked history:", error);
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
    getAllRecipes,
    getRecipesByPartialSearch,
    getRecipeById,
    getLikedDislikedRecipesHistoryOnUserId,
    incrementTotalViews
}
