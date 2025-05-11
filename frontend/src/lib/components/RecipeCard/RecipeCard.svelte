<script>
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import Badge from "../ui/badge/badge.svelte";
  import { ThumbsDown, ThumbsUp } from "lucide-svelte";
  import { goto } from "$app/navigation";
 
 let { recipe } = $props();

 let { name, description, likes, dislikes, tags, category, image } = recipe;

</script>
 
<Card.Root 
class="cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-[1.02]"
onclick={() => {
  goto("/recipes/" + recipe.id);
}}
>
  <Card.Header class="p-0">
    <img
      src={image || '/recipe-image-placeholder.png'}
      alt=""
      class="w-full h-48 object-cover rounded-t-lg"
    />
    <Card.Title class="ml-4 text-xl">{name}</Card.Title>
    <Card.Description class="ml-4 overflow-ellipsis line-clamp-3">{description}</Card.Description>
  </Card.Header>
  <Card.Content class="relative pb-2 px-4">
  <div class="flex flex-col gap-2 pb-10">
    <div>
      <Badge class="bg-slate-700">{category.name}</Badge>
    </div>
    <div class="flex flex-wrap gap-x-2">
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
  <Card.Footer class="relative pb-2 px-4">
  
  <div class="absolute bottom-2 right-4 flex gap-x-4 items-center">
    <span class="text-green-600 flex items-center"><ThumbsUp class="inline text-green-600 mr-1" /> {likes} 6</span>
    <span class="text-red-600 flex items-center"><ThumbsDown class="inline text-red-600 mr-1" /> {dislikes} 2</span>
  </div>
</Card.Footer>
</Card.Root>