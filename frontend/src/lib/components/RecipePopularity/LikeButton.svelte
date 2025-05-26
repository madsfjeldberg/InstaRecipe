<script>
  import { tick } from 'svelte';

  import { toast } from 'svelte-sonner';

  import { Button } from '$lib/components/ui/button/index.js';
  import { ThumbsUp } from 'lucide-svelte';

  import { handleLike } from '$lib/utils/recipeLikes.js';

  import { user } from '../../../stores/authStore.js';
  


  let { likes = $bindable(), dislikes = $bindable(), recipeId } = $props();
  let popping = $state(false);



  const handleColor = () => {
    if ($user && likes.includes($user.id)) {
      return "fill-current text-green-500 hover:text-green-700";
    }
    return "";
  };



  const handleClick = async (event) => {
    popping = true;
    likeRecipe(event);
    await tick();
    setTimeout(() => (popping = false), 150);
  }


  
  const likeRecipe = (event) => {
      event.stopPropagation();
      
      if(!$user) {
        toast.error("You have to login/register to like this recipe.");
        return;
      }
      
      const updated = handleLike({
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
  class="text-green-700 hover:text-green-500 hover:bg-transparent flex items-center"
>
  <ThumbsUp class={`${handleColor()} transition-transform duration-150 ${popping ? 'scale-125' : ''}`} /> {likes.length}
</Button>
