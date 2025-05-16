<script>
    import { onDestroy } from "svelte";

    import { Button } from "$lib/components/ui/button/index.js";
    import { toast } from "svelte-sonner";

    import { user } from "../../../stores/authStore.js";
    import { socket } from "../../../stores/socketStore.js";

    const { parentUser = $bindable() } = $props();

    const disconnect = socket.on("following", (updatedUser) => {
        parentUser.followers = [...parentUser.followers, updatedUser.followers]
    })
    onDestroy(disconnect)

    const followUser = () => {

        if(!$user) {
            toast.error("You have to login to follow " + parentUser.username)
            return;
        }

        const data = {
            parentId: parentUser.id,
            childId: $user.id
        }

        socket.emit("following", data);
    }
</script>

<Button onclick={followUser}>Follow</Button>