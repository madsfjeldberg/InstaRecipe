<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import Button from "$lib/components/ui/button/button.svelte";
  import { LoaderCircle } from "lucide-svelte";
  import { getAllRecipes } from "$lib/api/recipeApi";

  import RecipeCard from "$lib/components/RecipeCard/RecipeCard.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";

  const { data } = $props();
  const { user } = data;
  let loading = $state(false);
  let recipes = $state([]);
  let username = user.username;

  onMount(async () => {
    loading = true;
    try {
      const response = await getAllRecipes();
      recipes = response;
      console.log($state.snapshot(recipes));
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      loading = false;
    }
  });


  


</script>

<svelte:head>
  <title>Dashboard</title>
</svelte:head>

<div class="flex flex-col p-10">
<h1 class="font-bold text-3xl text-left dark:text-gray-200 mb-10">Hello, {username}!</h1>

<div class="grid grid-cols-8">
  <div class=col-span-8>
    <h2 class="font-bold text-2xl text-left dark:text-gray-200">Popular recipes</h2>
    <Separator class="mt-2 mb-6 h-[2px]" />
    <div class="grid grid-cols-3 gap-4 mt-4">
      {#if loading}
        <LoaderCircle class="animate-spin" />
      {:else if recipes.length > 0}
        {#each recipes as recipe}
          <RecipeCard recipe={recipe} />
        {/each}
      {:else}
        <p>No recipes found.</p>
      {/if}
      </div>
  </div>


</div>

</div>
