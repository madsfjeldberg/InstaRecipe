<script>
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import Badge from "../ui/badge/badge.svelte";
  import { Plus, ThumbsDown, ThumbsUp } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import { toast } from "svelte-sonner";
  import LikeButton from "../RecipePopularity/LikeButton.svelte";
  import DislikeButton from "../RecipePopularity/DislikeButton.svelte";
  import { user } from "../../../stores/authStore.js";
  import { socket } from "../../../stores/socketStore.js";
  import { handleDislike, handleLike } from "$lib/utils/recipeLikes";
  import { onDestroy, onMount } from "svelte";
 
  let { recipe } = $props();
  let { id, name, description, tags, category, image } = recipe;
  let likes = $state(recipe.likes);
  let dislikes = $state(recipe.dislikes);
  let userId = $user.id;


  
     const disconnect = socket.on("update-like-dislike", (recipe) => {
       if (recipe.id === id) {
         likes = recipe.likes;
         dislikes = recipe.dislikes;
       }
     });
  
    onDestroy(disconnect);


    
  const addRecipeToRecipeList = (event) => {
     event.stopPropagation();
     toast.info("Feature coming soon!");
  }



  // handle like/dislike events
  const onLike = (event) => {
    const updated = handleLike({
      event,
      likes,
      dislikes,
      userId,
      recipeId: id,
      socket,
    });
    likes = updated.likes;
    dislikes = updated.dislikes;
  };

  const onDislike = (event) => {
    const updated = handleDislike({
      event,
      likes,
      dislikes,
      userId,
      recipeId: id,
      socket,
    });
    likes = updated.likes;
    dislikes = updated.dislikes;
  };

</script>
 
<Card.Root 
class="group cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-[1.02] overflow-hidden"
onclick={() => {
  goto("/recipes/" + recipe.id);
}}
>
  <Card.Header class="p-0">
    <img
      src={image || '/recipe-image-placeholder.png'}
      alt=""
      class="w-full h-48 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
    />
    <Card.Title class="ml-4 text-xl">{name}</Card.Title>
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
  <Card.Footer class="pb-2 px-2 justify-between">
  <div class="flex items-center">
    <LikeButton {onLike} {likes} />
    <DislikeButton {onDislike} {dislikes} />
  </div>
  <div class="flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
    <Button onclick={addRecipeToRecipeList} variant="ghost">
      <Plus class="h-5 w-5 text-gray-600" />Add to list
    </Button>
  </div>
</Card.Footer>
</Card.Root>