import { handleResponse, makeOption } from '../utils/api.js';

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/categories` : '/api/categories';

const getCategories = async () => {

  try{
    const response = await fetch(BASE_URL);
    
    return await handleResponse(response);

  }catch (error) {
    throw error;
  }
}

const categoryApi = {
  getCategories,
};

export default categoryApi;
