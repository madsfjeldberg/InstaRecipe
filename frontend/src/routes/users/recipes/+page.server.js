import { redirect } from '@sveltejs/kit';

import recipeListApi from '$lib/api/recipelistApi.js';
import { sortRecipeList } from '$lib/utils/recipeList.js';



export async function load({ locals, url }) {
    if (!locals.user) {
                        //ensures correct encoding of URI such as spaces
        const returnTo = encodeURIComponent(url.pathname);
        throw redirect(303, `/auth/login?returnTo=${returnTo}`);
    }

    try {
        let recipeLists = await recipeListApi.getRecipeListsByUserId(locals.user.id);

        recipeLists = sortRecipeList(recipeLists);
        const selectedList = recipeLists[0];
        const favoritesRecipeList = recipeLists.find(list => list.name === "Favorites");


        return { 
            user: locals.user,
            recipeLists,
            selectedList,
            favoritesRecipeList
        }

    } catch (err) {
        console.error("Error loading recipe lists on server:", err);
        throw error(500, 'Could not load recipe lists. Please try again later.');
    }
}
