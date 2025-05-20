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
            commentReplyText = "@" + replyParent.user.username + "\n";
            return;
        }

        commentReplyText = "@" + parentComment.user.username + "\n"
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
            recipeId: parentComment.recipeId,
            commentParentId: parentComment.id,
            replyParent: replyParent,
            comment: commentReplyText
        } 

        //todo read up on callback acknowledgement use this as error handling.
        socket.emit("new-comment-reply", newCommentReply);

        closeReplyBox();
        toast.success("Reply has been posted");
    }



    const closeReplyBox = () => {
        isDisplayingReplyDialog = false;
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
    <Button onclick={closeReplyBox}>Cancel</Button>
</div>
