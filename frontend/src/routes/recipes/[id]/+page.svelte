<script>
    import { onMount } from "svelte";
    import { Stretch } from "svelte-loading-spinners";
    import { getRecipeById } from "$lib/api/recipeApi.js";
    import DoughnutChart from "$lib/components/ChartJs/DoughnutChart.svelte";
    import BarChart from "$lib/components/ChartJs/BarChart.svelte";


    let recipe = $state(null);
    let isLoading = $state(true);

    onMount(async () => {
        const recipeId = location.href.split("/").pop();
        recipe = await getRecipeById(recipeId);
        recipe = recipe.data;
        console.log(recipe);

        isLoading = false;
    });
</script>

<div class="min-h-screen p-4 flex flex-col items-center">
    {#if isLoading}
      <Stretch size="60" color="#105e7f" />

    {:else if recipe}
      <!-- Header & Image -->
      <div class="w-full max-w-3xl text-center">
        <h1 class="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">{recipe.name}</h1>
        <h1>IMAGE GOES HERE</h1>
        {#if recipe.imageUrl}
          <img src="{recipe.imageUrl}" alt="{recipe.name}" class="w-full h-64 object-cover rounded-2xl mb-6" />
        {/if}
  
        <!-- Tags -->
        <div class="flex justify-between items-center mb-4">
          <!-- <div class="flex space-x-2">
            {#each recipe.tags ?? [] as tag}
              <span class="px-3 py-1 bg-indigo-200 text-indigo-800 rounded-full text-sm">{tag}</span>
            {/each}
          </div> -->
        </div>
  
      
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">Created: {new Date(recipe.createdAt).toLocaleDateString()} | Updated: {new Date (recipe.updatedAt).toLocaleDateString()}</p>
  
      
        <section class="mb-8">
          <p class="text-center text-gray-700 dark:text-gray-300 mx-auto max-w-2xl">{recipe.description}</p>
        </section>
  
        <!-- Diagrams -->
        <div class="grid sm:grid-cols-2 gap-60 mb-8 ">

          <div class="flex flex-col items-center">
            <p class="text-lg text-gray-700 dark:text-gray-300 mb-4">Calories per Ingredient</p>
            <DoughnutChart labels={recipe.ingredientsList.map((ingredient) => {return ingredient.name})} data={recipe.ingredientsList.map((ingredient) => {return ingredient.calories})}/>
          </div>

          <div class="flex flex-col items-center">
            <p class="text-lg text-gray-700 dark:text-gray-300 mb-4">Macros per ingredient</p>
             <BarChart ingredientsList={recipe.ingredientsList}/>
          </div>

        </div>

        <div class="border-t-2 dark:border-gray-700 mb-8"></div>
  
        <!-- Totals -->
        <div class="mb-8 text-center">
          <p class="text-gray-800 dark:text-gray-200">Total Calories: {recipe.ingredientsList.reduce((sum, ingredient) => sum + ingredient.calories, 0)}kcal</p>
          <p class="text-gray-800 dark:text-gray-200">Total Macros: Protein {recipe.ingredientsList.reduce((sum, i) => sum + i.protein, 0).toFixed(2)}g | Fat {recipe.ingredientsList.reduce((sum, i) => sum + i.fat, 0).toFixed(2)}g | Carbs {recipe.ingredientsList.reduce((sum, i) => sum + i.carbs, 0).toFixed(2)}g</p>
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
  
        <!-- ingredientsList & Instructions -->
        <div class="grid sm:grid-cols-2 gap-8">
          <section>
            <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">ingredientsList</h2>
            <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              {#each recipe.ingredientsList as ingredient}
                <li>
                  <span class="font-medium">{ingredient.name}</span>: {ingredient.servingSize}g
                </li>
              {/each}
            </ul>
          </section>
          <section>
            <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Instructions</h2>
            <p class="whitespace-pre-line text-gray-700 dark:text-gray-300">{recipe.instructions}</p>
          </section>
        </div>

        <div class="flex space-x-4 mt-12">
          <button class="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition">
            <span>👍</span><span>{recipe.likes.length}</span>
          </button>
          <button class="flex items-center space-x-1 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition">
            <span>👎</span><span>{recipe.dislikes.length}</span>
          </button>
        </div>
      </div>
    {:else}
      <p class="text-gray-700 dark:text-gray-300">No recipe data available.</p>
    {/if}
  </div>