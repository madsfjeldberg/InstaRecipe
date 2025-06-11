<script>
  import { onMount } from 'svelte';

  import { toast } from 'svelte-sonner';

  import * as Card from '$lib/components/ui/card/index.js';
  import Switch from '$lib/components/ui/switch/switch.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Checkbox } from '$lib/components/ui/checkbox/index.js';
  
  import userApi from '$lib/api/userApi';

  let { data } = $props();
  let userId = data.user.id;
  let user = $state(data.user);
  let emailNotifications = $state(user.emailNotifications);

  
  onMount(async () => {
    try {
      user = await userApi.getUserById(userId);
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
      await userApi.updateEmailNotificationsSetting(userId, emailNotifications, user.email);
      toast.success("Settings saved successfully!");

    } catch (error) {
      console.error(error)
      toast.error(error.message);
    }
  }
</script>

<Card.Root class="col-span-5">
  <Card.Header>
    <Card.Title>Email Notifications</Card.Title>
    <Card.Description>
      Enable or disable email notifications for your account.
    </Card.Description>
  </Card.Header>
  <Card.Content class="flex items-center justify-between py-4">
    <span class="text-base">Receive email notifications</span>
    <Switch bind:checked={emailNotifications} on:change={toggleEmailNotifications} />
  </Card.Content>
</Card.Root>


<Button class="col-span-2 col-start-1" onclick={saveSettings}>Save Settings</Button>
