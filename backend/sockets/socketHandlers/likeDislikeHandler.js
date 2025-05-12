import likeDislikeRepository from "../../repository/likeDislikeRepository.js";

// all of these emit the same event "update-like-dislike" to the client
// containg a recipe object
// we can use the same socket.on in the frontend to listen to all of them
export const likeDislikeHandler = (socket, io) => {

  socket.on("add-like", async (data) => {
    console.log("like received:", data);
    const { userId, recipeId } = data;
    try {
      const recipe = await likeDislikeRepository.like(userId, recipeId);
      socket.broadcast.emit("update-like-dislike", recipe);
    } catch (error) {
      console.error("Error adding like:", error);
      socket.broadcast.emit("error", "Error adding like");
    }
  });

  socket.on("add-dislike", async (data) => {
    console.log("dislike received:", data);
    const { userId, recipeId } = data;
    try {
      const recipe = await likeDislikeRepository.dislike(userId, recipeId);
      socket.broadcast.emit("update-like-dislike", recipe);
    } catch (error) {
      console.error("Error adding dislike:", error);
      socket.broadcast.emit("error", "Error adding dislike");
    }
  });

  socket.on("remove-like", async (data) => {
    console.log("like removed:", data);
    const { userId, recipeId } = data;
    try {
      const recipe = await likeDislikeRepository.removeLike(userId, recipeId);
      socket.broadcast.emit("update-like-dislike", recipe);
    } catch (error) {
      console.error("Error removing like:", error);
      socket.broadcast.emit("error", "Error removing like");
    }
  });

  socket.on("remove-dislike", async (data) => {
    console.log("dislike removed:", data);
    const { userId, recipeId } = data;
    try {
      const recipe = await likeDislikeRepository.removeDislike(userId, recipeId);
      socket.broadcast.emit("update-like-dislike", recipe);
    } catch (error) {
      console.error("Error removing dislike:", error);
      socket.broadcast.emit("error", "Error removing dislike");
    }
  });
}