<script>
  import Recipetable from "$lib/components/recipetable/recipetable.svelte";
  import Recipeselect from "$lib/components/recipeselect/recipeselect.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { Plus } from "lucide-svelte";
  import { onMount } from "svelte";

  // will need some kind of state management to store the selected recipelist
  // also some onMount function to fetch the data from the server
  // and populate the state

</script>

<svelte:head>
  <title>Recipes</title>
</svelte:head>

<div class="grid grid-cols-8 p-10">
  <div class="col-span-2">
    <h1 class="text-2xl font-bold">Your Recipes</h1>
  </div>
  <div class="col-span-6">
    <Recipeselect />
    <Button
      class="align-middle mb-1 ml-2"
      size="sm"
      variant="secondary"
      href="/recipes"
    ><Plus />Add List</Button>
  </div>
  <div class="">
    
  </div>
  <div class="col-span-8 mt-10">
    <Recipetable />
  </div>
</div>