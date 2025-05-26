<script>
    import { onDestroy } from "svelte";

    import DislikeButton from "./DislikeButton.svelte";
    import LikeButton from "./LikeButton.svelte";

    import { socket } from "../../../stores/socketStore.js";

    let { likes = $bindable(), dislikes = $bindable(), recipeId } = $props();


    
    const disconnect = socket.on("update-like-dislike", (recipe) => {
        if (recipe.id === recipeId) {
            likes = recipe.likes;
            dislikes = recipe.dislikes;
        }
    });
    onDestroy(disconnect);
</script>

<div class="col-span-1 flex justify-end items-center">
    <LikeButton bind:likes bind:dislikes {recipeId} />
    <DislikeButton bind:dislikes bind:likes {recipeId} />
</div>
