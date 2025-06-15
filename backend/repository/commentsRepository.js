import prisma from '../database/prismaClient.js'


const getCommentsByRecipeId = async (recipeId) => {
    try{

        const comments = await prisma.comment.findMany({
            where: { recipeId, parentId: null },
            orderBy: { postedAt: 'asc' },
            include: {
                user: { 
                    select: { 
                        id: true, 
                        username: true 
                    } 
                },
                replyToUser: {
                    select: { 
                        id: true, 
                        username: true 
                    } 
                },
                replies: {
                    orderBy: { postedAt: 'asc' },
                    include: {
                        // author of reply and used for notification for a person who has replied to a comment that gets a reply on his reply.
                        user: { 
                            select: { 
                                username: true,
                                email: true
                            } 
                        },
                        replyToUser: { 
                            select: { 
                                id: true, 
                                username: true 
                            } 
                        }
                    }
                },
            }
        });
        return comments;

    }catch (error) {
        console.error(error);
        throw new Error("Could not fetch all comments for the recipe with id:", recipeId);
    }
}



const getCommentById = async (commentId) => {
    try{
        const foundComment = await prisma.comment.findUnique({
            where: {
                id: commentId
            },
            include: {
                user: {
                    select: {
                        username: true,
                        email: true
                    }
                },
                recipe: {
                    select: {
                        name: true
                    }
                }
            }
        })
        return foundComment;

    }catch(error) {
        console.error(error);
        throw new Error("Could not get the comment with id:", commentId);
    }
}



const postComment = async (newComment) => {
    try {
        const postedComment = await prisma.comment.create({
            data: {
                comment: newComment.comment,
                user: {
                    connect: {
                        id: newComment.userId
                    }
                },
                recipe: {
                    connect: {
                        id: newComment.recipeId
                    }
                }
            },
            include: {
                // Author
                user: {
                    select: {
                        username: true
                    }
                },

                //used for email notification when someone posts a comment on a recipe
                recipe: {
                    select: {
                        name: true,
                        recipeLists: {
                            select: {
                                user: {
                                    select: {
                                        username: true,
                                        email: true,
                                        emailNotifications: true
                                    }
                                }
                            }
                        }
                    }
                },
                replies: true
            }
        })
        return postedComment;

    } catch (error) {
        console.error(error);
        throw new Error("Could not post comment");
    }
};



const postCommentReply = async (newReply) => {
    try {
        const postedComment = await prisma.comment.create({
            data: {
                comment: newReply.comment,
                user: {
                    connect: {
                        id: newReply.userId
                    }
                },
                replyToUser: { 
                    connect: {
                        id: newReply.replyToUserId
                    }
                },
                recipe: {
                    connect: {
                        id: newReply.recipeId
                    }
                },
                parent: {
                    connect: {
                        id: newReply.commentParentId
                    }
                }
            },
            include: {
                // for notificatifying author
                user: {
                    select: {
                      username: true,
                      email: true,
                      emailNotifications: true
                    }
                },
                // adding @mentioned user
                replyToUser: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        })
        return postedComment;

    } catch (error) {
        console.error(error);
        throw new Error("Could not post comment");
    }
};



export default {
  getCommentsByRecipeId,
  getCommentById,
  postComment,
  postCommentReply
}
