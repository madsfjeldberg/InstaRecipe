<script>
  import Navlink from "$lib/components/navbar/navlink.svelte";

  let { data, children } = $props();

</script>

<svelte:head>
  <title>InstaRecipe | Settings</title>
</svelte:head>

<main
  class="flex flex-col gap-8 p-10"
>
  <div class="mx-auto grid w-full max-w-6xl gap-2">
    <h1 class="text-3xl font-semibold">Settings</h1>
  </div>
  <div
    class="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]"
  >
    <nav class="text-muted-foreground grid gap-4 text-sm"
      data-x-chunk-container="chunk-container after:right-0">
      <Navlink href="/settings/general" exact={true} >General</Navlink>
      <Navlink href="/settings/notifications" exact={true} >Notifications</Navlink>
    </nav>
    <div class="grid grid-cols-8 gap-6">
      {@render children()}
    </div>
  </div>
  
</main>