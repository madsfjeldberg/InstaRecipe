import prisma from "../database/prismaClient.js"

const postComment = async (userId, text, recipeId) => {
    try{
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

    }catch(error) {
        console.error(error);
        throw new Error("Could not post comment");
    }
};



export default { postComment }
