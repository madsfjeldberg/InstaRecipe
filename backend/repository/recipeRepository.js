import prisma from "../database/prismaClient.js";

const getRecipeById = async (recipeId) => {
    try{
        const foundRecipe = await prisma.recipe.findUnique({
            where: {
                id: recipeId
            }
        })
        return foundRecipe;

    }catch(error) {
        console.error(error);
        throw new Error("Could not get recipe with id:", recipeId);
    }
}



const incrementTotalViews = async (recipeId) => {
    try{
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

    }catch(error) {
        console.error(error);
        throw new Error("Could not increment total views for recipe with id:", recipeId);
    }
}



export default { getRecipeById, incrementTotalViews }
