<script>
    import { onDestroy } from "svelte";

    import { View } from "lucide-svelte";

    import { user } from "../../../stores/authStore.js";
    import { socket } from "../../../stores/socketStore.js";

    let { totalViews = $bindable(), recipeId } = $props();

    //incremant total views on load
    const data = {
        userId: $user.id || null,
        recipeId
    }
    socket.emit("update-recipe-views", data);
    ++totalViews;

    const disconnect = socket.on("update-recipe-views", (data) => {
        totalViews= data.totalViews;
    });
    onDestroy(disconnect);



</script>

<div class="flex items-center">
    <View class="mr-1" size="20" />
    {totalViews}
</div>
