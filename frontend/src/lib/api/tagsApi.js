import { handleResponse, makeOption } from '../utils/util';

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/tags` : '/api/tags';

const getRecipeTags = async () => {
    try {
        const response = await fetch(BASE_URL);
        return await handleResponse(response);
    }catch(error) {
       throw error;
    }
}

const tagsApi = {
    getRecipeTags,
};

export default tagsApi;
