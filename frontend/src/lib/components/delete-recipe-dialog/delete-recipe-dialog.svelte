<script>
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { X } from "lucide-svelte";
  import AlertDialogAction from "../ui/alert-dialog/alert-dialog-action.svelte";
  import { deleteRecipe } from "$lib/api/recipeApi";
  import { toast } from "svelte-sonner";

  let { recipeId, selectedList = $bindable() } = $props();
  let isDialogOpen = $state(false);

  const handleDelete = async () => {
  try {
    await deleteRecipe(recipeId);
    selectedList.updatedAt = new Date().toISOString(); // Update the selectedList
    selectedList = {...selectedList}; // Trigger reactivity
    toast.success('Recipe deleted successfully!');
  } catch (error) {
    console.error(error);
    toast.error('Failed to delete the recipe. Please try again.');
  }
}
  

 </script>
  
 <AlertDialog.Root bind:open={isDialogOpen}>
  <AlertDialog.Trigger class="opacity-0 group-hover:opacity-100 duration-200 m-1 transition-all rounded-md">
  <X class="h-5 w-5 hover:text-destructive transition-colors" />
  </AlertDialog.Trigger>
  <AlertDialog.Content>
   <AlertDialog.Header>
    <AlertDialog.Title>Delete this recipe?</AlertDialog.Title>
    <AlertDialog.Description>
     This action cannot be undone.<br> This will permanently delete the recipe from the list.
    </AlertDialog.Description>
   </AlertDialog.Header>
   <AlertDialog.Footer>
    <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
    <AlertDialog.Action class={buttonVariants({ variant: 'destructive' })} onclick={handleDelete}>Delete</AlertDialog.Action>
   </AlertDialog.Footer>
  </AlertDialog.Content>
 </AlertDialog.Root>