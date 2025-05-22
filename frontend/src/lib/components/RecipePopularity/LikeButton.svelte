<script>
  import { tick } from 'svelte';

  import { Button } from '$lib/components/ui/button/index.js';
  import { ThumbsUp } from 'lucide-svelte';

  import { user } from '../../../stores/authStore.js';
  
  let { onLike, likes } = $props();
  let popping = $state(false);

  const handleColor = () => {
    if ($user && likes.includes($user.id)) {
      return "fill-current text-green-500 hover:text-green-700";
    }
    return "";
  };

  const handleClick = async (event) => {
    popping = true;
    onLike(event);
    await tick();
    setTimeout(() => (popping = false), 150);
  }
</script>

<Button 
  variant="ghost" 
  onclick={handleClick}
  class="text-green-700 hover:text-green-500 hover:bg-transparent flex items-center"
>
  <ThumbsUp class={`${handleColor()} transition-transform duration-150 ${popping ? 'scale-125' : ''}`} /> {likes.length}
</Button>
