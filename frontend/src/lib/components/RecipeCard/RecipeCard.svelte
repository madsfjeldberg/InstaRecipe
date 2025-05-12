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
  import LikeButton from "../PopularityButtons/LikeButton.svelte";
  import DislikeButton from "../PopularityButtons/DislikeButton.svelte";
  import { user } from "../../../stores/authStore.js";
  import { socket } from "../../../stores/socketStore.js";
 
 let { recipe } = $props();
 let { id, name, description, tags, category, image } = recipe;
 let likes = $state(recipe.likes);
  let dislikes = $state(recipe.dislikes);
 let userId = $user.id;

 const addRecipeToRecipeList = (event) => {
    event.stopPropagation();
    toast.info("Feature coming soon!");
 }

 const handleLike = (event) => {
    event.stopPropagation();

    if (likes.includes(userId)) {
      // User already liked the recipe, remove like
      likes = likes.filter((like) => like !== userId);
      socket.emit("remove-like", { recipeId: id, userId });
    } else if (dislikes.includes(userId)) {
      console.log("Found dislike, removing...")
      // User has disliked the recipe, remove dislike and add like
      dislikes = dislikes.filter((dislike) => dislike !== userId);
      likes.push(userId);
      socket.emit("remove-dislike", { recipeId: id, userId });
      socket.emit("add-like", { recipeId: id, userId });
    } else {
      // User has not liked the recipe yet, add like
      likes.push(userId);
      socket.emit("add-like", { recipeId: id, userId });
  }
}

const handleDislike = (event) => {
    event.stopPropagation();

    if (dislikes.includes(userId)) {
      // User already disliked the recipe, remove dislike
      dislikes = dislikes.filter((dislike) => dislike !== userId);
      socket.emit("remove-dislike", { recipeId: id, userId });
    } else if (likes.includes(userId)) {
      console.log("Found like, removing...")
      // User has liked the recipe, remove like and add dislike
      likes = likes.filter((like) => like !== userId);
      dislikes.push(userId);
      socket.emit("remove-like", { recipeId: id, userId });
      socket.emit("add-dislike", { recipeId: id, userId });
    } else {
      // User has not disliked the recipe yet, add dislike
      dislikes.push(userId);
      socket.emit("add-dislike", { recipeId: id, userId });
    }
  }



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
    <Card.Description class="ml-4 mr-4 italic overflow-ellipsis line-clamp-3">{description}</Card.Description>
  </Card.Header>
  <Card.Content class="relative pb-2 px-4">
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
  <Card.Footer class="relative pb-2 px-2 justify-between">
  <div class="flex items-center">
    <LikeButton {handleLike} {likes} />
    <DislikeButton {handleDislike} {dislikes} />
  </div>
  <div class="flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
    <Button onclick={addRecipeToRecipeList} variant="ghost">
      <Plus class="h-5 w-5 text-gray-600" />Add to list
    </Button>
  </div>
</Card.Footer>
</Card.Root>