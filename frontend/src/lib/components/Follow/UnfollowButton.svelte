<script>
    import { toast } from 'svelte-sonner';

    import { Button } from '$lib/components/ui/button/index.js';
    import { UserRoundMinus } from 'lucide-svelte';

    import { user } from '../../../stores/authStore.js';
    import { socket } from '../../../stores/socketStore.js';

    const { topLevelUserId, parentUser, onToggleFollowButton } = $props();
    const viewer = $user;

    const unfollow = () => {
        if (!viewer) {
            toast.error("You have to be logged in to perform that action");
            return;
        }

        const data = {
            topLevelUserId,
            parentId: parentUser.id,
            childId: viewer.id,
        };

        socket.emit("unfollowing", data);

        if(topLevelUserId) {
            return;
        }
        
        if(onToggleFollowButton) {
            onToggleFollowButton();
        }
    };
</script>

<Button onclick={unfollow}>
    <UserRoundMinus />
    Unfollow
</Button>
