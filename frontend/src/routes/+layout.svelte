<script>
	import '../app.css';
  import { ModeWatcher } from 'mode-watcher';
  import { isAuthenticated, updateAuthState } from '$lib/stores/authStore';
  import { authService } from '$lib/services/authService.js';
  import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
  import Navbar from '$lib/components/navbar/navbar.svelte';
  import Footer from '$lib/components/ui/footer/footer.svelte';
  import { Toaster } from '$lib/components/ui/sonner';

  let { data, children } = $props();

  const year = new Date().getFullYear();

  onMount(() => {
    // on mount, check if user already has a token
    updateAuthState(data.user);
  })

  const handleLogout = async () => {
    await auth.logout();
    toast.success('Logged out successfully');
    goto('/');
  };

</script>
<ModeWatcher/>
<Toaster />

<div class="bg-muted">
  <Navbar />
  <div class="container mx-auto">
    
  <main class="min-h-screen">

    {@render children()}

  </main>
  <Footer />
  </div>
</div>