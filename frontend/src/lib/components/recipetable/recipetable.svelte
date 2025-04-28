<script>
  import * as Table from '$lib/components/ui/table';
  import { onMount } from 'svelte';
  import Button from '../ui/button/button.svelte';

  const { selectedList, recipes } = $props();

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