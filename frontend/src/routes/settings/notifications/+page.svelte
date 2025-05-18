<script>
  import Switch from "$lib/components/ui/switch/switch.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { toast } from "svelte-sonner";
  import { onMount } from "svelte";
  import userApi from "$lib/api/userApi";

  let { data } = $props();
  let userId = data.user.id;
  let user = $state({});
  let emailNotifications = $state(true);

  const saveSettings = async () => {
    user.emailNotifications = emailNotifications;
    let response = await userApi.updateUser({ user });

    if (response.status !== 200) {
      toast.error("Failed to save settings.");
      return;
    }
    toast.success("Settings saved successfully!");
  }

  onMount(async () => {
    user = await userApi.getUserById(userId);
    emailNotifications = user.emailNotifications;
  });

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