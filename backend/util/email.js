import 'dotenv/config';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:9001";

const sendEmail = async (to, subject, html) => {
  try {
    const response = await resend.emails.send({
      from: 'account@thaulow.tech',
      to,
      subject,
      html,
    });
    
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

const sendVerificationEmail = (to, token) => {
  const subject = 'Verify your email address';
  const html = `
    <h1>Verify your email address</h1>
    <p>Click the link below to verify your email address:</p>
    <a href="${FRONTEND_URL}/verify/${token}">Verify Email</a>
  `;
  return sendEmail(to, subject, html);
}

const sendPasswordResetEmail = (to, token) => {
  const subject = 'Reset your password';
  const html = `
    <h1>Reset your password</h1>
    <p>Click the link below to reset your password:</p>
    <a href="${FRONTEND_URL}/login/reset-password/${token}">Reset Password</a>
  `;
  return sendEmail(to, subject, html);
}



const sendConfirmationPasswordResetEmail = (to) => {
  const subject = 'Password has been reset';
  const html = `
    <h1>Your password has now been reset</h1>
    <p>Click the link below to visit InstaRecipe</p>
    <a href="${FRONTEND_URL}">Visit</a>
  `;
  return sendEmail(to, subject, html);
}



const sendGroceryListEmail = (to, groceryList) => {
  const subject = "Grocery list - " + groceryList.name;

  let groceries = groceryList.items.map((item) => {
    return `<li>${item.measurements}g ${item.name}</li>`
  })
  groceries = groceries.join("");

  const html = `
    <h1>${groceryList.name}</h1>
    <ul>${groceries}</ul>
  `

  return sendEmail(to, subject, html);
}



const sendCommentNotification = (to, recipentUsername, postedComment) => {
  const subject = postedComment.user.username + " has commented on your recipe: " + postedComment.recipe.name;

  const html = `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Comment Notification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9fafb;
      color: #333;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      padding: 24px;
    }
    .header {
      text-align: center;
      padding-bottom: 16px;
    }
    .header h1 {
      font-size: 24px;
      color: #111827;
    }
    .comment-box {
      background-color: #f3f4f6;
      padding: 16px;
      border-radius: 6px;
      margin: 16px 0;
      font-style: italic;
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      background-color: #2563eb;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin-top: 12px;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      font-size: 13px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>You've Got a New Comment! 📝</h1>
    </div>
    <p>Hi <strong>${recipentUsername}</strong>,</p>
    <p>${postedComment.user.username} just commented on your recipe: <strong>${postedComment.recipe.name}</strong>.</p>

    <br>

    <strong>The comment</strong>
    <div class="comment-box">
      ${postedComment.comment}
    </div>

    <p>You can view and reply to the comment by clicking the button below:</p>

    <a href="${FRONTEND_URL}/recipes/${postedComment.recipeId}" class="btn">View Recipe</a>

    <div class="footer">
      <p>Thanks for being part of our community!</p>
      <p>The InstaRecipe Team</p>
    </div>
  </div>
</body>
</html>
  `

  return sendEmail(to, subject, html);
}



const sendCommentReplyNotification = (originalComment, commentReply) => {
  const subject = commentReply.user.username + " has replied to your comment";

  const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Reply Notification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9fafb;
      color: #333;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      padding: 24px;
    }
    .header {
      text-align: center;
      padding-bottom: 16px;
    }
    .header h1 {
      font-size: 24px;
      color: #111827;
    }
    .section-title {
      font-weight: bold;
      margin-top: 24px;
    }
    .comment-box {
      background-color: #f3f4f6;
      padding: 16px;
      border-radius: 6px;
      margin: 12px 0;
      font-style: italic;
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      background-color: #2563eb;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin-top: 16px;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      font-size: 13px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>You’ve Got a New Reply! 💬</h1>
    </div>

    <p>Hi <strong>${originalComment.user.username}</strong>,</p>
    <p><strong>${commentReply.user.username}</strong> just replied to your comment on the recipe: <strong>${originalComment.recipe.name}</strong>.</p>

    <div class="section-title">Your original comment</div>
    <div class="comment-box">
      ${originalComment.comment}
    </div>

    <div class="section-title">Their reply</div>
    <div class="comment-box">
      ${commentReply.comment}
    </div>

    <p>You can view the conversation and continue replying by clicking the button below:</p>

    <a href="${FRONTEND_URL}/recipes/${commentReply.recipeId}" class="btn">View and respond</a>

    <div class="footer">
      <p>Thanks for staying engaged!</p>
      <p>The InstaRecipe Team</p>
    </div>
  </div>
</body>
</html>
  `

  return sendEmail(originalComment.user.email, subject, html);
}

const email = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendConfirmationPasswordResetEmail,
  sendGroceryListEmail,
  sendCommentNotification,
  sendCommentReplyNotification,
}

export default email;
