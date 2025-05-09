import prisma from "../database/prismaClient.js";

const createStaredList = async (userId) => {
    try {
        const staredList = await prisma.recipeList.create({
            data: {
                name: "Stared",
                userId: userId
            }
        })
        return staredList;

    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}



const addRecipeToStaredList = async (recipeListId, recipeId) => {
    try {
        const updatedList = await prisma.recipeList.update({
            where: { id: recipeListId },
            data: {
                recipes: {
                    connect: { id: recipeId }
                }
            },
            include: {
                recipes: true
            }
        });
        return updatedList;

    } catch (error) {
        console.error(error);
        throw new Error(error.message)
    }
}

export default { createStaredList, addRecipeToStaredList }