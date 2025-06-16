<script>
  import AuthForm from '$lib/components/Authform/Authform.svelte';

  import { updateAuthState } from '../../stores/authStore.js';

  const { data } = $props();

  // used for invalidation across devies
  if(data.user === null) {
    updateAuthState(null);
  }

  const returnTo = data.returnTo;
  
</script>

<svelte:head>
  <title>InstaRecipe | Login</title>
</svelte:head>

<AuthForm {returnTo}/>
