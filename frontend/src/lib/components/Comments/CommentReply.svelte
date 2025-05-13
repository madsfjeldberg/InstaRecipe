<script>
    import { onDestroy } from "svelte";

    import { toast } from "svelte-sonner";
    import { Textarea } from "$lib/components/ui/textarea/index.js";
    import { Button } from "$lib/components/ui/button/index.js";

    import { socket } from "../../../stores/socketStore.js";

    let { isDisplayingReplyDialog = $bindable(), parentComment, replyParent } = $props();
    let commentReplyText = $state("@" + parentComment.user.username + "\n");



    const postReply = () => {
        if(commentReplyText === "") {
            toast.error("Your reply is empty, write a reply")
            return;
        }

        const newCommentReply = {
            userId: parentComment.userId,
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

<h3 class="italic mt-4 mb-2 ml-1">Replying to {parentComment.user.username}</h3>
<Textarea bind:value={commentReplyText}/>

<div class="mb-10 mt-4">
    <Button onclick={postReply}>Submit</Button>
    <Button onclick={closeReplyBox}>Cancel</Button>
</div>