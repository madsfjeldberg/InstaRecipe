<script>
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import UploadAvatarButton from "$lib/components/UploadAvatarButton/UploadAvatarButton.svelte";
  import { avatarStore } from "../../../stores/avatarStore.js";
  import { onMount } from "svelte";
  import { z } from "zod";
  import { changeUsername, changePassword, getUserById, updateUser } from "$lib/api/userApi.js";
  import { toast } from "svelte-sonner";
  import DeleteAccountDialog from "$lib/components/DeleteAccountDialog/DeleteAccountDialog.svelte";
  import { CircleUser, LoaderCircle } from "lucide-svelte";
  import ErrorMessage from "$lib/components/ErrorMessage/ErrorMessage.svelte";
  // import { user } from "../../../stores/authStore.js";

  const { data } = $props();
  let { user } = data;
  let username = $state("");
  let password = $state("");
  let confirmPassword = $state("");
  username = user.username;
  let changeUsernameLoading = $state(false);
  let changePasswordLoading = $state(false);

  const resetErrors = () => {
    return {
      username: "",
      password: "",
      confirmPassword: "",
      form: "",
    };
  };

  let errors = $state(resetErrors());

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
    errors = resetErrors();
    changeUsernameLoading = true;

    const formData = new FormData(event.target);
    const username = formData.get("username");

    try {
      let response;
      changeUsernameRequest.parse({ username });
      let fetchedUser = await getUserById(user.id);
      let updatedUser = {
        ...fetchedUser,
        username: username,
      };
      response = await updateUser({ user: updatedUser });
      if (response.status === 200) {
        await toast.success("Username updated!");
      } else {
        await toast.error("Error updating username: " + response.message);
        errors = resetErrors();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors.resetErrors();
        error.errors.forEach((err) => {
          if (err.path[0] in errors) {
            errors[err.path[0]] = err.message;
          }
        });
      } else {
        errors = {
          ...resetErrors(),
          form: error.message || "An unexpected error occurred. Please try again later.",
        }
      }
    } finally {
      changeUsernameLoading = false;
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    errors = resetErrors();
    changePasswordLoading = true;
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
      let fetchedUser = await getUserById(user.id);
      let updatedUser = {
        ...fetchedUser,
        password: passwordData,
      };
      response = await updateUser({ user: updatedUser });
      if (response.status === 200) {
        await toast.success("Password updated!");
        // reset password fields
        password = "";
        confirmPassword = "";
        
      } else {
        await toast.error("Error updating password: " + response.message);
        errors = resetErrors();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors = resetErrors();
        // Map Zod errors to form fields
        error.errors.forEach((err) => {
          if (err.path[0] in errors) {
            errors[err.path[0]] = err.message;
          }
        });
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      changePasswordLoading = false;
    }
  };

</script>


<Card.Root class="col-span-3">
  <Card.Header>
    <Card.Title>Username</Card.Title>
    <Card.Description>
      Change your username here.
    </Card.Description>
  </Card.Header>
  <form onsubmit={handleChangeUsername}>
  <ErrorMessage message={errors.form} />
  <Card.Content>

      <Input bind:value={username} name="username" />
      <ErrorMessage message={errors.username} />

  </Card.Content>
  <Card.Footer class="px-6 pt-10">
    {#if changeUsernameLoading}
      <Button disabled class="mt-8"><LoaderCircle class="animate-spin" />Saving...</Button>
    {:else}
      <Button type="submit" class="mt-8">Save</Button>
    {/if}
  </Card.Footer>
</form>
</Card.Root>
<Card.Root class="col-span-5">
  <Card.Header>
    <Card.Title>Change password</Card.Title>
    <Card.Description>
      Change your password here.
    </Card.Description>
  </Card.Header>
  <form onsubmit={handleChangePassword}>
  <ErrorMessage message={errors.form} />
  <Card.Content class="flex flex-col gap-4">

      <Input bind:value={password} type="password" name="password" placeholder="New Password" />
      <ErrorMessage message={errors.password} />
      
      <Input bind:value={confirmPassword} type="password" name="confirmPassword" placeholder="Confirm Password" />
      <ErrorMessage message={errors.confirmPassword} />

  </Card.Content>
  <Card.Footer class="px-6 py-4">
    {#if changePasswordLoading}
      <Button disabled><LoaderCircle class="animate-spin" />Saving...</Button>
    {:else}
      <Button type="submit">Save</Button>
    {/if}
  </Card.Footer>
  </form>
</Card.Root>
<Card.Root class="col-span-4 ">
  <Card.Header>
    <Card.Title>Avatar</Card.Title>
    <Card.Description>
      Change your avatar.
    </Card.Description>
    
  </Card.Header>
  <Card.Content class="flex justify-start">
    {#if $avatarStore && avatarStore !== "null"}
    <img
      class="rounded-full w-28 h-28 object-cover"
      src={$avatarStore}
      loading="lazy"
      alt="User Avatar"
    > 
    {:else}
    <CircleUser class="rounded-full w-28 h-28 object-cover" />
    {/if}
  </Card.Content>
  <Card.Footer>
    <div class="flex gap-4">
      <UploadAvatarButton {user} />
    </div>
  </Card.Footer>
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