<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import Button from "$lib/components/ui/button/button.svelte";
  import { LoaderCircle } from "lucide-svelte";

  // export let data;
  const { data } = $props();
  const { user } = data;
  let recipeData = $state({ ingredientsWithMacros: [], macros: {} });
  let url = $state("");
  let loading = $state(false);

  let username = user.username;

  const scrapeSite = async () => {
    
    loading = (true); // Set loading to true when scraping starts
    const response = await fetch("http://localhost:9000/api/scrape", { // Added http://
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      loading = (false); // Set loading to false if the response is not ok
      throw new Error("Failed to scrape the site");
    }

    const result = await response.json();
    console.log(result.name); // Log the result to the console
    recipeData = result; // Update the recipeData with the result
    loading = (false); // Set loading to false when scraping is done
    return result;
  }

</script>

<svelte:head>
  <title>Dashboard</title>
</svelte:head>


<h1 class="font-bold text-3xl text-center dark:text-gray-200">Welcome to the Dashboard, {username}!</h1>
<h2 class="font-bold text-xl text-center dark:text-gray-200">This means you're logged in :)</h2>
  <input type="text" placeholder="Feed me seymour..." bind:value={url} />
  {#if loading}
    <Button disabled><LoaderCircle class="mr-2 h-10 w-10  animate-spin inline-block" />Generating...</Button>
  {:else}
  <Button onclick={scrapeSite}>Scrape</Button>
  {/if}
<p>{recipeData.name}</p>
<br>
<p>{recipeData.ingredients}</p>
<br>
<p>{recipeData.instructions}</p>
<br>
<p>{recipeData.category}</p>
<br>
<br>
{#each recipeData.ingredientsWithMacros as ingredient}
  <div>
    <p>{ingredient.name}</p>
    <p>{ingredient.servingSize} g</p>
    <p>{ingredient.calories} calories</p>
    <p>{ingredient.protein} protein</p>
    <p>{ingredient.fat} fat</p>
    <p>{ingredient.carbs} carbs</p>
  </div>
{/each}
<!-- <p>{recipeData.ingredientsWithMacros}</p> -->
<br>

<p>TOTAL:</p>
  <div>
    <p>{recipeData.macros.calories} calories</p>
    <p>{recipeData.macros.protein} protein</p>
    <p>{recipeData.macros.fat} fat</p>
    <p>{recipeData.macros.carbs} carbs</p>
  </div>