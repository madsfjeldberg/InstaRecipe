<script>
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { X } from "lucide-svelte";
  import AlertDialogAction from "../ui/alert-dialog/alert-dialog-action.svelte";
  import { deleteRecipeList } from "$lib/api/recipelistApi";
  import { toast } from "svelte-sonner";

  let { selectedList = $bindable(), recipeLists = $bindable(), isSheetDialogOpen = $bindable() } = $props();
  let isDialogOpen = $state(false);

  const handleDelete = async () => {
  try {
    await deleteRecipeList(selectedList.id);
    toast.success('List deleted successfully!');
    isDialogOpen = false;
    isSheetDialogOpen = false;
    recipeLists = recipeLists.filter(list => list.id !== selectedList.id); // Remove the deleted list from the recipeLists
    selectedList = recipeLists[0] || null; // Set selectedList to the first one or null if none left
  } catch (error) {
    console.error(error);
    toast.error('Failed to delete the recipe. Please try again.');
  }
}
  
 </script>
  
 <AlertDialog.Root bind:open={isDialogOpen}>
  <AlertDialog.Trigger>
  <Button variant="destructive">Delete</Button>
  </AlertDialog.Trigger>
  <AlertDialog.Content>
   <AlertDialog.Header>
    <AlertDialog.Title>Delete this list?</AlertDialog.Title>
    <AlertDialog.Description>
     This action cannot be undone.<br> This will permanently delete the list from the system.
    </AlertDialog.Description>
   </AlertDialog.Header>
   <AlertDialog.Footer>
    <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
    <AlertDialog.Action class={buttonVariants({ variant: 'destructive' })} onclick={handleDelete}>Delete</AlertDialog.Action>
   </AlertDialog.Footer>
  </AlertDialog.Content>
 </AlertDialog.Root>