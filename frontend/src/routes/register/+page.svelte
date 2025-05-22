<script>
  import AuthForm from '$lib/components/AuthForm/AuthForm.svelte';

  const isRegister = true;
  
</script>

<svelte:head>
  <title>InstaRecipe | Register</title>
</svelte:head>

<AuthForm {isRegister}/>
