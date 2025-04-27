<script>
  import Recipetable from "$lib/components/recipetable/recipetable.svelte";


  import Button from "$lib/components/ui/button/button.svelte";
  import { Plus } from "lucide-svelte";

</script>

<div class="grid grid-cols-8 p-10">
  <div class="col-span-8 md:col-span-2">
    <h1 class="text-2xl font-bold">Your Recipes</h1>
    <Button
      class="mt-4"
      variant="secondary"
      href="/recipes"
    ><Plus />Add Recipe</Button>
  </div>
  <div class="col-span-8 mt-10">
    <Recipetable />
  </div>
</div>