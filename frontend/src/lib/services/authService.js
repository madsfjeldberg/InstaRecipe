import { isAuthenticated } from "$lib/stores/authStore";
import { makeOption } from "./util.js";

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth` : '/api/auth';
// const BASE_URL = '/api/auth';

const login = async (username, password) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });

  if (response.status === 200) {
    isAuthenticated.set(true);
  }

  const data = await response.json();
  return data;
}

const register = async (username, email, password) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ username, email, password })
  });

  const data = await response.json();
  return data;
}

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



export const authService = {
  login,
  register,
  logout,
  sendRestPasswordRequest,
  resetPassword
};