<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { blur } from 'svelte/transition';

  import { LoaderCircle } from 'lucide-svelte';
  import RecipeCard from '$lib/components/RecipeCard/RecipeCard.svelte';
  import Separator from '$lib/components/ui/separator/separator.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  
  import recipeApi from '$lib/api/recipeApi';
  import recipeListApi from '$lib/api/recipelistApi.js';

  const { data } = $props();
  const { user } = data;
  
  let loading = $state(true);
  let recipes = $state([]);
  let favoritesRecipeList = $state(null);

  onMount(async () => {
    loading = true;
    try {
      recipes = await recipeApi.getAllRecipes();
      
      if(!user) {
        return;
      }

      const recipeLists = await recipeListApi.getRecipeListsByUserId(user.id);

      if (recipeLists.length > 0) {
        favoritesRecipeList = recipeLists.find( (list) => list.name === "Favorites");
      } 

    } catch (error) {
      console.error("Error fetching recipes:", error);
      
    } finally {
      loading = false;
    }
  });

</script>

<svelte:head>
  <title>InstaRecipe | explore</title>
</svelte:head>

<div class="flex flex-col p-10">
  {#if user}
    <h1 class="font-bold text-3xl text-left dark:text-gray-200 mb-10">Hello, {user.username}!</h1>
    
    {:else}
    <h1 class="font-bold text-3xl text-left dark:text-gray-200 mb-10">Welcome!</h1>
    
  {/if}

  {#if loading}
    <!-- still loading: show spinner -->
    <div class="flex justify-center items-center h-64">
      <LoaderCircle class="animate-spin h-16 w-16" />
    </div>
  {:else}
    <!-- only *this* block gets mounted when loading → false -->
    <div 
      transition:blur={{ duration: 250 }} 
      class="grid grid-cols-8 gap-4"
    >
      <div class="col-span-8">
        <h2 class="text-2xl mb-2">Popular recipes</h2>
        <Separator class="mb-6" />

        <div class="grid grid-cols-3 gap-4">
          {#if recipes.length > 0}
            {#each recipes as recipe (recipe.id)}
              <RecipeCard 
                recipe={recipe}
                bind:favoritesRecipeList
              />
            {/each}
          {:else}
            <p>No recipes found.</p>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>
