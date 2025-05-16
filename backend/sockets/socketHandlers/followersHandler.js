import usersRepository from "../../repository/usersRepository.js";

export const followersHandler = (socket, io) => {
    socket.on("following", async (data) => {
        console.log("reviced user:", data);
        
        try{
            const updatedUser = await usersRepository.follow(data.parentId, data.childId);
            socket.broadcast.emit(updatedUser);
            console.log("emitted updated user:", updatedUser);

        }catch(error) {
            console.error(error);
        }

    })

    socket.on("unfollowing", async (data) => {
        console.log("reviced user:", data);
        
        try{
            const updatedUser = await usersRepository.unfollow(data.parentId, data.childId);
            socket.broadcast.emit(updatedUser);
            console.log("emitted updated user:", updatedUser);

        }catch(error) {
            console.error(error);
        }
    })
}