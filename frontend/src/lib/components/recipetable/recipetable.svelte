<script>
  import * as Table from '$lib/components/ui/table';
  import { onMount } from 'svelte';
  import Button from '../ui/button/button.svelte';
  import DeleteRecipeDialog from '../delete-recipe-dialog/delete-recipe-dialog.svelte';
  import { toast } from 'svelte-sonner';
  import { deleteRecipe } from '$lib/services/recipeService.js';
  import PopularityVoteButtons from '../popularity-vote-buttons/popularity-vote-buttons.svelte';

  let { selectedList = $bindable(), recipes } = $props();

</script>

<Table.Root>
  <Table.Header>
   <Table.Row>
    <Table.Head class="w-[100px]">Name</Table.Head>
    <Table.Head>Description</Table.Head>
    <Table.Head class="">Category</Table.Head>
    <Table.Head class="text-right">Calories</Table.Head>
    <Table.Head class="text-center">Popularity</Table.Head>
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
    <Table.Row class="group cursor-pointer" key={recipe.id}>
    <Table.Cell class="font-medium overflow">{recipe.name}</Table.Cell>
    <Table.Cell>{recipe.description}</Table.Cell>
    <Table.Cell>{recipe.category.name}</Table.Cell>
    <Table.Cell class="text-right">{recipe.calories}kcal</Table.Cell>
    <Table.Cell class="flex items-center justify-center"><PopularityVoteButtons /></Table.Cell>
    <Table.Cell>
      <DeleteRecipeDialog recipeId={recipe.id} bind:selectedList />
    </Table.Cell>
    </Table.Row>
  {/each}
  {/if}
  </Table.Body>
 </Table.Root>