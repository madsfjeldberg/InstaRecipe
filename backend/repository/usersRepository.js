import prisma from '../database/prismaClient.js';



const getUserById = async (userId) => {
    try {
        const foundUser = await prisma.user.findUnique({
            where: {
                id: userId,
                isDeleted: false
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
        
        const { password, createdAt, updatedAt, isConfirmed, isDeleted, ...userWithoutPassword } = foundUser;
        return userWithoutPassword;

    } catch (error) {
        console.error(error);
        throw error;
    }
}



const getUserByEmail = async (userEmail) => {
    try {
        const foundUser = await prisma.user.findUnique({
            where: {
                email: userEmail
            }
        });

        if (!foundUser) {
            return null;
        }
        
        const { password, ...userWithoutPassword } = foundUser;
        return userWithoutPassword;

    } catch (error) {
        console.error(error);
        throw error;
    }
}



const getAllUsers = async () => {
    try {
        const allUsers = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                avatar: true,
                avatarMime: true, 
                emailNotifications: true,
                alertNotifications: true
            }
        });
        return allUsers;

    } catch (error) {
        throw error
    }
}



const searchUser = async (partialUsername) => {
    try {
    const foundUsers = await prisma.user.findMany({
        where: {
            username: {
            contains: partialUsername,
            mode: "insensitive",
            },
            isDeleted: false,            
        },
        select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
            avatarMime: true, 
            emailNotifications: true,
            alertNotifications: true,
        }
    });

    return foundUsers;
    
    } catch (error) {
        throw error;
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

        const { password: _, ...userWithoutPassword} = updatedUser;
        return userWithoutPassword;

    } catch (error) {
        console.error(error);
        throw error;
    }
}



const updatePassword = async (userId, newPassword) => {
    try {
        const updatedUser = prisma.user.update({
            where: {
                id: userId
            },
            data: {
                password: newPassword
            },
        });

        const { password: _, ...userWithoutPassword} = updatedUser;
        return userWithoutPassword;

    } catch (error) {
        console.error(error);
        throw error;
    }
}



const updateEmailNotifications = async (userId, emailNotificationSetting) => {
    try {
        const updatedUser = prisma.user.update({
            where: {
                id: userId
            },
            data: {
                emailNotifications: emailNotificationSetting
            },
        });

        const { password: _, ...userWithoutPassword} = updatedUser;
        return userWithoutPassword;

    } catch (error) {
        console.error(error);
        throw error;
    }
}



const follow = async (parentId, childId) => {
    try{
        const updatedUser = await prisma.user.update({
            where: {
                id: parentId
            },
            data: {
                followers: {
                    connect: {
                        id: childId
                    }
                }
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

        const { password, ...userWithOutPassword} = updatedUser;
        return userWithOutPassword;

    }catch(error) {
        console.error(error);
        throw error;
    }
}



const unfollow = async (parentId, childId) => {
    try{
        const updatedUser = await prisma.user.update({
            where: {
                id: parentId
            },
            data: {
                followers: {
                    disconnect: {
                        id: childId
                    }
                }
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

        const { password, ...userWithOutPassword} = updatedUser;
        return userWithOutPassword;

    }catch(error) {
        console.error(error);
        throw error;
    }
}



const softDeleteUser = async (userId) => {
    try {
        const userWithFollow = await getUserById(userId);
        const followers = userWithFollow.followers;
        const following = userWithFollow.following;

        const deletedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                email: "deleted@" + userId,
                password: "deleted_" + userId,
                avatar: null,
                avatarMime: null,
                followers: {
                    disconnect: followers.map( (follower) => ({id: follower.id }))
                },
                following: {
                    disconnect: following.map( (follower) => ({id: follower.id }))
                },
                isDeleted: true
            }
        });
        return deletedUser;

    } catch (error) {
        console.error(error)
        throw error;
    }
}

export default {
  getUserById,
  getUserByEmail,
  getAllUsers,
  searchUser,
  updateUsername,
  updatePassword,
  updateEmailNotifications,
  follow,
  unfollow,
  softDeleteUser
}
