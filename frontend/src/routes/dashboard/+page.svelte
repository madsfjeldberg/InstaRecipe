<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  export let data;
  const { user } = data;

  let username = user.username;

</script>


<h1 class="font-bold text-3xl text-center dark:text-gray-200">Welcome to the Dashboard, {username}!</h1>
<h2 class="font-bold text-xl text-center dark:text-gray-200">This means you're logged in :)</h2>