<script>
  import { toast } from 'svelte-sonner';

  import { LoaderCircle } from 'lucide-svelte';
  import Button from '../ui/button/button.svelte';

  import { avatarStore } from '../../../stores/avatarStore.js';

  const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}` : '/api';

  let { user } = $props();

  let browseInput = $state(null);
  let files = $state(null);
  let uploading = $state(false);

  // trigger the hidden input
  const handleUploadClick = () => {
    browseInput.click();
  }

  // when a file is chosen...
  const onFileChange = async () => {
    if (files.length === 0) return;
    const file = files[0]; // only one file is allowed
    // restrict size
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error('File size exceeds 2MB limit.');
      console.error('File size exceeds 2MB limit');
      return;
    }
    const formData = new FormData();
    formData.append('avatar', file);

    uploading = true;
    const res = await fetch(`${BASE_URL}/users/${user.id}/avatar`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
    uploading = false;

    if (res.ok) {
      
      const reader = new FileReader();
      reader.onload = () => {
        avatarStore.set(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      console.error('Avatar upload failed', await res.text());
    }
  }
</script>

{#if (uploading)}
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
  