<script>
    import { onMount } from "svelte";
    import { Stretch } from "svelte-loading-spinners";
    import DoughnutChart from "$lib/components/ChartJs/DoughnutChart.svelte";
    import BarChart from "$lib/components/ChartJs/BarChart.svelte";
    import { Toaster } from "$lib/components/ui/sonner";
    import { toast } from "svelte-sonner";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Root } from "$lib/components/ui/button";
    import { Separator } from "$lib/components/ui/separator";
    import { ArrowLeft, ThumbsDown, ThumbsUp } from "lucide-svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import Badge from "$lib/components/ui/badge/badge.svelte";
    import { LoaderCircle } from "lucide-svelte";
    import { getRecipeById } from "$lib/api/recipeApi.js";
    import groceryListApi from "$lib/api/groceryListApi";
    
    let recipe = $state(null);
    let isLoading = $state(true);
    let isGroceryListGenerating = $state(false)

    onMount(async () => {
        const recipeId = location.href.split("/").pop();

        try{
          recipe = await getRecipeById(recipeId);

        } catch(error) {
          toast.error("Could not load recipe, try again later")
        
        } finally {
          isLoading = false;
        }
    });



    async function generateShoppingList() {
      const groceryList = recipe.ingredientsList.map( (ingredient) => {
        return {name: ingredient.name, measurements: ingredient.servingSize};
      });

      try{
        isGroceryListGenerating = true;

        // const response = await groceryListApi.sendGroceryList(recipe.name, groceryList);
        const response = await groceryListApi.sendGroceryList(recipe.name, groceryList);
        if(response.errorMessage) {
          toast.error(response.errorMessage)
          return;
        }

        toast.success("Grocery list has been generated and sent to your email");

      }catch(error) {
        toast.error(error.message);

      }finally {
        isGroceryListGenerating = false;
      }
    }
</script>

