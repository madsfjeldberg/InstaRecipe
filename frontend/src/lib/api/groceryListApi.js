import { fetchWithAuth, handleResponse, makeOption } from '../utils/api.js';

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/grocerylist` : '/api/grocerylist';

const sendGroceryList = async (recipeName, ingredients) => {
    const groceryList = {name: recipeName, items: ingredients};

    try{
        const option = makeOption("POST", {groceryList})
        const response = await fetchWithAuth(BASE_URL, option);

        return await handleResponse(response);

    }catch(error) {
        throw error;
    }
}

const groceryListApi = {
    sendGroceryList
};

export default groceryListApi;
