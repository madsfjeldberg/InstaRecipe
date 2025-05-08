import { readable } from "svelte/store";
import tagsApi from "$lib/api/tagsApi";

export const recipeTags = readable([], (set) => {
    // Start function runs when the first subscriber subscribes
    let isMounted = true;
    
    // Immediately fetch the data
    tagsApi.getRecipeTags()
        .then(tags => {
            console.log(tags)
            // Only update if the store hasn't been cleaned up
            if (isMounted) {
                set(tags);
            }
        })
        .catch(error => {
            console.error("Failed to fetch recipe tags:", error);
        });
    
    // Return the stop function that runs when the last subscriber unsubscribes
    return () => {
        isMounted = false;
    };
});
