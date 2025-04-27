<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";                
  import Check from "phosphor-svelte/lib/Check";                                                           
  import CaretDown from "phosphor-svelte/lib/CaretDown";                       
  
  // Your fruit options
  const fruits = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Cherry", value: "cherry" },
    { label: "Date", value: "date" },
    { label: "Elderberry", value: "elderberry" },
  ];
  
  // Bound value for the Select
  let value = "";
  
  // Reactive label for display
  $: selectedLabel =
    fruits.find((fruit) => fruit.value === value)?.label || "Select a fruit";
</script>

<Select.Root
  bind:value={value}
  name="favoriteFruit"
  type="single"
>
  <Select.Trigger class="h-input rounded-9px border-border-input bg-background inline-flex w-[296px] items-center px-[11px] text-sm">
    {selectedLabel}
  </Select.Trigger>
  
    <Select.Content>
      <Select.ScrollUpButton class="flex w-full justify-center">
      </Select.ScrollUpButton>
        <Select.Group>

          {#each fruits as fruit (fruit.value)}
            <Select.Item
              value={fruit.value}
              disabled={fruit.disabled}
              class="flex items-center justify-between py-2 px-4 text-sm capitalize data-disabled:opacity-50"
            >
              {fruit.label}
              {#if fruit.value === value}
                <Check class="size-4 text-primary" />
              {/if}
            </Select.Item>
          {/each}
        </Select.Group>

    </Select.Content>
</Select.Root>
