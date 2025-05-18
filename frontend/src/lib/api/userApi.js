import { isAuthenticated } from "../../stores/authStore.js";
import { makeOption, fetchWithAuth } from "./util.js";

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/users` : '/api/users';



const getUserById = async (userId) => {
  
  try {
    const getOption = makeOption("GET");
    const response = await fetch(BASE_URL + "/" + userId, getOption);
    const result = await response.json();
    
    if(!response.ok) {
      throw new Error(result.errorMessage);
    }
    
    return result.data;

  } catch(error) {
    throw error;
  }
}

const getUsersByPartialUsername = async (query) => {
  const option = makeOption("GET", null);
  const response = await fetchWithAuth(`${BASE_URL}/?partialUsername=${query}`, option);

  if (response.status === 200) {
    isAuthenticated.set(true);
  }
  
  const data = await response.json();
  return data;
}

const getUserAvatar = async (userId) => {
  
  try{
    const getOption = makeOption("GET");
    const response = await fetch(BASE_URL + "/" + userId + "/avatar", getOption);

    if(!response.ok) {
      throw new Error(result.errorMessage);
    }

    return await response.blob();

  }catch(error) {
    throw error;
  }
}

const updateUser = async (user) => {
  // remove avatar and avatarMime from user object
  const { avatar, avatarMime, followers, following, ...userWithoutAvatar } = user.user;
  const option = makeOption("PUT", { user: userWithoutAvatar });
  const response = await fetchWithAuth(`${BASE_URL}`, option);
  const data = await response.json();
  return data;
}

const changeUsername = async (userId, newUsername) => {
  const option = makeOption("PATCH", { userId, newUsername });
  const response = await fetchWithAuth(`${BASE_URL}`, option);

  if (response.status === 200) {
    isAuthenticated.set(true);
  }
  
  const data = await response.json();
  return data;
}

const changePassword = async (userId, newPassword) => {
  const option = makeOption("PATCH", { userId, newPassword });
  const response = await fetchWithAuth(`${BASE_URL}`, option);

  if (response.status === 200) {
    isAuthenticated.set(true);
  }
  
  const data = await response.json();
  return data;
}

const deleteUser = async (userId) => {
  const option = makeOption("DELETE", { userId });
  const response = await fetchWithAuth(`${BASE_URL}`, option);

  if (response.status === 200) {
    isAuthenticated.set(false);

  }
  
  const data = await response.json();
  return data;
}

export default {
  getUserById,
  getUserAvatar,
  getUsersByPartialUsername,
  updateUser,
  changeUsername,
  changePassword,
  deleteUser,
};