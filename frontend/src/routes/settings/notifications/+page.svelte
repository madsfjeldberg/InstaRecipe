<script>
  import { onMount } from 'svelte';

  import { toast } from 'svelte-sonner';

  import { LoaderCircle } from "lucide-svelte";
  import * as Card from '$lib/components/ui/card/index.js';
  import Switch from '$lib/components/ui/switch/switch.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Checkbox } from '$lib/components/ui/checkbox/index.js';
  
  import userApi from '$lib/api/userApi';

  let { data } = $props();
  let user = $state(data.user);
  let emailNotifications = $state(data.user.emailNotifications);
  let isLoading = $state(false);

  
  onMount(async () => {
    try {
      user = await userApi.getUserById(user.id);
      emailNotifications = user.emailNotifications;
    } catch (error) {
      toast.error(error.message);
    }
  });
  
  const toggleEmailNotifications = () => {
    emailNotifications = !emailNotifications;
  }

  const saveSettings = async () => {
    try {
      isLoading = true;
      await userApi.updateEmailNotificationsSetting(user.id, emailNotifications, user.email);
      toast.success("Settings saved successfully!");

    } catch (error) {
      toast.error(error.message);
    } finally {
      isLoading = false;
    }
  }
</script>

<Card.Root class="col-span-5">
  <Card.Header>
    <Card.Title>Email Notifications</Card.Title>
    <Card.Description>
      Enable or disable email notifications for your account, such as comments replies.
    </Card.Description>
  </Card.Header>
  <Card.Content class="flex items-center justify-between py-4">
    <span class="text-base">Receive email notifications</span>
    <Switch bind:checked={emailNotifications} on:change={toggleEmailNotifications} />
  </Card.Content>
</Card.Root>

{#if isLoading}
  <Button disabled class="col-span-2 col-start-1" onclick={saveSettings}>
    <LoaderCircle class="animate-spin"/>
    Saving settings...
  </Button>

{:else}
    <Button class="col-span-2 col-start-1" onclick={saveSettings}>Save Settings</Button>
{/if}
