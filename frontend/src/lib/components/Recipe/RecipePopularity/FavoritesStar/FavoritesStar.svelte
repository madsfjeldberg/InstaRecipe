<script>
    import { toast } from 'svelte-sonner';
    
    import { Star } from 'lucide-svelte';
    import Button from '../../../ui/button/button.svelte';
    
    import { user } from '../../../../../stores/authStore.js';

    import recipelistApi from '$lib/api/recipelistApi.js';
    
    const { favoritesRecipeList = $bindable(), recipe } = $props();


    const isAddedToFavoritesRecipeList = async (event) => {
        event.stopPropagation();

        if (!$user) {
            toast.error("You have to login/register to add recipe to favorites.")
            return;
        }
        
        try {
            const inFavoritesList = favoritesRecipeList.recipes.some( (checkRecipe) => checkRecipe.id === recipe.id )
            if (inFavoritesList) {
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
        // favoritesRecipeList = {
        //     ...favoritesRecipeList,
        //     recipes: favoritesRecipeList.recipes.filter(
        //         (recipe) => recipe.id !== recipeToRemove.id,
        //     ),
        // };

        try{
            await recipelistApi.removeRecipeFromFavoritesList(
                favoritesRecipeList.id,
                recipeToRemove.id,
            );
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
