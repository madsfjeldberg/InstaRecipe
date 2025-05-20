<script>
    import { toast } from 'svelte-sonner';

    import { Button } from '$lib/components/ui/button/index.js';
    import { UserRoundPlus } from 'lucide-svelte';

    import { user } from '../../../stores/authStore.js';
    import { socket } from '../../../stores/socketStore.js';

    const { parentUser = $bindable(), onToggleFollowButton } = $props();
    const viewer = $user;

    const followUser = () => {

        if(!viewer) {
            toast.error("You have to login to follow " + parentUser.username)
            return;
        }

        const data = {
            parentId: parentUser.id,
            childId: viewer.id
        }

        socket.emit("following", data);

        if(onToggleFollowButton) {
            onToggleFollowButton();
        }
    }
</script>

<Button onclick={followUser}>
    <UserRoundPlus/>
    Follow
</Button>
