<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  export let data;
  const { user } = data;

  let username = user.username;

  async function test() {
    console.log("asfda")

    const response = await fetch("https://api.calorieninjas.com/v1/nutrition?query="+"200g chicken, 51g brocoli", {
      headers: {
        "X-Api-Key": "C3Fd5ykDV1g1T5sRhK6Nxg==UHOtfGzcE89aZYxU"
      }
    });

    const result = await response.json();
    console.log(result);
    
  }
</script>

<svelte:head>
  <title>Dashboard</title>
</svelte:head>


<h1 class="font-bold text-3xl text-center dark:text-gray-200">Welcome to the Dashboard, {username}!</h1>
<h2 class="font-bold text-xl text-center dark:text-gray-200">This means you're logged in :)</h2>

<button onclick={test}>Test</button>