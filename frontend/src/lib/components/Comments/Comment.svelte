<script>
    import { onDestroy } from 'svelte';

    import { Button } from '$lib/components/ui/button/index.js';
    import * as Card from '$lib/components/ui/card/index.js';
    import Separator from '../ui/separator/separator.svelte';
    
    import CommentCard from './CommentCard.svelte';
    import CommentInput from './CommentInput.svelte';
    import CommentReply from './CommentReply.svelte';
    import { socket } from '../../../stores/socketStore.js';

    let { comments = $bindable(), recipeId } = $props();

    let commentToReplyToId = $state("");
    let isDisplayingReplyDialog = $state(false);
        
    const disconnect = socket.on("new-comment-reply", (commentReply) => {
        if(recipeId === commentReply.recipeId) {
            // we need to fint the parent comment and add the reply to it
            // we do this to avoid having to re-fetch all comments and getting instant feedback
            // and to keep the replies nested under their parent comment
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
        
        <Separator class="my-4" />
        <CommentCard className={"mt-4"} {comment} {commentToReplyToId} {isDisplayingReplyDialog} onShowReplyBox={showReplyBox}/>
        
        {#if isDisplayingReplyDialog && commentToReplyToId === comment.id}
            <CommentReply bind:isDisplayingReplyDialog parentComment={comment}/>
        {/if}
        
        {#if comment.replies && comment.replies.length > 0}
            {#each comment.replies as reply (reply.id) }
                <CommentCard className={"w-3/4 mt-2"} comment={reply} {commentToReplyToId} {isDisplayingReplyDialog} onShowReplyBox={showReplyBox}/>
                {#if isDisplayingReplyDialog && commentToReplyToId === reply.id}
                    <CommentReply bind:isDisplayingReplyDialog parentComment={comment} replyParent={reply}/>
                {/if}
            {/each}
        {/if}
    {/each}
{/if}
