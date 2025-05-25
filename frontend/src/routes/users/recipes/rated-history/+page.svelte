<script>
    import userApi from '$lib/api/userApi';
    import { onMount } from 'svelte';
    import { toast } from 'svelte-sonner';
     import { LoaderCircle } from 'lucide-svelte';

    const { data } = $props();
    const user = data.user;

    let ratedRecipeHistory = $state([]);

    let isLoading = $state(true);

    onMount( async () => {
        try {
            isLoading = true;
            ratedRecipeHistory = await userApi.getUserRatedRecipesHistory(user.id);
        } catch(error) {
            toast.error(error.message);
        } finally {
            isLoading = false;
        }
    });
</script>

{#if isLoading} 
    <LoaderCircle class="animate-spin"/> 
    <h1 class="ml-4 text-xl">Loading...</h1>
{/if}

{#if ratedRecipeHistory.length === 0}
    <h1 class="flex justify-center items-center h-min[window]">Rated recipes history is empty, rate a recipe...</h1>
{/if}

<!-- design the recipes history page

make like/dislike reusebale components

include timestamps on like/dislike by modifying db structure
-->
