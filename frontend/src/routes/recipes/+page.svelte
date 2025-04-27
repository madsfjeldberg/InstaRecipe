<script>
  import RecipeTable from "$lib/components/recipetable/recipetable.svelte";
  import RecipeSelect from "$lib/components/recipeselect/recipeselect.svelte";
  import AddListDialog from "$lib/components/add-list-dialog/add-list-dialog.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { Plus, ScrollText } from "lucide-svelte";
  import { onMount } from "svelte";
  import { getRecipeListsByUserId } from "$lib/services/recipelists.js";

  // will need some kind of state management to store the selected recipelist
  // also some onMount function to fetch the data from the server
  // and populate the state

  const { data } = $props();
  const { user } = data;

  let userId = user.id;

  let selectedList = $state({ id: "", name: "" });
  let recipeLists = $state([]);

  onMount(async () => {
    // Fetch the initial recipe list when the component mounts
    recipeLists = await getRecipeListsByUserId(userId);
    console.log("Fetched recipe lists:", recipeLists);
    selectedList = recipeLists[0];
  });

  function logSelectedList() {
    console.log("Selected recipe list:", selectedList);
  }

</script>

<svelte:head>
  <title>Recipes</title>
</svelte:head>

<div class="grid grid-cols-8 p-10">
  <div class="col-span-2">
    <h1 class="text-2xl font-bold flex items-center"><ScrollText class="inline-block mr-2" /> Your Recipes</h1>
  </div>
  <div class="col-span-4 flex items-center gap-2">
    <RecipeSelect {user} bind:recipeLists bind:selectedList />
    <AddListDialog />
  </div>
  <div class="col-span-8 mt-10">
    <RecipeTable bind:selectedList />
    <Button class="mt-4" variant="primary" size="sm" onclick={logSelectedList}>
      Log Selected List
    </Button>
  </div>
</div>