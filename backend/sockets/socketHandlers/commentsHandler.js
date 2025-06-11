import emailService from '../../util/email.js';

import commentsRepository from '../../repository/commentsRepository.js';
import recipeRepository from '../../repository/recipeRepository.js';

export const commentsHandler = (socket, io) => {
    socket.on("new-comment", async (newComment) => {
        console.log("comment recived:", newComment);

        const postedComment = await commentsRepository.postComment(newComment.userId, newComment.comment, newComment.recipeId);
        
        const recipeCreatorUsername = postedComment.recipe.recipeLists[0].user.username;
        const recipeCreatorEmail = postedComment.recipe.recipeLists[0].user.email;
      
        const emailNotificationEnabled = postedComment.recipe.recipeLists[0].user.emailNotifications;
        if (emailNotificationEnabled) {
          emailService.sendCommentNotification(recipeCreatorEmail, recipeCreatorUsername, postedComment);
      };

        io.emit("new-comment", postedComment);
        
        console.log("comment emitted:", postedComment)
    })



    socket.on("new-comment-reply", async (newReply) => {
        console.log("reply recived:", newReply);

        const postedCommentReply = await commentsRepository.postCommentReply(newReply.userId, newReply.comment, newReply.recipeId, newReply.commentParentId);
        
        if(!newReply.replyParent) {
            const parentComment = await commentsRepository.getCommentById(newReply.commentParentId);
            emailService.sendCommentReplyNotification(parentComment, postedCommentReply);
            
        } else {
            const foundRecipe = await recipeRepository.getRecipeById(newReply.recipeId);
            const recipeName = foundRecipe.name;
            newReply.replyParent.recipe = { name: recipeName };
          
            const emailsNotificationEnabled = postedCommentReply.user.emailNotifications;
            if (emailsNotificationEnabled) {
              emailService.sendCommentReplyNotification(newReply.replyParent, postedCommentReply);    
            };
            
        }

        io.emit("new-comment-reply", postedCommentReply);
        
        console.log("reply emitted:", postedCommentReply);
    })
}
