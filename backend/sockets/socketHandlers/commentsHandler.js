import commentsRepository from "../../repository/commentsRepository.js";

export const commentsHandler = (socket, io) => {
    socket.on("new-comment", async (newComment) => {
        console.log("comment recived:", newComment);

        const postedComment = await commentsRepository.postComment(newComment.userId, newComment.comment, newComment.recipeId);

        socket.broadcast.emit("new-comment", postedComment);
        
        console.log("comment emitted:", postedComment)
    })
}