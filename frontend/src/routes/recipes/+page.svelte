<script>
  import RecipeTable from "$lib/components/recipetable/recipetable.svelte";
  import RecipeListSelect from "$lib/components/recipe-list-select/recipe-list-select.svelte";
  import AddListDialog from "$lib/components/add-list-dialog/add-list-dialog.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { Plus, ScrollText, ExternalLink } from "lucide-svelte";
  import { onMount } from "svelte";
  import { getRecipeListsByUserId } from "$lib/services/recipelistService.js";
  import AddRecipeDialog from "$lib/components/add-recipe-dialog/add-recipe-dialog.svelte";
  import { getRecipesByListId } from "$lib/services/recipeService.js";

  const { data } = $props();
  const { user } = data;

  let isInitialLoad = $state(true); // Flag to track if it's the initial load

  let userId = user.id;
  let selectedList = $state(null);
  let recipeLists = $state([]);
  let recipes = $state([]);

  onMount(async () => {
    // Fetch the initial recipe list when the component mounts
    recipeLists = await getRecipeListsByUserId(userId);
    // Set the selected list to the first one if available
    if (recipeLists.length > 0) selectedList = recipeLists[0];
    // Set the flag to false after the initial load
    isInitialLoad = false;
  });

  // when a new recipe list is selected, fetch the recipes for that list
  // and pass to recipe table
  $effect(async () => {
  if (isInitialLoad || !selectedList) return;
  recipes = await getRecipesByListId(selectedList.id);
});
  
  
</script>

<svelte:head>
  <title>Recipes</title>
</svelte:head>

<div class="grid grid-cols-8 p-10">
  <div class="col-span-2">
    <h1 class="text-2xl font-bold flex items-center"><ScrollText class="inline-block mr-2" /> Your Recipes</h1>
  </div>
  <div class="col-span-4 flex items-center gap-2">
    <RecipeListSelect {user} bind:recipeLists bind:selectedList />
    <AddListDialog bind:recipeLists />
  </div>
  <div class="col-span-8 mt-10">
    {#if selectedList}
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">{selectedList.name}</h1>
      <AddRecipeDialog bind:selectedList />
    </div>
    <RecipeTable bind:selectedList {recipes} />
    {:else}
    <div class="flex text-center flex-col items-center justify-center h-full">
    <h1 class="text-2xl font-semibold">No recipe list selected.</h1>
    <p class="text-muted-foreground">Please create a recipe list to get started.</p>
  </div>
    {/if}
  </div>
</div>