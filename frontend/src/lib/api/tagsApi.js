import { makeOption } from "../utils/util";

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/tags` : '/api/tags';

const getRecipeTags = async () => {
    try {
        const option = makeOption("GET");
        const response = await fetch(BASE_URL, option);

        if(!response.ok) {
            const error = await response.json();
            return error.errorMessage;
        }

        const result = await response.json();
        return result.data;

    }catch(error) {
        console.error(error);
        throw new Error(error.message);
    }
}

const tagsApi = {
    getRecipeTags,
};

export default tagsApi;