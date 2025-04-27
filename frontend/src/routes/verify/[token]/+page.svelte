<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
	import { page } from '$app/stores';

  const BASE_URL = import.meta.env.VITE_API_URL + '/auth' || '/auth';

  let status = 'verifying'; // 'verifying' | 'success' | 'error'
  let message = '';

  onMount(async () => {
    const token = $page.params.token;
    
    try {
      const response = await fetch(`${BASE_URL}/verify/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        status = 'success';
        message = data.message;
        // Redirect to login after 3 seconds
        setTimeout(() => {
          goto('/login');
        }, 3000);
      } else {
        status = 'error';
        message = data.message;
      }
    } catch (error) {
      status = 'error';
      message = 'An error occurred during verification';
    }
  });
</script>

<div class="flex flex-col items-center justify-center min-h-screen p-4">
  {#if status === 'verifying'}
    <h1 class="font-bold text-3xl text-center dark:text-gray-200">Verifying your email...</h1>
  {:else if status === 'success'}
    <h1 class="font-bold text-3xl text-center text-green-600">Email verified successfully!</h1>
    <p class="mt-4 text-center dark:text-gray-200">{message}</p>
    <p class="mt-2 text-center dark:text-gray-200">Redirecting to login page...</p>
  {:else}
    <h1 class="font-bold text-3xl text-center text-red-600">Verification failed</h1>
    <p class="mt-4 text-center dark:text-gray-200">{message}</p>
    <a href="/login" class="mt-4 text-blue-600 hover:underline">Go to login</a>
  {/if}
</div>