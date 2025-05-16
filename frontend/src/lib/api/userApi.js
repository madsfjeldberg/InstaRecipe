import { isAuthenticated } from "../../stores/authStore.js";
import { makeOption } from "./util.js";

// const BASE_URL = import.meta.env.VITE_BASE_URL + "/users" || "/users";
const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/users` : '/api/users';



const getUserById = async (userId) => {
  const getOption = makeOption("GET");
  const response = await fetch(BASE_URL + "/" + userId, getOption);

  if(!response.ok) {
    throw new Error("Could not get user with id:", userId);
  }

  const result = await response.json();
  return result.data;
}



const getUsersByPartialUsername = async (query) => {
  const option = makeOption("GET", null);
  const response = await fetch(`${BASE_URL}/?partialUsername=${query}`, option);

  if (response.status === 200) {
    isAuthenticated.set(true);
  }
  
  const data = await response.json();
  return data;
}

const changeUsername = async (userId, newUsername) => {
  const response = await fetch(`${BASE_URL}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ userId, newUsername }),
  });

  if (response.status === 200) {
    isAuthenticated.set(true);
  }
  
  const data = await response.json();
  return data;
}

const changePassword = async (userId, newPassword) => {
  const response = await fetch(`${BASE_URL}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ userId, newPassword }),
  });

  if (response.status === 200) {
    isAuthenticated.set(true);
  }
  
  const data = await response.json();
  return data;
}

const deleteUser = async (userId) => {
  const response = await fetch(`${BASE_URL}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ userId }),
  });

  if (response.status === 200) {
    isAuthenticated.set(false);

  }
  
  const data = await response.json();
  return data;
}

export {
  getUserById,
  getUsersByPartialUsername,
  changeUsername,
  changePassword,
  deleteUser,
};