import prisma from "../database/prismaClient.js";



const getUserById = async (userId) => {
    try{
        const foundUser = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        return foundUser;

    }catch(error) {
        console.error(error);
        throw new Error("Could not get user with id:", userId);
    }
}



const updateUsername = async (userId, newUsername) => {
    try{
        const updatedUser = prisma.user.update({
            where: {
                id: userId
            },
            data: {
                username: newUsername
            }
        });
        return updatedUser;

    }catch(error) {
        console.error(error);
        throw new Error("Could not update username");
    }
}

export default { getUserById, updateUsername }
