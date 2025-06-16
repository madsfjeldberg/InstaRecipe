<script>
  import AuthForm from '$lib/components/Authform/Authform.svelte';

  import { updateAuthState } from '../../stores/authStore.js';

  const { data } = $props();

  if(data.user === null) {
    updateAuthState(null);
  }

  const returnTo = data.returnTo;
  const isRegister = data.isRegister;
  
</script>

<svelte:head>
  <title>InstaRecipe | Login</title>
</svelte:head>

<AuthForm {returnTo} {isRegister}/>
