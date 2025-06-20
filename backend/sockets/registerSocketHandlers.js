import { commentsHandler } from './socketHandlers/commentsHandler.js';
import { followersHandler } from './socketHandlers/followersHandler.js';
import { likeDislikeHandler } from './socketHandlers/likeDislikeHandler.js';
import { recipeViewsHandler } from './socketHandlers/recipeViewsHandler.js';

export const registerSocketHandlers = (io) => {
    
    io.on("connection", (socket) => {

        commentsHandler(socket, io);
        likeDislikeHandler(socket, io);
        recipeViewsHandler(socket, io);
        followersHandler(socket, io);

        socket.on("disconnect", () => {})
    })
}
