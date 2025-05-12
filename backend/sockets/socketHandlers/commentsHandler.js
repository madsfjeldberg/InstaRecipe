import commentsRepository from "../../repository/commentsRepository.js";

export const commentsHandler = (socket, io) => {
    socket.on("new-comment", async (newComment) => {
        console.log("comment recived:", newComment);

        const postedComment = await commentsRepository.postComment(newComment.userId, newComment.comment, newComment.recipeId);
        socket.broadcast.emit("new-comment", postedComment);
        
        console.log("comment emitted:", postedComment)
    })



    socket.on("new-comment-reply", async (newReply) => {
        console.log("reply recived:", newReply);

        const postedCommentReply = await commentsRepository.postCommentReply(newReply.userId, newReply.comment, newReply.recipeId, newReply.commentParentId);
        socket.broadcast.emit("new-comment-reply", postedCommentReply);
        
        console.log("reply emitted:", postedCommentReply);
    })
}