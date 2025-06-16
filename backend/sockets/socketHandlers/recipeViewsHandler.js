import recipeRepository from '../../repository/recipeRepository.js'

export const recipeViewsHandler = (socket, io) => {

    socket.on("update-recipe-views", async (data) => {
        try {
            const updatedRecipe = await recipeRepository.incrementTotalViews(data.recipeId);
            const totalViews = updatedRecipe.totalViews;
            socket.broadcast.emit("update-recipe-views", { totalViews, recipeId: data.recipeId });

        } catch (error) {
            socket.emit("update-recipe-views-error", error.message);
        }

    })
}
