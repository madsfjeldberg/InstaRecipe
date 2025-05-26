<script>
  import { goto } from '$app/navigation';

  import { toast } from 'svelte-sonner';

  import { Plus, X } from 'lucide-svelte';
  import * as Card from '$lib/components/ui/card/index.js';
  import * as Select from '$lib/components/ui/select/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import Badge from '$lib/components/ui/badge/badge.svelte';

  import RecipeViews from '$lib/components/RecipePopularity/RecipeViews.svelte';
  import DeleteRecipeDialog from '$lib/components/DeleteRecipeDialog/DeleteRecipeDialog.svelte';
  import FavoritesStar from '$lib/components/FavoritesStar/FavoritesStar.svelte';
  import LikeDislikeButtonsCombined from '../RecipePopularity/LikeDislikeButtonsCombined.svelte';

  import { user } from '../../../stores/authStore.js';
  
  import recipeListApi from '$lib/api/recipelistApi.js';
  
 
  let { recipe, selectedList = $bindable(), favoritesRecipeList = $bindable(), parentUser } = $props();
  let { id, name, description, tags, category, image, totalViews } = recipe;

  let likes = $state(recipe.likes);
  let dislikes = $state(recipe.dislikes);

    
  const addRecipeToRecipeList = (event) => {
     event.stopPropagation();
     toast.info("Feature coming soon!");
  }
</script>
 
<Card.Root 
  class="group cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-[1.02] overflow-hidden"
  onclick={() => {
    goto("/recipes/" + recipe.id);
  }}
  >
  
  {#if $user}

    {#if parentUser}
      {#if selectedList && selectedList.name !== "Favorites" && parentUser.id === $user.id}
        <DeleteRecipeDialog recipeId={id} bind:selectedList />
      {/if}
    
    {:else} 
      {#if selectedList && selectedList.name !== "Favorites"}
        <DeleteRecipeDialog recipeId={id} bind:selectedList />
      {/if}
    {/if}

  {/if}

  
  <Card.Header class="p-0">
    <img
      src={image || '/recipe-image-placeholder.png'}
      alt=""
      class="w-full h-48 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
    />
    <Card.Title class="ml-4 text-xl mr-2 line-clamp-2 min-h-16">{name}</Card.Title>
    <Card.Description class="ml-4 mr-4 italic overflow-ellipsis line-clamp-3 min-h-16">{description}</Card.Description>
  </Card.Header>

  <Card.Content class="pb-2 px-4">
    <div class="flex flex-col gap-2">
      <div>
        <Badge class="bg-slate-700">{category.name}</Badge>
      </div>

      <div class="flex flex-wrap gap-x-2 gap-y-2">
        {#if tags.length > 0}
          {#each tags as tag}
            <Badge class="tag">{tag.name}</Badge>
          {/each}

        {:else}
          <Badge class="bg-transparent">No tags</Badge>
        {/if}
      </div>
    </div>
  </Card.Content>

  <Card.Footer class="pb-1 px-2 justify-between gap-2 ml-2">
    <div class="flex items-center gap-3">
      <RecipeViews {totalViews} recipeId={id}/>
      <LikeDislikeButtonsCombined bind:likes bind:dislikes recipeId={recipe.id}/>
      <FavoritesStar {recipe} bind:favoritesRecipeList/>
    </div>

    {#if !selectedList}
      <div class="flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
        <Button onclick={(event) => addRecipeToRecipeList(event)} variant="ghost">
          <Plus class="h-5 w-5 text-gray-600" />Add to list
        </Button>
      </div>
    {/if}
  </Card.Footer>
</Card.Root>
