

const BASE_URL = import.meta.env.VITE_BASE_URL + "/users" || "/users";


const changeUsername = async (userId, newUsername) => {
  const response = await fetch(`${BASE_URL}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ newUsername }),
  });

  if (response.status === 200) {
    isAuthenticated.set(true);
  }
  
  const data = await response.json();
  return data;
}

export const userService = {
  changeUsername,
};