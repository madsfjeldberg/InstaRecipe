<script>
    import { onMount } from "svelte";
    import { Stretch } from "svelte-loading-spinners";
    import { getRecipeById } from "$lib/api/recipeApi.js";

    console.log("jjjija");

    let recipe = $state(null);
    let isLoading = $state(true);

    onMount(async () => {
        const recipeId = location.href.split("/").pop();
        recipe = await getRecipeById(recipeId);
        recipe = recipe.data;
        console.log(recipe);

        isLoading = false;
        console.log("inside mount");
    });
</script>

<div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 flex flex-col items-center">
    {#if isLoading}
      <Stretch size="60" color="#105e7f" />
    {:else if recipe}
      <!-- Header & Image -->
      <div class="w-full max-w-3xl text-center">
        <h1 class="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">{recipe.name}</h1>
        {#if recipe.imageUrl}
          <img src="{recipe.imageUrl}" alt="{recipe.name}" class="w-full h-64 object-cover rounded-2xl mb-6" />
        {/if}
  
        <!-- Tags & Actions Row -->
        <div class="flex justify-between items-center mb-4">
          <div class="flex space-x-2">
            {#each recipe.tags ?? [] as tag}
              <span class="px-3 py-1 bg-indigo-200 text-indigo-800 rounded-full text-sm">{tag}</span>
            {/each}
          </div>
          <div class="flex items-center space-x-4">
            <button class="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition">
              <span>👍</span><span>{recipe.likes.length}</span>
            </button>
            <button class="flex items-center space-x-1 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition">
              <span>👎</span><span>{recipe.dislikes.length}</span>
            </button>
          </div>
        </div>
  
        <!-- Dates -->
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">Created: {recipe.createAt} | Updated: {recipe.updatedAt}</p>
  
        <!-- Description -->
        <section class="mb-8">
          <p class="text-center text-lg text-gray-700 dark:text-gray-300 mx-auto max-w-2xl">{recipe.description}</p>
        </section>
  
        <!-- Diagrams -->
        <div class="grid sm:grid-cols-2 gap-6 mb-8">
          <div class="flex flex-col items-center">
            <!-- Macro Circle Diagram Placeholder -->
            <div class="w-40 h-40 rounded-full border-4 border-blue-500 flex items-center justify-center mb-2">
              <span class="text-xl font-semibold text-blue-500">Macros</span>
            </div>
            <p class="text-gray-700 dark:text-gray-300">Calories per Ingredient</p>
          </div>
          <div class="flex flex-col items-center">
            <!-- Calories Circle Diagram Placeholder -->
            <div class="w-40 h-40 rounded-full border-4 border-green-500 flex items-center justify-center mb-2">
              <span class="text-xl font-semibold text-green-500">Calories</span>
            </div>
            <p class="text-gray-700 dark:text-gray-300">Total Calories</p>
          </div>
        </div>
  
        <!-- Totals -->
        <div class="mb-8 text-center">
          <p class="text-lg text-gray-800 dark:text-gray-200">Total Calories: {recipe.calories}</p>
          <p class="text-lg text-gray-800 dark:text-gray-200">Total Macros: Protein {recipe.ingredients.reduce((sum, i) => sum + i.macros.protein, 0)}g | Fat {recipe.ingredients.reduce((sum, i) => sum + i.macros.fat, 0)}g | Carbs {recipe.ingredients.reduce((sum, i) => sum + i.macros.carbs, 0)}g</p>
        </div>
  
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
  
        <!-- Ingredients & Instructions -->
        <div class="grid sm:grid-cols-2 gap-8">
          <section>
            <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Ingredients</h2>
            <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              {#each recipe.ingredients as ing}
                <li>
                  <span class="font-medium">{ing.name}</span>: {ing.amount}
                </li>
              {/each}
            </ul>
          </section>
          <section>
            <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Instructions</h2>
            <p class="whitespace-pre-line text-gray-700 dark:text-gray-300">{recipe.instructions}</p>
          </section>
        </div>
      </div>
    {:else}
      <p class="text-gray-700 dark:text-gray-300">No recipe data available.</p>
    {/if}
  </div>