<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import Navbar from "$lib/components/Navbar/Navbar.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { isAuthenticated } from "../stores/authStore.js";
  import { Leaf, List, Search, ShoppingBasket } from "lucide-svelte";

  onMount(() => {
    if ($isAuthenticated) goto("/explore");
  });
</script>

<svelte:head>
  <title>InstaRecipe | Discover & Share Recipes</title>
</svelte:head>

<div class="flex-grow">
  <div class="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 text-center py-16 lg:py-32">
    <h1 class="text-4xl md:text-5xl font-extrabold text-foreground">Discover & Share Recipes</h1>
    <p class="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
      Collect your favorite recipes in one place, using AI.
    </p>
    <div class="mt-8 flex justify-center gap-4">
      <Button onclick={() => goto("/explore")} size="lg">Explore Recipes</Button>
      <Button onclick={() => goto("/register")} variant="outline" size="lg">Get Started</Button>
    </div>

    <Separator class="my-16" />

    <div class="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
      <div class="flex flex-col items-center px-4">
        <Search class="h-10 w-10"/>
        <h3 class="mt-4 text-xl font-semibold text-foreground">Powerful Search</h3>
        <p class="mt-2 text-muted-foreground">
          Quickly find recipes by name, ingredient or cuisine.
        </p>
      </div>
      <div class="flex flex-col items-center px-4">
        <List class="h-10 w-10"/>
        <h3 class="mt-4 text-xl font-semibold text-foreground">Favorites & Lists</h3>
        <p class="mt-2 text-muted-foreground">
          Save what you love and organize into custom lists.
        </p>
      </div>
      <div class="flex flex-col items-center px-4">
        <ShoppingBasket class="h-10 w-10"/>
        <h3 class="mt-4 text-xl font-semibold text-foreground">Grocery Lists</h3>
        <p class="mt-2 text-muted-foreground">
          Auto-generate shopping lists from any recipe.
        </p>
      </div>
      <div class="flex flex-col items-center px-4">
        <Leaf class="h-10 w-10"/>
        <h3 class="mt-4 text-xl font-semibold text-foreground">Macros</h3>
        <p class="mt-2 text-muted-foreground">
          Generate nutritional information for any recipe.
        </p>
      </div>
    </div>
  </div>
</div>