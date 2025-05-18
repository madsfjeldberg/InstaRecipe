<script>
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { X } from "lucide-svelte";
  import AlertDialogAction from "../ui/alert-dialog/alert-dialog-action.svelte";
  import { toast } from "svelte-sonner";
  import userApi from "$lib/api/userApi";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  
  let isDialogOpen = $state(false);
  const { user } = $props();
  
  const handleDelete = async () => {
  try {
    await userApi.deleteUser(user.id);
    toast.success('Account deleted successfully!');
    goto('/');
  } catch (error) {
    console.error(error);
    toast.error('Failed to delete account. Please try again.');
  }
}
  
 </script>
  
 <AlertDialog.Root bind:open={isDialogOpen}>
  <AlertDialog.Trigger class={buttonVariants({ variant: 'destructive' })}>
  Delete Account
  </AlertDialog.Trigger>
  <AlertDialog.Content>
   <AlertDialog.Header>
    <AlertDialog.Title>Delete your account?</AlertDialog.Title>
    <AlertDialog.Description>
     This action cannot be undone.<br> This will permanently delete your account, and all your recipes.
    </AlertDialog.Description>
   </AlertDialog.Header>
   <AlertDialog.Footer>
    <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
    <AlertDialog.Action class={buttonVariants({ variant: 'destructive' })} onclick={handleDelete}>Delete</AlertDialog.Action>
   </AlertDialog.Footer>
  </AlertDialog.Content>
 </AlertDialog.Root>