<script>
  import { Button } from "$lib/components/ui/button/index.js";
  import { ThumbsUp } from "lucide-svelte";
  import { user } from "../../../stores/authStore";

  let { onLike, likes } = $props();

  const handleColor = () => {
    if (likes.includes($user.id)) {
      return "fill-current text-green-500 hover:text-green-700";
    }
    return "";
  };

</script>

<Button 
  variant="ghost" 
  onclick={onLike} 
  class="text-green-700 hover:text-green-500 hover:bg-transparent flex items-center">
  <ThumbsUp class={handleColor()} /> {likes.length}
</Button>