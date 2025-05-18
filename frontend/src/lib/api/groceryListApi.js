import { makeOption } from "./util";

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/grocerylist` : '/api/grocerylist';

async function sendGroceryList(recipeName, ingredients) {
    const groceryList = {name: recipeName, items: ingredients};

    try{
        const option = makeOption("POST", {groceryList})
        const response = await fetch(BASE_URL, option);

        if(!response.ok) {
            return await response.json();
        }

        const result = await response.json();
        return result.data;

    }catch(error) {
        console.error(error);
        throw new Error("Network error, try again later");
    }
}

const groceryListApi = {
    sendGroceryList
};

export default groceryListApi;