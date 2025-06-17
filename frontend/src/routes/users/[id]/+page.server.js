import userApi from '$lib/api/userApi.js';
import recipeListApi from '$lib/api/recipelistApi.js';
import { sortRecipeList } from '$lib/utils/recipeList.js'; // Assuming this can be imported on server

export async function load({ params, locals }) {
    const currentUserId = params.id;
    let currentUser = null;
    let currentUserRecipeLists = null;
    let viewer = null;
    let viewerFavoritesRecipeList = null;
    let viewerFollowingList = [];
    let isFollowing = false;

    try {
        currentUser = await userApi.getUserById(currentUserId);
        currentUserRecipeLists = await recipeListApi.getRecipeListsByUserId(currentUserId);
        currentUserRecipeLists = sortRecipeList(currentUserRecipeLists);
        


        if (locals.user) {
            viewer = await userApi.getUserById(locals.user.id);
            const viewerRecipeLists = await recipeListApi.getRecipeListsByUserId(viewer.id);
            viewerFavoritesRecipeList = viewerRecipeLists.find((list) => list.name === "Favorites");
            viewerFollowingList = viewer.following;
            isFollowing = currentUser.followers.some((follower) => follower.id === viewer.id);
        }


    } catch (error) {
        console.error("Error fetching data on server:", error);
    }


    return {
        currentUser,
        currentUserRecipeLists,
        viewer,
        viewerFavoritesRecipeList,
        viewerFollowingList,
        isFollowing
    };
}