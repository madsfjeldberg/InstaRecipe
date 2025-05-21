<script>
  import { onMount } from 'svelte';
  import { blur } from 'svelte/transition';
  
  import { toast } from 'svelte-sonner';

  import { Plus, ScrollText, ExternalLink, LoaderCircle } from 'lucide-svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import Separator from '$lib/components/ui/separator/separator.svelte';

  import RecipeListSelect from '$lib/components/RecipeListSelect/RecipeListSelect.svelte';
  import AddListDialog from '$lib/components/AddListDialog/AddListDialog.svelte';
  import AddRecipeDialog from '$lib/components/AddRecipeDialog/AddRecipeDialog.svelte';
  import DeleteListDialog from '$lib/components/DeleteListDialog/DeleteListDialog.svelte';
  import EditListDialog from '$lib/components/EditListDialog/EditListDialog.svelte';
  import RecipeCard from '$lib/components/RecipeCard/RecipeCard.svelte';

  import recipeListApi from '$lib/api/recipelistApi.js';
  import categoryApi from '$lib/api/categoryApi.js';
  import tagsApi from '$lib/api/tagsApi.js';
  import { goto } from '$app/navigation';
  

  const { data } = $props();
  const { user } = data;

  let isInitialLoad = $state(true); // Flag to track if it's the initial load

  let userId = user.id;

  let recipeLists = $state([]);
  let selectedList = $state(null);
  let favoritesRecipeList = $state(null);

  let categories = $state([]);
  let tags = $state([]);

  let loading = $state(true);

  onMount(async () => {
    // Fetch the initial recipe list when the component mounts
    try {
      recipeLists = await recipeListApi.getRecipeListsByUserId(userId);
      categories = await categoryApi.getCategories();
      tags = await tagsApi.getRecipeTags();
      
    } catch(error) {
      toast.error(error.message + "\nTry again later");
      return;
    }

    // Set the selected list to the first one if available
    if (recipeLists.length > 0) {
      selectedList = recipeLists[0];
      favoritesRecipeList = recipeLists.find( (list) => list.name === "Favorites");
    } 
    
    // Set the flag to false after the initial load
    isInitialLoad = false;
    loading = false;
  });

  // when a new recipe list is selected, fetch the recipes for that list
  // and pass to recipe table
  $effect(async () => {
    if (isInitialLoad || !selectedList) return;
    loading = true;
    loading = false;
  });
  
  
</script>

<svelte:head>
  <title>InstaRecipe | Recipes</title>
</svelte:head>

<div class="grid grid-cols-8 p-10">
  <div class="col-span-2">
    <h1 class="text-2xl font-bold flex items-center"><ScrollText class="inline-block mr-2" /> Your Recipes</h1>
  </div>

  <div class="col-span-4 flex items-center gap-2">
    <RecipeListSelect {user} bind:recipeLists bind:selectedList />
    <AddListDialog bind:recipeLists bind:selectedList/>
  </div>

  <div class="col-span-8 mt-10">
    {#if loading}
      <div class="flex text-center flex-col items-center justify-center h-full">
        <h1 class="flex text-2xl font-semibold items-center mt-72"><LoaderCircle class="mr-2 h-10 w-10 animate-spin inline-block" /> Loading...</h1>
      </div>

      {:else if selectedList}

        {#if selectedList.name !== "Favorites"}
          <div class="group flex items-center justify-between mb-4">
              <EditListDialog bind:selectedList bind:recipeLists />
            <AddRecipeDialog bind:selectedList {categories} {tags}/>
          </div>
        {:else}
          <h1 class="text-2xl font-semibold">{selectedList.name}</h1>
          {#if selectedList.isPrivate}
            <p>(Private)</p>
          {:else}
            <p>(Public)</p>
          {/if}
        {/if}
        
        <div transition:blur={{ duration: 250 }} class="grid grid-cols-8">
          <div class=col-span-8>
            <Separator class="mt-2 mb-6 h-[2px]" />
            <div class="grid grid-cols-3 gap-4 mt-4">
              {#if loading}
                <div class="flex justify-center items-center col-span-3">
                  <LoaderCircle class="animate-spin h-16 w-16 mt-56" />
                </div>
                {:else if selectedList && selectedList.recipes && selectedList.recipes.length > 0}
                    
                  {#each selectedList.recipes as recipe (recipe.id)}
                    <RecipeCard {recipe} bind:selectedList bind:favoritesRecipeList />
                  {/each}

                {:else}
                  <p>No recipes found.</p>
              {/if}
            </div>
          </div>
        </div>

    {:else}
      <div class="flex text-center flex-col items-center justify-center h-full">
        <h1 class="text-2xl font-semibold">You have no recipe lists.</h1>
        <p class="text-muted-foreground">Please create a recipe list to get started.</p>
      </div>
    {/if}
  </div>

</div>
