<script>
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Sheet from "$lib/components/ui/sheet/index.js";

  const { data } = $props();
  let { user } = data;
  let username = user.username;
</script>

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
          <Card.Content>
            <form>
              <Input value={username} />
            </form>
          </Card.Content>
          <Card.Footer class="border-t px-6 py-4">
            <Button>Save</Button>
          </Card.Footer>
        </Card.Root>
        <Card.Root class="col-span-3">
          <Card.Header>
            <Card.Title>Change password</Card.Title>
            <Card.Description>
              Change your password here.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <form class="flex flex-col gap-4">
              <Input placeholder="New Password" />
              <Input placeholder="Confirm Password" />
            </form>
          </Card.Content>
          <Card.Footer class="border-t px-6 py-4">
            <Button>Save</Button>
          </Card.Footer>
        </Card.Root>
        <Card.Root class="col-span-4">
          <Card.Header>
            <Card.Title>Avatar</Card.Title>
            <Card.Description>
              Change your avatar.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <Button>Upload image</Button>
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
          <Card.Footer class="border-t px-6 py-4">
            <Button variant="destructive">Delete Account</Button>
          </Card.Footer>
        </Card.Root>
      </div>
    </div>
  </main>
</div>
