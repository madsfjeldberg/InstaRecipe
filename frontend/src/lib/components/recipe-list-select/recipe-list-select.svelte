<script>
  import * as Select from "$lib/components/ui/select/index.js";
  import { getRecipeListsByUserId } from "$lib/api/recipelistApi.js";
  import { Check } from "lucide-svelte";
  import { createEventDispatcher, onMount } from "svelte";

  let { user, recipeLists = $bindable(), selectedList = $bindable() } = $props();
  let userId = user.id;
  
</script>

<Select.Root
  bind:value={selectedList}
  name="recipeList"
  type="single"
>
  <Select.Trigger class="hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">
    {selectedList ? selectedList.name : "Create a list"}
  </Select.Trigger>
    <Select.Content>
      <Select.ScrollUpButton>
      </Select.ScrollUpButton>
        <Select.Group>
          {#each recipeLists as list, index (list.id || index)}
            <Select.Item
              class="hover:bg-slate-200 dark:hover:bg-gray-800 transition-all"
              value={list}
              selected={list._id === selectedList._id}
            >
              {list.name}
            </Select.Item>
          {/each}
        </Select.Group>
    </Select.Content>
</Select.Root>
