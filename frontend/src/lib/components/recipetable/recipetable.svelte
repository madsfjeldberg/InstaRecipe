<script>
  import * as Table from "$lib/components/ui/table";
  import { onMount } from "svelte";
  import Button from "../ui/button/button.svelte";
  import DeleteRecipeDialog from "../delete-recipe-dialog/delete-recipe-dialog.svelte";
  import { toast } from "svelte-sonner";
  import { deleteRecipe } from "$lib/api/recipeApi.js";
  import PopularityVoteButtons from "../popularity-vote-buttons/popularity-vote-buttons.svelte";
  import { goto } from "$app/navigation";
  import { Star } from "lucide-svelte";
  import { addRecipeToStaredRecipeList, removeRecipeFromStaredList } from "$lib/api/recipelistApi.js";

  let { selectedList = $bindable(), staredRecipeList = $bindable(), recipes } = $props();

  const navigateToRecipe = (recipe) => {
    goto("/recipes/" + recipe.id);
  }

  const showCalories = (recipe) => {
    if (!recipe || !recipe.ingredientsList) {
      return 0;
    }
    return recipe.ingredientsList.reduce((sum, ingredient) => sum + ingredient.calories, 0).toFixed();
  };



  const isAddedToStaredRecipeList = async (recipe) => {
    try {
      if(staredRecipeList.recipes.some( (checkRecipe) => checkRecipe.id === recipe.id)) {
        await removeFromStaredList(recipe);
        toast.success(recipe.name + " was removed from stared list");
        return;
      }

      await addToStaredRecipeList(recipe);
      toast.success(recipe.name + " was added to your stared list")

    }catch(error) {
      toast.error("Something went wrong interacting with stared list")
    }
  }



  const addToStaredRecipeList = async (newRecipe) => {
    staredRecipeList.recipes = [...staredRecipeList.recipes, newRecipe];
    
    try {
      await addRecipeToStaredRecipeList(staredRecipeList.id, newRecipe.id);

    }catch(error) {
      toast.error(error.message);
    }
  }



  const removeFromStaredList = async (recipeToRemove) => {
      staredRecipeList.recipes = staredRecipeList.recipes.filter( (recipe) => recipe.id !== recipeToRemove.id );
      await removeRecipeFromStaredList(staredRecipeList.id, recipeToRemove.id)
  }
</script>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head class="w-[100px]">Name</Table.Head>
      <Table.Head>Description</Table.Head>
      <Table.Head class="">Category</Table.Head>
      <Table.Head class="text-right">Calories</Table.Head>
      <Table.Head class="text-center">Popularity</Table.Head>
      <Table.Head class="w-[20px]">Star</Table.Head>
      <Table.Head class="w-[20px]"></Table.Head>
    </Table.Row>
  </Table.Header>

  <Table.Body>
    {#if recipes.length === 0}
      <Table.Row>
        <Table.Cell colspan="4" class="text-center">
          No recipes found in this list.
        </Table.Cell>
      </Table.Row>
    {:else}
      {#each recipes as recipe (recipe.id)}
        <Table.Row
          class="group cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
          key={recipe.id}
        >
          <Table.Cell onclick={() => navigateToRecipe(recipe)} class="font-medium overflow">{recipe.name}</Table.Cell>
          <Table.Cell onclick={() => navigateToRecipe(recipe)}>{recipe.description}</Table.Cell>
          <Table.Cell onclick={() => navigateToRecipe(recipe)}>{recipe.category.name}</Table.Cell>
          <Table.Cell onclick={() => navigateToRecipe(recipe)} class="text-right">{showCalories(recipe)}</Table.Cell>

          <Table.Cell class="flex items-center justify-center">
            <PopularityVoteButtons />
          </Table.Cell>

          <Table.Cell onclick={() => isAddedToStaredRecipeList(recipe)}>
            {#if staredRecipeList.recipes.some((checkRecipe) => checkRecipe.id === recipe.id)}
            <span class="hover:text-black dark:hover:text-white transition-colors">
              <Star color="orange"/>
            </span>
              {:else }
              <span class="hover:text-orange-500 transition-colors">
                <Star />
              </span>
              {/if}
          </Table.Cell>

          <Table.Cell>
            <DeleteRecipeDialog recipeId={recipe.id} bind:selectedList />
          </Table.Cell>
        </Table.Row>
      {/each}
    {/if}
  </Table.Body>
</Table.Root>
