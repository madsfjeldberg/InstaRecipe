<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { blur } from 'svelte/transition';
  
  import { toast } from 'svelte-sonner';

  import { Plus, ScrollText, ExternalLink, LoaderCircle, Star } from 'lucide-svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import Separator from '$lib/components/ui/separator/separator.svelte';

  import RecipeListSelect from '$lib/components/RecipeList/RecipeListSelect/RecipeListSelect.svelte';
  import AddListDialog from '$lib/components/RecipeList/AddListDialog/AddListDialog.svelte';
  import AddRecipeDialog from '$lib/components/Recipe/AddRecipeDialog/AddRecipeDialog.svelte';
  import DeleteListDialog from '$lib/components/RecipeList/DeleteListDialog/DeleteListDialog.svelte';
  import EditListDialog from '$lib/components/RecipeList/EditListDialog/EditListDialog.svelte';
  import RecipeCard from '$lib/components/Recipe/RecipeCard/RecipeCard.svelte';

  import recipeListApi from '$lib/api/recipelistApi.js';
  import tagsApi from '$lib/api/tagsApi.js';
  
  import { sortRecipeList } from '$lib/utils/recipeList.js';


  const { data } = $props();
  const { user } = data;

  let userId = user.id;

  let recipeLists = $state([]);
  let selectedList = $state(null);
  let favoritesRecipeList = $state(null);

  let loading = $state(true);

  onMount(async () => {
    // Fetch the initial recipe list when the component mounts
    try {
      recipeLists = await recipeListApi.getRecipeListsByUserId(userId);
      favoritesRecipeList = recipeLists.find(list => list.name === "Favorites");

    } catch(error) {
      toast.error(error.message + "\nTry again later");
      return;
    }

    // Set the selected list to the first one if available
    if (recipeLists.length > 0) {
      recipeLists = sortRecipeList(recipeLists);
      selectedList = recipeLists[0];
    } 
    
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
    <AddListDialog bind:recipeLists bind:selectedList onSortRecipeList={sortRecipeList}/>
  </div>

  <div class="col-span-8 mt-10">
    {#if loading}
      <div class="flex text-center flex-col items-center justify-center h-full">
        <h1 class="flex text-2xl font-semibold items-center mt-72"><LoaderCircle class="mr-2 h-10 w-10 animate-spin inline-block" /> Loading...</h1>
      </div>

      {:else if selectedList}

        {#if selectedList.name === "Favorites"}
        <EditListDialog bind:selectedList bind:recipeLists />

        {:else}
        <div class="group flex items-center justify-between mb-4">
          <EditListDialog bind:selectedList bind:recipeLists />
          <AddRecipeDialog bind:selectedList/>
        </div>
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
