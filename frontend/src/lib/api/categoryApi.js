import { makeOption } from '../utils/util';

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/categories` : '/api/categories';

const getCategories = async () => {

  try{
    const option = makeOption('GET');
    const response = await fetch(BASE_URL, option);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.errorMessage);
    }
    
    return result.data;

  }catch (error) {
    throw error;
  }
}

const categoryApi = {
  getCategories,
};

export default categoryApi;
