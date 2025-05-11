import commentsRepository from "../../repository/commentsRepository.js";

export const commentsHandler = (socket, io) => {
    socket.on("new-comment", async (data) => {
        console.log("comment recived");

        const postedComment = await commentsRepository.postComment(data.recipeId, data.commentText);

        io.emit("new-comment", {postedComment});
    })
}