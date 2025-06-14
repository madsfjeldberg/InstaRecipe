import { goto } from '$app/navigation';
import { get } from 'svelte/store';

import { toast } from 'svelte-sonner';

import { updateAuthState, accessToken } from '../../stores/authStore.js';
import authApi from '$lib/api/authApi.js';


const makeOption = (httpMethod, body) => {

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

    if (body) {
        option.body = JSON.stringify(body);
    }

    return option;
}

const fetchWithAuth = async (url, options) => {
    options.headers["Authorization"] = "Bearer " + get(accessToken);
    let response = await fetch(url, options);

    if (response.status === 401) {
        try {
            const renewedAccessToken = await authApi.renewAccessToken();
            options.headers["Authorization"] = "Bearer " + renewedAccessToken;
            
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

    if(result.accessToken) {
        accessToken.set(result.accessToken);
    }

    return result.data;
}



export { makeOption, fetchWithAuth, ifResponseOk };