import { ifResponseOk, makeOption } from '../utils/util.js';

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/categories` : '/api/categories';

const getCategories = async () => {

  try{
    const option = makeOption('GET');
    const response = await fetch(BASE_URL, option);
    
    return await ifResponseOk(response);

  }catch (error) {
    throw error;
  }
}

const categoryApi = {
  getCategories,
};

export default categoryApi;
