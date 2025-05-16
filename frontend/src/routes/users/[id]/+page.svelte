<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";

    import { LoaderCircle } from "lucide-svelte";

    const userId = $page.params.id;
    let user = $state(null);
    let loading = $state(true);

    onMount(async () => {
        user = await getUserById(userId);
    });
</script>

{#if loading}
    <LoaderCircle/> Loading...
{/if}
<!-- <h1>Users: {userId} {user.name}</h1> -->
