<script>
    import { goto } from "$app/navigation";

    import { Search, LoaderCircle, CircleUser } from "lucide-svelte";
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import { Separator } from "$lib/components/ui/separator";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";

    import UnfollowButton from "./UnfollowButton.svelte";
    import FollowButton from "./FollowButton.svelte";
    import { user } from "../../../stores/authStore.js";

    const { noOfUsers, label, parentUserList, viewerFollowersList, viewerFollowingList } = $props();
    let searchValue = $state("");
    const viewer = $user;

    $effect(() => {
        console.log(searchValue)
        console.log(viewerFollowersList)
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

        {#if parentUserList.length > 0}
             {#each parentUserList as user (user.id)}
                <div class="flex justify-between items-center gap-4">
                    <button class="flex gap-3" onclick={ () => vistUser(user.id)}>
                        {#if user.avatar === null || user.avatarMime === null}
                            <CircleUser/>
                        {:else}
                            <img src="" alt={user.username + "' avatar"}>
                        {/if}
                     
                        <p>{user.username}</p>
                    </button>
                    
                    {#if user.id !== viewer.id}
                        {#if viewerFollowingList.some( (followingUser) => followingUser.id === user.id)}
                            <UnfollowButton parentUser={user}/>
                        {:else}
                            <FollowButton parentUser={user}/>
                        {/if}
                    {/if}
                </div>
             {/each}

        {:else}
            <p class="flex justify-center">There are currently no {label}...</p>
        {/if}
    </Dialog.Content>
</Dialog.Root>
