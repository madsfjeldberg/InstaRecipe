const sortRecipeList = (recipeLists) => {
    const sortedRecipeLists = recipeLists.sort((a, b) => a.name.localeCompare(b.name));

    // Ensures the Favorites list is always at the first
    const favoritesRecipeListIndex = sortedRecipeLists.findIndex((list) => list.name === "Favorites");
    const favoritesRecipeList = sortedRecipeLists[favoritesRecipeListIndex];
    sortedRecipeLists.splice(favoritesRecipeListIndex, 1);
    sortedRecipeLists.unshift(favoritesRecipeList);

    return sortedRecipeLists;
}

export { sortRecipeList };