<script>
  import AuthForm from '$lib/components/AuthForm/AuthForm.svelte';

  const { data } = $props();
  const returnTo = data.returnTo;
  const isRegister = data.isRegister;
  
</script>

<svelte:head>
  <title>InstaRecipe | Login</title>
</svelte:head>

<AuthForm {returnTo} {isRegister}/>