<div class="p-4 flex flex-col items-center">
    {#if isLoading}
    <div class="flex flex-col items-center justify-center h-screen">
      <Stretch size="60" color="#105e7f" /><span>Loading...</span>
    </div>

    {:else if recipe}
      <!-- Header & Image -->
       <div class="flex justify-start w-full mb-4">
        <Button variant="ghost" class="flex items-center hover:bg-primary hover:text-secondary" onclick={() => history.back()}>
          <ArrowLeft class="mr-2" />Back
        </Button>
      </div>
      <div class="w-full">
        <div>
          <div>
            <Badge>{recipe.category.name}</Badge>
          </div>
          <div>
            {#if recipe.tags}
              {#each recipe.tags as tag}
                <Badge class="mt-2 mb-4 mr-2 bg-cyan-800">{tag.name}</Badge>
              {/each}
            {/if}
          </div>
        </div>
        

        <h1 class="text-5xl text-left font-bold text-gray-900 dark:text-gray-100 mb-4">{recipe.name}</h1>
        <h2 class="text-left text-gray-700 dark:text-gray-300 mx-auto">{recipe.description}</h2>
        
        <p class="text-right">IMAGE GOES HERE</p>
        {#if recipe.imageUrl}
          <img src="{recipe.imageUrl}" alt="{recipe.name}" class="w-full h-64 object-cover rounded-2xl mb-6" />
        {/if}
  
        
  
        <div class="mb-8 text-left">
          <br>
          <p class="text-gray-800 dark:text-gray-200">Calories: {recipe.ingredientsList.reduce((sum, ingredient) => sum + ingredient.calories, 0).toFixed()}kcal</p>
          <br>
          <p class="text-gray-800 dark:text-gray-200">Protein {recipe.ingredientsList.reduce((sum, i) => sum + i.protein, 0).toFixed()}g</p>
          <p> Fat {recipe.ingredientsList.reduce((sum, i) => sum + i.fat, 0).toFixed()}g</p> 
          <p> Carbs {recipe.ingredientsList.reduce((sum, i) => sum + i.carbs, 0).toFixed()}g</p>
        </div>
        
  
      
        <section class="mb-8">
          
        </section>

        <!-- Ingredients & Instructions Card -->
        <Card.Root class="shadow-lg flex flex-row w-full mb-8">
          <!-- Ingredients Section -->
          <div class="flex-1 p-6">
            <Card.Header>
              <Card.Title class="text-2xl text-left">Ingredients</Card.Title>
              <Separator />
            </Card.Header>
            <Card.Content>
              <ul class="list-inside space-y-1">
                {#each recipe.ingredientsList as ingredient}
                  <li class="cursor-pointer text-left">
                    <span class="font-medium">{ingredient.name}</span>: {ingredient.servingSize}g
                  </li>
                {/each}
              </ul>
            </Card.Content>
          </div>
          <!-- Instructions Section -->
          <div class="flex-1 p-6">
            <Card.Header>
              <Card.Title class="text-2xl text-left">Instructions</Card.Title>
              <Separator />
            </Card.Header>
            <Card.Content>
              <p class="whitespace-pre-line text-left">{recipe.instructions}</p>
            </Card.Content>
          </div>
        </Card.Root>

        
          {#if isGroceryListGenerating}
            <Button disabled> <LoaderCircle class="mr-2 h-4 w-4 animate-spin" /> Generating...</Button>
            {:else}
            <Button onclick={generateShoppingList}>Generate shopping list</Button>
          {/if}
        
  

        <!-- Diagrams & Comment Grid -->
        <div class="grid grid-cols-2 gap-8 mb-8">
          <!-- Left Side: Info (empty for now, or add more info here if needed) -->
          <div class="col-span-1">
            <h1 class=" text-3xl text-left font-semibold">Comments:</h1>
            <div class="bg-gray-100 dark:bg-gray-800 rounded-lg">
            <span class="text-gray-500 dark:text-gray-400 italic">No comments yet. Be the first to comment!</span>
          </div>
          </div>
          <!-- Comments Placeholder -->
          
          <!-- Right Side: Diagrams -->
          <div class="col-span-1  flex flex-col space-y-8">
            <div class="flex flex-col items-center">
              <p class="text-lg text-gray-700 dark:text-gray-300 mb-4">Calories per Ingredient</p>
              <div style="width: 250px; height: 250px;">
              <DoughnutChart
                labels={recipe.ingredientsList.map((ingredient) => ingredient.name)}
                data={recipe.ingredientsList.map((ingredient) => ingredient.calories)}
                width={250}
                height={250}
              />
              </div>
            </div>
            <div class="flex flex-col items-center">
              <p class="text-lg text-gray-700 dark:text-gray-300 mb-4">Macros per ingredient</p>
              <BarChart ingredients={recipe.ingredientsList} />
            </div>
          </div>
        </div>

        <!-- TODO add est time and servings -->
        <!-- Info Row -->
        <div class="flex justify-center space-x-12 mb-8">
          {#if recipe.estimatedTime}
            <div class="text-center">
              <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-400">Est. Time</h3>
              <p class="text-md text-gray-800 dark:text-gray-200">{recipe.estimatedTime}</p>
            </div>
          {/if}

          {#if recipe.servings}
            <div class="text-center">
              <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-400">Servings</h3>
              <p class="text-md text-gray-800 dark:text-gray-200">{recipe.servings}</p>
            </div>
          {/if}
        </div>
  
        

        <div class="flex space-x-4 mt-12">
          <button class="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition">
            <span><ThumbsUp /></span><span>{recipe.likes.length}</span>
          </button>
          <button class="flex items-center space-x-1 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition">
            <span><ThumbsDown /></span><span>{recipe.dislikes.length}</span>
          </button>
        </div>
        <p class="text-sm text-right text-gray-600 dark:text-gray-300 mb-6">Created: {new Date(recipe.createdAt).toLocaleDateString()} | Updated: {new Date (recipe.updatedAt).toLocaleDateString()}</p>
      </div>
    {:else}
      <p class="text-gray-700 dark:text-gray-300">No recipe data available.</p>
    {/if}
  </div>