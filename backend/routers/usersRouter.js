import { Router } from "express";
import multer from 'multer';
import auth from "../util/auth.js";

import prisma from "../database/prismaClient.js";

const router = Router();
const upload = multer();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Set to true in production
  sameSite: process.env.NODE_ENV === "production" ? "None" : "lax", // Set to None in production for cross-site cookies
  maxAge: 3600000, // 1 hour
}

router.get('/api/users/:id/avatar', async (req, res) => {
  let userId = req.params.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.avatar) {
    return res.status(404).json({ message: 'Avatar not found' });
  }

  res.set('Content-Type', user.avatarMime ?? 'image/png').send(user.avatar);
});

router.post('/api/users/:id/avatar', upload.single('avatar'), async (req, res) => {
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

router.get('/api/users/', async (req, res) => { 
  const users = await prisma.user.findMany();
  if (!users) {
    return res.status(404).json({ message: 'No users found' });
  }
  res.status(200).json(users);
});

// PATCH route to update the username
router.patch('/api/users', async (req, res) => {
  const { userId, newUsername } = req.body;
  console.log('Received request to update username:', req.body);

  if (!userId || !newUsername) {
    return res.status(400).json({ message: 'User ID and new username are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Check if the new username is already taken
    const existingUser = await prisma.user.findUnique({ where: { username: newUsername } });
    if (existingUser) {
      console.log('Username already exists:', newUsername);
      return res.status(400).json({ message: 'Username already exists' });
    }
    // Update the username
    user.username = newUsername;
    const updatedUser = await user.save();
    const token = auth.generateToken(updatedUser);
    res
        .status(200)
        .cookie("jwt", token, cookieOptions)
        .json({
          id: updatedUser._id,
          message: "Username updated successfully.",
          status: 200,
        });

  } catch (error) {
    console.error('Error updating username:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;