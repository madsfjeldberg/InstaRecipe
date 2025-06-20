import { updateAuthState } from '../../stores/authStore.js';

import { makeOption, fetchWithAuth, handleResponse } from '../utils/api.js';

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/users` : '/api/users';



const getUserById = async (userId) => {
  try {
    const response = await fetch(BASE_URL + "/" + userId);
    const result = await response.json();

    if(!response.ok) {
      return null;
    }

    return result.data;

  } catch(error) {
    throw error;
  }
}

const getUsersByPartialUsername = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/?partialUsername=${query}`);
    return await handleResponse(response)

  }catch(error) {
    throw error;
  }
}



const uploadAvatar = async (userId, avatarFile) => {
  const response = await fetchWithAuth(`${BASE_URL}/${userId}/avatar`, {
    headers: {"Authorization": ""},
    method: 'POST',
    credentials: 'include',
    body: avatarFile
  });

  return await handleResponse(response);
}



const updateUsername = async (id, username, email) => {
  try {
    const user = {id, username, email}
    const option = makeOption("PUT", {user});
    const response = await fetchWithAuth(`${BASE_URL}`, option);
    
    return await handleResponse(response);

  }catch(error) {
    throw error;
  }
}

const updatePassword = async (id, password, email) => {
  try {
    const user = {id, password, email}
    const option = makeOption("PUT", { user });
    const response = await fetchWithAuth(`${BASE_URL}`, option);
    
    return await handleResponse(response);

  }catch(error) {
    throw error;
  }
}

const updateEmailNotificationsSetting = async (id, notificationSetting, email) => {
  try {
    const user = {id, emailNotification: {setting: notificationSetting}, email}
    const option = makeOption("PUT", { user });
    const response = await fetchWithAuth(`${BASE_URL}`, option);
    
    return await handleResponse(response);

  }catch(error) {
    throw error;
  }
}


const deleteUser = async (userId, email) => {
  try {
    const user = { id: userId, email }
    const option = makeOption("DELETE", { user });
    const response = await fetchWithAuth(`${BASE_URL}`, option);
    
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.errorMessage);
    }
    
    updateAuthState(null);

  } catch (error) { 
    throw error;
  }
}

const userApi = {
  getUserById,
  getUsersByPartialUsername,
  uploadAvatar,
  updateUsername,
  updatePassword,
  updateEmailNotificationsSetting,
  deleteUser
};

export default userApi;
