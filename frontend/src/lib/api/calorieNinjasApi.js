import { makeOption } from './util.js';

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}` : 'http://localhost/api';

async function getMacros(ingredients) {

    try{
        const getOption = makeOption("GET");
        const response = await fetch(BASE_URL + "/macros?"+"ingredients="+ingredients, getOption);
        return await response.json();

    } catch(error) {
        console.error(error);
    }     
}

export default {getMacros}
