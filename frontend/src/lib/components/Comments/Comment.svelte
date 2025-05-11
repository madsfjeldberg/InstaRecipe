<script>
    import { onDestroy } from "svelte";

    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";

    import { socket } from "../../../stores/socketStore.js";
    import CommentInput from "./CommentInput.svelte";

    let { comments } = $props();
    let isDisplayingReplyDialog = false;

    console.log("asdasdasdads", comments.length)

    const disconnect = socket.on("new-comment", (data) => {

    })

    const postComment = () => {
        socket.emit("new-comment", {});
    }

    const showReplyBox = () => {
        isDisplayingReplyDialog = true;
    }

    onDestroy(disconnect);
</script>

<CommentInput/> 

{#if comments.length === 0}
    <span class="text-gray-500 dark:text-gray-400 italic">No comments yet. Be the first to comment!</span>

    {:else}
    {#each comments as comment}
        
        <Card.Root class="w-[81rem]">
            <Card.Header>
                <Card.Title>{comment.owner.name}</Card.Title>
            <Card.Description>{comment.postDate}</Card.Description
                >
            </Card.Header>
            
            <Card.Content class="grid gap-4">
                <p>{comment.text}</p>
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

<!-- <div class="flex flex-col rounded-xl">
    <div class="flex justify-between">
        <h4>Name here</h4>
        <span class="font-sm">date here</span>
        </div>
        
        <p>
            comment goes here
    </p>
</div> -->
