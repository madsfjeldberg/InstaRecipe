<script>
    import { Star } from "lucide-svelte";
    import { toast } from "svelte-sonner";
    import Button from "../ui/button/button.svelte";

    import { addRecipeToFavoritesRecipeList, removeRecipeFromFavoritesList } from "$lib/api/recipelistApi.js";
  


    const { favoritesRecipeList = $bindable(), recipe } = $props();


    const isAddedToFavoritesRecipeList = async (event, recipe) => {
        event.stopPropagation();

        try {
            if (
                favoritesRecipeList.recipes.some(
                    (checkRecipe) => checkRecipe.id === recipe.id,
                )
            ) {
                await removeFromFavoritesList(recipe);
                toast.success(recipe.name + " was removed from favorites list");
                return;
            }

            await addToFavoritesRecipeList(recipe);
            toast.success(recipe.name + " was added to your favorites list");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong interacting with favorites list");
        }
    };

    const addToFavoritesRecipeList = async (newRecipe) => {
        favoritesRecipeList.recipes = [
            ...favoritesRecipeList.recipes,
            newRecipe,
        ];

        try {
            await addRecipeToFavoritesRecipeList(
                favoritesRecipeList.id,
                newRecipe.id,
            );
        } catch (error) {
            toast.error(error.message);
        }
    };

    const removeFromFavoritesList = async (recipeToRemove) => {
        favoritesRecipeList.recipes = favoritesRecipeList.recipes.filter(
            (recipe) => recipe.id !== recipeToRemove.id,
        );
        await removeRecipeFromFavoritesList(
            favoritesRecipeList.id,
            recipeToRemove.id,
        );
    };
</script>

<Button size="icon" variant="ghost" class="transition-all hover:text-orange-400 hover:bg-transparent" onclick={(event) => isAddedToFavoritesRecipeList(event, recipe)}>
    {#if favoritesRecipeList && favoritesRecipeList.recipes.some((checkRecipe) => checkRecipe.id === recipe.id)}
      <Star class="text-orange-400 fill-current" />
    {:else}
      <Star class=""/>
    {/if}
</Button>
