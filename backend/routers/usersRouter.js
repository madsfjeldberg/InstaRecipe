import e, { Router } from "express";
import multer from 'multer';

import auth from "../service/authService.js";
import prisma from "../database/prismaClient.js";
import redis from '../database/redisClient.js';
import usersRepository from "../repository/usersRepository.js";
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = Router();
const upload = multer();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Set to true in production
  sameSite: process.env.NODE_ENV === "production" ? "None" : "lax", // Set to None in production for cross-site cookies
  maxAge: 604800000, // 7 days
}

router.get("/api/users/:id", async (req, res) => {
  try {
    const foundUser = await usersRepository.getUserById(req.params.id);
    if(!foundUser) {
      return res.status(404).send({ data: {} });
    }

    res.send({ data: foundUser });

  }catch(error) {
    console.error(error);
    res.status(500).send({ errorMessage: error.message});
  }
})

router.get('/api/users', authenticateToken, async (req, res) => {
  const { partialUsername } = req.query;
  if (partialUsername) {
    const foundUsers = await prisma.user.findMany({
      where: {
        username: {
          contains: partialUsername,
          mode: 'insensitive'
        }
      }
    });
    if (foundUsers.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }
    return res.status(200).json(foundUsers);
  } else {
    const users = await prisma.user.findMany();
    if (!users) {
      return res.status(404).json({ message: 'No users found' });
    }
    return res.status(200).json(users);
  }

  
});



router.get('/api/users/:id/avatar', authenticateToken, async (req, res) => {
  let userId = req.params.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return res.status(404).send({ errorMessage: 'Could not get avatar, since user not found with id: ' + userId });
  }

  res.set('Content-Type', user.avatarMime || 'image/png').send(user.avatar);
});

router.post('/api/users/:id/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  let userId = req.params.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  await prisma.user.update({
    where: { id: userId },
    data: {
      avatar: req.file.buffer,
      avatarMime: req.file.mimetype
    }
  });
  res.status(200).json({ message: 'Avatar uploaded successfully' });
});

router.put('/api/users', authenticateToken, async (req, res) => {
  const { user } = req.body;
  
  if (!user) {
    return res.status(400).json({ message: 'User data is required' });
  }
  try {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        username: user.username,
        email: user.email,
        password: user.password,
        emailNotifications: user.emailNotifications
      }
    })
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = await auth.generateToken(updatedUser);
    res
      .status(200)
      .clearCookie("jwt")
      .cookie("jwt", token, cookieOptions)
      .json({
        id: updatedUser._id,
        message: "User updated successfully.",
        status: 200,
      });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE route to delete a user
router.delete('/api/users', authenticateToken, async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  try {
    // Fetch all recipelist IDs for this user
    const recipeLists = await prisma.recipeList.findMany({
      where: { userId },
      select: { id: true }
    });
    const listIds = recipeLists.map(r => r.id);

    // Delete ALL recipes that belong to any of those lists
    await prisma.recipe.deleteMany({
      where: {
        recipeLists: {
          some: { id: { in: listIds } }
        }
      }
    });

    // Delete the recipe lists themselves
    await prisma.recipeList.deleteMany({ where: { userId } });

    // Delete the user
    await prisma.user.delete({ where: { id: userId } });

    // Clear the auth cookie
    res.clearCookie("jwt", cookieOptions);

    return res.status(200).json({ message: 'User and all related data deleted.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;