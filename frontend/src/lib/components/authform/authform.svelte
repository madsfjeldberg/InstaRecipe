<script>
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";

  import LoginForm from "../loginform/loginform.svelte";
  import RegisterForm from "../registerform/registerform.svelte";

  let loginMode = true;

  const handleToggleAuthMode = () => {
    loginMode = !loginMode;
    console.log("Toggled auth mode to: ", loginMode);
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
  <LoginForm onToggleAuthMode={handleToggleAuthMode} />
{:else}
  <RegisterForm onToggleAuthMode={handleToggleAuthMode} />
{/if}

