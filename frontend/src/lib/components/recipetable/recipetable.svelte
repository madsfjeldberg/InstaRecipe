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
      console.log('Recipes:', recipes);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    }
  }


</script>
<Button
  variant="primary"
  size="sm"
  class="mb-4"
  onclick={() => {
    console.log($state.snapshot(selectedList));
    // Logic to add a recipe
  }}
>table state </Button>

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
  {#each recipes as recipe (recipe._id)}
    <Table.Row key={recipe._id}>
    <Table.Cell class="font-medium">{recipe.name}</Table.Cell>
    <Table.Cell>{recipe.description}</Table.Cell>
    <Table.Cell>{recipe.category}</Table.Cell>
    <Table.Cell class="text-right">{recipe.calories}kcal</Table.Cell>
    </Table.Row>
  {/each}
   <Table.Row>
    <Table.Cell class="font-medium">Recipe 1</Table.Cell>
    <Table.Cell>Delicious recipe</Table.Cell>
    <Table.Cell>Main Course</Table.Cell>
    <Table.Cell class="text-right">350kcal</Table.Cell>
   </Table.Row>
   <Table.Row>
    <Table.Cell class="font-medium">Recipe 2</Table.Cell>
    <Table.Cell>Yummy dessert</Table.Cell>
    <Table.Cell>Dessert</Table.Cell>
    <Table.Cell class="text-right">280kcal</Table.Cell>
   </Table.Row>
  </Table.Body>
 </Table.Root>