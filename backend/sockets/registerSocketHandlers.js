import { commentsHandler } from "./socketHandlers/commentsHandler.js";

export const registerSocketHandlers = (io) => {
    
    io.on("connection", (socket) => {

        console.log("A client has connected:", socket.id);

        commentsHandler(socket, io);

        socket.on("disconnet", () => {
            console.log("A client has disconnected:", socket.id);
        })
    })
}