<script>
  import AuthForm from '$lib/components/AuthForm/AuthForm.svelte';

  const { data } = $props();
  const returnTo = data.returnTo;
  
</script>

<svelte:head>
  <title>InstaRecipe | Login</title>
</svelte:head>

<AuthForm {returnTo}/>
