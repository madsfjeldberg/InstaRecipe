<script>
    import { onMount } from "svelte";

    import { toast } from "svelte-sonner";
    
    import { LoaderCircle } from "lucide-svelte";
    
    import userApi from "$lib/api/userApi";

    const { data } = $props();
    const user = data.user;

    let ratedRecipeHistory = $state(null);

    let isLoading = $state(true);

    onMount(async () => {
        try {
            isLoading = true;
            ratedRecipeHistory = await userApi.getUserRatedRecipesHistory(user.id);
            console.log("history", ratedRecipeHistory)
        } catch (error) {
            toast.error(error.message);
        } finally {
            isLoading = false;
        }
    });
</script>

{#if true}
    <div class="flex justify-center items-center min-h-screen">
        <LoaderCircle class="animate-spin h-10 w-10"/>
    </div>
{/if}

{#if ratedRecipeHistory && ratedRecipeHistory.length === 0}
    <h1 class="flex justify-center items-center min-h-screen text-center">
        Rated recipes history is empty, rate a recipe...
    </h1>
{/if}


<!-- design the recipes history page

make like/dislike reusebale components

include timestamps on like/dislike by modifying db structure
-->
