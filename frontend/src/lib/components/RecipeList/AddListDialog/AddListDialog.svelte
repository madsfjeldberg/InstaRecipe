<script>
  import { z } from 'zod';

  import { Plus } from 'lucide-svelte';
  import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';

  import { isAuthenticated, user } from '../../../../stores/authStore.js';
  
  import recipeListApi from '$lib/api/recipelistApi.js';
    import { toast } from 'svelte-sonner';

  let { recipeLists = $bindable(), selectedList = $bindable(), onSortRecipeList } = $props();

  let errors = $state({
    name: "",
    form: "",
  });

  let isDialogOpen = $state(false);

  const AddListRequest = z.object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters long")
      .max(50, "Name must be at most 50 characters long"),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const name = formData.get("name");
    const userId = $user.id;

    try {
      AddListRequest.parse({ name });
      const createdRecipeList = await recipeListApi.addRecipeList(name, userId); // Call the addRecipeList function
      selectedList = createdRecipeList;

      // Handle success, e.g., show a success message or close the dialog
      errors = { ...errors, form: "" };
      // Optionally, you can refresh the recipe lists or perform other actions
      const updatedList = [...recipeLists, createdRecipeList]; // Update the recipeLists state
      recipeLists = onSortRecipeList(updatedList); // Ensure the new list is sorted in the ui
      // CLOSE DIALOG HERE
      isDialogOpen = false;

      toast.success("List created successfully!");
      
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
      <div class="flex flex-col gap-2 mb-4">
        <Label for="name">Name</Label>

        {#if errors.name}
          <p class="text-red-500 col-span-4">{errors.name}</p>
        {/if}

        <Input
          id="name"
          placeholder="Recipe ideas ✨"
          name="name"
          class="col-span-3"
        />
      </div>

      <Dialog.Footer>
        <Button type="submit">Create</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
