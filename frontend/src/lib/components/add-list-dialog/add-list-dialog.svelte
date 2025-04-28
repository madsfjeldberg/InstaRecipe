<script>
  import {
   Button,
   buttonVariants
  } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Plus } from "lucide-svelte";
  import { z } from "zod";
  import { isAuthenticated, user } from "$lib/stores/authStore.js";
  import { addRecipeList } from "$lib/services/recipelistService.js";
  import Recipetable from "../recipetable/recipetable.svelte";

  let { recipeLists = $bindable() } = $props();

  let errors = $state({
   name: "",
   form: "",
  });

  let isDialogOpen = $state(false);

  const AddListRequest = z.object({
   name: z.string().min(3, "Name must be at least 3 characters long").max(50, "Name must be at most 50 characters long"),
  });

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const name = formData.get("name");
    const userId = $user.id; // fetched from authStore

    try {
      let response;

      AddListRequest.parse({ name });
      response = await addRecipeList(name, userId); // Call the addRecipeList function

      console.log("Response from addRecipeList:", response);

      if (response.status !== 201) {
        errors = { ...errors, form: response.message };
      } else {
        // Handle success, e.g., show a success message or close the dialog
        errors = { ...errors, form: "" };
        // Optionally, you can refresh the recipe lists or perform other actions
        recipeLists = [...recipeLists, response.data]; // Update the recipeLists state
        // CLOSE DIALOG HERE
        isDialogOpen = false;

        console.log(recipeLists);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Map Zod errors to form fields
        error.errors.forEach((err) => {
          if (err.path[0] in errors) {
            errors[err.path[0]] = err.message;
          }
        });
      } else {
        errors.form = error.message || "An unexpected error occurred";
      }
    }
  }
  
 </script>
  

 <Dialog.Root bind:open={isDialogOpen}>
  <Dialog.Trigger class={buttonVariants({ size: "sm" })}>
   <Plus />Add list</Dialog.Trigger
  >
  <Dialog.Content class="sm:max-w-[425px]">
   <Dialog.Header>
    <Dialog.Title>Add list</Dialog.Title>
    <Dialog.Description>
      Create a new list to save your recipes.
    </Dialog.Description>
   </Dialog.Header>
   <form onsubmit={handleSubmit}>
    {#if errors.form}
     <p class="text-red-500">{errors.form}</p>
    {/if}
   <div class="grid gap-4 py-4">
    <div class="grid grid-cols-4 items-center gap-4">
     <Label for="name" class="text-right">Name</Label>
     <Input id="name" placeholder="Dinner ideas ✨" name="name" class="col-span-3" />
     {#if errors.name}
     <p class="text-red-500 col-span-4">{errors.name}</p>
    {/if}
    </div>
   </div>
   <Dialog.Footer>
    <Button type="submit">Save</Button>
   </Dialog.Footer>
  </form>
  </Dialog.Content>
 </Dialog.Root>