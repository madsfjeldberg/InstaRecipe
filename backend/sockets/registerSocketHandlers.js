import { commentsHandler } from "./socketHandlers/commentsHandler.js";
import { likeDislikeHandler } from "./socketHandlers/LikeDislikeHandler.js";

export const registerSocketHandlers = (io) => {
    
    io.on("connection", (socket) => {

        console.log("A client has connected:", socket.id);

        commentsHandler(socket, io);
        likeDislikeHandler(socket, io);

        socket.on("disconnect", () => {
            console.log("A client has disconnected:", socket.id);
        })
    })
}