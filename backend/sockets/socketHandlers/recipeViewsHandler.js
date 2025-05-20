import recipeRepository from '../../repository/recipeRepository.js'

export const recipeViewsHandler = (socket, io) => {

    socket.on("update-recipe-views", async (data) => {
        console.log("Reviced", data)
        if (!data.userId) {
            try {
                const updatedRecipe = await recipeRepository.incrementTotalViews(data.recipeId);
                const totalViews = updatedRecipe.totalViews;
                socket.broadcast.emit("update-recipe-views", { totalViews });

            } catch (error) {
                socket.emit("update-recipe-views-error", error.message);
            }

        } else {

            //update totalviews
            const updatedRecipe = await recipeRepository.incrementTotalViews(data.recipeId);
            const totalViews = updatedRecipe.totalViews;
            socket.broadcast.emit("update-recipe-views", { totalViews });
            
            //update unique views
        }



    })
}
