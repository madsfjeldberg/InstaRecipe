import { isAuthenticated, user } from "../../stores/authStore.js";
import { avatarStore } from "../../stores/avatarStore.js";

import { makeOption } from "../utils/util.js";

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth` : '/api/auth';

const login = async (username, password) => {
  
  try{
    const postOption = makeOption("POST", {username, password});
    const response = await fetch(BASE_URL + "/login", postOption);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.errorMessage);
    }
    
    isAuthenticated.set(true);
    return result.data;
    
  } catch (error) {
    throw error;
  }
}

const register = async (username, email, password) => {
  const postOption = makeOption("POST", { username, email, password });

  try {
    const response = await fetch(BASE_URL + "/register", postOption);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.errorMessage || 'Registration failed');
    }

    return result.data;

  } catch (error) {
    throw error;
  }
};

const logout = async (email) => {
  try {
    const getOption = makeOption("POST", {email});
    const response = await fetch(BASE_URL + "/logout", getOption);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.errorMessage);
    }
    
    isAuthenticated.set(false);
    user.set(null);
    avatarStore.set(null);
  
  }catch(error) {
    throw error;
  }
}



const sendRestPasswordRequest = async (email) => {
  try{
    const postOption = makeOption("POST", {email})
    const response = await fetch(BASE_URL + "/forgot-password", postOption);
    const result = await response.json();

    if(!response.ok) {
      throw new Error(result.errorMessage);
    }

  } catch(error) {
    throw error;
  }  
}



const resetPassword = async (newPassword, resetToken) => {
  try{
    const patchOption = makeOption("PATCH", {newPassword});
    const response = await fetch(`${BASE_URL}/reset-password/${resetToken}`, patchOption);
    const result = await response.json();

    if(!response.ok) {
      throw new Error(result.errorMessage);
    }

    return result.data;

  }catch(error) {
    console.error(error);
    throw error;
  }
}



const verifyEmail = async (userId) => {
  try {
    const response = await fetch(BASE_URL + "/verify/" + userId);
    const result = await response.json();

    if(!response.ok) {
      throw new Error(result.errorMessage);
    }

    return result.data;

  }catch(error) {
    throw error;
  }
}



const authApi = {
  login,
  register,
  verifyEmail,
  logout,
  sendRestPasswordRequest,
  resetPassword
};
export default authApi;