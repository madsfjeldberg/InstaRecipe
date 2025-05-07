import { isAuthenticated } from "../stores/authStore.js";

// const BASE_URL = import.meta.env.VITE_BASE_URL + "/users" || "/users";
const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/users` : '/api/users';


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
  changeUsername,
  deleteUser,
};