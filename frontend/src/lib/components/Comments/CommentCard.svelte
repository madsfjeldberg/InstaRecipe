<script>
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";

    let { className, comment, commentToReplyToId = $bindable(), isDisplayingReplyDialog, onShowReplyBox} = $props();
</script>

<Card.Root class={className}>
    <Card.Header>
        <Card.Title>
            {#if comment.user.username.substring(0, 7) === "deleted"}
                <span class="italic text-gray-500">Deleted User</span>
            {:else}
                {comment.user.username}
            {/if}
        </Card.Title>
        <Card.Description
            >Date: {new Date(comment.postedAt).toLocaleDateString()} Time: {new Date(
                comment.postedAt,
            ).toLocaleTimeString()}</Card.Description
        >
    </Card.Header>

    <Card.Content class="grid gap-4">
        <p>{comment.comment}</p>
    </Card.Content>

    <Card.Footer class="flex justify-end z-10 relative">
        {#if isDisplayingReplyDialog && commentToReplyToId === comment.id}
            <Button size="sm" disabled>Reply</Button>
        {:else}
            <Button size="sm" onclick={() => onShowReplyBox(comment.id)}
                >Reply</Button
            >
        {/if}
    </Card.Footer>
</Card.Root>
