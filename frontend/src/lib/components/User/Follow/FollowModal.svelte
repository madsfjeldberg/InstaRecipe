<script>
    import { goto } from '$app/navigation';

    import { Search, LoaderCircle, CircleUser } from 'lucide-svelte';
    import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
    import { Separator } from '$lib/components/ui/separator';
    import * as Dialog from '$lib/components/ui/dialog/index.js';
    import { Input } from '$lib/components/ui/input/index.js';
    import { Label } from '$lib/components/ui/label/index.js';

    import UnfollowButton from './UnfollowButton.svelte';
    import FollowButton from './FollowButton.svelte';
    
    import { user } from '../../../../stores/authStore.js';

    const { topLevelUserId, noOfUsers, label, parentUserList, viewerFollowingList } = $props();
    let searchValue = $state("");
    let filteredUsers = $state([]);

    const viewer = $user;

    $effect(() => {
        filteredUsers = parentUserList.filter( (user) => user.username.toLowerCase().includes(searchValue.toLowerCase()) );
    })

    const vistUser = (userId) => {
        goto("/users/" + userId);
    }
</script>

<Dialog.Root>
    <Dialog.Trigger>
        <div class="flex flex-col">
            <p class="text-lg font-medium">{noOfUsers}</p>
            <p class="text-sm text-gray-500">{label}</p>
        </div>
    </Dialog.Trigger>

    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title class="flex justify-center">{label}</Dialog.Title>
        </Dialog.Header>

        <div class="flex-grow flex items-center">
            <Search class="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0"/>
            <Input
                bind:value={searchValue}
                placeholder="Search in {label}..."
                class="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 h-9 bg-transparent"
                autofocus
            />
        </div>

        <Separator class="h-[2px]" />

        {#if parentUserList.length > 0 && searchValue === ""}
            {#each parentUserList as user (user.id)}
                <div class="flex justify-between items-center gap-4">
                    <button class="flex gap-3" onclick={ () => vistUser(user.id)}>
                        {#if user.avatarUrl}
                            <img class="rounded-full w-7 h-7" src={user.avatarUrl} alt={user.username + "' avatar"}>
                        {:else}
                            <CircleUser class="w-7 h-7"/>
                        {/if}
                     
                        <p>{user.username}</p>
                    </button>
                    
                    <!-- if viewer means im logged in -->
                    {#if viewer }
                        {#if user.id !== viewer.id}
                            <!-- check to se if the users profile we are looking at are in our own following list if so show unfollow button. -->
                            {#if viewerFollowingList && viewerFollowingList.some( (followingUser) => followingUser.id === user.id)}
                                <UnfollowButton {topLevelUserId} parentUser={user}/>
                            {:else}
                                <FollowButton {topLevelUserId} parentUser={user}/>
                            {/if}
                        {/if}
                        <!-- if user.id === viewer.id -->
                        <!-- render no buttons, as I should not be able to follow/unfollow my self  -->
                    {:else} 
                    <!-- else not logged in, show follow button on all -->
                        <FollowButton parentUser={user}/>

                    {/if}
                </div>
            {/each}

        <!-- Search in follower / following list -->
        {:else if filteredUsers.length === 0 && searchValue !== ""}
            <p class="p-4 text-center text-gray-500">No results for “{searchValue}”</p>
            
        {:else if filteredUsers.length > 0 && searchValue !== ""}
            {#each filteredUsers as filteredUser (filteredUser.id)}
                <div class="flex justify-between items-center gap-4">
                    <button class="flex gap-3" onclick={ () => vistUser(filteredUser.id)}>
                        {#if !filteredUser.avatarUrl}
                            <CircleUser class="w-7 h-7"/>
                        {:else}
                            <img class="w-7 h-7 rounded-full" src={filteredUser.avatarUrl} alt={filteredUser.username + "' avatar"}>
                        {/if}
                     
                        <p>{filteredUser.username}</p>
                    </button>
                    
                <!-- i dont want to be able to follow myself when searching -->
                    {#if viewer && viewer.id !== filteredUser.id }
                        {#if viewerFollowingList && viewerFollowingList.some( (followingUser) => followingUser.id === filteredUser.id)}
                            <UnfollowButton parentUser={filteredUser}/>
                        {:else}
                            <FollowButton parentUser={filteredUser}/>
                        {/if}
                            
                    {:else}

                        {#if !viewer}
                            <FollowButton parentUser={filteredUser}/>
                        {/if}

                    {/if}
                </div>
            {/each}

        {:else}
            <p class="p-4 text-center text-gray-500">There are currently no {label}...</p>
        {/if}
    </Dialog.Content>
</Dialog.Root>
