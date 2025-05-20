import prisma from '../database/prismaClient.js'


const getCommentsByRecipeId = async (recipeId) => {
    try{

        const comments = await prisma.comment.findMany({
            where: { recipeId, parentId: null },
            include: {
                replies: {
                    include: {
                        //this is used for notification for a person who has replied to a comment that gets a reply on his reply.
                        user: { 
                            select: { 
                                username: true,
                                email: true
                            } 
                        }
                    }
                },
                user: { select: { username: true } }
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



const postComment = async (userId, text, recipeId) => {
    try {
        const postedComment = await prisma.comment.create({
            data: {
                comment: text,
                user: {
                    connect: {
                        id: userId
                    }
                },
                recipe: {
                    connect: {
                        id: recipeId
                    }
                }
            },
            include: {
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
                                        email: true
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



const postCommentReply = async (userId, text, recipeId, commentParentId) => {
    try {
        const postedComment = await prisma.comment.create({
            data: {
                comment: text,
                user: {
                    connect: {
                        id: userId
                    }
                },
                recipe: {
                    connect: {
                        id: recipeId
                    }
                },
                parent: {
                    connect: {
                        id: commentParentId
                    }
                }
            },
            include: {
                user: {
                    select: {
                      username: true,
                      emailNotifications: true
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
