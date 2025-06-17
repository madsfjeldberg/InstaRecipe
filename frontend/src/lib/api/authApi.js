
import { handleResponse, makeOption } from '../utils/api.js';

import { accessToken } from '../../stores/authStore.js';

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth` : '/api/auth';



const verifyEmail = async (userId) => {
  try {
    const postOption = makeOption("POST");
    const response = await fetch(BASE_URL + "/verify/" + userId, postOption);
    
    return await handleResponse(response);

  }catch(error) {
    throw error;
  }
}



const verifyToken = async (token) => {
  try{
    const postOption = makeOption("POST", {token});
    const response = await fetch(BASE_URL + "/token/verify", postOption);

    return await handleResponse(response);

  } catch (error) {
    throw error;
  }
} 



const login = async (username, password) => {
  try{
    const postOption = makeOption("POST", {username, password});
    const response = await fetch(BASE_URL + "/login", postOption);
    const result = await response.json();

    if(!response.ok) {
      throw new Error(result.errorMessage);
    }

    return result;
    
  } catch (error) {
    console.error(error)
    throw error;
  }
}



const register = async (username, email, password) => {
  try {
    const postOption = makeOption("POST", { username, email, password });
    const response = await fetch(BASE_URL + "/register", postOption);

    return await handleResponse(response);

  } catch (error) {
    throw error;
  }
};



const logout = async (email) => {
  try {
    const getOption = makeOption("POST", {email});
    const response = await fetch(BASE_URL + "/logout", getOption);
    
    if(!response.ok) {
      const result = await response.json();
      throw new Error(result.errorMessage);
    }
  
  }catch(error) {
    throw error;
  }
}



const renewAccessToken = async () => {
  try {
    const postOption = makeOption("POST");
    const response = await fetch(BASE_URL + "/access-token", postOption);
    const result = await response.json();

    if(!response.ok) {
      throw new Error(result.errorMessage);
    }

    const newAccessToken = result.accessToken;
    accessToken.set(newAccessToken);
    return newAccessToken;

  } catch (error) {
    throw error;
  }
}



const sendRestPasswordRequest = async (email) => {
  try{
    const postOption = makeOption("POST", {email})
    const response = await fetch(BASE_URL + "/forgot-password", postOption);
    
    return await handleResponse(response);

  } catch(error) {
    throw error;
  }  
}



const resetPassword = async (newPassword, resetToken) => {
  try{
    const patchOption = makeOption("PATCH", {newPassword});
    const response = await fetch(`${BASE_URL}/reset-password/${resetToken}`, patchOption);
    
    return await handleResponse(response);

  }catch(error) {
    console.error(error);
    throw error;
  }
}






const authApi = {
  verifyEmail,
  verifyToken,
  login,
  register,
  logout,
  renewAccessToken,
  sendRestPasswordRequest,
  resetPassword
};

export default authApi;
