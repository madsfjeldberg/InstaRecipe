<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  import { isAuthenticated } from "../stores/authStore.js";
  
  onMount(() => {
    // Check if the user is authenticated
    if ($isAuthenticated) {
      // If so, redirect to the explore page
      goto("/explore");
    }
  });
</script>

<svelte:head>
  <title>InstaRecipe | Home</title>
</svelte:head>

<h1 class="font-bold text-3xl text-center dark:text-gray-200">Home</h1>
