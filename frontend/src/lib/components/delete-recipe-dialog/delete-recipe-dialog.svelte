<script>
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { X } from "lucide-svelte";
  import AlertDialogAction from "../ui/alert-dialog/alert-dialog-action.svelte";
  import { deleteRecipe } from "$lib/services/recipeService";
  import { toast } from "svelte-sonner";

  let { recipeId, selectedList = $bindable() } = $props();
  let isDialogOpen = $state(false);

  const handleDelete = async () => {

    try {
      console.log("Deleting recipe with ID:", recipeId);
      await deleteRecipe(recipeId);
      selectedList = {...selectedList}; // Trigger reactivity
      isDialogOpen = false; // Close the dialog after deletion
      toast.success('Recipe deleted successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete the recipe. Please try again.');
    }
  }
 </script>
  
 <AlertDialog.Root bind:open={isDialogOpen}>
  <AlertDialog.Trigger class="hover:bg-slate-400 transition-all rounded-md">
   <X class="h-5 w-5" />
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