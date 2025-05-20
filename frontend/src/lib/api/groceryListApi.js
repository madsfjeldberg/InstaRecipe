import { makeOption } from "../utils/util";

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/grocerylist` : '/api/grocerylist';

async function sendGroceryList(recipeName, ingredients) {
    const groceryList = {name: recipeName, items: ingredients};

    try{
        const option = makeOption("POST", {groceryList})
        const response = await fetch(BASE_URL, option);
        const result = await response.json();

        if(!response.ok) {
            throw new Error(result.errorMessage);
        }

        return result.data;

    }catch(error) {
        throw error;
    }
}

const groceryListApi = {
    sendGroceryList
};

export default groceryListApi;