import 'dotenv/config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import redis from '../database/redisClient.js';
import { token } from 'morgan';
import email from './email.js';

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
  try{
    await redis.setEx(token, JWT_EXPIRATION, user.id.toString())
    return token;
    
  } catch(error) {
    console.error(error);
  }
}

async function verifyToken(token) {
  try{
    const exists = await redis.exists(token);
    if(!exists){
      return null;
    }

    // error thrown if varification fails 
    // also checks exp by default
    const decodedPayload = jwt.verify(token, JWT_SECRET);
    return decodedPayload;

  } catch(error) {
    console.error(error);
    return null;
  }
}

async function destroyToken(token) {

  try{
    const keysDeleted = await redis.del(token);
    if(keysDeleted === 0) {
      return false;
    }

    return true;

  } catch(error) {
    console.error(error);
    return false;
  }
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
  decodeToken,
  verifyToken,
  destroyToken
};
