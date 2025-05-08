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
  <Select.Trigger class="flex flex-wrap gap-1 p-2 border rounded">
    {#if selectedItems.length}
      {#each selectedItems as selectedItemId (selectedItemId)}
        <span class="px-2 py-1 bg-gray-200 rounded text-sm">
          {items.find((item) => item.id === selectedItemId).name}
        </span>
      {/each}
    {:else}
      {selectPlaceholder}
    {/if}
  </Select.Trigger>

  <Select.Content class="bg-white border rounded shadow-lg">
    <Select.ScrollUpButton />
    <Select.Group>
      {#each items as item (item.id)}
        <Select.Item
          value={item.id}
          class="flex justify-between px-3 py-2 hover:bg-gray-100"
        >
          {item.name}
        </Select.Item>
      {/each}
    </Select.Group>
    <Select.ScrollDownButton />
  </Select.Content>
</Select.Root>
