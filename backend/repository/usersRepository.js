import prisma from "../database/prismaClient.js";



const getUserById = async (userId) => {
    try {
        const foundUser = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                followers: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                        avatarMime: true
                    }
                },
                following: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                        avatarMime: true
                    }
                }
            }
        });

        if (!foundUser) {
            return null;
        }
        
        const { password, ...userWithoutPassword } = foundUser;
        return userWithoutPassword;

    } catch (error) {
        console.error(error);
        throw new Error("Could not get user with id:", userId);
    }
}



const updateUsername = async (userId, newUsername) => {
    try {
        const updatedUser = prisma.user.update({
            where: {
                id: userId
            },
            data: {
                username: newUsername
            },
        });
        return updatedUser;

    } catch (error) {
        console.error(error);
        throw new Error("Could not update username");
    }
}



const follow = async (parentId, childId) => {
    try{
        const updatedUser = await prisma.user.update({
            where: {
                id: parentId
            },
            data: {
                following: {
                    connect: {
                        id: childId
                    }
                }
            }
        });
        return updatedUser;

    }catch(error) {
        console.error(error);
        throw new Error("Could not follow user with id:", parentId)
    }
}



const unfollow = async (parentId, childId) => {
    try{
        const updatedUser = prisma.user.update({
            where: {
                id: parentId
            },
            data: {
                following: {
                    disconnect: {
                        id: childId
                    }
                }
            }
        });
        return updatedUser;

    }catch(error) {
        console.error(error);
        throw new Error("Could not unfollow user with id:", parentId);
    }
}

export default { getUserById, updateUsername, follow, unfollow }
