import { testConnection } from '../db.js';
import 'dotenv/config';
import Token from '../models/Token.js';

const createToken = async (userId, token) => {
  testConnection();
  try {
    const newToken = new Token({ userId, token });
    await newToken.save();
    return newToken.token;
  } catch (e) {
    throw new Error(`Failed to create token: ${e.message}`);
  }
}

const getToken = async (userId) => {
  testConnection();
  try {
    const foundToken = await Token.findOne({ userId: userId });
    if (!foundToken) {
      throw new Error(`Token not found for user ID: ${userId}`);
    }
    // Optionally, you can remove the token after retrieval
    await Token.deleteOne({ userId: userId });
    return foundToken.token;
  } catch (e) {
    throw new Error(`Failed to retrieve token: ${e.message}`);
  }
}

const verifyToken = async (token) => {
  testConnection();
  try {
    const foundToken = await Token.findOne({ token: token });
    console.log("Found token:", foundToken);
    if (!foundToken) {
      throw new Error(`Token not found: ${token}`);
    }
    return foundToken;
  } catch (e) {
    throw new Error(`Failed to verify token: ${e.message}`);
  }
}

const deleteToken = async (token) => {
  testConnection();
  try {
    const result = await Token.deleteOne({ token: token });
    if (result.deletedCount === 0) {
      throw new Error(`Token not found: ${token}`);
    }
    return result;
  }
  catch (e) {
    throw new Error(`Failed to delete token: ${e.message}`);
  }
}

const tokens = {
  createToken,
  getToken,
  verifyToken,
  deleteToken,
};

export default tokens;