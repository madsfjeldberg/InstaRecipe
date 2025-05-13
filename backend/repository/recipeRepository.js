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

export default { getRecipeById }
