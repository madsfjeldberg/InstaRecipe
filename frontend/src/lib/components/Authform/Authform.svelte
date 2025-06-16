<script>
  import * as Card from '$lib/components/ui/card/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';

  import Loginform from '../Loginform/Loginform.svelte';
  import Registerform from '../Registerform/Registerform.svelte';

  const { returnTo } = $props();
  let loginMode = $state(true);

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
  <Loginform onToggleAuthMode={handleToggleAuthMode} {returnTo} />
{:else}
  <Registerform onToggleAuthMode={handleToggleAuthMode} />
{/if}
