<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import Button from "$lib/components/ui/button/button.svelte";

  export let data;
  const { user } = data;

  let username = user.username;

  const scrapeSite = async () => {
    const response = await fetch("http://localhost:9000/api/scrape", { // Added http://
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ url: "https://www.instagram.com/p/C3TIKgKvAXo/" }),
    });

    if (!response.ok) {
      throw new Error("Failed to scrape the site");
    }

    const result = await response.json();
    console.log(result); // Log the result to the console
    return result;

  }

</script>

<svelte:head>
  <title>Dashboard</title>
</svelte:head>


<h1 class="font-bold text-3xl text-center dark:text-gray-200">Welcome to the Dashboard, {username}!</h1>
<h2 class="font-bold text-xl text-center dark:text-gray-200">This means you're logged in :)</h2>
<Button onclick={scrapeSite}>Scrape insta link</Button>