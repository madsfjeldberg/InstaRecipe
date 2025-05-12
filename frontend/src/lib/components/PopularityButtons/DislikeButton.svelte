<script>
  import { Button } from "$lib/components/ui/button/index.js";
  import { ThumbsDown } from "lucide-svelte";
  import { user } from "../../../stores/authStore";

  let { handleDislike, dislikes } = $props();

  const handleColor = () => {
    if (dislikes.includes($user.id)) {
      return "fill-current text-red-500 hover:text-red-700";
    }
    return "";
  };

</script>

<Button 
  variant="ghost" 
  onclick={handleDislike} 
  class="text-red-700 hover:text-red-500 hover:bg-transparent flex items-center">
  <ThumbsDown class={handleColor()} /> {dislikes.length}
</Button>