import { Router } from 'express';
import multer from 'multer';

import authMiddleware from '../middleware/authMiddleware.js';

import authService from '../service/authService.js';

import usersRepository from '../repository/usersRepository.js';

import prisma from '../database/prismaClient.js';

const router = Router();
const upload = multer();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Set to true in production
  sameSite: process.env.NODE_ENV === "production" ? "None" : "lax", // Set to None in production for cross-site cookies
  maxAge: 604800000, // 7 days
};

router.get("/api/users/:id", async (req, res) => {
  try {
    const foundUser = await usersRepository.getUserById(req.params.id);
    if (!foundUser) {
      return res.status(404).send({ data: {} });
    }

    res.send({ data: foundUser });
  } catch (error) {
    console.error(error);
    res.status(500).send({ errorMessage: "Could not get user by id, server/database error" });
  }
});

router.get("/api/users", async (req, res) => {
  const { partialUsername } = req.query;

  if (partialUsername) {
    const foundUsers = await usersRepository.searchUser(partialUsername);
    if (foundUsers.length === 0) {
      return res.status(404).send({ errorMessage: "No users found" });
    }

    return res.send({data: foundUsers});
  } 
  
  const users = await usersRepository.getAllUsers();
  if (!users) {
    return res.status(404).send({ errorMessage: "No users found" });
  }

  return res.send({ data: users });
  
});

router.get("/api/users/:id/avatar", async (req, res) => {
  let userId = req.params.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return res.status(404).send({ errorMessage: 'Could not get avatar, since user not found with id: ' + userId });
  }

  res.set('Content-Type', user.avatarMime || 'image/png').send(user.avatar);
});

router.post("/api/users/:id/avatar", authMiddleware.authenticateToken, upload.single("avatar"), async (req, res) => {
    let userId = req.params.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).send({ errorMessage: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        avatar: req.file.buffer,
        avatarMime: req.file.mimetype,
      },
    });
    const { password: _, ...userWithoutPassword } = updatedUser;
    res.send({ data: userWithoutPassword });
  }
);

router.put("/api/users", authMiddleware.authenticateToken, async (req, res) => {
  const { user } = req.body;
  if (!user) {
    return res.status(400).send({ errorMessage: "User data is required" });
  }
  

  
  const jwt = req.cookies.jwt;
  if (!jwt) {
    return res.status(404).send({ errorMessage: "No tokens found on request." });
  }
  
  try {
  const isDestroyed = await authService.destroyToken(user.email, jwt);
  if (!isDestroyed) {
    return res.status(404).send({ errorMessage: "Could not destroy token." });
  }



  let updatedUser;
  if (user.username) {
    updatedUser = await usersRepository.updateUsername(user.id, user.username);
  }

  if(user.password) {
    const hashedPassword = await authService.hashPassword(user.password);
    updatedUser = await usersRepository.updatePassword(user.id, hashedPassword);
  }
  
  if(user.emailNotification) {
    updatedUser = await usersRepository.updateEmailNotifications(user.id, user.emailNotification.setting);
  }
  
  if (!updatedUser) {
    return res.status(500).send({ errorMessage: "Server error. Error updating user fields." });
  }
  const { password: _, ...userWithoutPassword } = updatedUser;

    const token = await authService.generateToken(userWithoutPassword);
    res
      .clearCookie("jwt")
      .cookie("jwt", token, cookieOptions)
      .send({ data: userWithoutPassword});

  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send({ errorMessage: "Internal server error" });
  }
});

// DELETE route to delete a user
router.delete("/api/users", authMiddleware.authenticateToken, async (req, res) => {
  const { user } = req.body;
  if (!user) {
    return res.status(400).send({ errorMessage: "User ID is required" });
  }

  const userId = user.id

  try {
    // Fetch all recipelist IDs for this user
    const recipeLists = await prisma.recipeList.findMany({
      where: { userId },
      select: { id: true },
    });
    const listIds = recipeLists.map((r) => r.id);

    // Delete ALL recipes that belong to any of those lists
    await prisma.recipe.deleteMany({
      where: {
        recipeLists: {
          some: { id: { in: listIds } },
        },
      },
    });

    // Delete the recipe lists themselves
    await prisma.recipeList.deleteMany({ where: { userId } });

    // Delete the user
    await usersRepository.softDeleteUser(userId);
    
    const jwt = req.cookies.jwt;
    if (!jwt) {
      return res.status(404).send({ errorMessage: "No tokens found on request." });
    }

    const isDestroyed = await authService.destroyToken(user.email, jwt);
    if (!isDestroyed) {
      return res.status(404).send({ errorMessage: "Could not destroy token." });
    }

    // Clear the auth cookie
    res.clearCookie("jwt", cookieOptions);

    return res.send({ data: {} });

  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).send({ errorMessage: "Internal server error" });
  }
});

export default router;
