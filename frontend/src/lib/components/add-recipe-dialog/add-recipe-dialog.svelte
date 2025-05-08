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
  import MultiSelect from "../MultiSelect/MultiSelect.svelte";
  import { LoaderCircle } from "lucide-svelte";
  // import { recipeTags } from "../../../stores/tagsStore.js";

  // selectedList needs to be bound here, so we can update it and force 
  // an update in the parent component
  let { selectedList = $bindable(), categories, tags } = $props();

  let selectedTags = $state([]);
  // let tags = $state($recipeTags);

  let isLoading = $state(false);
  let isDialogOpen = $state(false); // control state of the dialog/sheet


  let errors = $state({
    form: "",
    name: "",
    description: "",
    ingredients: "",
    instructions: "",
    category: "",
  });

  const addRecipeRequest = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    ingredients: z.string().min(1, "Ingredients are required"),
    instructions: z.string().min(1, "Instructions are required"),
    category: z.string().min(1, "Category is required"),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = formData.get('recipeName');
    const description = formData.get('description');
    const ingredients = formData.get('ingredients');
    const instructions = formData.get('instructions');
    const category = formData.get('category');
    const recipeListId = selectedList.id;
    
    try {
      let response;
      let success = addRecipeRequest.parse({
        name,
        description,
        ingredients,
        instructions,
        category,
      });
      
      isLoading = true;
      response = await addRecipe(
        name,
        description,
        ingredients,
        instructions,
        category,
        selectedTags,
        recipeListId
      );

      if (response.status === 201) {
        const newRecipe = response.data.recipe;
        newRecipe.ingredientsList = response.data.ingredients;
        console.log("newRecipe: ", newRecipe);

        selectedList.updatedAt = new Date().toISOString(); // Ensure updatedAt is a string in ISO format
        selectedList = { ...selectedList};
        selectedList.recipes.push(newRecipe)

        errors = {
          form: "",
          name: "",
          description: "",
          ingredients: "",
          instructions: "",
          // category: "",
        };
        selectedTags = [];
        isDialogOpen = false; // Close the dialog
        await toast.success("Recipe added successfully!");
        
      } else {
        errors = { ...errors, form: response.message };
      }

    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path[0] in errors) {
            errors[err.path[0]] = err.message;
          }
        });

      } else {
        errors.form = error.message || "An unexpected error occurred";
      }

    } finally {
      isLoading = false;
    }
  };

 </script>

<!-- TODO REMOVE DEFAULT VALUES THESE ARE ONLY FOR TESTING -->
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
            <Input id="recipeName" placeholder="Grandma's lasagna" name="recipeName" class="col-span-3" value="Grandma's lasagna"/>
            {#if errors.recipeName}
              <p class="text-red-500 col-span-4">{errors.recipeName}</p>
            {/if}
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="description" class="text-right">Description</Label>
            <Textarea id="description" placeholder="The best recipe to ever do it." name="description" class="col-span-3" value="The best recipe to ever do it." />
            {#if errors.description}
              <p class="text-red-500 col-span-4">{errors.description}</p>
            {/if}
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="ingredients" class="text-right">Ingredients</Label>
            <Textarea id="ingredients" placeholder="200g minced beef, 100g carrots, 50g butter" name="ingredients" class="col-span-3" value="200g minced beef, 100g carrots, 50g butter"/>
            {#if errors.ingredients}
              <p class="text-red-500 col-span-4">{errors.ingredients}</p>
            {/if}
          </div>
        </div>

        <div class="grid gap-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="instructions" class="text-right">Instructions</Label>
            <Textarea id="instructions" placeholder="Brown the beef on medium-high. Add carrots and butter." name="instructions" class="col-span-3" value="Brown the beef on medium-high. Add carrots and butter."/>
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
            <Label for="category" class="text-right">Tags</Label>
            <div class="col-span-3">
              <MultiSelect bind:selectedItems={selectedTags} items={tags} selectPlaceholder="Select tags..."/>
              <p class="text-xs mt-1">Max 3 tags</p>
            </div>
          </div>
        </div>

        <Sheet.Footer>
          {#if isLoading}
            <Button type="submit" disabled>
              <LoaderCircle/>
              Saving...
            </Button>

          {:else}
            <Button type="submit">Save</Button>

          {/if}
        </Sheet.Footer>
        
      </form>
    </Sheet.Header>
  </Sheet.Content>
</Sheet.Root>