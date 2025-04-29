import { Router } from "express";
import multer from 'multer';
import { getUserById } from "../database/users/users.js";

const router = Router();
const upload = multer();

router.get('/users/:id/avatar', async (req, res) => {
  let userId = req.params.id;
  const user = await getUserById(userId);
  if (!user || !user.avatar) {
    return res.status(404).json({ message: 'Avatar not found' });
  }
  res.set('Content-Type', user.avatar.contentType);
  res.send(user.avatar.data);
});

router.post('/users/:id/avatar', upload.single('avatar'), async (req, res) => {
  let userId = req.params.id;
  const user = await getUserById(userId);
  user.avatar = {
    data: req.file.buffer,
    contentType: req.file.mimetype
  };
  await user.save();
  res.status(200).json({ message: 'Avatar uploaded successfully', user });
});

export default router;