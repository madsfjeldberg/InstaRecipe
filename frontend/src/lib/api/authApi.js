import { isAuthenticated, user } from '../../stores/authStore.js';
import { avatarStore } from '../../stores/avatarStore.js';

import { ifResponseOk, makeOption } from '../utils/util.js';

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth` : '/api/auth';

const login = async (username, password) => {
  try{
    const postOption = makeOption("POST", {username, password});
    const response = await fetch(BASE_URL + "/login", postOption);
    
    return await ifResponseOk(response);
    
  } catch (error) {
    throw error;
  }
}

const register = async (username, email, password) => {
  try {
    const postOption = makeOption("POST", { username, email, password });
    const response = await fetch(BASE_URL + "/register", postOption);

    return await ifResponseOk(response);

  } catch (error) {
    throw error;
  }
};

const logout = async (email) => {
  try {
    const getOption = makeOption("POST", {email});
    const response = await fetch(BASE_URL + "/logout", getOption);
    
    return await ifResponseOk(response);
  
  }catch(error) {
    throw error;
  }
}



const sendRestPasswordRequest = async (email) => {
  try{
    const postOption = makeOption("POST", {email})
    const response = await fetch(BASE_URL + "/forgot-password", postOption);
    
    return await ifResponseOk(response);

  } catch(error) {
    throw error;
  }  
}



const resetPassword = async (newPassword, resetToken) => {
  try{
    const patchOption = makeOption("PATCH", {newPassword});
    const response = await fetch(`${BASE_URL}/reset-password/${resetToken}`, patchOption);
    
    return await ifResponseOk(response);

  }catch(error) {
    console.error(error);
    throw error;
  }
}



const verifyEmail = async (userId) => {
  try {
    const response = await fetch(BASE_URL + "/verify/" + userId);
    
    return await ifResponseOk(response);

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
