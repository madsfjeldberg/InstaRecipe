<script>
  import { createEventDispatcher, onMount } from "svelte";

  import * as Select from "$lib/components/ui/select/index.js";
  import { Check } from "lucide-svelte";
  
  let { categories = $bindable() } = $props();
  let selectedCategory = $state("");

</script>

<Select.Root
  bind:value={selectedCategory}
  name="category"
  type="single"
>
  <Select.Trigger class="hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">
    {selectedCategory || "Select a category"}
  </Select.Trigger>
    <Select.Content>
      <Select.ScrollUpButton>
      </Select.ScrollUpButton>
        <Select.Group>
          {#each categories as cat, index (cat.id || index)}
            <Select.Item
              class="hover:bg-slate-200 dark:hover:bg-gray-800 transition-all"
              value={cat.name}
              selected={cat._id === selectedCategory._id}
            >
              {cat.name}
            </Select.Item>
          {/each}
        </Select.Group>
    </Select.Content>
</Select.Root>