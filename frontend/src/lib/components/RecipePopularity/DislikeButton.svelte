<script>
  import { tick } from 'svelte';

  import { Button } from '$lib/components/ui/button/index.js';
  import { ThumbsDown } from 'lucide-svelte';
  
  import { user } from '../../../stores/authStore.js';

  let { onDislike, dislikes } = $props();
  let popping = $state(false);

  const handleColor = () => {
    if ($user && dislikes.includes($user.id)) {
      return "fill-current text-red-500 hover:text-red-700";
    }
    return "";
  };

  async function handleClick(event) {
    popping = true;
    onDislike(event);
    await tick();
    setTimeout(() => (popping = false), 150);
  }

</script>

<Button
  variant="ghost"
  onclick={handleClick}
  class="text-red-700 hover:text-red-500 hover:bg-transparent flex items-center">
  <ThumbsDown class={`${handleColor()} transition-transform duration-150 ${popping ? 'scale-125' : ''}`} /> {dislikes.length}
</Button>
