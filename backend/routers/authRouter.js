import 'dotenv/config';
import { Router } from "express";
import auth from "../util/auth.js";
import emailService from "../util/email.js";
import prisma from "../database/prismaClient.js";
import { authenticateToken, isAuthenticated } from '../util/middleware/authenticateToken.js';

const router = Router();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Set to true in production
  sameSite: process.env.NODE_ENV === "production" ? "None" : "lax", // Set to None in production for cross-site cookies
  maxAge: 3600000, // 1 hour
  path: "/"
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

  //this generates the token and stroes userId as value and token as key
  const jwt = await auth.generateToken(newUser);
  await emailService.sendVerificationEmail(newUser.email, jwt);

  res.cookie("jwt", jwt, cookieOptions).send({ message: "User registered successfully.", status: 200 });
});

router.post("/api/auth/login", isAuthenticated, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    console.log("All fields are required");
    return res.status(400).send({ message: "All fields are required" });
  }

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    console.log("User not found");
    return res.status(401).send({ message: "Wrong username or password." });
  }
  if (!user.isConfirmed) {
    console.log("User not confirmed");
    return res.status(401).send({ message: "Please confirm your email first." });
  }
  const isValidPassword = await auth.verifyPassword(password, user.password);

  try {
    if (isValidPassword) {
      const token = await auth.generateToken(user);

      res
        .status(200)
        .cookie("jwt", token, cookieOptions)
        .send({
          id: user.id,
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


router.get("/api/auth/logout", async (req, res) => {
  
  const jwt = req.cookies.jwt;
  if(!jwt) {
    return res.status(404).send({ errorMessage: "no tokens found on request"})
  }


  const isDestroyed = await auth.destroyToken(jwt);
  if(!isDestroyed) {
    return res.status(404).send({ errorMessage: "error occoured during logout"})
  }

  res
    .clearCookie("jwt")
    .status(200)
    .send({ message: "Logout successful." });
});

//TODO
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

router.get("/api/auth/verify/:token", authenticateToken, async (req, res) => {
  const user = req.user;

  try {

    await prisma.user.update({
      where: {
        username: user.username
      },
      data: {
        isConfirmed: true
      }
    });

    return res.status(200).send({
      status: 200,
      message: "Account verified successfully."
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: "Somehting went wrong conforming the email" })
  }

});

export default router;
