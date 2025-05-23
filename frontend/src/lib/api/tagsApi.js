import { ifResponseOk, makeOption } from '../utils/util';

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/tags` : '/api/tags';

const getRecipeTags = async () => {
    try {
        const option = makeOption("GET");
        const response = await fetch(BASE_URL, option);
        return await ifResponseOk(response);
    }catch(error) {
       throw error;
    }
}

const tagsApi = {
    getRecipeTags,
};

export default tagsApi;
