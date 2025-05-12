import prisma from "../database/prismaClient.js"


const getCommentsByRecipeId = async (recipeId) => {
    try{

        const comments = await prisma.comment.findMany({
            where: { recipeId, parentId: null },
            include: {
                replies: {
                    include: {
                        user: { select: { username: true } }
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
                }
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
                parentId: commentParentId,
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
                }
            }
        })
        return postedComment;

    } catch (error) {
        console.error(error);
        throw new Error("Could not post comment");
    }
};



export default { getCommentsByRecipeId, postComment, postCommentReply }
