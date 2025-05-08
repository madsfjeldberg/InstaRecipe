import { Router } from "express";
import multer from 'multer';
import auth from "../service/authService.js";

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

router.get('/api/users/', async (req, res) => { 
  const users = await prisma.user.findMany();
  if (!users) {
    return res.status(404).json({ message: 'No users found' });
  }
  res.status(200).json(users);
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



// PATCH route to update the username
router.patch('/api/users', async (req, res) => {
  const { userId, newUsername, newPassword } = req.body;
  console.log('Received request to update username:', req.body);

  if (!userId && !newUsername && !newPassword) {
    console.log('Missing userId or newUsername or newPassword');
    return res.status(400).json({ message: 'No values provided.' });
  }

  if (newPassword) {
    // Update the password
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      let hashedPassword = await auth.hashPassword(newPassword);
      user.password = hashedPassword;
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
      });
      return res.status(200).json({ status: 200, message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error updating password:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
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

// DELETE route to delete a user
router.delete('/api/users', async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  try {
    // 1) Fetch all recipelist IDs for this user
    const recipeLists = await prisma.recipeList.findMany({
      where: { userId },
      select: { id: true }
    });
    const listIds = recipeLists.map(r => r.id);

    // 2) Delete ALL recipes that belong to any of those lists
    await prisma.recipe.deleteMany({
      where: {
        recipeLists: {
          some: { id: { in: listIds } }
        }
      }
    });

    // 3) Delete the recipe lists themselves
    await prisma.recipeList.deleteMany({ where: { userId } });

    // 4) Delete the user
    await prisma.user.delete({ where: { id: userId } });

    // 5) Clear the auth cookie
    res.clearCookie("jwt", cookieOptions);

    return res.status(200).json({ message: 'User and all related data deleted.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;