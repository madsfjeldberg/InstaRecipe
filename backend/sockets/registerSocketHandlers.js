import { commentsHandler } from "./socketHandlers/commentsHandler.js";
import { likeDislikeHandler } from "./socketHandlers/LikeDislikeHandler.js";
import { recipeViewsHandler } from "./socketHandlers/recipeViewsHandler.js";

export const registerSocketHandlers = (io) => {
    
    io.on("connection", (socket) => {

        console.log("A client has connected:", socket.id);

        commentsHandler(socket, io);
        likeDislikeHandler(socket, io);
        recipeViewsHandler(socket, io);

        socket.on("disconnect", () => {
            console.log("A client has disconnected:", socket.id);
        })
    })
}