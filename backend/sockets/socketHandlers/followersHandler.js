import usersRepository from '../../repository/usersRepository.js';

export const followersHandler = (socket, io) => {
    
    socket.on("following", async (data) => {
        try{
            const updatedUser = await usersRepository.follow(data);
            io.emit("following", updatedUser);

        }catch(error) {
            console.error(error);
        }

    })

    socket.on("unfollowing", async (data) => {
        try{
            const updatedUser = await usersRepository.unfollow(data);
            io.emit("unfollowing", updatedUser);

        }catch(error) {
            console.error(error);
        }
    })
}
