<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";

    import { LoaderCircle } from "lucide-svelte";
    import CircleUser from "lucide-svelte/icons/circle-user";

    import { getUserById } from "$lib/api/userApi.js";
    import { avatarStore } from "../../../stores/avatarStore.js";
    import { socket } from "../../../stores/socketStore.js";

    const userId = $page.params.id;
    let user = $state(null);
    let loading = $state(true);

    onMount(async () => {
        try {
            user = await getUserById(userId);
            console.log(user);
        } catch (error) {
            console.error(error);
        } finally {
            loading = false;
        }
    });
</script>

{#if loading}
    <div class="flex items-center justify-center min-h-screen">
        <LoaderCircle class="animate-spin h-16 w-16" />
        <h1 class="text-2xl font-semibold">Loading...</h1>
    </div>
{/if}

{#if user}
    <div class="flex justify-center mt-12">
        <div class="grid grid-cols-2 gap-24">
            <div class="col-span-1">
                <CircleUser class="rounded-full w-28 h-28 object-cover" />
            </div>
            <div class="col-span-1">
                <h1 class="text-4xl font-semibold">{user.username}</h1>
            </div>
        </div>
    </div>
    <div class="flex justify-around">
        <CircleUser class="rounded-full w-28 h-28 object-cover" />
        <h1 class="text-4xl font-semibold">{user.username}</h1>
    </div>
{/if}

<!-- TODO ENABLE COSTUME AVATAR -->
<!-- {#if $avatarStore}
        <img class="rounded-full w-28 h-28 object-cover" src={$avatarStore} alt="User Avatar"> 
        {:else}

    {/if} -->
