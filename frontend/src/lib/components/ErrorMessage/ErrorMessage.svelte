<script>
  let { message, className } = $props();
</script>

{#if message} 
<p class={`text-red-500 text-sm mt-1 ${className}`}>{message}</p>
{/if}
