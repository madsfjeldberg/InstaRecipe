import likeDislikeRepository from '../../repository/likeDislikeRepository.js';



export const likeDislikeHandler = (socket, io) => { // Use 'io' to emit to all

  socket.on("toggle-like", async (data) => {
    const { userId, recipeId } = data;
    
    try {
      const recipe = await likeDislikeRepository.toggleLike(userId, recipeId);
      socket.broadcast.emit("update-like-dislike", recipe);
    
    } catch (error) {
      console.error("Error toggling like:", error);
      socket.emit("like-dislike-error", { message: "Error toggling like" }); // Send specific error
    }
  });



  socket.on("toggle-dislike", async (data) => {
    const { userId, recipeId } = data;

    try {
      const recipe = await likeDislikeRepository.toggleDislike(userId, recipeId);
      socket.broadcast.emit("update-like-dislike", recipe);
    
    } catch (error) {
      console.error("Error toggling dislike:", error);
      socket.emit("like-dislike-error", { message: "Error toggling dislike" }); // Send specific error
    }
  });
}
