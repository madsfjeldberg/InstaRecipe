import { isAuthenticated } from "../../stores/authStore.js";
import { makeOption, fetchWithAuth } from "./util.js";

// const BASE_URL = import.meta.env.VITE_BASE_URL + "/users" || "/users";
const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/users` : '/api/users';

const getUsersByPartialUsername = async (query) => {
  const option = makeOption("GET", null);
  const response = await fetchWithAuth(`${BASE_URL}/?partialUsername=${query}`, option);

  if (response.status === 200) {
    isAuthenticated.set(true);
  }
  
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

export {
  getUsersByPartialUsername,
  changeUsername,
  changePassword,
  deleteUser,
};