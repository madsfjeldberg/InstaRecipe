<script>
    import { Textarea } from "$lib/components/ui/textarea/index.js";
    import { Button } from "$lib/components/ui/button/index.js";

    let { isDisplayingReplyDialog = $bindable(), username } = $props();

</script>

<h3 class="font-italic">Replying to {username}</h3>
<Textarea class="mb-2"/>
<Button onclick={() => isDisplayingReplyDialog = false}>asd</Button>
<Button onclick={() => isDisplayingReplyDialog = false}>Cancel</Button>