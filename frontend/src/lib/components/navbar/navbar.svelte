<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { blur } from 'svelte/transition';
  
  import { toast } from 'svelte-sonner';

  import { Cog, CookingPot, LogIn, LogOut, LoaderCircle, CircleUser, Menu, Search } from 'lucide-svelte';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import * as Sheet from '$lib/components/ui/sheet/index.js';
  import Separator from '../ui/separator/separator.svelte';
  import Label from '../ui/label/label.svelte';
  
  import Navlink from './NavLink.svelte';
  import ThemeToggle from '../ThemeToggle/ThemeToggle.svelte';

  import { isAuthenticated, user } from '../../../stores/authStore.js';
  import { avatarStore } from '../../../stores/avatarStore.js';

  import authApi from '$lib/api/authApi.js';
  import userApi from '$lib/api/userApi';
  import recipeApi from '$lib/api/recipeApi';
  

  let searchValue = $state("");
  let searchFocused = $state(false);
  let searchResults = $state([]);
  let recipeSearchResults = $state([]);
  let userSearchResults = $state([]);
  let searchLoading = $state(false);

  let debounceTimeout;

  $effect(() => {
    if (searchValue) {
      searchLoading = true;
      userSearchResults = [];
      recipeSearchResults = [];
      clearTimeout(debounceTimeout);

      debounceTimeout = setTimeout(async () => {
        searchLoading = true;
        try {
          // Run searches in parallel
          await Promise.all([
            handleUserSearch(searchValue),
            handleRecipeSearch(searchValue),
          ]);
        } catch(error) {

        } finally {
          // Ensure loading is set to false even if there are errors
          searchLoading = false;
        }
      }, 300); // 300ms debounce delay
    } else {
      userSearchResults = [];
      recipeSearchResults = [];
    }
  });

  const avatarUrl = (userId) => {
    return import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL}/users/${userId}/avatar`
      : `/api/users/${userId}/avatar`;
  };

  const handleLogout = async () => {
    try {
      await authApi.logout($user.email);
      toast.success("Logged out successfully");
      goto("/");

    }catch(error) {
      toast.error(error.message);
    }
  };


  const handleUserSearch = async (query) => {
    if (query.length > 2) {
      try {
        const results = await userApi.getUsersByPartialUsername(query);
        userSearchResults = results;
      } catch (error) {
      }
      
    } else {
      userSearchResults = [];
    }
  };

  const handleRecipeSearch = async (query) => {
    if (query.length > 2) {
      const results = await recipeApi.getRecipesByPartialName(query);
      recipeSearchResults = results;

    } else {
      recipeSearchResults = [];
    }
  };

  const handleNavigate = (recipeId) => {
    goto(`/recipes/${recipeId}`);
    searchValue = "";
    searchFocused = false;
    recipeSearchResults = [];
    userSearchResults = [];
  };
</script>

<header class="bg-background sticky top-0 border-b">
  <div class="mx-auto max-w-7xl flex h-16 items-center gap-4 px-4 md:px-6">
    <nav
      class="hidden flex-col gap-6 md:flex md:flex-row md:items-center md:gap-5 lg:gap-6"
    >
      <a
        href={$isAuthenticated ? "/dashboard" : "/"}
        class="flex items-center gap-2 text-lg font-semibold md:text-base"
      >
        <CookingPot class="h-6 w-6" />InstaRecipe
      </a>
      {#if !$isAuthenticated}
        <Navlink exact={true} href="/">Home</Navlink>
      {:else}
        <Navlink exact={true} href="/dashboard">Dashboard</Navlink>
        <Navlink href="/recipes">Recipes</Navlink>
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
          <Navlink href="/dashboard" class="text-muted-foreground hover:text-foreground"> Dashboard </Navlink>
          <Navlink href="/recipes" class="text-muted-foreground hover:text-foreground"> Recipes </Navlink>
          <Navlink href="/settings/general" class="hover:text-foreground"> Settings </Navlink>
        </nav>
      </Sheet.Content>
    </Sheet.Root>
    <div class="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
      <div class="ml-auto flex-1 sm:flex-initial">
        {#if !$isAuthenticated}
          <Navlink exact={true} href="/login"
            >Login <LogIn class="h-5 w-5 inline-block" /></Navlink
          >
        {/if}
      </div>

      <!-- SEARCH START -->
      {#if $isAuthenticated}
        <div class="relative z-50">
          <Button
            variant="ghost"
            size="sm"
            class="rounded-lg flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-slate-800"
            onclick={() => (searchFocused = true)}
          >
            <Search class="h-4 w-4" />
            <span>Search</span>
          </Button>

          <!-- Search results dropdown -->
          {#if searchFocused}
            <!-- Blocker to disable all interaction with the rest of the page -->
            <div
              class="fixed inset-0 z-40"
              style="background: transparent;"
              tabindex="-1"
              role="button"
              onclick={() => (searchFocused = false)}
              onkeydown={(e) => e.key === "Escape" && (searchFocused = false)}
              aria-label="Close search"
            ></div>

            <div
              transition:blur={{ duration: 250 }}
              class="fixed z-50 inset-0 flex items-start justify-center pt-16 bg-black/40"
              style="pointer-events: none;"
            >
              <div
                class="w-full max-w-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden mt-10"
                style="pointer-events: auto;"
              >
                <!-- Panel header with search input -->
                <div
                  class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-slate-800"
                >
                  <div class="flex-grow flex items-center gap-2">
                    <Search
                      class="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0"
                    />
                    <Input
                      type="search"
                      placeholder="Search..."
                      class="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 h-9 bg-transparent"
                      bind:value={searchValue}
                      autofocus
                    />
                  </div>
                </div>

                <!-- Scrollable content -->
                <div class="max-h-[60vh] overflow-y-auto">
                  {#if recipeSearchResults.length}
                    <div class="px-4 py-3">
                      <h3
                        class="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2"
                      >
                        <CookingPot class="h-4 w-4" />
                        Recipes
                      </h3>
                      <ul
                        class="mt-2 divide-y divide-gray-100 dark:divide-gray-800"
                      >
                        {#each recipeSearchResults as recipe}
                          <button
                            onclick={() => handleNavigate(recipe.id)}
                            class="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer rounded transition-colors duration-150"
                          >
                            <img
                              src={recipe.image ||
                                "/recipe-image-placeholder.png"}
                              alt={recipe.name}
                              class="h-14 w-14 rounded-md object-cover shadow-sm border border-gray-200 dark:border-gray-700"
                            />
                            <div class="flex-1 min-w-0">
                              <p
                                class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate text-left"
                              >
                                {recipe.name}
                              </p>
                              {#if recipe.description}
                                <p
                                  class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 text-left"
                                >
                                  {recipe.description}
                                </p>
                              {/if}
                            </div>
                          </button>
                        {/each}
                      </ul>
                    </div>
                  {/if}

                  {#if userSearchResults.length}
                    <div
                      class="px-4 py-3 {recipeSearchResults.length
                        ? 'border-t border-gray-200 dark:border-gray-700'
                        : ''}"
                    >
                      <h3
                        class="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2"
                      >
                        <CircleUser class="h-4 w-4" />
                        Users
                      </h3>
                      <ul
                        class="mt-2 divide-y divide-gray-100 dark:divide-gray-800"
                      >
                        {#each userSearchResults as usr}
                          <button
                            onclick={() => {
                              goto(`/users/${usr.id}`);
                              searchValue = "";
                              searchFocused = false;
                            }}
                            class="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer rounded transition-colors duration-150"
                          >
                            <div class="flex-shrink-0">
                              {#if usr.avatar}
                                <img
                                  src={avatarUrl(usr.id)}
                                  alt={usr.username}
                                  class="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-700 shadow-sm"
                                />
                              
                              {:else}
                                <CircleUser class="h-10 w-10"/>
                              {/if}
                            </div>
                            <div class="flex-1 min-w-0">
                              <p
                                class="text-left text-sm font-medium text-gray-900 dark:text-gray-100"
                              >
                                {usr.username}
                              </p>
                            </div>
                          </button>
                        {/each}
                      </ul>
                    </div>
                  {/if}

                  {#if searchLoading}
                    <div class="py-10 px-8 text-center">
                      <div
                        class="inline-flex items-center justify-center w-14 h-14 mb-4"
                      >
                        <LoaderCircle
                          class="h-6 w-6 animate-spin text-gray-500 dark:text-gray-400"
                        />
                      </div>
                    </div>
                  {/if}

                  {#if !searchLoading && !recipeSearchResults.length && !userSearchResults.length}
                    <div class="py-10 px-8 text-center">
                      <div
                        class="inline-flex items-center justify-center w-14 h-14 mb-4"
                      >
                        <Search
                          class="h-6 w-6 text-gray-500 dark:text-gray-400"
                        />
                      </div>
                      {#if searchValue}
                        <p class="text-gray-700 dark:text-gray-300 font-medium">
                          No results found for "{searchValue}"
                        </p>

                        {:else}
                          <p class="text-gray-700 dark:text-gray-300 font-medium">
                            Type to search for delicious recipes or discover other users...
                          </p>
                      {/if}
                    </div>
                  {/if}
                </div>
              </div>
            </div>
          {/if}
        </div>
        <!-- END SEARCH INPUT AND DROPDOWN -->
      {/if}

      {#if $isAuthenticated && $user}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger let:props>
          {#snippet child({props})}
          <span
            class="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-all rounded-full p-2"
            {...props}
          >
            {#if avatarUrl($user.id) === null}
              <CircleUser class="h-8 w-8" />
            {:else}
              <img
                src={$avatarStore}
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
