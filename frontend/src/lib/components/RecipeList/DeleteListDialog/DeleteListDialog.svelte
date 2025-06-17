<script>
  import { toast } from 'svelte-sonner';

  import { X } from 'lucide-svelte';
  import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
  import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
  import AlertDialogAction from '../../ui/alert-dialog/alert-dialog-action.svelte';
  
  import recipeListApi from '$lib/api/recipelistApi';

  let { selectedList = $bindable(), recipeLists = $bindable(), isSheetDialogOpen = $bindable() } = $props();
  let isDialogOpen = $state(false);

  const handleDelete = async () => {
    try {
      await recipeListApi.deleteRecipeList(selectedList.id);
      
      isDialogOpen = false;
      isSheetDialogOpen = false;
      recipeLists = recipeLists.filter(list => list.id !== selectedList.id); // Remove the deleted list from the recipeLists
      selectedList = recipeLists[0] || null; // Set selectedList to the first one or null if none left
      
      toast.success("List deleted successfully!");

    } catch (error) {
      console.error(error);
      toast.error(error.message);
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
