import 'dotenv/config';

import { Router } from 'express';

import authMiddleware from '../middleware/authMiddleware.js';

import authService from '../service/authService.js';
import emailService from '../service/emailService.js';

import recipeListRepository from '../repository/recipeListRepository.js';
import usersRepository from '../repository/usersRepository.js';

import prisma from '../database/prismaClient.js';
import redis from '../database/redisClient.js';

const router = Router();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Set to true in production
  sameSite: process.env.NODE_ENV === "production" ? "None" : "lax", // Set to None in production for cross-site cookies
  maxAge: 604800000, // 7 days
  path: "/",
};


router.get("/api/auth/verify/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        isConfirmed: true,
      },
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    const token = await authService.generateToken(userWithoutPassword);

    return res.cookie("jwt", token, cookieOptions).send({ data: userWithoutPassword });

  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: "Something went wrong confirming the email." });
  }
});

router.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).send({  errorMessage: "All fields are required." });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).send({ errorMessage: "Username already exists." });
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(400).send({ errorMessage: "Email already exists." });
    }

    const hashedPassword = await authService.hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    await recipeListRepository.createFavoritesList(newUser.id);
    
    const uuid = newUser.id;
    await emailService.sendVerificationEmail(newUser.email, uuid);

    const { password: _, ...newUserWithoutPassword } = newUser; 
    res.send({ data: newUserWithoutPassword});

  } catch (error) {
    console.error(error)
    res.status(500).send({ errorMessage: "Server error. Error registering user." });
  }
});



router.post("/api/auth/login", authMiddleware.isAuthenticated, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ errorMessage: "All fields are required." });
  }
  
  try {
    const foundUser = await prisma.user.findUnique({ where: { username } });
    if (!foundUser) {
      return res.status(401).send({ errorMessage: "Wrong username or password." });
    }

    if (!foundUser.isConfirmed) {
      return res.status(401).send({ errorMessage: "Please confirm your email first." });
    }

    const isValidPassword = await authService.verifyPassword(password, foundUser.password);
    if (!isValidPassword) {
      return res.status(401).send({ errorMessage: "Wrong username or password." });
    }

    const token = await authService.generateToken(foundUser);
    const { password: _, ...userWithoutPassword } = foundUser; 

    res.cookie("jwt", token, cookieOptions).send({data: userWithoutPassword});

  } catch (error) {
    res.status(500).send({ errorMessage: "An error occurred during login." });
  }
});



router.post("/api/auth/logout", async (req, res) => {
  const jwt = req.cookies.jwt;
  if (!jwt) {
    return res.status(404).send({ errorMessage: "No tokens found on request." });
  }

  const { email } = req.body;
  if(!email) {
    return res.status(404).send({ errorMessage: "Email must be included in request." });
  }

  try {
    const isDestroyed = await authService.destroyToken(email, jwt);
    if (!isDestroyed) {
      return res.status(404).send({ errorMessage: "Could not destroy token." });
    }
    
    res.clearCookie("jwt").status(200).send({ });

  }catch(error) {
    res.status(500).send({ errorMessage: "Could not logout error occurred on the server."});
  }
});



router.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(401).send({ errorMessage: "Email must be included in the request." });
  }

  try {
    const foundUser = await usersRepository.getUserByEmail(email);
    if (!foundUser) {
      return res.status(401).send({ errorMessage: "Invalid email, no users registered with that email." });
    }

    const resetToken = crypto.randomUUID();
    const FIFTEEN_MINUTES = 900;
    const isSet = await redis.setEx(resetToken, FIFTEEN_MINUTES, email);
    if (!isSet) {
      return res.status(500).send({ errorMessage: "Something went wrong generating reset password token." });
    }

    await emailService.sendPasswordResetEmail(email, resetToken);
    res.send({ });

  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: "Something went wrong processing forgot-password request." });
  }
});

router.patch("/api/auth/reset-password/:token", async (req, res) => {
  const resetToken = req.params.token;
  if (!resetToken) {
    return res.status(401).send({ errorMessage: "Reset token must be included in the request." });
  }
  
  try {
    const doesExists = await redis.exists(resetToken);
    if (!doesExists) {
      return res.status(401).send({ errorMessage: "No reset token found, send a new forgot password request." });
    }
    
    const email = await redis.get(resetToken);
    await authService.invalidateOtherTokens(email);

    const isDeleted = await redis.del(resetToken);
    if (!isDeleted) {
      return res.status(500).send({ errorMessage: "Error occurred when deleting reset token." });
    }
    
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(401).send({ errorMessage: "Must include a new password." });
    }

    const newHashedPassword = await authService.hashPassword(newPassword);
    const updatedUser = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: newHashedPassword,
      },
    });

    emailService.sendConfirmationPasswordResetEmail(email);

    const { password: _, ...userWithoutPassword } = updatedUser;
    res.send({ data: userWithoutPassword });

  } catch (error) {
    res.status(500).send({ errorMessage: "Unexpected error occurred during password reset." });
    console.error(error);
  }
});


export default router;
