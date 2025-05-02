import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const SALT = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = 3600; // 1 hour

const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT);
    return hashedPassword;
  } catch (e) {
    throw new Error('Error hashing password');
  }
}

const verifyPassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (e) {
    throw new Error(`Error verifying password: ${e.message}`);
  }
}

const generateToken = (user) => {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  const exp = now + JWT_EXPIRATION; // Exactly JWT_EXPIRATION seconds from now

  const token = jwt.sign({
    id: user.id,
    username: user.username,
    iat: now,
    exp: exp
  }, JWT_SECRET);
  return token;
}

const decodeToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (e) {
    throw new Error('Invalid token');
  }
}

export default {
  hashPassword,
  verifyPassword,
  generateToken,
  decodeToken
};