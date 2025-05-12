<script>
  import { isAuthenticated } from "../stores/authStore";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";


  onMount(() => {
    // Check if the user is authenticated
    if ($isAuthenticated) {
      // If so, redirect to the dashboard page
      goto("/dashboard");
    }
  });
</script>

<svelte:head>
  <title>InstaRecipe | Home</title>
</svelte:head>

<h1 class="font-bold text-3xl text-center dark:text-gray-200">Home</h1>