import { goto } from '$app/navigation';

import { toast } from 'svelte-sonner';

import { updateAuthState } from '../../stores/authStore.js';
import authApi from '$lib/api/authApi.js';


const makeOption = (httpMethod, body, accessToken) => {

    const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];
    if (!methods.includes(httpMethod)) {
        throw Error(httpMethod + " is not a valid http method / verb")
    }

    const option = {
        method: httpMethod.toUpperCase(),
        credentials: "include",
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }

    if (accessToken) {
        option.headers["Authorization"] = "Bearer " + accessToken;
    }

    if (body) {
        option.body = JSON.stringify(body);
    }

    return option;
}

const fetchWithAuth = async (url, options) => {
    let response = await fetch(url, options);

    if (response.status === 401) {
        try {
            const accessToken = await authApi.renewAccessToken();
            options.headers["Authorization"] = "Bearer " + accessToken;
            
            response = await fetch(url, options);
            
        } catch (error) {
            console.error(error);
            updateAuthState(null, null);
            toast.error("Session expired. Please log in again.");
            goto("/login");
            throw new Error("Unauthorized");
        }
    }

    return response;
}

const ifResponseOk = async (response) => {
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.errorMessage)
    }

    return result.data;
}

const avatarUrl = (userId) => {
    return import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL}/users/${userId}/avatar`
      : `/api/users/${userId}/avatar`;
  };

export { makeOption, fetchWithAuth, ifResponseOk, avatarUrl };