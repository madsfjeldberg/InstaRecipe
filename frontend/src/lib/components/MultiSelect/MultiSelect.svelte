<script>
  import * as Select from "$lib/components/ui/select/index.js";

  let { items, selectedItems = $bindable(), selectPlaceholder } = $props();

  const isMaxSelection = () => {
    if (selectedItems.length === 4) {
      selectedItems.pop();
      return;
    }
  };
</script>

<Select.Root
  onValueChange={isMaxSelection}
  bind:value={selectedItems}
  name="tags"
  type="multiple"
>                                                                            
<!--                                                                  Hvis du har en god dynamisk måde at resize select box på må du gerne lave det her om :) -->
  <Select.Trigger class={`flex flex-wrap gap-1 p-2 border rounded ${items.filter( (item) => selectedItems.find( (selectedItemId) => item.id === selectedItemId)).map((obj) => {return obj.name}).join("").length > 25 ? 'min-h-[6rem]' : ''}`}>
    {#if selectedItems.length}
      {#each selectedItems as selectedItemId (selectedItemId)}
        <span class="px-2 py-1 bg-slate-200 dark:bg-slate-900 rounded text-sm">
          {items.find((item) => item.id === selectedItemId).name}
        </span>
      {/each}
    {:else}
      {selectPlaceholder}
    {/if}
  </Select.Trigger>

  <Select.Content class="bg-slate-200 dark:bg-slate-900 border rounded shadow-lg">
    <Select.ScrollUpButton />
    <Select.Group>
      {#each items as item (item.id)}
        <Select.Item
          value={item.id}
          class="transition-all hover:bg-slate-200 dark:hover:bg-gray-800"
        >
          {item.name}
        </Select.Item>
      {/each}
    </Select.Group>
    <Select.ScrollDownButton />
  </Select.Content>
</Select.Root>
