<script>
  import { goto } from '$app/navigation';
  
  import { toast } from 'svelte-sonner';

  import { Cog, CookingPot, LogIn, LogOut, CircleUser, Menu, ClipboardPen } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import * as Sheet from '$lib/components/ui/sheet/index.js';
  
  import Navlink from './Navlink.svelte';
  import ThemeToggle from './ThemeToggle/ThemeToggle.svelte';
  import SearchBar from './SearchBar/SearchBar.svelte';

  import { updateAuthState, isAuthenticated, user } from '../../../stores/authStore.js';

  import authApi from '$lib/api/authApi.js';



  const handleLogout = async () => {
    try {
      await authApi.logout($user.email);
      updateAuthState(null);
      toast.success("Logged out successfully");
      goto("/");

    }catch(error) {
      console.error("Logout failed:", error);
      toast.error(error.message);
    }
  };
</script>

<header class="bg-background sticky top-0 border-b">
  <div class="mx-auto max-w-7xl flex h-16 items-center gap-4 px-4 md:px-6">
    <nav class="hidden flex-col gap-6 md:flex md:flex-row md:items-center md:gap-5 lg:gap-6">
      <a
        href={$isAuthenticated ? "/explore" : "/"}
        class="flex items-center gap-2 text-lg font-semibold md:text-base"
      >
        <CookingPot class="h-6 w-6" />InstaRecipe
      </a>
      {#if !$isAuthenticated}
        <Navlink exact={true} href="/">Home</Navlink>
        <Navlink exact={true} href="/explore">Explore</Navlink>
        {:else}
        <Navlink exact={true} href="/explore">Explore</Navlink>
        <Navlink href="/users/recipes">Recipes</Navlink>
      {/if}
    </nav>
    
    <Sheet.Root>
      <Sheet.Trigger let:props>
        {#snippet child({ props })}
          <Button
            variant="outline"
            size="icon"
            class="shrink-0 md:hidden"
            {...props}
          >
            <Menu class="h-5 w-5" />
            <span class="sr-only">Toggle navigation menu</span>
          </Button>
        {/snippet}
      </Sheet.Trigger>
      <Sheet.Content side="left" class="w-[300px]">
        <nav class="grid gap-6 text-lg font-medium">
          <a href="##" class="flex items-center gap-2 text-lg font-semibold">
            <CookingPot class="h-6 w-6" />
            <span class="sr-only">InstaRecipe</span>
          </a>
          <Navlink href="/explore" class="text-muted-foreground hover:text-foreground"> Explore </Navlink>
          <Navlink href="/users/recipes" class="text-muted-foreground hover:text-foreground"> Recipes </Navlink>
          <Navlink href="/settings/general" class="hover:text-foreground"> Settings </Navlink>
        </nav>
      </Sheet.Content>
    </Sheet.Root>
    
    <div class="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
      <div class="ml-auto flex items-center sm:flex-initial">

        <SearchBar/>
      
        {#if !$isAuthenticated}
          <Navlink className="ml-4" exact={true} href="/auth/login">
            Login <LogIn class="h-5 w-5 inline" />
          </Navlink>
        {/if}
      </div>

      {#if $isAuthenticated && $user}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger let:props>
          {#snippet child({props})}
          <span
            class="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-all rounded-full p-2"
            {...props}
          >
            {#if !$user.avatarUrl}
              <CircleUser class="h-8 w-8" />
            {:else}
              <img
                src={$user.avatarUrl}
                alt="User Avatar"
                class="h-8 w-8 rounded-full object-cover"
              />
            {/if}
            <span class="sr-only">Toggle user menu</span>
          </span>
          {/snippet}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" class="w-56">
          <DropdownMenu.Label class="font-medium">My Account</DropdownMenu.Label>
          <DropdownMenu.Separator class="my-1" />
          <DropdownMenu.Item onclick={() => goto('/settings/general')} class="cursor-pointer"><Cog />Settings</DropdownMenu.Item>
          <DropdownMenu.Separator class="my-1" />
          <DropdownMenu.Item onclick={handleLogout} class="cursor-pointer"><LogOut />Log out</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      {/if}

      <ThemeToggle />
    </div>
  </div>
</header>
