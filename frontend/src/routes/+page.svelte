<script>
  import { isAuthenticated } from "$lib/stores/authStore";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<h1 class="font-bold text-3xl text-center dark:text-gray-200">Home</h1>