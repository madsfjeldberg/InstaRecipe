import prisma from "../database/prismaClient.js"

const postComment = async (recipeId, commentText) => {
    try{
        const postedComment = await prisma.comment.create({
            data: {
                comment: commentText,
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
