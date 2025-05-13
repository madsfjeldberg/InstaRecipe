<script>
  import CircleUser from "lucide-svelte/icons/circle-user";
  import Menu from "lucide-svelte/icons/menu";
  import { Cog, CookingPot, LogIn, LogOut } from "lucide-svelte";
  import Search from "@lucide/svelte/icons/search";
  
  import { Input } from "$lib/components/ui/input/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import ThemeToggle from "../theme-toggle/theme-toggle.svelte";
  import { page } from "$app/stores";
  import { isAuthenticated } from "../../../stores/authStore";
  import Separator from "../ui/separator/separator.svelte";
  import Navlink from "./navlink.svelte";
  import { goto } from "$app/navigation";
  import { authService } from "$lib/api/authApi.js";
  import { toast } from "svelte-sonner";
  import { avatarStore } from "../../../stores/avatarStore.js";
  import { blur } from "svelte/transition";
  import { getUsersByPartialUsername } from "$lib/api/userApi";
  import Label from "../ui/label/label.svelte";

  let searchValue = $state("");
  let searchFocused = $state(false);
  let searchResults = $state([]);
  let recipeSearchResults = $state([]);
  let userSearchResults = $state([]);

  let debounceTimeout;

  // users/${user.id}/avatar
  const avatarUrl = (userId) => {
    return import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/users/${userId}/avatar` : `/api/users/${userId}/avatar`;
  }

  const handleLogout = async () => {
    await authService.logout();
    toast.success("Logged out successfully");
    avatarStore.set(null); // Clear the avatar store
    goto("/");
  };

  $effect(() => {
  if (searchValue) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      handleUserSearch(searchValue);
    }, 1000); // 1000ms debounce delay
  } else {
    userSearchResults = [];
  }
});

  const handleUserSearch = async (query) => {
    console.log("Searching for users with query:", query);
    if (query.length > 2) {
      const results = await getUsersByPartialUsername(query);
      userSearchResults = results;
      console.log("User search results:", $state.snapshot(userSearchResults));
    } else {
      userSearchResults = [];
    }
  }

</script>

  <header class="bg-background sticky top-0 border-b">
    <div class="mx-auto max-w-7xl flex h-16 items-center gap-4 px-4 md:px-6">
    <nav
      class="hidden flex-col gap-6 md:flex md:flex-row md:items-center md:gap-5 lg:gap-6"
    >
      
      <a href={$isAuthenticated ? "/dashboard" : "/"} class="flex items-center gap-2 text-lg font-semibold md:text-base">
        <CookingPot class="h-6 w-6" />InstaRecipe
      </a>
      {#if !$isAuthenticated}
      <Navlink exact={true} href="/">Home</Navlink>
      {:else}
      <Navlink exact={true} href="/dashboard">
        Dashboard
      </Navlink>
      <Navlink href="/recipes">
        Recipes
      </Navlink>
      {/if}
    </nav>
    <Sheet.Root>
      <Sheet.Trigger let:props>
        {#snippet child({props})}
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
          <Navlink href="/dashboard" class="text-muted-foreground hover:text-foreground"> Dashboard </Navlink>
          <Navlink href="/recipes" class="text-muted-foreground hover:text-foreground"> Recipes </Navlink>
          <Navlink href="/settings" class="hover:text-foreground"> Settings </Navlink>
        </nav>
      </Sheet.Content>
    </Sheet.Root>
    <div class="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
      <div class="ml-auto flex-1 sm:flex-initial">
        {#if !$isAuthenticated}
          <Navlink exact={true} href="/login">Login <LogIn class="h-5 w-5 inline-block" /></Navlink>
        {/if}
      </div>
      {#if $isAuthenticated}
    <div class="relative">
      <Input
        type="search"
        placeholder="Search..."
        class="rounded-lg md:w-[200px] lg:w-[336px]"
        bind:value={searchValue}
        onfocus={() => searchFocused = true}
        onblur={() => setTimeout(() => searchFocused = false, 100)}
      />
        {#if searchFocused}
  <div
    transition:blur={{ duration: 250 }}
    class="fixed inset-0 flex items-start justify-center pt-20"
    style="pointer-events: none;"
  >
    <div
      class="w-full max-w-md bg-white dark:bg-slate-900 border rounded-lg shadow-lg p-4"
      style="pointer-events: auto;"
    >
      {#if userSearchResults && userSearchResults.length > 0}
        <Label class="text-sm font-medium">Users</Label>
        <Separator class="my-1" />
        <ul>
          {#each userSearchResults as user}
            <li 
            class="flex py-1 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer">
            <img src={avatarUrl(user.id)} alt={user.username} class="h-6 w-6 rounded-full object-cover mr-2" />
            {user.username}
            </li>
          {/each}
        </ul>
      {:else}
        <div class="text-gray-500">No results</div>
      {/if}
    </div>
  </div>
{/if}
      </div>
    {/if}
      {#if $isAuthenticated}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger let:props>
          {#snippet child({props})}
          <span
            class="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-all rounded-full p-2"
            {...props}
          >
            {#if $avatarStore}
              <img
                src={$avatarStore}
                alt="User Avatar"
                class="h-8 w-8 rounded-full object-cover"
              />
            {:else}
              <CircleUser class="h-8 w-8" />
            {/if}
            <span class="sr-only">Toggle user menu</span>
          </span>
          {/snippet}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" class="w-56">
          <DropdownMenu.Label class="font-medium">My Account</DropdownMenu.Label>
          <DropdownMenu.Separator class="my-1" />
          <DropdownMenu.Item onclick={() => goto('/settings')} class="cursor-pointer"><Cog />Settings</DropdownMenu.Item>
          <DropdownMenu.Separator class="my-1" />
          <DropdownMenu.Item onclick={handleLogout} class="cursor-pointer"><LogOut />Log out</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      {/if}

      <ThemeToggle />
    </div>
  </div>
  </header>