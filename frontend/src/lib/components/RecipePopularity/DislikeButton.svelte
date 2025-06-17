<script>
  import { tick } from 'svelte';

  import { toast } from 'svelte-sonner';

  import { Button } from '$lib/components/ui/button/index.js';
  import { ThumbsDown } from 'lucide-svelte';
  
  import { handleDislike } from '$lib/utils/recipeLikes.js';

  import { user } from '../../../stores/authStore.js';



  let { dislikes = $bindable(), likes = $bindable(), recipeId } = $props();
  let popping = $state(false);



  const handleColor = () => {
    if ($user && dislikes.includes($user.id)) {
      return "fill-current text-red-500 hover:text-red-700";
    }
    return "";
  };


  
  const handleClick = async (event) => {
    popping = true;
    dislikeRecipe(event);
    await tick();
    setTimeout(() => (popping = false), 150);
  }



  const dislikeRecipe = (event) => {
    event.stopPropagation();
    
    if(!$user) {
      toast.error("You have to login/register to dislike this recipe.");
      return;
    }

    const updated = handleDislike({
      likes,
      dislikes,
      userId: $user.id,
      recipeId
    });

    likes = updated.likes;
    dislikes = updated.dislikes;
};


</script>

<Button
  size="icon"
  variant="ghost"
  onclick={handleClick}
  class="text-red-700 hover:text-red-500 hover:bg-transparent flex items-center">
  <ThumbsDown class={`${handleColor()} transition-transform duration-150 ${popping ? 'scale-125' : ''}`} /> {dislikes.length}
</Button>
