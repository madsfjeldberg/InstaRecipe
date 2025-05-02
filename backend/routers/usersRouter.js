import { Router } from "express";
import multer from 'multer';
import { getUser, getUserById } from "../database/users/users.js";
import auth from "../util/auth.js";

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
  const user = await getUserById(userId);
  if (!user || !user.avatar) {
    return res.status(404).json({ message: 'Avatar not found' });
  }
  res.set('Content-Type', user.avatar.contentType);
  res.send(user.avatar.data);
});

router.post('/api/users/:id/avatar', upload.single('avatar'), async (req, res) => {
  let userId = req.params.id;
  const user = await getUserById(userId);
  user.avatar = {
    data: req.file.buffer,
    contentType: req.file.mimetype
  };
  await user.save();
  res.status(200).json({ message: 'Avatar uploaded successfully', user });
});

// PATCH route to update the username
router.patch('/api/users', async (req, res) => {
  const { userId, newUsername } = req.body;
  console.log('Received request to update username:', req.body);

  if (!userId || !newUsername) {
    return res.status(400).json({ message: 'User ID and new username are required' });
  }

  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Check if the new username is already taken
    const existingUser = await getUser(newUsername);
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