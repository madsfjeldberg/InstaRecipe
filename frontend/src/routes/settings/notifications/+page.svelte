<script>
  import Switch from "$lib/components/ui/switch/switch.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { toast } from "svelte-sonner";

  let emailNotifications = $state(false);
  let alertNotifications = $state(false);

  const toggleEmailNotifications = () => {
    toast.info("Feature coming soon!");
    // Call API to update email notifications setting
  };

  const toggleAlertNotifications = () => {
    toast.info("Feature coming soon!");
    // Call API to update alert notifications setting
  };

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
    <Switch bind:checked={emailNotifications} onchange={toggleEmailNotifications} />
  </Card.Content>
</Card.Root>
<Card.Root class="col-span-5">
  <Card.Header>
    <Card.Title>Alert Notifications</Card.Title>
    <Card.Description>
      Enable or disable alert notifications for your account.
    </Card.Description>
  </Card.Header>
  <Card.Content class="flex items-center justify-between py-4">
    <span class="text-base">Receive alert notifications</span>
    <Switch bind:checked={alertNotifications} onchange={toggleAlertNotifications} />
  </Card.Content>
</Card.Root>