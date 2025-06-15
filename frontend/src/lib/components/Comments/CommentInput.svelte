<script>
    import { onDestroy } from 'svelte';

    import { toast } from 'svelte-sonner';
    import { Button } from '$lib/components/ui/button/index.js';
    import { Textarea } from '$lib/components/ui/textarea/index.js';

    import { user } from '../../../stores/authStore.js';
    import { socket } from '../../../stores/socketStore.js';



    let { comments = $bindable(), recipeId } = $props();
    let newCommentText = $state("");



    const disconnect = socket.on("new-comment", (data) => {
        if(recipeId === data.recipeId) {
            comments = [...comments, data]
        }
    })
    onDestroy(disconnect);



    const postComment = () => {
        if($user === null) {
            toast.error("You have to have an account for posting comments");
            return;
        }

        if(newCommentText === "") {
            toast.error("Comments block empty, write a comment");
            return;
        }

        const newComment = {
            userId: $user.id,
            comment: newCommentText,
            postedAt: Date.now(),
            recipeId
        }

        newCommentText = "";

        socket.emit("new-comment", newComment);
        toast.success("Comment posted");
    }

</script>

<div class="grid w-full gap-2">
    <Textarea bind:value={newCommentText} placeholder="Type your comment here."/>
    <Button onclick={postComment}>Post Comment</Button>
</div>
