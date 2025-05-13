import { makeOption } from "./util.js";

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/comments` : '/api/comments';

const getCommentsByRecipeId = async (recipeId) => {
    
    const getOption = makeOption("GET")
    const response = await fetch(BASE_URL + "/" + recipeId, getOption);
    if(!response.ok) {
        throw new Error("Failed to fetch comments on recipe id:", recipeId);
    }
    
    const result = await response.json();
    return result.data;
}

export default { getCommentsByRecipeId }
