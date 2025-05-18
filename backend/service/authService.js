import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import redis from '../database/redisClient.js';
import 'dotenv/config';

const SALT = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = 604800; // 7 days

const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT);
    return hashedPassword;
  } catch (error) {
    throw new Error(`Error hashing password: ${error.message}`);
  }
}

const verifyPassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error(`Error verifying password: ${error.message}`);
  }
}

const generateToken = async (user) => {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  const exp = now + JWT_EXPIRATION; // Exactly JWT_EXPIRATION seconds from now

  const token = jwt.sign({
    id: user.id,
    username: user.username,
    email: user.email,
    iat: now,
    exp: exp
  }, JWT_SECRET);

  // store token in redis
  try {
    await redis.setEx(token, JWT_EXPIRATION, user.email);
    return token;
    
  } catch (error) {
    throw new Error(`Error generating token: ${error.message}`);
  }
}

async function verifyToken(token) {
  try {
    const exists = await redis.exists(token);
    if (!exists) {
      return null;
    }

    // error thrown if verification fails 
    // also checks exp by default
    const decodedPayload = jwt.verify(token, JWT_SECRET);
    return decodedPayload;

  } catch (error) {
    throw new Error(`Invalid token: ${error.message}`);
  }
}

async function destroyToken(token) {

  try {
    const keysDeleted = await redis.del(token);
    if(keysDeleted === 0) {
      return false;
    }

    return true;

  } catch (error) {
    throw new Error(`Error deleting token: ${error.message}`);
  }
}

const decodeToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error(`Invalid token: ${error.message}`);
  }
}

const auth = {
  hashPassword,
  verifyPassword,
  generateToken,
  decodeToken,
  verifyToken,
  destroyToken
};

export default auth;
