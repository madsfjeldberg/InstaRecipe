<script>
    import { onDestroy } from "svelte";
    import { page } from '$app/stores';
    import { get } from "svelte/store";

    import { Eye } from "lucide-svelte";

    import { user } from "../../../stores/authStore.js";
    import { socket } from "../../../stores/socketStore.js";

    let { totalViews = $bindable(), recipeId } = $props();

    

    // Only increment views if on the correct recipe page
    if (get(page).url.pathname === `/recipes/${recipeId}`) {
      const data = {
        userId: $user.id || null,
        recipeId
      };
      socket.emit("update-recipe-views", data);
      ++totalViews;
    }

    const disconnect = socket.on("update-recipe-views", (data) => {
      totalViews = data.totalViews;
    });
    onDestroy(disconnect);



</script>

<div class="flex items-center">
    <Eye class="mr-1" size="20" />
    <p class="font-semibold" >{totalViews}</p>
</div>
