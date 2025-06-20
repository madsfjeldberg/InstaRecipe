<script>
    import { onMount, onDestroy } from 'svelte';
    import { page } from '$app/stores';

    import { LoaderCircle, CircleUser } from 'lucide-svelte';
    import { Separator } from '$lib/components/ui/separator';
    import FollowButton from '$lib/components/User/Follow/FollowButton.svelte';
    import UnfollowButton from '$lib/components/User/Follow/UnfollowButton.svelte';
    import FollowModal from '$lib/components/User/Follow/FollowModal.svelte';
    import RecipeListSelect from '$lib/components/RecipeList/RecipeListSelect/RecipeListSelect.svelte';
    import RecipeCard from '$lib/components/Recipe/RecipeCard/RecipeCard.svelte';
    
    import { user } from '../../../stores/authStore.js';
    import { socket } from '../../../stores/socketStore.js';
    
    import userApi from '$lib/api/userApi.js';
    import recipeListApi from '$lib/api/recipelistApi.js';

    import { sortRecipeList } from '$lib/utils/recipeList.js';


    const currentUserId = $page.params.id;
    let currentUser = $state(null);
    let currentUserRecipeLists = $state(null);
    
    let viewer = $state(null);
    let viewerSelectedList = $state(null);
    let viewerFavoritesRecipeList = $state(null);
    let viewerFollowingList = $state([]);

    let isLoading = $state(true);
    let isFollowing = $state(false);
    let isShowingFollowersModal = $state(false);
    let isShowingFollowingModal = $state(false);



    onMount(async () => {
        try {
            currentUser = await userApi.getUserById(currentUserId);
            currentUserRecipeLists = await recipeListApi.getRecipeListsByUserId(currentUserId);
            currentUserRecipeLists = sortRecipeList(currentUserRecipeLists);
            viewerSelectedList = currentUserRecipeLists[0];

            if(!$user) {
                return;
            }

            viewer = await userApi.getUserById($user.id);
            const viewerRecipeLists = await recipeListApi.getRecipeListsByUserId(viewer.id);
            viewerFavoritesRecipeList = viewerRecipeLists.find( (list) => list.name === "Favorites" );
            viewerFollowingList = viewer.following;
            
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
    
    
    const handleFollowEvent = async (updatedUser) => {
        if (updatedUser.id === currentUser.id) {   
            currentUser = updatedUser;
            viewer = await userApi.getUserById(viewer.id)
            viewerFollowingList = viewer.following;
        }
    }

    const disconnectFollowing = socket.on("following", handleFollowEvent);
    const disconnectUnfollowing = socket.on("unfollowing", handleFollowEvent);


    onDestroy(() => {
        disconnectFollowing()
        disconnectUnfollowing()
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
        {#if currentUser.avatarUrl}
            <img class="rounded-full w-28 h-28 object-cover" src={currentUser.avatarUrl} alt="User Avatar"> 
        {:else}
            <CircleUser class="w-28 h-28 rounded-full text-gray-400" />
        {/if}

        <div class="flex flex-col items-center">
            <h1 class="text-3xl font-semibold mt-4">{currentUser.username}</h1>
        </div>

        <!-- Stats: followers / following -->
        <div class="flex space-x-8 text-center">
            <FollowModal topLevelUserId={currentUser.id} noOfUsers={currentUser.followers.length} label={"followers"} parentUserList={currentUser.followers} {viewerFollowingList}/>
            <FollowModal topLevelUserId={currentUser.id} noOfUsers={currentUser.following.length} label={"following"} parentUserList={currentUser.following} {viewerFollowingList}/>
        </div>

        <div class="flex gap-6">
            <!-- Follow / Unfollow button -->
            {#if viewer}

                {#if currentUser.id !== viewer.id} 
                    {#if isFollowing}
                        <UnfollowButton bind:parentUser={currentUser} onToggleFollowButton={handleToggleFollowButton} />
                    {:else}
                        <FollowButton bind:parentUser={currentUser} onToggleFollowButton={handleToggleFollowButton} />
                    {/if}
                {/if}

            {:else}
                <FollowButton bind:parentUser={currentUser} onToggleFollowButton={handleToggleFollowButton} />  
            {/if}

            <RecipeListSelect user={currentUser} bind:recipeLists={currentUserRecipeLists} bind:selectedList={viewerSelectedList}/>
        </div>

    </div>


    <Separator class="mt-4 mb-6 h-[2px]" />


    {#if viewerSelectedList}    
        {#if viewerSelectedList.recipes.length > 0}
            <div class="grid grid-cols-3 gap-4 mt-4">
                {#each viewerSelectedList.recipes as recipe (recipe.id)}
                    <RecipeCard {recipe} bind:selectedList={viewerSelectedList} bind:favoritesRecipeList={viewerFavoritesRecipeList} parentUser={currentUser}/>
                {/each}
            </div>

        {:else}
            <h3 class="flex justify-center">{viewerSelectedList.name} is empty, no recipes found...</h3>

        {/if}
    {/if}

{/if}
