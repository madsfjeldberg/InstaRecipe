<script>
	import '../app.css';

  import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
  import * as transition from 'svelte/transition';

  import { ModeWatcher } from 'mode-watcher';

  import { Toaster } from '$lib/components/ui/sonner';
  import Footer from '$lib/components/ui/footer/footer.svelte';
  
  import Navbar from '$lib/components/Navbar/Navbar.svelte';
  
  import { updateAuthState } from '../stores/authStore.js';
  
  import authApi from '$lib/api/authApi.js';

  let { data, children } = $props();
  
  
  onMount(() => {
    // on mount, update auth state
    // this makes sure the correct state is set when page is refreshed
    updateAuthState(data.user);
  });

  const handleLogout = async () => {
    await authApi.logout();
    toast.success('Logged out successfully');
    goto('/');
  };

</script>
<ModeWatcher />
<Toaster />

<div class="bg-muted">
  <Navbar />
  <div class="container mx-auto">
    <div class="transition-wrapper">
      {#key data.url}
        <main
          in:transition.blur={{ duration: 300 }}
          out:transition.blur={{ duration: 300 }}
          class="min-h-screen"
        >

          {@render children()}

        </main>
      {/key}
    </div>
    <Footer />
  </div>
</div>

<style>
  /* Overlay children so out+in can overlap */
  .transition-wrapper {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
  }
  .transition-wrapper > :global(*) {
    grid-row: 1;
    grid-column: 1;
  }
</style>
