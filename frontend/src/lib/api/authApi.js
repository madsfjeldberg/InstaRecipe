import { isAuthenticated, user } from "../../stores/authStore.js";
import { makeOption } from "./util.js";

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth` : '/api/auth';

const login = async (username, password) => {
  const postOption = makeOption("POST", {username, password});

  try{
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

const logout = async () => {
  const response = await fetch(`${BASE_URL}/logout`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }

  isAuthenticated.set(false);
  return true;
}



async function sendRestPasswordRequest(email) {
  try{
    const postOption = makeOption("POST", {email})
    const response = await fetch(`${BASE_URL}/forgot-password`, postOption);
    return await response.json();

  } catch(error) {
    console.error(error);
  }  
}



async function resetPassword(newPassword, resetToken) {
  try{
    const patchOption = makeOption("PATCH", {newPassword});
    const response = await fetch(`${BASE_URL}/reset-password/${resetToken}`, patchOption);
    return await response.json();

  }catch(error) {
    console.error(error);
  }
}



export default {
  login,
  register,
  logout,
  sendRestPasswordRequest,
  resetPassword
};