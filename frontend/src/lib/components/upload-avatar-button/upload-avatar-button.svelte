<script>
  import { avatar } from '$lib/stores/avatar'; // your localStorage-backed store
  import Button from '../ui/button/button.svelte';

  let { user } = $props();

  let browseInput;
  let files = $state(null);
  let uploading = $state(false);

  // trigger the hidden input
  function handleUploadClick() {
    browseInput.click();
  }

  // when a file is chosen...
  async function onFileChange() {
    if (files.length === 0) return;
    const formData = new FormData();                          // build payload :contentReference[oaicite:1]{index=1}
    formData.append('avatar', files[0]);                       // append the first (and only) file :contentReference[oaicite:2]{index=2}

    uploading = true;
    const res = await fetch(`http://localhost:9000/users/${user.id}/avatar`, {  // POST to your API :contentReference[oaicite:3]{index=3}
      method: 'POST',
      body: formData                                          // do NOT set Content-Type manually :contentReference[oaicite:4]{index=4}
    });
    uploading = false;

    if (res.ok) {
      // preview immediately:
      const previewUrl = URL.createObjectURL(files[0]);       // optional instant preview :contentReference[oaicite:5]{index=5}
      avatar.set(previewUrl);                                 // update your persistent store :contentReference[oaicite:6]{index=6}
    } else {
      console.error('Avatar upload failed', await res.text());
    }
  }
</script>

<Button onclick={handleUploadClick} disabled={uploading}>
  {#if uploading}Uploading…{:else}Upload image{/if}
</Button>
<input
  class="hidden"
  type="file"
  bind:this={browseInput}
  bind:files={files}
  accept="image/*"
  onchange={onFileChange}
/>
