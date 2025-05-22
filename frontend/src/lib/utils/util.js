import { goto } from '$app/navigation';

import { toast } from 'svelte-sonner';

import { isAuthenticated } from '../../stores/authStore.js';


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
    const response = await fetch(url, options);

    if (response.status === 401) {
        isAuthenticated.set(false);
        toast.error("Session expired. Please log in again.");
        goto("/login");
        throw new Error("Unauthorized");
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

export { makeOption, fetchWithAuth, ifResponseOk };