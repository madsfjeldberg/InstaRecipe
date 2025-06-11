import { fetchWithAuth, ifResponseOk, makeOption } from '../utils/util.js';

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/grocerylist` : '/api/grocerylist';

const sendGroceryList = async (recipeName, ingredients) => {
    const groceryList = {name: recipeName, items: ingredients};

    try{
        const option = makeOption("POST", {groceryList})
        const response = await fetchWithAuth(BASE_URL, option);

        return await ifResponseOk(response);

    }catch(error) {
        throw error;
    }
}

const groceryListApi = {
    sendGroceryList
};

export default groceryListApi;
