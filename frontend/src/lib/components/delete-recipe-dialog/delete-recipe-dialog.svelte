<script>
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { X } from "lucide-svelte";

  let { selectedList = $bindable() } = $props();
 </script>
  
 <AlertDialog.Root>
  <AlertDialog.Trigger class="hover:bg-slate-400 transition-all rounded-md">
   <X class="h-5 w-5" />
  </AlertDialog.Trigger>
  <AlertDialog.Content>
   <AlertDialog.Header>
    <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
    <AlertDialog.Description>
     This action cannot be undone. This will permanently delete your account
     and remove your data from our servers.
    </AlertDialog.Description>
   </AlertDialog.Header>
   <AlertDialog.Footer>
    <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
    <AlertDialog.Action>Continue</AlertDialog.Action>
   </AlertDialog.Footer>
  </AlertDialog.Content>
 </AlertDialog.Root>