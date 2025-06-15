import usersRepository from '../../repository/usersRepository.js';

export const followersHandler = (socket, io) => {
    socket.on("following", async (data) => {
        console.log("following received user:", data);

        try{
            const updatedUser = await usersRepository.follow(data);
            
            io.emit("following", updatedUser);
            console.log("emitted follow updated user:", updatedUser);

        }catch(error) {
            console.error(error);
        }

    })

    socket.on("unfollowing", async (data) => {
        console.log("unfollowing received user:", data);
        
        try{
            const updatedUser = await usersRepository.unfollow(data);
            
            io.emit("unfollowing", updatedUser);
            console.log("emitted unfollow updated user:", updatedUser);

        }catch(error) {
            console.error(error);
        }
    })
}
