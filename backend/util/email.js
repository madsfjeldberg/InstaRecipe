import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

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
    <a href="${FRONTEND_URL}/reset-password/${token}">Reset Password</a>
  `;
  return sendEmail(to, subject, html);
}

export default {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
};

