<script>
    import { onDestroy } from "svelte";

    import { Button } from "$lib/components/ui/button/index.js";
    import { Textarea } from "$lib/components/ui/textarea/index.js";

    import { user } from "../../../stores/authStore.js";
    import { socket } from "../../../stores/socketStore.js";

    let { comments = $bindable(), recipeId } = $props();
    let newCommentValue = $state("");

    const postComment = () => {
        const newComment = {
            userId: $user.id,
            username: $user.username,
            comment: newCommentValue,
            postedAt: Date.now(),
            recipeId
        }
        comments.push(newComment)
        newCommentValue = "";

        socket.emit("new-comment", newComment);
    }
</script>

<div class="grid w-full gap-2">
    <Textarea bind:value={newCommentValue} placeholder="Type your comment here."/>
    <Button onclick={postComment}>Post Comment</Button>
</div>
