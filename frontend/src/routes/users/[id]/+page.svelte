<script>
    import { onMount, onDestroy } from "svelte";
    import { page } from "$app/stores";

    import { LoaderCircle } from "lucide-svelte";
    import CircleUser from "lucide-svelte/icons/circle-user";
    import { Separator } from "$lib/components/ui/separator";

    import { avatarStore } from "../../../stores/avatarStore.js";
    import { user } from "../../../stores/authStore.js";
    import { socket } from "../../../stores/socketStore.js";
    import { getUserById } from "$lib/api/userApi.js";
    import { getRecipeListsByUserId } from "$lib/api/recipelistApi.js";
    import FollowButton from "$lib/components/Follow/FollowButton.svelte";
    import UnfollowButton from "$lib/components/Follow/UnfollowButton.svelte";
    import RecipeListSelect from "$lib/components/recipe-list-select/recipe-list-select.svelte";
    import RecipeCard from "$lib/components/RecipeCard/RecipeCard.svelte";

    const currentUserId = $page.params.id;
    const viewer = $user;
    let currentUser = $state(null);
    let currentUserRecipeLists = $state(null);
    let selectedList = $state(null);
    let favoritesRecipeList = $state(null);

    let isLoading = $state(true);
    let isFollowing = $state(false);

    onMount(async () => {
        try {
            currentUser = await getUserById(currentUserId);
            currentUserRecipeLists = await getRecipeListsByUserId(currentUserId);
            selectedList = currentUserRecipeLists[0];
            
            const viewerRecipeLists = await getRecipeListsByUserId(viewer.id);
            favoritesRecipeList = viewerRecipeLists.find( (list) => list.name === "Favorites" );

            if(currentUser.followers.length === 0 || !viewer) {
                isFollowing = false;
                return;
            }

            isFollowing = currentUser.followers.some((follower) => follower.id === viewer.id);
        } catch (error) {
            console.error(error);
        } finally {
            isLoading = false;
        }
    });


    $effect(() => {
        isLoading = true;
    })


    const disconnectFollowing = socket.on("following", (updatedUser) => {
        currentUser = updatedUser;
    })

    const disconnectUnfollowing = socket.on("unfollowing", (updatedUser) => {
        currentUser = updatedUser;
    });

    onDestroy(() => {
        disconnectFollowing
        disconnectUnfollowing
    })

    const handleToggleFollowButton = () => {
        isFollowing = !isFollowing;
    }
</script>

{#if isLoading}
    <div class="flex items-center justify-center min-h-screen">
        <LoaderCircle class="animate-spin h-16 w-16" />
        <h1 class="text-2xl font-semibold">Loading...</h1>
    </div>
{/if}

{#if currentUser}
    <div class="flex flex-col items-center mt-12 space-y-6">

        <!-- Profile picture + username -->
         
<!-- TODO ENABLE COSTUME AVATAR -->
<!-- {#if $avatarStore}
        <img class="rounded-full w-28 h-28 object-cover" src={$avatarStore} alt="User Avatar"> 
        {:else}

    {/if} -->
        <div class="flex flex-col items-center">
            <CircleUser class="w-28 h-28 rounded-full text-gray-400" />
            <h1 class="text-3xl font-semibold mt-4">{currentUser.username}</h1>
        </div>

        <!-- Stats: followers / following -->
        <div class="flex space-x-8 text-center">
            <div>
                <p class="text-lg font-medium">{currentUser.followers.length}</p>
                <p class="text-sm text-gray-500">Followers</p>
            </div>
            <div>
                <p class="text-lg font-medium">{currentUser.following.length}</p>
                <p class="text-sm text-gray-500">Following</p>
            </div>
        </div>

        <!-- Follow / Unfollow button -->
        <div class="flex gap-6">
            {#if isFollowing}
                <UnfollowButton bind:parentUser={currentUser} onToggleFollowButton={handleToggleFollowButton} />
            {:else}
                <FollowButton bind:parentUser={currentUser} onToggleFollowButton={handleToggleFollowButton} />
            {/if}

            <RecipeListSelect user={currentUser} bind:recipeLists={currentUserRecipeLists} bind:selectedList/>
        </div>

    </div>


    <Separator class="mt-4 mb-6 h-[2px]" />


    {#if selectedList}    
        {#if selectedList.recipes.length > 0}
            <div class="grid grid-cols-3 gap-4 mt-4">
                {#each selectedList.recipes as recipe (recipe.id)}
                    <RecipeCard {recipe} bind:selectedList bind:favoritesRecipeList parentUser={currentUser}/>
                {/each}
            </div>

        {:else}
            <h3 class="flex justify-center">{selectedList.name} is empty, no recipes found...</h3>

        {/if}
    {/if}

{/if}
