<script>
  import { onMount } from "svelte";

  import { z } from "zod";
  import { toast } from "svelte-sonner";

  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";

  import CategorySelect from "$lib/components/category-select/category-select.svelte";
  import MultiSelect from "../MultiSelect/MultiSelect.svelte";
  import ErrorMessage from "$lib/components/ErrorMessage/ErrorMessage.svelte";

  import { addRecipe, getCategories } from "$lib/api/recipeApi";
  import { scrapeLink } from "$lib/api/scrapeApi";

  import { LoaderCircle } from "lucide-svelte";
  // import { recipeTags } from "../../../stores/tagsStore.js";

  // selectedList needs to be bound here, so we can update it and force 
  // an update in the parent component
  let { selectedList = $bindable(), categories, tags } = $props();

  let selectedTags = $state([]);
  let counter = $state(0);
  // let tags = $state($recipeTags);

  let isLoading = $state(false);
  let isDialogOpen = $state(false); // control state of the dialog/sheet
  let inputMode = $state("link"); // control between link and manual input

  const resetErrors = () => {
  return {
    form: "",
    name: "",
    description: "",
    ingredients: "",
    instructions: "",
    category: "",
    url: "",
    };
  }

  let errors = $state(resetErrors());

  const linkRequest = z.object({
    url: z.string().url("Invalid URL").min(1, "URL is required"),
  })

  const addRecipeRequest = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    ingredients: z.string().min(1, "Ingredients are required"),
    instructions: z.string().min(1, "Instructions are required"),
    category: z.string().min(1, "Category is required"),
  });



  const startTimer = () => {
    const intervalId = setInterval(() => counter++, 1000);
    return intervalId;
  }



  const handleLinkSubmit = async (event) => {
    event.preventDefault();
    errors = resetErrors();
    const intervalId = startTimer();
  
    const formData = new FormData(event.target);
    const url = formData.get('url');
    const recipeListId = selectedList.id;

    try {
      let response;
      let success = linkRequest.parse({ url });
      
      isLoading = true;
      
      let generatedRecipe = await scrapeLink(url);
      console.log("generatedRecipe", generatedRecipe);

      if (generatedRecipe.status !== 200) {
        errors = { ...errors, form: generatedRecipe.data.message };
        return;
      }

      let { name, description, ingredientsInGrams, instructions, category, tags, image } = generatedRecipe.data;
      response = await addRecipe(
        name,
        description,
        ingredientsInGrams,
        instructions,
        category,
        tags,
        image,
        recipeListId
      );

      if (response.status === 201) {
        const newRecipe = response.data.recipe;
        newRecipe.ingredientsList = response.data.ingredients;

        selectedList.updatedAt = new Date().toISOString(); // Ensure updatedAt is a string in ISO format
        selectedList = { ...selectedList};
        selectedList.recipes.push(newRecipe);
        
        errors = resetErrors();
        selectedTags = [];
        isDialogOpen = false; // Close the dialog
        await toast.success("Recipe added successfully!");
        
      } else {
        errors = { ...errors, form: response.message };
      }
      
      isLoading = false;
      
    } catch (error) {

      if (error instanceof z.ZodError) {
        errors = resetErrors();
        error.errors.forEach((err) => {
          if (err.path[0] in errors) {
            errors[err.path[0]] = err.message;
          }
        });
      } else {
        errors = {
          ...resetErrors(),
          form: error.message || "An unexpected error occurred",
        };
      }

    } finally {
      counter = 0;
      clearInterval(intervalId)
      isLoading = false;
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = formData.get('recipeName');
    const description = formData.get('description');
    const ingredients = formData.get('ingredients');
    const instructions = formData.get('instructions');
    const category = formData.get('category');
    const image = null;
    const recipeListId = selectedList.id;
    console.log("recipeListId", recipeListId);
    
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
        image,
        recipeListId
      );

      if (response.status === 201) {
        const newRecipe = response.data.recipe;
        newRecipe.ingredientsList = response.data.ingredients;

        selectedList.updatedAt = new Date().toISOString(); // Ensure updatedAt is a string in ISO format
        selectedList = { ...selectedList};
        selectedList.recipes.push(newRecipe)

        errors = resetErrors();
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

      <RadioGroup.Root bind:value={inputMode}>
        <div class="flex items-center space-x-2">
          <RadioGroup.Item value="link" id="r1" />
          <Label for="r1">Link</Label>
        </div>

        <div class="flex items-center space-x-2">
          <RadioGroup.Item value="manual" id="r2" />
          <Label for="r2">Manual</Label>
        </div>
      </RadioGroup.Root>

      {#if inputMode == "link"}
      <form onsubmit={handleLinkSubmit}>
        
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <ErrorMessage message={errors.form} className="col-span-4 mx-auto" />
            <Label for="url" class="text-right">Link</Label>
            <Input id="url" placeholder="URL" name="url" class="col-span-3" />
            <ErrorMessage message={errors.url} className="col-span-3 col-end-5" />
          </div>
        </div>
        <Sheet.Footer>
          {#if isLoading}
          <div class="flex items-center">
            <p class="mr-3 text-sm"><i>Current: {counter} sec</i></p>
             <Button type="submit" disabled>
               <LoaderCircle class="animate-spin"/>
               Generating...
              </Button>
            </div>
          {:else}
            <Button type="submit">Generate</Button>
          {/if}
        </Sheet.Footer>
      </form>

      {:else if inputMode == "manual"}
      <form onsubmit={handleSubmit}>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="recipeName" class="text-right">Name</Label>
            <Input id="recipeName" placeholder="Grandma's lasagna" name="recipeName" class="col-span-3"/>
            <ErrorMessage message={errors.name} className="col-span-3 col-end-5" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="description" class="text-right">Description</Label>
            <Textarea id="description" placeholder="The best recipe to ever do it." name="description" class="col-span-3" />
            <ErrorMessage message={errors.description} className="col-span-3 col-end-5" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="ingredients" class="text-right">Ingredients</Label>
            <Textarea id="ingredients" placeholder="200g minced beef, 100g carrots, 50g butter" name="ingredients" class="col-span-3" />
            <ErrorMessage message={errors.ingredients} className="col-span-3 col-end-5" />
          </div>
        </div>

        <div class="grid gap-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="instructions" class="text-right">Instructions</Label>
            <Textarea id="instructions" placeholder="Brown the beef on medium-high. Add carrots and butter." name="instructions" class="col-span-3" />
            <ErrorMessage message={errors.instructions} className="col-span-3 col-end-5" />
          </div>

          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="category" class="text-right">Category</Label>
            <div class="col-span-3">
              <CategorySelect {categories} name="category" />
            </div>
            <ErrorMessage message={errors.category} className="col-span-3 col-end-5" />
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
              <LoaderCircle class="animate-spin"/>
              Saving...
            </Button>

          {:else}
            <Button type="submit">Save</Button>

          {/if}
        </Sheet.Footer>
        
      </form>
      {/if}
    </Sheet.Header>
  </Sheet.Content>
</Sheet.Root>