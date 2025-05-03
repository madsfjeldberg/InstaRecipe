import 'dotenv/config';
import { Router } from "express";
import auth from "../util/auth.js";
import emailService from "../util/email.js";
import { addUser, getUser, getUserByEmail, editUser, confirmUser } from "../database/users/users.js";
import tokens from "../database/tokens/tokens.js";


import prisma from "../database/prismaClient.js";

const router = Router();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Set to true in production
  sameSite: process.env.NODE_ENV === "production" ? "None" : "lax", // Set to None in production for cross-site cookies
  maxAge: 3600000, // 1 hour
}

router.post("/api/auth/register", async (req, res) => {
  // extract user data from request body
  const { username, email, password } = req.body;

  // validate user data
  if (!username || !email || !password) {
    return res.status(400).send({ status: 400, message: "All fields are required" });
  }
  // check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) {
    return res.status(400).send({ status: 400, message: "Username already exists" });
  }
  // check if email already exists
  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    return res.status(400).send({ status: 400, message: "Email already exists" });
  }
  
  const hashedPassword = await auth.hashPassword(password);
  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });
  const token = auth.generateToken(newUser);

  // create a verification token and send a verification email
  // const verificationToken = await tokens.createToken(newUser._id, token);
  const verificationToken = await prisma.token.create({
    data: {
      userId: newUser.id,
      token: token,
    },
  });
  await emailService.sendVerificationEmail(newUser.email, verificationToken.token);

  res
    .status(200)
    .json({ message: "User registered successfully.", status: 200 });
});

router.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    console.log("All fields are required");
    return res.status(400).send({ message: "All fields are required" });
  }

  const dbUser = await prisma.user.findUnique({ where: { username } });

  if (!dbUser) {
    console.log("User not found");
    return res.status(401).send({ message: "Wrong username or password." });
  }
  if (!dbUser.isConfirmed) {
    console.log("User not confirmed");
    return res.status(401).send({ message: "Please confirm your email first." });
  }
  const isValidPassword = await auth.verifyPassword(password, dbUser.password);

  try {
    if (isValidPassword) {
      const token = auth.generateToken(dbUser);
      res
        .status(200)
        .cookie("jwt", token, cookieOptions)
        .json({
          id: dbUser.id,
          message: "Login successful.",
          status: 200,
        });
    } else {
      console.log("Wrong username or password.");
      return res.status(401).send({ message: "Wrong username or password." });
    }
  } catch (e) {
    res
      .status(500)
      .send({ message: "An error occurred during login.", error: e.message });
  }
});


router.get("/api/auth/logout", (req, res) => {
  res
    .clearCookie("jwt")
    .status(200)
    .send({ message: "Logout successful." });
});

router.post("/api/auth/change-password", async (req, res) => {
  const { newPassword } = req.body;
  
  if (!newPassword) {
    return res.status(400).send({ message: "All fields are required" });
  }

  const token = req.cookies.jwt;  
  const decoded = auth.decodeToken(token);
  const dbUser = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!dbUser) {
    return res.status(401).send({ message: "User not found" });
  }

  try {
    const hashedPassword = await auth.hashPassword(newPassword);
    await editUser(dbUser._id, dbUser.username, dbUser.email, hashedPassword);
    res.status(200).send({ message: "Password changed successfully" });
  } catch (e) {
    res.status(500).send({ message: `An error occurred during password change.` });
  }
});

router.get("/api/auth/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;
    
    // Verify the token
    const foundToken = await prisma.token.findUnique({
      where: { token: token },
    });
    if (!foundToken) {
      return res.status(400).json({ 
        status: 400, 
        message: "Invalid or expired verification token" 
      });
    }

    // Update user
    const user = await confirmUser(foundToken.userId);
    if (!user) {
      return res.status(400).json({ 
        status: 400, 
        message: "User not found" 
      });
    }

    // Delete the used token
    await prisma.token.delete({
      where: { token: token },
    });

    return res.status(200).json({ 
      status: 200, 
      message: "Account verified successfully." 
    });
  } catch (error) {
    console.error(`Error verifying account: ${error.message}`);
    return res.status(500).json({ 
      status: 500, 
      message: `Error verifying account: ${error.message}`
    });
  }
});

export default router;
