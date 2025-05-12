import commentsRepository from "../../repository/commentsRepository.js";

export const commentsHandler = (socket, io) => {
  socket.on("new-comment", async (comment) => {
    const postedComment = await commentsRepository.postComment(comment.userId, comment.comment, comment.recipeId);
    socket.broadcast.emit("new-comment", postedComment);
  })
}