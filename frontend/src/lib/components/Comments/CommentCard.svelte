<script>
    import { Button } from '$lib/components/ui/button/index.js';
    import * as Card from '$lib/components/ui/card/index.js';

    let { comment, commentToReplyToId = $bindable(), onShowReplyBox  } = $props();
</script>

<Card.Root class="mt-4">
    <Card.Header>
        <Card.Title>{comment.user.username}</Card.Title>
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
            <Button disabled>Reply</Button>
        {:else}
            <Button onclick={() => showReplyBox(comment.id)}>Reply</Button>
        {/if}
    </Card.Footer>
</Card.Root>
