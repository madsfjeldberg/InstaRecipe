<script>
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Pencil } from "lucide-svelte";
  import AlertDialogAction from "../ui/alert-dialog/alert-dialog-action.svelte";
  import recipeListApi from "$lib/api/recipelistApi";
  import { toast } from "svelte-sonner";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import Label from "../ui/label/label.svelte";
  import Input from "../ui/input/input.svelte";
  import Switch from "../ui/switch/switch.svelte";
  import DeleteListDialog from "../DeleteListDialog/DeleteListDialog.svelte";
  import { z } from "zod";

  let { selectedList = $bindable(), recipeLists = $bindable() } = $props();
  let isSheetDialogOpen = $state(false);
  let isPrivate = $state(selectedList.isPrivate);

  // update the isPrivate state when selectedList changes
  $effect(() => {
    if (selectedList) {
      isPrivate = selectedList.isPrivate;
    }
  });

  let errors = $state({
    form: "",
    name: "",
  });

  const editListRequest = z.object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters long")
      .max(50, "Name must be at most 50 characters long"),
  });
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get("listName");
    const isPrivate = formData.get("visibility") === "on" ? true : false;
    console.log("isPrivate", isPrivate);
    console.log("name", name);

    try {
      editListRequest.parse({ name });
      const response = await recipeListApi.updateRecipeList(selectedList.id, name, isPrivate);
      selectedList = response.data;

      if (response.status !== 200) {
        errors = { ...errors, form: response.message };
        return;
      }

      errors = { ...errors, form: "" };
      recipeLists = recipeLists.map((list) => {
        if (list.id === selectedList.id) {
          return { ...list, name, isPrivate };
        }
        return list;
      });
      toast.success('List updated successfully!'); // Update success message
      isSheetDialogOpen = false;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Map Zod errors to form fields
        error.errors.forEach((err) => {
          if (err.path[0] in errors) {
            errors[err.path[0]] = err.message;
          }
        });
      }
    }
  };

 </script>
  
 <Sheet.Root bind:open={isSheetDialogOpen}>
  <Sheet.Trigger>
  <Button variant="link" class="text-2xl font-semibold transition-all">{selectedList.name}</Button>
  </Sheet.Trigger>
  <Sheet.Content side="left">
   <Sheet.Header>
    <Sheet.Title>Edit</Sheet.Title>
   </Sheet.Header>
   
    <div class="grid gap-4 py-4">
      <form onsubmit={handleSubmit}>
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="listName" class="text-right">Name</Label>
        <Input id="listName" placeholder="List name" name="listName" class="col-span-3" value={selectedList.name} />
        {#if errors.listName}
          <p class="text-red-500 col-span-4">{errors.listName}</p>
        {/if}
        <Label for="visibility" class="text-right">{isPrivate ? "Private" : "Public"}</Label>
        <Switch id="visibility" name="visibility" class="col-span-3" bind:checked={isPrivate} />
        <Button type="submit" class="col-span-1 col-end-5 mt-4">Save</Button>
      </div>
    </form>
    
    </div>
   <Sheet.Footer>
    <Sheet.Action class={buttonVariants({ variant: 'destructive' })} onclick={handleDelete}>Delete</Sheet.Action>
    <DeleteListDialog bind:recipeLists bind:selectedList bind:isSheetDialogOpen />
   </Sheet.Footer>
  </Sheet.Content>
 </Sheet.Root>