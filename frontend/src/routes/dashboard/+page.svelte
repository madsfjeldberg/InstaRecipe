<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import Button from "$lib/components/ui/button/button.svelte";

  // export let data;
  const { data } = $props();
  const { user } = data;
  let recipeData = $state({});
  let url = $state("");

  let username = user.username;

  const scrapeSite = async () => {
    const response = await fetch("http://localhost:9000/api/scrape", { // Added http://
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error("Failed to scrape the site");
    }

    const result = await response.json();
    console.log(result.name); // Log the result to the console
    recipeData = result; // Update the recipeData with the result
    return result;
  }

</script>

<svelte:head>
  <title>Dashboard</title>
</svelte:head>


<h1 class="font-bold text-3xl text-center dark:text-gray-200">Welcome to the Dashboard, {username}!</h1>
<h2 class="font-bold text-xl text-center dark:text-gray-200">This means you're logged in :)</h2>
  <input type="text" placeholder="Feed me seymour..." bind:value={url} />
  <Button onclick={scrapeSite}>Scrape</Button>
<p>{recipeData}</p>
<p>{recipeData.name}</p>
<p>{recipeData.ingredients}</p>
<p>{recipeData.instructions}</p>
<p>{recipeData.category}</p>
<p>{recipeData.calories}</p>