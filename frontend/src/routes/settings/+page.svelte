<script>
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import UploadAvatarButton from "$lib/components/upload-avatar-button/upload-avatar-button.svelte";
  import { avatarStore } from "../../stores/avatarStore.js";
  import { onMount } from "svelte";
  import { z } from "zod";
  import { changeUsername, changePassword } from "$lib/api/userApi.js";
  import { toast } from "svelte-sonner";
  import DeleteAccountDialog from "$lib/components/delete-account-dialog/delete-account-dialog.svelte";
  import { passive } from "svelte/legacy";
  import { CircleUser } from "lucide-svelte";

  const { data } = $props();
  let { user } = data;
  let username = $state("");
  let password = $state("");
  let confirmPassword = $state("");
  username = user.username;

  let errors = $state({
    username: "",
    password: "",
    confirmPassword: "",
    form: "",
  });

  const changeUsernameRequest = z.object({
    username: z.string()
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username must be at most 20 characters long"),
  });

  const changePasswordRequest = z.object({
    password: z.string()
      .min(5, "Password must be at least 5 characters long")
      .max(100, "Password must be at most 100 characters long"),
    confirmPassword: z.string()
      .min(5, "Confirm Password must be at least 5 characters long")
      .max(100, "Confirm Password must be at most 100 characters long"),
  });

  const handleChangeUsername = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const username = formData.get("username");

    try {
      let response;
      changeUsernameRequest.parse({ username });
      response = await changeUsername(user.id, username);
      if (response.status === 200) {
        await toast.success("Username updated!");
        
      } else {
        await toast.error("Error updating username: " + response.message);
        errors = { };
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
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    let passwordData = formData.get("password");
    let confirmPasswordData = formData.get("confirmPassword");

    try {
      let response;
      changePasswordRequest.parse({ password: passwordData, confirmPassword: confirmPasswordData });
      if (passwordData !== confirmPasswordData) {
        errors.confirmPassword = "Passwords do not match";
        return;
      }
      response = await changePassword(user.id, passwordData);
      if (response.status === 200) {
        await toast.success("Password updated!");
        // reset password fields
        password = "";
        confirmPassword = "";
        
      } else {
        await toast.error("Error updating password: " + response.message);
        errors = { };
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
        console.error("Unexpected error:", error);
      }
    }
  };

</script>

<svelte:head>
  <title>InstaRecipe | Settings</title>
</svelte:head>

<div class="flex min-h-screen w-full flex-col">
  
  <main
    class="bg-muted flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10"
  >
    <div class="mx-auto grid w-full max-w-6xl gap-2">
      <h1 class="text-3xl font-semibold">Settings</h1>
    </div>
    <div
      class="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]"
    >
      <nav class="text-muted-foreground grid gap-4 text-sm"
        data-x-chunk-container="chunk-container after:right-0">
        <a href="##" class="text-primary font-semibold"> General </a>
        <a href="##">Security</a>
        <a href="##">Integrations</a>
        <a href="##">Support</a>
        <a href="##">Organizations</a>
        <a href="##">Advanced</a>
      </nav>
      <div class="grid grid-cols-8 gap-6">
        <Card.Root class="col-span-5">
          <Card.Header>
            <Card.Title>Username</Card.Title>
            <Card.Description>
              Change your username here.
            </Card.Description>
          </Card.Header>
          <form onsubmit={handleChangeUsername}>
          <Card.Content>
              <Input bind:value={username} name="username" />
              {#if errors.username}
          <span class="text-red-500 text-sm">{errors.username}</span>
        {/if}
          </Card.Content>
          <Card.Footer class="px-6 pt-10">
            <Button type="submit" class="mt-8">Save</Button>
          </Card.Footer>
        </form>
        </Card.Root>
        <Card.Root class="col-span-3">
          <Card.Header>
            <Card.Title>Change password</Card.Title>
            <Card.Description>
              Change your password here.
            </Card.Description>
          </Card.Header>
          <form onsubmit={handleChangePassword}>
          <Card.Content class="flex flex-col gap-4">
              <Input bind:value={password} type="password" name="password" placeholder="New Password" />
              {#if errors.password}
          <span class="text-red-500 text-sm">{errors.password}</span>
        {/if}
              <Input bind:value={confirmPassword} type="password" name="confirmPassword" placeholder="Confirm Password" />
              {#if errors.confirmPassword}
          <span class="text-red-500 text-sm">{errors.confirmPassword}</span>
        {/if}
          </Card.Content>
          <Card.Footer class="px-6 py-4">
            <Button type="submit">Save</Button>
          </Card.Footer>
          </form>
        </Card.Root>
        <Card.Root class="col-span-4 relative">
          <Card.Header>
            <Card.Title>Avatar</Card.Title>
            <Card.Description>
              Change your avatar.
            </Card.Description>
            {#if $avatarStore == "null"}
            <CircleUser class="absolute top-8 right-8 rounded-full w-32 h-32 object-cover" />
            {:else}
            <img 
              class="absolute top-8 right-8 rounded-full w-32 h-32 object-cover" 
              src={$avatarStore}
              loading="lazy" 
              alt="User Avatar"
            > 
            {/if}
          </Card.Header>
          <Card.Content>
            <div class="flex gap-4">
              <UploadAvatarButton {user} />
            </div>
          </Card.Content>
        </Card.Root>
        <Card.Root class="col-span-4 col-end-9">
          <Card.Header>
            <Card.Title>Delete account</Card.Title>
          </Card.Header>
          <Card.Content>
            <p class="text-sm text-muted-foreground">
              This action is irreversible. Please proceed with caution.
            </p>
          </Card.Content>
          <Card.Footer class="px-6 py-4">
            <DeleteAccountDialog {user} />
          </Card.Footer>
        </Card.Root>
      </div>
    </div>
  </main>
</div>
