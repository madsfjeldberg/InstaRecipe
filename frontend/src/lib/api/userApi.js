import { isAuthenticated } from "../../stores/authStore.js";
import { makeOption, fetchWithAuth } from "./util.js";

// const BASE_URL = import.meta.env.VITE_BASE_URL + "/users" || "/users";
const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/users` : '/api/users';



const getUserById = async (userId) => {
  const getOption = makeOption("GET");
  const response = await fetch(BASE_URL + "/" + userId, getOption);

  if(!response.ok) {
    throw new Error(`Could not get user with id: ${userId}`);
  }

  const result = await response.json();
  return result.data;
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

const updateUser = async (user) => {
  // remove avatar and avatarMime from user object
  const { avatar, avatarMime, followers, following, ...userWithoutAvatar } = user.user;
  const option = makeOption("PUT", { user: userWithoutAvatar });
  const response = await fetchWithAuth(`${BASE_URL}`, option);
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

const userApi = {
  getUserById,
  getUsersByPartialUsername,
  updateUser,
  deleteUser,
};
export default userApi;