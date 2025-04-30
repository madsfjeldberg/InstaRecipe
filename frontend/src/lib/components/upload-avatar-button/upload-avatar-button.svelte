<script>
  import { avatar } from '$lib/stores/avatar'; // your localStorage-backed store
  import { toast } from 'svelte-sonner';
  import Button from '../ui/button/button.svelte';
  import { LoaderCircle } from 'lucide-svelte';

  let { user } = $props();

  let browseInput = $state(null);
  let files = $state(null);
  let uploading = $state(false);

  // trigger the hidden input
  function handleUploadClick() {
    browseInput.click();
  }

  // when a file is chosen...
  async function onFileChange() {
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
    const res = await fetch(`http://localhost:9000/users/${user.id}/avatar`, {
      method: 'POST',
      body: formData
    });
    uploading = false;

    if (res.ok) {
      
      const reader = new FileReader();
      reader.onload = () => {
        avatar.set(reader.result);
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
  