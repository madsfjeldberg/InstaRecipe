import { handleResponse, makeOption } from '../utils/util.js';

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/comments` : '/api/comments';

const getCommentsByRecipeId = async (recipeId) => {
  try {
    const response = await fetch(BASE_URL + "/" + recipeId);
    
    return await handleResponse(response);

  }catch(error) {
    throw error;
  }  
}

const commentsApi = {
  getCommentsByRecipeId
};

export default commentsApi;
