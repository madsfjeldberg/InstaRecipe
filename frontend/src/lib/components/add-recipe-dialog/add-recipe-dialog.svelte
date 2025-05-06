<script>
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import Textarea from "../ui/textarea/textarea.svelte";
  import CategorySelect from "../category-select/category-select.svelte";
  import { onMount } from "svelte";
  import { addRecipe, getCategories } from "$lib/api/recipeApi";
  import { z } from "zod";
  import { toast } from "svelte-sonner";

  // selectedList needs to be bound here, so we can update it and force 
  // an update in the parent component
  let { selectedList = $bindable(), categories } = $props();

  let isDialogOpen = $state(false); // control state of the dialog/sheet

  // Fetch categories once when the component mounts
  // onMount(async () => {
  //   categories = await getCategories();
  // });

  let errors = $state({
    form: "",
    name: "",
    description: "",
    ingredients: "",
    instructions: "",
    category: "",
    calories: "",
  });

  const addRecipeRequest = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    ingredients: z.string().min(1, "Ingredients are required"),
    instructions: z.string().min(1, "Instructions are required"),
    category: z.string().min(1, "Category is required"),
    calories: z.number().positive("Calories must be a positive number"),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = formData.get('recipeName');
    const description = formData.get('description');
    const ingredients = formData.get('ingredients');
    const instructions = formData.get('instructions');
    const category = formData.get('category');
    const calories = parseFloat(formData.get('calories'));
    const recipeListId = selectedList.id;

    try {
      let response;
      let success = addRecipeRequest.parse({
        name,
        description,
        ingredients,
        instructions,
        category,
        calories,
      });
      response = await addRecipe(
        name,
        description,
        ingredients,
        instructions,
        category,
        calories,
        recipeListId
      );
      console.log(response);
      if (response.status === 201) {
        await toast.success("Recipe added successfully!");
        selectedList.updatedAt = new Date().toISOString(); // Ensure updatedAt is a string in ISO format
        selectedList = { ...selectedList };
        errors = {
          form: "",
          name: "",
          description: "",
          ingredients: "",
          instructions: "",
          category: "",
          calories: "",
        };
        isDialogOpen = false; // Close the dialog
      } else {
        errors = { ...errors, form: response.message };
      }
    } catch (error) {
      console.log("inside catch, error: ", error);
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path[0] in errors) {
            errors[err.path[0]] = err.message;
          }
        });
      } else {
        errors.form = error.message || "An unexpected error occurred";
      }
    }
  };

 </script>

<Sheet.Root bind:open={isDialogOpen}>
  <Sheet.Trigger let:props>
    {#snippet child({props})}
    <Button
      {...props}
    >Add Recipe
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
            <Label for="recipeName" class="text-right">Name</Label>
            <Input id="recipeName" placeholder="Recipe Name" name="recipeName" class="col-span-3" />
            {#if errors.recipeName}
              <p class="text-red-500 col-span-4">{errors.recipeName}</p>
            {/if}
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="description" class="text-right">Description</Label>
            <Textarea id="description" placeholder="Recipe description" name="description" class="col-span-3" />
            {#if errors.description}
              <p class="text-red-500 col-span-4">{errors.description}</p>
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
            <div class="col-span-3">
            <CategorySelect {categories} name="category" />
          </div>
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
      </form>
    </Sheet.Header>
  </Sheet.Content>
</Sheet.Root>