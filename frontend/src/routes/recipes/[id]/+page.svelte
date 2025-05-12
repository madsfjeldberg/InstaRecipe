<script>
    import { onMount } from "svelte";

    import { Stretch } from "svelte-loading-spinners";
    import DoughnutChart from "$lib/components/ChartJs/DoughnutChart.svelte";
    import BarChart from "$lib/components/ChartJs/BarChart.svelte";
    import { toast } from "svelte-sonner";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Root } from "$lib/components/ui/button";
    import { Separator } from "$lib/components/ui/separator";
    import { LoaderCircle, Zap, BicepsFlexed, CakeSlice, Wheat, ArrowLeft, ThumbsDown, ThumbsUp } from "lucide-svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import Badge from "$lib/components/ui/badge/badge.svelte";

    import { getRecipeById } from "$lib/api/recipeApi.js";
    import groceryListApi from "$lib/api/groceryListApi";
    import Comment from "$lib/components/Comments/Comment.svelte";
    import CommentInput from "$lib/components/Comments/CommentInput.svelte";
        
    let recipe = $state(null);
    let comments = $state([]);
    let checkedItems = $state([]);
    let steps = $state([]);

    let isLoading = $state(true);
    let isGroceryListGenerating = $state(false)




    onMount(async () => {
        const recipeId = location.href.split("/").pop();

        try{
          recipe = await getRecipeById(recipeId);
          steps = recipe.instructions.split(/\d+\.\s/).filter(step => step.trim());
          comments = recipe.comments;
          
        } catch(error) {
          toast.error("Could not load recipe, try again later")
          
        } finally {
          isLoading = false;
        }
    });



    const toggleItem = (name) => {
      if (checkedItems.includes(name)) {
        checkedItems = checkedItems.filter(n => n !== name);
      } else {
        checkedItems = [...checkedItems, name];
      }
    }



    const generateShoppingList = async () => {
      const groceryList = recipe.ingredientsList.map( (ingredient) => {
        return {name: ingredient.name, measurements: ingredient.servingSize};
      });

      try{
        isGroceryListGenerating = true;

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
      {#if recipe.image}
          <img src="{recipe.image}" alt="{recipe.name}" class="w-full h-64 rounded-xl object-cover mb-2" />
        {/if}
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
        

        <div class="grid grid-cols-6">          
        <h1 class="col-span-6 text-4xl text-left font-bold text-gray-900 dark:text-gray-100 mb-4">{recipe.name}</h1>
        <h2 class="col-span-3 italic text-left text-gray-700 dark:text-gray-300 mb-10 mx-auto">{recipe.description}</h2>
  
        <div class="col-span-2 col-start-1 mt-6 mb-10">
        <Card.Root class="shadow-lg rounded-2xl flex flex-col">
          <Card.Header class="w-full">
            <Card.Title class="text-2xl text-center font-bold text-gray-900 dark:text-gray-100 mb-2">Nutrition</Card.Title>
            <Separator class="mb-4" />
          </Card.Header>
            <Card.Content class="w-full">
              <div class="flex flex-col gap-4">
                <div class="flex items-center justify-between">
                  <span class="flex items-center font-medium text-gray-700 dark:text-gray-300">
                    <Zap class="text-yellow-500 mr-2" />
                    Calories
                  </span>
                  <span class="inline-block font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">{recipe.ingredientsList?.reduce((sum, i) => sum + i.calories, 0).toFixed() ?? 0} kcal</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="flex items-center font-medium text-gray-700 dark:text-gray-300">
                    <BicepsFlexed class="text-blue-500 mr-2" />
                    Protein
                  </span>
                  <span class="font-bold text-gray-900 dark:text-gray-100">{recipe.ingredientsList?.reduce((sum, i) => sum + i.protein, 0).toFixed() ?? 0} g</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="flex items-center font-medium text-gray-700 dark:text-gray-300">
                    <CakeSlice class="w-5 h-5 mr-2 text-pink-500" />
                    Fat
                  </span>
                  <span class="font-bold text-gray-900 dark:text-gray-100">{recipe.ingredientsList?.reduce((sum, i) => sum + i.fat, 0).toFixed() ?? 0} g</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="flex items-center font-medium text-gray-700 dark:text-gray-300">
                    <Wheat class="w-5 h-5 mr-2 text-green-500" />
                    Carbs
                  </span>
                  <span class="font-bold text-gray-900 dark:text-gray-100">{recipe.ingredientsList?.reduce((sum, i) => sum + i.carbs, 0).toFixed() ?? 0} g</span>
                </div>
              </div>
            </Card.Content>
        </Card.Root>
        </div>

        <div class="col-span-2 flex flex-col space-y-8 mb-10">
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
            </div>
            <div class="col-span-2 flex flex-col items-center">
              <p class="text-lg text-gray-700 dark:text-gray-300">Macros per ingredient</p>
              <BarChart ingredients={recipe.ingredientsList} />
            </div>
        
                
        </div>
  
        <!-- Ingredients & Instructions Card -->
        <Card.Root class="shadow-lg flex flex-row w-full mb-8">
          <!-- Ingredients Section -->
          <div class="flex-1 p-6">
            <Card.Header>
              <Card.Title class="text-2xl text-left">Ingredients</Card.Title>
              <Separator />
            </Card.Header>
            <Card.Content>
              <ul class="list-inside space-y-3">
                {#each recipe.ingredientsList as ingredient}
                  <li>
                  <button
                  class="cursor-pointer text-left select-none"
                    onclick={() => toggleItem(ingredient.name)}>
                    <span class={`font-medium transition-all duration-150 ${checkedItems.includes(ingredient.name) ? 'line-through text-gray-400' : ''}`}>
                      {ingredient.name}: {ingredient.servingSize}g
                      </span>
                  </button>
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
              <ol class="list-decimal list-outside whitespace-pre-line text-left space-y-6">
                {#each steps as step}
                  <li>
                    <button
                      class="cursor-pointer text-left select-none"
                      onclick={() => toggleItem(step)}>
                      <span class={`font-medium transition-all duration-150 ${checkedItems.includes(step) ? 'line-through text-gray-400' : ''}`}>
                        {step}
                      </span>
                  </button>
                  </li>
                {/each}
              </ol>
            </Card.Content>
          </div>
        </Card.Root>

        
          
        
  

        <!-- Diagrams & Comment Grid -->
        <div class="grid grid-cols-2 gap-8 mb-8">
          <!-- Left Side: Comments -->
          <div class="col-span-1">
            <h1 class=" text-3xl text-left font-semibold">Comments:</h1>
            <div class="bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Comment bind:comments recipeId={recipe.id}/>
            </div>
          </div>
          <!-- Right Side: Generate grocery list button-->
           <div class="col-span-1 col-end-4">
           {#if isGroceryListGenerating}
            <Button disabled> <LoaderCircle class="mr-2 h-4 w-4 animate-spin" /> Generating...</Button>
            {:else}
            <Button onclick={generateShoppingList}>Generate shopping list</Button>
          {/if}
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