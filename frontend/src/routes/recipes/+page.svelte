<script>
  import { onMount } from "svelte";

  import Button from "$lib/components/ui/button/button.svelte";
  import { Plus, ScrollText, ExternalLink, LoaderCircle } from "lucide-svelte";
  
  import RecipeTable from "$lib/components/recipetable/recipetable.svelte";
  import RecipeListSelect from "$lib/components/recipe-list-select/recipe-list-select.svelte";
  import AddListDialog from "$lib/components/add-list-dialog/add-list-dialog.svelte";
  import AddRecipeDialog from "$lib/components/add-recipe-dialog/add-recipe-dialog.svelte";
  import DeleteListDialog from "$lib/components/delete-list-dialog/delete-list-dialog.svelte";
  import EditListDialog from "$lib/components/edit-list-dialog/edit-list-dialog.svelte";
  import { getRecipeListsByUserId } from "$lib/api/recipelistApi.js";
  import { getCategories } from "$lib/api/categoryApi.js";
  import tagsApi from "$lib/api/tagsApi.js";
  import RecipeCard from "$lib/components/RecipeCard/RecipeCard.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { blur } from "svelte/transition";

  const { data } = $props();
  const { user } = data;

  let isInitialLoad = $state(true); // Flag to track if it's the initial load

  let userId = user.id;
  let recipeLists = $state([]);
  let selectedList = $state(null);
  let staredRecipeList = $state(null);
  let recipes = $state([]);
  let categories = $state([]);
  let tags = $state([]);
  let loading = $state(true);

  onMount(async () => {
    // Fetch the initial recipe list when the component mounts
    recipeLists = await getRecipeListsByUserId(userId);
    categories = await getCategories();
    tags = await tagsApi.getRecipeTags();

    // Set the selected list to the first one if available
    if (recipeLists.length > 0) {
      selectedList = recipeLists[0];
      staredRecipeList = recipeLists.find( (list) => list.name === "Stared");
      recipes = selectedList.recipes;
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
  recipes = selectedList.recipes;
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
      <div class="group flex items-center justify-between mb-4">
          <EditListDialog bind:selectedList bind:recipeLists />
        <AddRecipeDialog bind:selectedList {categories} {tags}/>
      </div>
  <div transition:blur={{ duration: 250 }} class="grid grid-cols-8">
    <div class=col-span-8>
      <Separator class="mt-2 mb-6 h-[2px]" />
      <div class="grid grid-cols-3 gap-4 mt-4">
        {#if loading}
        <div class="flex justify-center items-center col-span-3">
          <LoaderCircle class="animate-spin h-16 w-16 mt-56" />
          </div>
        {:else if recipes.length > 0}
          {#each recipes as recipe}
            <RecipeCard {recipe} {selectedList} />
          {/each}
        {:else}
          <p>No recipes found.</p>
        {/if}
        </div>
    </div>
  </div>
      <!-- <RecipeTable bind:selectedList bind:staredRecipeList {recipes} /> -->

    {:else}
      <div class="flex text-center flex-col items-center justify-center h-full">
        <h1 class="text-2xl font-semibold">You have no recipe lists.</h1>
        <p class="text-muted-foreground">Please create a recipe list to get started.</p>
      </div>
    {/if}
  </div>

</div>