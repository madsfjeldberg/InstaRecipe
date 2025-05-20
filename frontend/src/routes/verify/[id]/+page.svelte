<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
	import { page } from '$app/stores';
  
  import authApi from '$lib/api/authApi.js';

  import { updateAuthState } from '../../../stores/authStore.js';

  const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + '/auth' : '/auth';

  let status = "verifying";
  let message = "";

  onMount(async () => {
    const userId = $page.params.id;
    
    try {
      const user = await authApi.verifyEmail(userId);
      status = "success";
      message = "Email verified."
      
      setTimeout(() => {
        updateAuthState(user);
        goto("/dashboard");
      }, 3000);
     
    } catch (error) {
      status = "error";
      message = error.message;
    }
  });
</script>

<svelte:head>
  <title>Account Verification</title>
</svelte:head>

<div class="flex flex-col items-center justify-center min-h-screen p-4">
  {#if status === 'verifying'}
    <h1 class="font-bold text-3xl text-center dark:text-gray-200">Verifying your email...</h1>

  {:else if status === 'success'}
    <h1 class="font-bold text-3xl text-center text-green-600">Email verified successfully!</h1>
    <p class="mt-4 text-center dark:text-gray-200">{message}</p>
    <p class="mt-2 text-center dark:text-gray-200">Redirecting to dashboard...</p>
  {:else}
    <h1 class="font-bold text-3xl text-center text-red-600">Verification failed</h1>
    <p class="mt-4 text-center dark:text-gray-200">{message}</p>
    <a href="/login" class="mt-4 text-blue-600 hover:underline">Go to login</a>
  {/if}
</div>
