<script>
  import { toast } from 'svelte-sonner';

  import { LoaderCircle } from 'lucide-svelte';
  import Button from '../../ui/button/button.svelte';

  import userApi from '$lib/api/userApi.js';
  import { user as UserStore } from '../../../../stores/authStore.js';


  let { user } = $props();

  let browseInput = $state(null);
  let files = $state(null);
  let isUploading = $state(false);

  // trigger the hidden input
  const handleUploadClick = () => {
    browseInput.click();
  }

  // when a file is chosen...
  const onFileChange = async () => {
    if (files.length === 0) return;
    const file = files[0]; // only one file is allowed
    // restrict size
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }
    const formData = new FormData();
    formData.append('avatar', file);

    isUploading = true;
    try {
      const updatedUser = await userApi.uploadAvatar(user.id, formData);
      UserStore.update(currentUser => {
        return { ...currentUser, avatarUrl: updatedUser.avatarUrl };
      });
      toast.success("Avatar successfully uploaded!");

    } catch(error) {
      console.error("Error uploading avatar:", error);
      toast.error(error.message);

    } finally {
      isUploading = false;
    }

  }
</script>

{#if (isUploading)}
<Button disabled>
  <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
  Uploading
</Button>
{:else}
<Button onclick={handleUploadClick}>
  Upload image
</Button>
<input
  class="mt-20 hidden"
  type="file"
  bind:this={browseInput}
  bind:files={files}
  accept="image/*"
  onchange={onFileChange}
/>
{/if}
  