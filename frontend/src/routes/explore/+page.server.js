import recipeApi from "$lib/api/recipeApi";
import recipeListApi from "$lib/api/recipelistApi";

export async function load({ locals }) {

    let favoritesRecipeList = null;
    let recipes = [];

    try {
        recipes = await recipeApi.getAllRecipes();

        if(locals.user) {
            const recipeLists = await recipeListApi.getRecipeListsByUserId(locals.user.id);
            favoritesRecipeList = recipeLists.find( (list) => list.name === "Favorites");
        }

    } catch (error) {
        console.error("Error loading recipes:", error);
    }

    return {
        recipes,
        favoritesRecipeList
    };
}