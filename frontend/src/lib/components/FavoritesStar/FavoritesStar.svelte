<script>
    import { Star } from "lucide-svelte";
    import { toast } from "svelte-sonner";
    import Button from "../ui/button/button.svelte";

    import recipelistApi from "$lib/api/recipelistApi.js";
  


    const { favoritesRecipeList = $bindable(), recipe } = $props();


    const isAddedToFavoritesRecipeList = async (event) => {
        event.stopPropagation();

        try {
            const inFavoritesList = favoritesRecipeList.recipes.some( (checkRecipe) => checkRecipe.id === recipe.id )
            if (inFavoritesList) {
                await removeFromFavoritesList(recipe);
                toast.success(recipe.name + " was removed from favorites list");
                return;
            }

            await recipelistApi.addRecipeToFavoritesRecipeList(recipe);
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
            await recipelistApi.addRecipeToFavoritesRecipeList(
                favoritesRecipeList.id,
                newRecipe.id,
            );
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const removeFromFavoritesList = async (recipeToRemove) => {
        favoritesRecipeList.recipes = favoritesRecipeList.recipes.filter(
            (recipe) => recipe.id !== recipeToRemove.id,
        );

        try{

            await recipelistApi.removeRecipeFromFavoritesList(
                favoritesRecipeList.id,
                recipeToRemove.id,
            );
            console.log("removed from favorites:", recipe)
        }catch(error) {
            console.error(error);
            toast.error(error.message)
        }
    };
</script>

<Button size="icon" variant="ghost" class="transition-all hover:text-orange-400 hover:bg-transparent" onclick={(event) => isAddedToFavoritesRecipeList(event)}>
    {#if favoritesRecipeList && favoritesRecipeList.recipes.some((checkRecipe) => checkRecipe.id === recipe.id)}
      <Star class="text-orange-400 fill-current" />
    {:else}
      <Star/>
    {/if}
</Button>
