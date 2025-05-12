import prisma from "../database/prismaClient.js"

const postComment = async (userId, username, text, recipeId) => {
    try{
        const postedComment = await prisma.comment.create({
            data: {
                comment: text,
                username,
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
            }
        })
        return postedComment;

    }catch(error) {
        console.error(error);
        throw new Error("Could not post comment");
    }
};



export default { postComment }
