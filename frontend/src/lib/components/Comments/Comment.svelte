<script>
    import { onDestroy } from "svelte";

    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    
    import CommentInput from "./CommentInput.svelte";
    import CommentReply from "./CommentReply.svelte";
    import { socket } from "../../../stores/socketStore.js";



    let { comments = $bindable(), recipeId } = $props();

    let commentToReplyToId = $state("");
    let isDisplayingReplyDialog = $state(false);
    
    
    
    const disconnect = socket.on("new-comment-reply", (commentReply) => {
        if(recipeId === commentReply.recipeId) {
            console.log("before mutatuib", comments)
            comments = comments.map( (comment) => {
                if(comment.id === commentReply.parentId) {
                    return {
                        ...comment,
                        replies: [...comment.replies, commentReply]
                    }
                }
                return comment;
            })
        }
    })

    onDestroy(disconnect);



    const showReplyBox = (commentId) => {
        commentToReplyToId = commentId;
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
                <Card.Title>{comment.user.username}</Card.Title>
            <Card.Description>Date: {new Date(comment.postedAt).toLocaleDateString()} Time: {new Date(comment.postedAt).toLocaleTimeString()}</Card.Description>
            </Card.Header>
            
            <Card.Content class="grid gap-4">
                <p>{comment.comment}</p>
            </Card.Content>
            
            <Card.Footer class="flex justify-end z-10 relative">
                {#if isDisplayingReplyDialog && commentToReplyToId === comment.id}
                <Button disabled>Reply</Button>
                
                {:else}
                <Button onclick={ () => showReplyBox(comment.id)}>Reply</Button>

                {/if}
            </Card.Footer>
        </Card.Root>
        
        {#if isDisplayingReplyDialog && commentToReplyToId === comment.id}
            <CommentReply bind:isDisplayingReplyDialog parentComment={comment}/>
        {/if}
        
        {#if comment.replies.length > 0}
            <h1>REPLIES!</h1>
            {#each comment.replies as reply }
                            <Card.Root class="mt-4">
                        <Card.Header>
                            <Card.Title>{reply.user.username}</Card.Title>
                        <Card.Description>Date: {new Date(reply.postedAt).toLocaleDateString()} Time: {new Date(reply.postedAt).toLocaleTimeString()}</Card.Description>
                        </Card.Header>
                        
                        <Card.Content class="grid gap-4">
                            <p>{reply.comment}</p>
                        </Card.Content>
                        
                        <Card.Footer class="flex justify-end z-10 relative">
                            {#if isDisplayingReplyDialog && commentToReplyToId === reply.id}
                            <Button disabled>Reply</Button>
                            
                            {:else}
                            <Button onclick={ () => showReplyBox(reply.id)}>Reply</Button>

                            {/if}
                        </Card.Footer>
                    </Card.Root>

                    {#if isDisplayingReplyDialog && commentToReplyToId === reply.id}
                        <CommentReply bind:isDisplayingReplyDialog parentComment={comment}/>
                    {/if}
            {/each}
        {/if}
        
    {/each}

{/if}


