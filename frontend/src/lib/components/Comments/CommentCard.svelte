<script>
    import { goto } from "$app/navigation";

    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";

    let { className, comment, commentToReplyToId = $bindable(), isDisplayingReplyDialog, onShowReplyBox} = $props();
</script>

<Card.Root class={className}>
    <Card.Header>
        <Card.Title>
            {#if comment.user.username.startsWith("deleted")}
                <p class="italic text-gray-500">Deleted User</p>
            {:else}
                <button class="hover:underline text-2xl" onclick={() => goto(`/users/${comment.user.id}`)}>
                    {comment.user.username}
                </button>

            {/if}
        </Card.Title>
        <Card.Description>
            Date: {new Date(comment.postedAt).toLocaleDateString()} 
            Time: {new Date(comment.postedAt).toLocaleTimeString()}
        </Card.Description>
    </Card.Header>

    <Card.Content class="grid gap-4">
        {#if comment.replyToUser && comment.replyToUser.username.startsWith("deleted")}
            <p class="italic text-gray-500">@Deleted User {comment.comment}</p>
        {:else if comment.replyToUser} 
            <p>
                <button class="hover:underline" onclick={() => goto(`/users/${comment.replyToUser.id}`)}>
                    @{comment.replyToUser.username} 
                </button>
                {comment.comment}
            </p>
        {:else}
            {comment.comment}
        {/if}
    </Card.Content>

    <Card.Footer class="flex justify-end z-10 relative">
        {#if isDisplayingReplyDialog && commentToReplyToId === comment.id}
            <Button size="sm" disabled>Reply</Button>
        {:else}
            <Button size="sm" onclick={() => onShowReplyBox(comment.id)}>
                Reply
            </Button>
        {/if}
    </Card.Footer>
</Card.Root>
