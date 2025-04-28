<script>
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import Textarea from "../ui/textarea/textarea.svelte";

  let { selectedList } = $props();

  let errors = $state({
    form: "",
    name: "",
    description: "",
    ingredients: "",
    instructions: "",
    category: "",
    calories: "",
  });

 </script>
  
  <Sheet.Root>
    <Sheet.Trigger let:props>
      {#snippet child({props})}
      <Button
        {...props}
        variant="outline"
      >Add Recipe
        <span class="sr-only">Toggle navigation menu</span>
      </Button>
      {/snippet}
    </Sheet.Trigger>
    <Sheet.Content side="right">
      <Sheet.Header>
        <Sheet.Title class="text-lg font-semibold">Add Recipe</Sheet.Title>
        <Sheet.Description>
          Fill in the details of the recipe you want to add.
        </Sheet.Description>
        <form onsubmit={handleSubmit}>
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="name" class="text-right">Name</Label>
              <Input id="name" placeholder="Recipe Name" name="name" class="col-span-3" />
              {#if errors.name}
                <p class="text-red-500 col-span-4">{errors.name}</p>
              {/if}
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="ingredients" class="text-right">Ingredients</Label>
              <Textarea id="ingredients" placeholder="List of ingredients" name="ingredients" class="col-span-3" />
              {#if errors.ingredients}
                <p class="text-red-500 col-span-4">{errors.ingredients}</p>
              {/if}
            </div>
          </div>
          <div class="grid gap-4">
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="instructions" class="text-right">Instructions</Label>
              <Textarea id="instructions" placeholder="Cooking instructions" name="instructions" class="col-span-3" />
              {#if errors.instructions}
                <p class="text-red-500 col-span-4">{errors.instructions}</p>
              {/if}
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="category" class="text-right">Category</Label>
              <Input id="category" placeholder="Recipe category" name="category" class="col-span-3" />
              {#if errors.category}
                <p class="text-red-500 col-span-4">{errors.category}</p>
              {/if}
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="calories" class="text-right">Calories</Label>
              <Input id="calories" placeholder="Calories per serving" name="calories" class="col-span-3" />
              {#if errors.calories}
                <p class="text-red-500 col-span-4">{errors.calories}</p>
              {/if}
          <Sheet.Footer>
            <Button type="submit">Save</Button>
          </Sheet.Footer>
      </Sheet.Header>
    </Sheet.Content>
  </Sheet.Root>