import { isAuthenticated, updateAuthState } from '../../stores/authStore.js';

import { makeOption, fetchWithAuth, ifResponseOk } from '../utils/util.js';

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/users` : '/api/users';



const getUserById = async (userId) => {
  try {
    const getOption = makeOption("GET");
    const response = await fetch(BASE_URL + "/" + userId, getOption);
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
    const option = makeOption("GET");
    const response = await fetchWithAuth(`${BASE_URL}/?partialUsername=${query}`, option);
    
    return await ifResponseOk(response)

  }catch(error) {
    throw error;
  }
}

const getUserAvatar = async (userId) => {
  try{
    const getOption = makeOption("GET");
    const response = await fetch(BASE_URL + "/" + userId + "/avatar", getOption);
    
    if(!response.ok) {
      const result = await response.json();
      throw new Error(result.errorMessage);
    }

    return await response.blob();

  }catch(error) {
    throw error;
  }
}

const getUserRatedRecipesHistory = async (userId) => {
  try {
    const option = makeOption("GET");
    const response = await fetchWithAuth(BASE_URL + "/" + userId + "/recipes", option);

    return await ifResponseOk(response);

  } catch (error) {
    throw error;
  }
}

const updateUsername = async (id, username, email) => {
  try {
    const user = {id, username, email}
    const option = makeOption("PUT", {user});
    const response = await fetchWithAuth(`${BASE_URL}`, option);
    
    return await ifResponseOk(response);

  }catch(error) {
    throw error;
  }
}

const updatePassword = async (id, password, email) => {
  try {
    const user = {id, password, email}
    const option = makeOption("PUT", { user });
    const response = await fetchWithAuth(`${BASE_URL}`, option);
    
    return await ifResponseOk(response);

  }catch(error) {
    throw error;
  }
}

const updateEmailNotificationsSetting = async (id, notificationSetting, email) => {
  try {
    const user = {id, emailNotification: {setting: notificationSetting}, email}
    const option = makeOption("PUT", { user });
    const response = await fetchWithAuth(`${BASE_URL}`, option);
    
    return await ifResponseOk(response);

  }catch(error) {
    throw error;
  }
}


const deleteUser = async (userId, email) => {
  try {
    const user = { id: userId, email }
    const option = makeOption("DELETE", { user });
    const response = await fetchWithAuth(`${BASE_URL}`, option);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.errorMessage);
    }
    
    updateAuthState(null);
    return result.data;

  } catch (error) { 
    throw error;
  }
}

const userApi = {
  getUserById,
  getUserAvatar,
  getUsersByPartialUsername,
  getUserRatedRecipesHistory,
  updateUsername,
  updatePassword,
  updateEmailNotificationsSetting,
  deleteUser
};

export default userApi;
