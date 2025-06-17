<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { blur } from 'svelte/transition';

  import { LoaderCircle, ArrowLeft } from 'lucide-svelte';
  import RecipeCard from '$lib/components/Recipe/RecipeCard/RecipeCard.svelte';
  import Separator from '$lib/components/ui/separator/separator.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  
  import recipeApi from '$lib/api/recipeApi';
  import recipeListApi from '$lib/api/recipelistApi.js';

  const { data } = $props();
  const { user } = data;
  
  let isError = $state(!data.recipes);
  let recipes = $state(data.recipes);
  let favoritesRecipeList = $state(data.favoritesRecipeList);

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

  {#if isError}
    <div class="flex flex-col items-center justify-center h-screen">
      Error loading recipe. Please try again later.
      <Button onclick={() => history.back()} class="mt-4"> 
        <ArrowLeft class="mr-2"/>
        Go back
      </Button>
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
