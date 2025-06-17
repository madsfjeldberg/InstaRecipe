<script>
  import { Check } from 'lucide-svelte';
  import * as Select from '$lib/components/ui/select/index.js';

  let { user, recipeLists = $bindable(), selectedList = $bindable() } = $props();
  let userId = user.id;
  
</script>

<Select.Root
  bind:value={selectedList}
  name="recipeList"
  type="single"
>
  <Select.Trigger class="hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">
    {selectedList ? selectedList.name : "Create a list to get started!"}
  </Select.Trigger>

    <Select.Content>

      <Select.ScrollUpButton/>

        <Select.Group>
          {#each recipeLists as list, index (list.id || index)}
          <!-- bad to compare plain object with proxy object like object from state, they have different indetifiers apprently, which can cause unforseen bugs -->
            <Select.Item
              class="hover:bg-slate-200 dark:hover:bg-gray-800 transition-all"
              value={list}
              selected={list.id === selectedList.id}
            >
              {list.name}
            </Select.Item>
          {/each}
        </Select.Group>
        
    </Select.Content>
</Select.Root>
