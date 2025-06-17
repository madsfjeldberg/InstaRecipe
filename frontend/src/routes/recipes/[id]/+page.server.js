import recipeApi from '$lib/api/recipeApi.js';
import commentsApi from '$lib/api/commentsApi.js';
import recipeListApi from '$lib/api/recipelistApi.js';
import { error } from '@sveltejs/kit'; // For throwing HTTP errors

export async function load({ params, locals }) {
    const recipeId = params.id;
    let favoritesRecipeList = null;
    let recipe = null;
    let comments = [];

    try {
        recipe = await recipeApi.getRecipeById(recipeId);
        comments = await commentsApi.getCommentsByRecipeId(recipeId);

        if (locals.user) {
            const recipeLists = await recipeListApi.getRecipeListsByUserId(locals.user.id);
            favoritesRecipeList = recipeLists.find((list) => list.name === "Favorites");
        }

    } catch (err) {
        console.error("Error loading recipe data:", err);
        throw error(500, 'Could not load recipe data. Please try again later.');
    }

   
    return {
        recipe,
        comments,
        favoritesRecipeList
    };
}