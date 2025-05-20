<script>
  import { page } from '$app/stores';

  export let href = "/";
  export let exact = false; // if you want it to match exactly
  export let className = "";

  $: isActive = exact ? $page.url.pathname === href : $page.url.pathname.startsWith(href);

  $: fullClass = `
    transition-colors
    text-muted-foreground
    hover:text-foreground
    font-semibold
    ${isActive ? "!text-accent-foreground font-semibold" : ""}
    ${className}
  `;
</script>

<a href={href} class={fullClass.trim()}>
  <slot />
</a>