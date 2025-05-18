<script>
  import { stopPropagation } from "svelte/legacy";

  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import AlertDialogAction from "../ui/alert-dialog/alert-dialog-action.svelte";
  import { X } from "lucide-svelte";
  
  import { toast } from "svelte-sonner";
  
  import recipeApi from "$lib/api/recipeApi";

  let { recipeId, selectedList = $bindable() } = $props();
  let isDialogOpen = $state(false);

  const handleDelete = async () => {
  try {
    await recipeApi.deleteRecipe(recipeId);
    // Remove the recipe from the selected list
    selectedList.recipes = selectedList.recipes.filter(recipe => recipe.id !== recipeId);
    toast.success('Recipe deleted successfully!');
    isDialogOpen = false;
  } catch (error) {
    console.error(error);
    toast.error('Failed to delete the recipe. Please try again.');
  }
}
  

 </script>
  
 <AlertDialog.Root bind:open={isDialogOpen}>
  <AlertDialog.Trigger onclick={(event) => event.stopPropagation()} class="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 duration-300 transition-all">
  <X class="h-6 w-6 text-destructive transition-colors hover:text-slate-800 hover:bg-destructive rounded-md" />
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