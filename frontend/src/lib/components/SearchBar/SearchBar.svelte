<script>
    import { goto } from '$app/navigation';
    import { blur } from 'svelte/transition';

    import { CookingPot, LoaderCircle, CircleUser, Search } from 'lucide-svelte';
    import { Input } from '$lib/components/ui/input/index.js';
    import { Button } from '$lib/components/ui/button/index.js';

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

    const handleUserSearch = async (query) => {
        if (query.length > 2) {
            try {
                const results = await userApi.getUsersByPartialUsername(query);
                userSearchResults = results;
            } catch (error) { }
        
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
                <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-slate-800">
                    <div class="flex-grow flex items-center gap-2">
                        <Search class="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0"/>
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
                            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <CookingPot class="h-4 w-4" />
                                Recipes
                            </h3>
                            <ul class="mt-2 divide-y divide-gray-100 dark:divide-gray-800">
                                {#each recipeSearchResults as recipe}
                                    <button
                                        onclick={() =>
                                            handleNavigate(recipe.id)}
                                        class="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer rounded transition-colors duration-150"
                                    >
                                        <img
                                            src={recipe.image ||
                                                "/recipe-image-placeholder.png"}
                                            alt={recipe.name}
                                            class="h-14 w-14 rounded-md object-cover shadow-sm border border-gray-200 dark:border-gray-700"
                                        />
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate text-left">
                                                {recipe.name}
                                            </p>

                                            {#if recipe.description}
                                                <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 text-left">
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
                            <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <CircleUser class="h-4 w-4" />
                                Users
                            </h3>
                            <ul class="mt-2 divide-y divide-gray-100 dark:divide-gray-800">
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
                                            {#if usr.avatarUrl}
                                                <img
                                                    src={usr.avatarUrl}
                                                    alt={usr.username}
                                                    class="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-700 shadow-sm"
                                                />
                                            {:else}
                                                <CircleUser class="h-10 w-10" />
                                            {/if}
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-left text-sm font-medium text-gray-900 dark:text-gray-100">
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
                            <div class="inline-flex items-center justify-center w-14 h-14 mb-4">
                                <LoaderCircle class="h-6 w-6 animate-spin text-gray-500 dark:text-gray-400"/>
                            </div>
                        </div>
                    {/if}

                    {#if !searchLoading && !recipeSearchResults.length && !userSearchResults.length}
                        <div class="py-10 px-8 text-center">
                            <div class="inline-flex items-center justify-center w-14 h-14 mb-4">
                                <Search class="h-6 w-6 text-gray-500 dark:text-gray-400"/>
                            </div>
                            {#if searchValue}
                                <p class="text-gray-700 dark:text-gray-300 font-medium">
                                    No results found for "{searchValue}"
                                </p>
                            {:else}
                                <p class="text-gray-700 dark:text-gray-300 font-medium">
                                    Type to search for delicious recipes or
                                    discover other users...
                                </p>
                            {/if}
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</div>
