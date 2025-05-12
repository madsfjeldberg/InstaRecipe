import prisma from "../database/prismaClient.js";

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

export default { updateUsername }
