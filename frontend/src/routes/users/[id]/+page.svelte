<script>
    import { onMount, onDestroy } from 'svelte';
    import { page } from '$app/stores';

    import { LoaderCircle, CircleUser, ArrowLeft } from 'lucide-svelte';
    import { Separator } from '$lib/components/ui/separator';
    import Button from '$lib/components/ui/button/button.svelte';

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

    const { data } = $props();
    const { currentUser, currentUserRecipeLists, viewer, viewerFavoritesRecipeList, viewerFollowingList, isFollowing } = data;

    let currentUserState = $state(currentUser || null);
    let currentUserRecipeListsState = $state(currentUserRecipeLists || []);
    
    let viewerState = $state(viewer || null);
    let viewerSelectedListState = $state(currentUserRecipeLists ? currentUserRecipeLists[0] : null);
    let viewerFavoritesRecipeListState = $state(viewerFavoritesRecipeList || null);
    let viewerFollowingListState = $state(viewerFollowingList || []);

    let isFollowingState = $state(isFollowing || false);
    let isShowingFollowersModal = $state(false);
    let isShowingFollowingModal = $state(false);


    
    
    const handleFollowEvent = async (updatedUser) => {
        if (updatedUser.id === currentUserState.id) {   
            currentUserState = updatedUser;
            viewerState = await userApi.getUserById(viewerState.id)
            viewerFollowingListState = viewerState.following;
        }
    }

    const disconnectFollowing = socket.on("following", handleFollowEvent);
    const disconnectUnfollowing = socket.on("unfollowing", handleFollowEvent);


    onDestroy(() => {
        disconnectFollowing()
        disconnectUnfollowing()
    })
    


    const handleToggleFollowButton = () => {
        isFollowingState = !isFollowingState;
    }
</script>



{#if currentUserState}
    <div class="flex flex-col items-center mt-12 space-y-6">

        <!-- Profile picture + username -->
        {#if currentUserState.avatarUrl}
            <img class="rounded-full w-28 h-28 object-cover" src={currentUserState.avatarUrl} alt="User Avatar"> 
        {:else}
            <CircleUser class="w-28 h-28 rounded-full text-gray-400" />
        {/if}

        <div class="flex flex-col items-center">
            <h1 class="text-3xl font-semibold mt-4">{currentUserState.username}</h1>
        </div>

        <!-- Stats: followers / following -->
        <div class="flex space-x-8 text-center">
            <FollowModal topLevelUserId={currentUserState.id} noOfUsers={currentUserState.followers.length} label={"followers"} parentUserList={currentUserState.followers} viewerFollowingList={viewerFollowingListState}/>
            <FollowModal topLevelUserId={currentUserState.id} noOfUsers={currentUserState.following.length} label={"following"} parentUserList={currentUserState.following} viewerFollowingList={viewerFollowingListState}/>
        </div>

        <div class="flex gap-6">
            <!-- Follow / Unfollow button -->
            {#if viewerState}

                {#if currentUserState.id !== viewerState.id} 
                    {#if isFollowingState}
                        <UnfollowButton bind:parentUser={currentUserState} onToggleFollowButton={handleToggleFollowButton} />
                    {:else}
                        <FollowButton bind:parentUser={currentUserState} onToggleFollowButton={handleToggleFollowButton} />
                    {/if}
                {/if}

            {:else}
                <FollowButton bind:parentUser={currentUserState} onToggleFollowButton={handleToggleFollowButton} />  
            {/if}

            <RecipeListSelect user={currentUserState} bind:recipeLists={currentUserRecipeListsState} bind:selectedList={viewerSelectedListState}/>
        </div>

    </div>


    <Separator class="mt-4 mb-6 h-[2px]" />


    {#if viewerSelectedListState}    
        {#if viewerSelectedListState.recipes.length > 0}
            <div class="grid grid-cols-3 gap-4 mt-4">
                {#each viewerSelectedListState.recipes as recipe (recipe.id)}
                    <RecipeCard {recipe} bind:selectedList={viewerSelectedListState} bind:favoritesRecipeList={viewerFavoritesRecipeListState} parentUser={currentUserState}/>
                {/each}
            </div>

        {:else}
            <h3 class="flex justify-center">{viewerSelectedListState.name} is empty, no recipes found...</h3>

        {/if}
    {/if}


{:else}
    <div class="flex flex-col items-center justify-center h-screen">
      Error loading recipe. Please try again later.
      <Button onclick={() => history.back()} class="mt-4"> 
        <ArrowLeft/>
        Go back
      </Button>
    </div> 
{/if}
