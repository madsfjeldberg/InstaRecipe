import 'dotenv/config';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import redis from '../database/redisClient.js';



const hashPassword = async (password) => {
  const SALT = 10;
  
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






const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      emailNotifications: user.emailNotifications
    }, 
    ACCESS_TOKEN_SECRET,
    { expiresIn: '30m' }
  );
}

const generateRefreshToken = async (user) => {
  
  const refreshToken = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      emailNotifications: user.emailNotifications
    }, 
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  try {
    await redis.sAdd(user.email, refreshToken);
    return refreshToken;
    
  } catch (error) {
    throw new Error(`Error adding refresh token to redis: ${error.message}`);
  }
}

const generateTokens = async (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  return {accessToken, refreshToken}
}

const verifyToken = async (token, tokenSecret) => {
    const SEVEN_DAYS = 7 * 24 * 60 * 60;

  try {
    const decodedPayload = jwt.verify(token, tokenSecret);
    const ttl = decodedPayload.exp - decodedPayload.iat;

    if (ttl === SEVEN_DAYS) {
      const exists = await redis.sIsMember(decodedPayload.email, token);
      if (!exists) {
        return null;
      }
    }

    return decodedPayload;
    
  } catch (error) {
    throw error;
  }
}



const invalidateAllRefreshTokens = async (email) => {
  try{
    await redis.del(email);
  }catch(error) {
    throw error;
  }
}



const decodeToken = (token) => {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    return decoded;
  } catch (error) {
    throw new Error(`Invalid token: ${error.message}`);
  }
}

const auth = {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  decodeToken,
  verifyToken,
  invalidateAllRefreshTokens
};

export default auth;
