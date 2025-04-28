<script>
  import * as Table from '$lib/components/ui/table';
  import { onMount } from 'svelte';
  import { getRecipeListsByListId } from '$lib/services/recipeService.js';
  import Button from '../ui/button/button.svelte';

  const { selectedList } = $props();
  let recipes = $state([]);

    // Watch for changes to selectedList and fetch recipes when it's set
  $effect(() => {
    if (selectedList && selectedList._id) {
      fetchRecipes(selectedList._id);
    }
  });

  async function fetchRecipes(listId) {
    try {
      console.log('Fetching recipes for listId:', listId);
      recipes = await getRecipeListsByListId(listId);
      console.log('Recipes:', $state.snapshot(recipes));
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    }
  }


</script>

<Table.Root>
  <Table.Header>
   <Table.Row>
    <Table.Head class="w-[100px]">Name</Table.Head>
    <Table.Head>Description</Table.Head>
    <Table.Head>Category</Table.Head>
    <Table.Head class="text-right">Calories</Table.Head>
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
  {#each recipes as recipe (recipe._id)}
    <Table.Row key={recipe._id}>
    <Table.Cell class="font-medium overflow">{recipe.name}</Table.Cell>
    <Table.Cell>{recipe.description}</Table.Cell>
    <Table.Cell>{recipe.category}</Table.Cell>
    <Table.Cell class="text-right">{recipe.calories}kcal</Table.Cell>
    </Table.Row>
  {/each}
  {/if}
  </Table.Body>
 </Table.Root>