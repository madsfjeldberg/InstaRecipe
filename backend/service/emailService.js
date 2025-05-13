import { Resend } from 'resend';
import 'dotenv/config';

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

const sendVerificationEmail = async (to, token) => {
  const subject = 'Verify your email address';
  const html = `
    <h1>Verify your email address</h1>
    <p>Click the link below to verify your email address:</p>
    <a href="${FRONTEND_URL}/verify/${token}">Verify Email</a>
  `;
  return sendEmail(to, subject, html);
}

const sendPasswordResetEmail = async (to, token) => {
  const subject = 'Reset your password';
  const html = `
    <h1>Reset your password</h1>
    <p>Click the link below to reset your password:</p>
    <a href="${FRONTEND_URL}/login/reset-password/${token}">Reset Password</a>
  `;
  return sendEmail(to, subject, html);
}



const sendGroceryListEmail = async (to, groceryList) => {
  const subject = "Grocery list - " + groceryList.name;

  let groceries = groceryList.items.map( (item) => {
    return `<li>${item.measurements}g ${item.name}</li>`
  } )
  groceries = groceries.join("");

  const html = `
    <h1>${groceryList.name}</h1>
    <ul>${groceries}</ul>
  `

  return sendEmail(to, subject, html);
}



const sendCommentReplyNotification = async (to, comment) => {
  const subject = comment.user.username + " has replied to your comment";

  // send the respond in the email
  // include a link to the page so that reciver can respond to comment again

  const html = `
    <h2>Comment</h2>
    <h2>Comment</h2>
    <p>${comment.comment}</p>
    <br>
    <button href="${FRONTEND_URL}/recipes/${comment.recipeId}">Respond</button>
  `
}



export default {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendGroceryListEmail,
  sendCommentReplyNotification,
};

