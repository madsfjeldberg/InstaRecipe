<script>
  import * as Select from "$lib/components/ui/select/index.js";
  import { getRecipeListsByUserId } from "$lib/services/recipelists";
  import { Check } from "lucide-svelte";
  import { onMount } from "svelte";
  import { user } from "$lib/stores/authStore.js";

  let userId = $user.id; // fetched from authStore

  let recipeLists = $state([]);
  // Bound value for the Select
  let value = $state("");

  onMount(async () => {
    // Fetch the recipe lists when the component mounts
    recipeLists = await getRecipeListsByUserId(userId);
  });

</script>

<Select.Root
  bind:value={value}
  on:change={e => {
    console.log("Selected recipe list:", e.detail.value);
  }}
  name="recipeList"
  type="single"
>
  <Select.Trigger>
    {value || "Select a recipe list"}
  </Select.Trigger>
    <Select.Content>
      <Select.ScrollUpButton>
      </Select.ScrollUpButton>
        <Select.Group>
          {#each recipeLists as list, index (list.id || index)}
            <Select.Item
              value={list.name}
            >
              {list.name}
            </Select.Item>
          {/each}
        </Select.Group>

    </Select.Content>
</Select.Root>
