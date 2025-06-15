<script>
    import { onDestroy, onMount } from 'svelte';

    import { toast } from 'svelte-sonner';
    import { Textarea } from '$lib/components/ui/textarea/index.js';
    import { Button } from '$lib/components/ui/button/index.js';

    import { socket } from '../../../stores/socketStore.js';
    import { user } from '../../../stores/authStore.js';

    let { isDisplayingReplyDialog = $bindable(), parentComment, replyParent } = $props();
    let commentReplyText = $state("");



    onMount( () => {
        if(replyParent) {
            commentReplyText = "@" + replyParent.user.username + " ";
            return;
        }

        commentReplyText = "@" + parentComment.user.username + " ";
    })



    const postReply = () => {

        if($user === null) {
            toast.error("You have to login to comment");
            return;
        }

        if(commentReplyText === "") {
            toast.error("Your reply is empty, write a reply");
            return;
        }

    
        const newCommentReply = {
            userId: $user.id,
            replyToUserId: replyParent ? replyParent.userId : parentComment.userId, // user being replied to
            recipeId: parentComment.recipeId,
            commentParentId: parentComment.id,
            replyParent: replyParent,
            comment: parseCommentText(commentReplyText)
        } 
        

        //todo read up on callback acknowledgement use this as error handling.
        socket.emit("new-comment-reply", newCommentReply);

        closeReplyBox();
        toast.success("Reply has been posted");
    }



    const closeReplyBox = () => {
        isDisplayingReplyDialog = false;
    }

    const parseCommentText = (comment) => {
        return comment.split(" ").slice(1).join(" "); // Removes the '@username' part
    }

</script>

{#if replyParent}
    <h3 class="italic mt-4 mb-2 ml-1">Replying to {replyParent.user.username}</h3>
{:else}
    <h3 class="italic mt-4 mb-2 ml-1">Replying to {parentComment.user.username}</h3>
{/if}
<Textarea bind:value={commentReplyText}/>

<div class="mb-10 mt-4">
    <Button onclick={postReply}>Submit</Button>
    <Button onclick={closeReplyBox} variant="ghost">Cancel</Button>
</div>
