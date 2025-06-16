<script>
  import Authform from '$lib/components/Authform/Authform.svelte';

  const isRegister = true;
  
</script>

<svelte:head>
  <title>InstaRecipe | Register</title>
</svelte:head>

<Authform {isRegister}/>
