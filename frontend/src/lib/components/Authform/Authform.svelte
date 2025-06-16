<script>
  import * as Card from '$lib/components/ui/card/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';

  import LoginForm from '../Loginform/Loginform.svelte';
  import RegisterForm from '../Registerform/Registerform.svelte';

  const { returnTo, isRegister } = $props();
  let loginMode = $state(true);
  console.log(isRegister)

  if(isRegister) {
    loginMode = false;
  }

  const handleToggleAuthMode = () => {
    loginMode = !loginMode;
  };
</script>

<svelte:head>
  {#if loginMode}
    <title>Login</title>
  {:else}
    <title>Register</title>
  {/if}
</svelte:head>

{#if loginMode}
  <LoginForm onToggleAuthMode={handleToggleAuthMode} {returnTo} />
{:else}
  <RegisterForm onToggleAuthMode={handleToggleAuthMode} />
{/if}
