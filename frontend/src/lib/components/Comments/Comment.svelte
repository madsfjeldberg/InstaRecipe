<script>
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { onDestroy } from "svelte";

    import { socket } from "../../../stores/socketStore.js";
    import CommentInput from "./CommentInput.svelte";

    let { comments = $bindable(), recipeId } = $props();
    let isDisplayingReplyDialog = $state(false);

    const disconnect = socket.on("new-comment", (data) => {
        comments.push(data)
    })

    onDestroy(disconnect)

    const showReplyBox = () => {
        isDisplayingReplyDialog = true;
    }

</script>

<CommentInput bind:comments recipeId={recipeId}/> 

{#if comments.length === 0}
    <span class="text-gray-500 dark:text-gray-400 italic">No comments yet. Be the first to comment!</span>

    {:else}
    {#each comments as comment, index (comment.id || index)}
        
        <Card.Root class="w-[81rem] mt-4">
            <Card.Header>
                <Card.Title>{comment.username}</Card.Title>
            <Card.Description>Date: {new Date(comment.postedAt).toLocaleDateString()} Time: {new Date(comment.postedAt).toLocaleTimeString()}</Card.Description
                >
            </Card.Header>
            
            <Card.Content class="grid gap-4">
                <p>{comment.comment}</p>
            </Card.Content>
            
            <Card.Footer class="flex justify-end z-10 relative">
                <Button onclick={showReplyBox}>Reply</Button>
            </Card.Footer>
        </Card.Root>
        
    {/each}

{/if}


{#if isDisplayingReplyDialog}
    <CommentReply/>
{/if}
